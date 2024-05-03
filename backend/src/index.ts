import "dotenv/config";
import express from "express";

const app = express();

const port = process.env.PORT || 3000;

app.post("/generate", (req, res) => {
  //
});

app.get("/", (req, res) => {
  res.json({ status: 200 });
});

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
