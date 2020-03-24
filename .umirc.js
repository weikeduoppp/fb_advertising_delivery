const path = require("path");
// ref: https://umijs.org/config/
export default {
  // 打包线上 hash 模式
  base: "/",
  publicPath:
    "/dist/",
  hash: true,
  // history: "hash",
  treeShaking: true,
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
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      "umi-plugin-react",
      {
        antd: true,
        dva: true,
        dynamicImport: false,
        title: "海外投放",
        dll: false,

        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//
          ]
        }
      }
    ]
  ],
  alias: {
    components: path.resolve(__dirname, "src/components/"),
    utils: path.resolve(__dirname, "src/utils/"),
    pages: path.resolve(__dirname, "src/pages/")
  }
};
