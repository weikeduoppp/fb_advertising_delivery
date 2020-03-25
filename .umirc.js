const path = require("path");
// ref: https://umijs.org/config/
export default {
  // 打包线上 hash 模式
  base: "/",
  publicPath: "/dist/",
  hash: true,
  // history: "hash",
  routes: [
    {
      path: "/",
      component: "../layouts/index",
      routes: [
        {
          path: "/",
          redirect: "/campaign",
          component: "./campaign/campaignManagement"
        },
        { path: "/campaign", component: "./campaign/campaignManagement" },
        { path: "/adset", component: "./adset/adsetManagement" },
        { path: "/ad", component: "./ads/adsManagement" },
        { path: "/creation", component: "./creation/index" }
      ]
    }
  ],
  antd: {},
  dva: {},
  dynamicImport: false,
  title: "海外投放",

  alias: {
    components: path.resolve(__dirname, "src/components/"),
    utils: path.resolve(__dirname, "src/utils/"),
    pages: path.resolve(__dirname, "src/pages/")
  }
};
