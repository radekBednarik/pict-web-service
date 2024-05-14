import "dotenv/config";
import { writeFile, mkdir } from "node:fs/promises";
import express from "express";
import { rateLimit } from "express-rate-limit";
import { v4 as u4 } from "uuid";
import { pinoHttp } from "pino-http";
import { pino } from "pino";
import PictGenerator from "pwtg";

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
  }

  if (!Object.prototype.hasOwnProperty.call(req.body, "data")) {
    const msg = { error: { code: 400, message: "Data not provided in request body." } };
    res.log.error(msg);
    res.status(400).json(msg);
  }

  if (req.body["data"].length === 0) {
    const msg = { error: { code: 400, message: "Empty form was sent." } };
    res.log.error(msg);
    res.status(400).json(msg);
  }

  if (!Object.prototype.hasOwnProperty.call(req.body, "output")) {
    const msg = { error: { code: 400, message: "Output file type was not provided." } };
    res.log.error(msg);
    res.status(400).json(msg);
  }

  res.setHeader("Access-Control-Allow-Origin", "*");

  const data = req.body["data"];
  const output = req.body["output"];
  // must save data so PICT can load them - this is perf penalty, but
  // since PICT is CLI first tool, it cannot be avoided
  const dirModels = "/tmp/pict/models";
  const dirTests = "/tmp/pict/tests";

  await mkdir(dirModels, { recursive: true });
  await mkdir(dirTests, { recursive: true });

  const modelPath = `${dirModels}/${u4()}.txt`;
  const testsPath = `${dirTests}/${u4()}.${output}`;

  await writeFile(modelPath, data, { encoding: "utf-8" });

  const generator = new PictGenerator(modelPath, process.env.PICT_LOC!);

  // generate JSON file and save it, so it can be downloaded via express api
  // handle errors
  try {
    const outType = output === "json" ? "json" : "text";
    await generator.generate(outType, true, testsPath);
  } catch (error) {
    const msg = { error: { code: 500, message: "PICT generation of test cases failed." } };
    res.status(500).json(msg);
    res.log.error({ ...msg, errorDetail: error });
  }

  // send file for download
  res.download(testsPath, async (err) => {
    if (err && !res.headersSent) {
      const msg = { error: { code: 500, message: "Downloading file failed." } };
      res.status(500).json(msg);
      res.log.error({ ...msg, errorDetail: err });
    }
  });
});

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
