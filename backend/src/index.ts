import "dotenv/config";
import { writeFile, mkdir } from "node:fs/promises";
import express from "express";
import { rateLimit } from "express-rate-limit";
import { v4 as u4 } from "uuid";
import PictGenerator from "pwtg";

const port = process.env.PORT || 4000;
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  rateLimit({
    windowMs: 1000 * 60 * 10,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
);

app.post("/generate", async (req, res) => {
  // handle content type
  if (!req.accepts("application/x-www-form-urlencoded")) {
    res.status(412).json({ error: { code: 412, message: "Wrong Content-Type header value." } });
  }

  if (!Object.prototype.hasOwnProperty.call(req.body, "data")) {
    res.status(400).json({ error: { code: 400, message: "Data not provided in request body." } });
  }

  if (req.body["data"].length === 0) {
    res.status(400).json({ error: { code: 400, message: "Empty form was sent." } });
  }

  res.setHeader("Access-Control-Allow-Origin", "*");

  const data = req.body["data"];
  // must save data so PICT can load them - this is perf penalty, but
  // since PICT is CLI first tool, it cannot be avoided
  const dirModels = "/tmp/pict/models";
  const dirTests = "/tmp/pict/tests";

  await mkdir(dirModels, { recursive: true });
  await mkdir(dirTests, { recursive: true });

  const modelPath = `${dirModels}/${u4()}.txt`;
  const testsPath = `${dirTests}/${u4()}.json`;

  await writeFile(modelPath, data, { encoding: "utf-8" });

  const generator = new PictGenerator(modelPath, process.env.PICT_LOC!);

  // generate JSON file and save it, so it can be downloaded via express api
  // handle errors
  try {
    await generator.generate("json", true, testsPath);
  } catch (error) {
    res
      .status(500)
      .json({ error: { code: 500, message: `PICT generation of test cases failed with error: ${error}` } });
  }

  // send file for download
  res.download(testsPath, async (err) => {
    if (err && !res.headersSent) {
      res.status(500).json({ error: { code: 500, message: `Downloading file failed with error: ${err}` } });
    }
  });
});

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
