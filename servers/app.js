const express = require("express");
const app = express();
const path = require("path");

app.use("/dist", express.static(path.join(__dirname, "../dist")));

app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(3001);
