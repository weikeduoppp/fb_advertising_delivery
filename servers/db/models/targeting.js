// 受众对象表
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// 细分对象 eg: { id: "<INTEREST_ID>", name: "<INTEREST_NAME>" }
const SubdivisionSchema = new Schema({
  id: String,
  name: String
});
const TargetingSchema = new Schema({
  // 年龄
  age_min: {
    type: Number,
    min: 13,
    max: 65
  },
  age_max: {
    type: Number,
    min: 13,
    max: 65
  },
  // 性别
  genders: [Number],
  // 地区
  geo_locations: {
    countries: [String],
    country_groups: [String]
  },
  // 自定义受众
  custom_audiences: [SubdivisionSchema],
  // 兴趣, 行为等
  behaviors: [SubdivisionSchema],
  interests: [SubdivisionSchema],
  life_events: [SubdivisionSchema],
  industries: [SubdivisionSchema],
  family_statuses: [SubdivisionSchema],
  income: [SubdivisionSchema],
  // 细分扩展是否开启
  targeting_optimization: { type: String, default: "none" },
  // 语言
  locales: [Number],
  // 版位
  publisher_platforms: [String],
  // 设备
  device_platforms: [String],
  // 移动设备
  user_os: [String],
  user_device: [String],
  // wifi
  wireless_carrier: [String],
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
  // 受众名字
  name: { type: String, required: true, default: "新受众" }
});

module.exports = mongoose.model("Targeting", TargetingSchema);
