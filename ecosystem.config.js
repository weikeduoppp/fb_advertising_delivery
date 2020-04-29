module.exports = {
  apps: [
    {
      name: "fb",
      script: "servers/app.js",
      env: {
        COMMON_VARIABLE: "true"
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3001
      }
    }
  ],
  deploy: {
    // 个人测试机
    production: {
      user: "manager",
      // 可以多台服务器
      host: ["47.104.88.94"],
      // 默认22
      // port: "",
      ref: "origin/yewq",
      repo: "git@gitlab.corp.youdao.com:yewq/fb_advertising_delivery.git",
      path: "/www/fb/production", // 部署到服务器的目录 -> 根目录
      ssh_options: ["StrictHostKeyChecking=no", "PasswordAuthentication=no"],
      // 发布脚本  (部署到服务后, 服务器会执行的script)
      "post-deploy":
        "yarn; pm2 startOrRestart ecosystem.config.js --env production",
      // Environment variables that must be injected in all applications on this env
      env: {
        NODE_ENV: "production"
      }
    }
  }
};
