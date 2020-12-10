// 受众对象表
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DetailSchema = new Schema({
  // 正文
  title: String,
  message: String,
  // 账户标识
  adaccount_id: { type: String, required: true },
  create_time: {
    type: Date,
    default: Date.now
  },
  last_update_time: {
    type: Date,
    default: Date.now
  },
  // 模板名字
  name: { type: String, required: true, default: "模板" }
});

module.exports = mongoose.model("Detail", DetailSchema);
