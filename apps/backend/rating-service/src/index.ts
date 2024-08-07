import express from "express";

const app = express();
let x = 1;

app.get("/", (req, res) => {
  res.json({
    message: "Hi there",
  });
});
