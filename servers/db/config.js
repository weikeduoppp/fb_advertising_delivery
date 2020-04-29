var env = process.env.NODE_ENV === "production";
// 数据库配置
module.exports = {
  host: env ? "127.0.01" : "localhost",
  port: env ? "19999" : "27017",
  db: "fb"
};
