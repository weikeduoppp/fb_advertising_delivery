var env = process.env.NODE_ENV === "production";
var env_test = process.env.NODE_ENV === "test";
var test = {
  host: '127.0.0.1',
  port: '19999',
  db: 'fb'
}
var online = {
  host: "yewq:yewq123@eadfbmongodb.youdao.com",
  port: "31492",
  db: "fb"
};
// 数据库配置
module.exports = env ? online : env_test ? test : {
  host:  "localhost",
  port:  "27017",
  db: "fb"
};
