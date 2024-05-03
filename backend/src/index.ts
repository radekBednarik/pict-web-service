import "dotenv/config";
import { writeFile, mkdir, rm } from "node:fs/promises";
import express from "express";
import { v4 as u4 } from "uuid";
import PictGenerator from "pwtg";

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/generate", async (req, res) => {
  // handle content type
  if (!req.accepts("application/x-www-form-urlencoded")) {
    res.status(412).json({ error: { code: 412, message: "Wrong Content-Type header value." } });
  }

  if (!Object.prototype.hasOwnProperty.call(req.body, "data")) {
    res.status(400).json({ error: { code: 400, message: "Data not provided in request body." } });
  }

  const data = req.body["data"];
  // must save data so PICT can load them - this is perf penalty, but
  // since PICT is CLI first tool, it cannot be avoided
  await mkdir("/tmp/pict/models", { recursive: true });
  await mkdir("/tmp/pict/tests", { recursive: true });

  const modelPath = `/tmp/pict/models/${u4()}.txt`;
  const testsPath = `/tmp/pict/tests/${u4()}.json`;

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
  // on errors remove files from file system
  res.download(testsPath, async (err) => {
    if (err) {
      await rm(testsPath);
      await rm(modelPath);
    }
  });
  // all done, remove files
  await rm(testsPath);
  await rm(modelPath);

  res.status(201).end();
});

app.get("/", (req, res) => {
  res.json({ status: 200 });
});

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
