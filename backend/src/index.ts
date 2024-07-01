import "dotenv/config";
import { writeFile, mkdir } from "node:fs/promises";
import express from "express";
import { rateLimit } from "express-rate-limit";
import { v4 as u4 } from "uuid";
import { pinoHttp } from "pino-http";
import { pino } from "pino";
import PictGenerator from "pwtg";

import { saveTsvAsCsv, saveJsonAsXlsx } from "./utils/conversions.js";
import { getOutType } from "./utils/utils.js";
import type { Output } from "./utils/utils.js";

// logger
const transports = pino.transport({
  targets: [
    {
      target: "pino/file",
      options: { destination: process.env.LOG_FILE_PATH || "/var/log/pict-server/server.log" },
      level: process.env.LOG_FILE_LEVEL || "warn",
    },
    {
      target: "pino-pretty",
      options: { destination: 1 },
    },
  ],
});
const pLogger = pino({ enabled: Boolean(process.env.LOG_ENABLED) || true }, transports);
const logger = pinoHttp({
  logger: pLogger,
  autoLogging: true,
  level: process.env.LOG_CONSOLE_LEVEL || "warn",
});

const port = process.env.PORT || 4000;
const app = express();

app.set("trust proxy", 1);
app.use(logger);
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  rateLimit({
    windowMs: 1000 * 60 * 10,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: { code: 429, message: "Request rate limit reached. Try again later." } },
  }),
);

app.post("/generate", async (req, res) => {
  // handle content type
  if (!req.accepts("application/x-www-form-urlencoded")) {
    const msg = { error: { code: 412, message: "Wrong Content-Type header value." } };
    res.log.error(msg);
    res.status(412).json(msg);
    return;
  }

  if (!Object.prototype.hasOwnProperty.call(req.body, "data")) {
    const msg = { error: { code: 400, message: "Data not provided in request body." } };
    res.log.error(msg);
    res.status(400).json(msg);
    return;
  }

  if (req.body["data"].length === 0) {
    const msg = { error: { code: 400, message: "Empty form was sent." } };
    res.log.error(msg);
    res.status(400).json(msg);
    return;
  }

  if (!Object.prototype.hasOwnProperty.call(req.body, "output")) {
    const msg = { error: { code: 400, message: "Output file type was not provided." } };
    res.log.error(msg);
    res.status(400).json(msg);
    return;
  }

  res.setHeader("Access-Control-Request-Method", "POST");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.setHeader("Cache-Control", "no-cache");

  const data = req.body["data"];
  const output = req.body["output"] as Output;
  const combOrder = Number(req.body["combOrder"]);
  const seedFile = req.body["seedFile"];
  // must save data so PICT can load them - this is perf penalty, but
  // since PICT is CLI first tool, it cannot be avoided
  const dirModels = "/tmp/pict/models";
  const dirTests = "/tmp/pict/tests";
  const dirSeeds = "/tmp/pict/seeds";

  await Promise.allSettled([
    mkdir(dirModels, { recursive: true }),
    mkdir(dirTests, { recursive: true }),
    mkdir(dirSeeds, { recursive: true }),
  ]);

  const modelPath = `${dirModels}/${u4()}.txt`;
  const testsPath = `${dirTests}/${u4()}.${output}`;

  let seedPath: string | undefined = undefined;
  if (seedFile.length > 0) {
    seedPath = `${dirSeeds}/${u4()}.txt`;
    await writeFile(seedPath, seedFile, { encoding: "utf-8" });
  }

  await writeFile(modelPath, data, { encoding: "utf-8" });

  const generator = new PictGenerator(modelPath, process.env.PICT_LOC!);

  // generate JSON file and save it, so it can be downloaded via express api
  // handle errors
  try {
    const outType = getOutType(output);
    await generator.generate(outType, true, testsPath, seedPath ? seedPath : undefined, combOrder);
  } catch (error) {
    const msg = { error: { code: 500, message: "PICT generation of test cases failed." } };
    res.log.error({ ...msg, errorDetail: error });
    res.status(500).json(msg);
    return;
  }

  // if needed output is `csv` or `xlsx`, then
  // further processing is needed
  if (output === "csv") {
    try {
      await saveTsvAsCsv(generator.generated!, testsPath, dirTests);
    } catch (error) {
      const msg = { error: { code: 500, message: "Failed to convert and save .tsv as .csv" } };
      res.log.error({ ...msg, errorDetail: error });
      res.status(500).json(msg);
      return;
    }
  }

  if (output === "xlsx") {
    try {
      saveJsonAsXlsx(generator.generated!, testsPath);
    } catch (error) {
      const msg = { error: { code: 500, message: "Failed to convert and save .json as .xlsx" } };
      res.log.error({ ...msg, errorDetail: error });
      res.status(500).json(msg);
      return;
    }
  }

  // send file for download
  res.download(testsPath, async (err) => {
    if (err && !res.headersSent) {
      const msg = { error: { code: 500, message: "Downloading file failed." } };
      res.log.error({ ...msg, errorDetail: err });
      res.status(500).json(msg);
      return;
    }
  });
});

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
