export const initOptions = {
  appId: "2327900167245519",
  cookie: true,
  autoLogAppEvents: true,
  xfbml: true,
  version: "v5.0"
};

// ead_net appid, 密钥
export const client_id = "2327900167245519";
export const client_secret = "0bf41f7783541275b9ed05f4ca51fdd7";

export const version = "v1.9";

export function fbInit() {
  window.fbAsyncInit = function() {
    window.FB.init(initOptions);
    window.dispatchEvent(new Event("fb-sdk-ready"));
  };
  (function(d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  })(document, "script", "facebook-jssdk");
}

/**
 * head 表头
 * head_key 表头对应数据的键值
 * excel_label 选择的标识
 * param 请求参数
 */

// 日常运营数据表
export const daily = {
  name: "日常运营数据表",
  head: [
    "帐户编号",
    "帐户名称",
    "广告系列名称",
    "日期",
    "国家/地区",
    "展示次数",
    "链接点击量",
    "成效",
    "成效类型",
    "花费金额 (USD)"
  ],
  head_key: [
    "account_id",
    "account_name",
    "campaign_name",
    "date_start",
    "country",
    "impressions",
    "inline_link_clicks",
    "action_value",
    "action_type",
    "spend"
  ],
  number_key: ["impressions", "inline_link_clicks", "action_value", "spend"],
  excel_label: 0,
  param: {
    fields:
      "impressions,date_start,account_name,campaign_name,inline_link_clicks,spend,account_id,actions",
    // 尽量全导出.
    limit: "10000",
    // 广告系列
    level: "campaign",
    breakdowns: "country"
  }
};
// 素材基本数据表
export const basic = {
  name: "素材基本数据表",
  head: [
    "帐户编号",
    "帐户名称",
    "广告名称",
    "素材名",
    "广告创建日期",
    "消费日期（日期）",
    "展示次数",
    "链接点击量",
    "链接点击量-独立用户",
    "成效",
    "花费金额 (USD)",
    "观看视频达 10 秒的次数",
    "观看视频达 10 秒的单次费用 (USD)",
    "视频播放次数",
    "25%视频进度观看量",
    "50%视频进度观看量",
    "75%视频进度观看量",
    "100%视频进度观看量"
  ],
  head_key: [
    "account_id",
    "account_name",
    "ad_name",
    "material_name",
    "created_time",
    "date_start",
    "impressions",
    "inline_link_clicks",
    "unique_inline_link_clicks",
    "action_value",
    "spend",
    "video_10_sec_watched_actions",
    "cost_per_10_sec_video_view",
    "video_play_actions",
    "video_p25_watched_actions",
    "video_p50_watched_actions",
    "video_p75_watched_actions",
    "video_p100_watched_actions"
  ],
  number_key: [
    "impressions",
    "inline_link_clicks",
    "unique_inline_link_clicks",
    "action_value",
    "spend",
    "video_10_sec_watched_actions",
    "cost_per_10_sec_video_view",
    "video_play_actions",
    "video_p25_watched_actions",
    "video_p50_watched_actions",
    "video_p75_watched_actions",
    "video_p100_watched_actions"
  ],
  excel_label: 1,
  param(start_time, end_time) {
    return {
      fields: `created_time,name,adcreatives{object_story_spec},insights.time_range({since: "${start_time}", until: "${end_time}"}){ad_name,impressions,date_start,inline_link_clicks,unique_inline_link_clicks,spend,video_10_sec_watched_actions,cost_per_10_sec_video_view,video_play_actions,video_p25_watched_actions,video_p50_watched_actions,video_p75_watched_actions,video_p100_watched_actions,actions,account_id,account_name}`,
      // 数据量大 分小请求 测试数据上限
      limit: "150"
    };
  }
};
// 视频相关key
export const video_keys = [
  "cost_per_10_sec_video_view",
  "video_10_sec_watched_actions",
  "video_play_actions",
  "video_p25_watched_actions",
  "video_p50_watched_actions",
  "video_p75_watched_actions",
  "video_p100_watched_actions"
];
// 顾问跟踪表
export const subdivision = {
  name: "顾问跟踪表",
  head: [
    "帐户编号",
    "帐户名称",
    "广告系列名称",
    "成效",
    "成效类型",
    "覆盖人数",
    "频次",
    "预算 (USD) / 单日预算",
    "单次成效费用 (USD)",
    "花费金额 (USD)",
    "展示次数",
    "千次展示费用",
    "链接点击量",
    "单次链接点击费用 (USD)",
    "链接点击率",
    "点击量（全部）",
    "点击率（全部）",
    "单次点击费用（全部）(USD)",
    "应用安装",
    "移动应用安装",
    "单次应用安装费用 (USD)",
    "加入购物车",
    "移动应用加入购物车",
    "加入购物车转化价值 (USD)",
    "移动应用加入购物车转化价值 (USD)",
    "单次加入购物车费用 (USD)",
    "购买",
    "移动应用购物",
    "购物转化价值 (USD)",
    "移动应用购物转化价值 (USD)",
    "单次购物费用"
  ],
  head_key: [
    "account_id",
    "account_name",
    "campaign_name",
    "action_value",
    "action_type",
    "reach",
    "frequency",
    "daily_budget",
    "action_value_spend",
    "spend",
    "impressions",
    "cpm",
    "inline_link_clicks",
    "inline_link_clicks_spend",
    "inline_link_clicks_impressions",
    "clicks",
    "clicks_impressions",
    "clicks_spend",
    "mobile_app_install",
    "mobile_app_install",
    "mobile_app_install_spend",
    "fb_mobile_add_to_cart",
    "fb_mobile_add_to_cart",
    "fb_mobile_add_to_cart_value",
    "fb_mobile_add_to_cart_value",
    "fb_mobile_add_to_cart_spend",
    "fb_mobile_purchase",
    "fb_mobile_purchase",
    "fb_mobile_purchase_value",
    "fb_mobile_purchase_value",
    "fb_mobile_purchase_spend"
  ],
  number_key: [
    "action_value",
    "reach",
    "frequency",
    "daily_budget",
    "action_value_spend",
    "spend",
    "impressions",
    "cpm",
    "inline_link_clicks",
    "inline_link_clicks_spend",
    "inline_link_clicks_impressions",
    "clicks",
    "clicks_impressions",
    "clicks_spend",
    "mobile_app_install",
    "mobile_app_install",
    "mobile_app_install_spend",
    "fb_mobile_add_to_cart",
    "fb_mobile_add_to_cart",
    "fb_mobile_add_to_cart_value",
    "fb_mobile_add_to_cart_value",
    "fb_mobile_add_to_cart_spend",
    "fb_mobile_purchase",
    "fb_mobile_purchase",
    "fb_mobile_purchase_value",
    "fb_mobile_purchase_value",
    "fb_mobile_purchase_spend"
  ],
  excel_label: 2,
  param(start_time, end_time) {
    return {
      fields: `daily_budget,insights.time_range({"since": "${start_time}", "until":"${end_time}"}){reach,campaign_name,frequency,account_id,account_name,impressions,spend,cpm,inline_link_clicks,clicks,action_values,actions},name`,
      // 数据量大 分小请求 测试数据上限
      limit: "100"
    };
  }
};
