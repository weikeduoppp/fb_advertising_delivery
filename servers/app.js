const express = require("express");
const app = express();
const path = require("path");
const apiRouter = require("./routes/api");
const mongoose = require("mongoose");
const dbConfig = require("./db/config");
const cors = require("cors");

// 配置cors
app.use(cors());

// 添req.body -> post请求
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// 静态资源
app.use("/", express.static(path.join(process.cwd(), "./dist")));

try {
  // 数据库连接
  mongoose.connect(
    `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.db}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferMaxEntries: 0 /* B */,
      // autoReconnect: true /* C, default is true, you can ignore it */,
      // 不要停止尝试重新连接
      // reconnectTries: Number.MAX_VALUE
    }
  );
  const db = mongoose.connection;
  db.on("error", error => {
    console.log(`MongoDB connecting failed: ${error}`);
  });
  db.on("reconnectFailed", error => {
    console.log(`MongoDB connecting reconnectFailed: ${error}`);
  });
  db.on("disconnected", () => {
    // do resetConnect
  });
  db.once("open", () => {
    console.log("MongoDB connecting succeeded");
  });
} catch (error) {
  console.log(`MongoDB connecting failed: ${error}`);
}

// api路由
app.use("/api", apiRouter);

//
app.use("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "./dist/index.html"));
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Listening on " + process.env.PORT);
});
