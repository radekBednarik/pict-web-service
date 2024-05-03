import "dotenv/config";
import { writeFile, mkdir } from "node:fs";
import express from "express";
import { v4 as u4 } from "uuid";
import PictGenerator from "pwtg";

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/generate", (req, res) => {
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
  const path = `/tmp/pict/${u4()}`;
  writeFile(path, data, { encoding: "utf-8" }, () => {
    const generator = new PictGenerator(path, "pict");
  });
});

app.get("/", (req, res) => {
  res.json({ status: 200 });
});

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
