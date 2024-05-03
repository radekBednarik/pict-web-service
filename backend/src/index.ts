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
  // on errors remove files from file system
  res.download(testsPath, async (err) => {
    if (err) {
      await rm(testsPath);
      await rm(modelPath);

      res.status(500).json({ error: { code: 500, message: `Downloading file failed with error: ${err}` } });
    }
  });
  // all done, remove files
  // if there would be an ensured deletion of `/tmp` folder
  // we would not want to do this, it is a perf penalty
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
