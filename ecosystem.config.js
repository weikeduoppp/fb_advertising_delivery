module.exports = {
  apps: [
    {
      name: "fb_amdin",
      script: "./servers/app.js",
      env: {
        COMMON_VARIABLE: "true"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ],
  deploy: {
    // "production" is the environment name
    production: {
      user: "manager",
      // 可以多台服务器
      host: ["47.104.88.94"],
      // 默认22
      // port: "",
      ref: "origin/pm2",
      repo: "git@gitlab.corp.youdao.com:yewq/fb_advertising_delivery.git",
      path: "/www/fb_admin/production", // 发布的目录 
      ssh_options: ["StrictHostKeyChecking=no", "PasswordAuthentication=no"],
      // 发布脚本  (部署到服务后, 服务器会执行的script)
      "post-deploy":
        "npm install && npm build && pm2 startOrRestart ecosystem.config.js --env production",
      // Environment variables that must be injected in all applications on this env
      env: {
        NODE_ENV: "production"
      }
    }
  }
};
