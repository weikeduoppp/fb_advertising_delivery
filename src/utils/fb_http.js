import { notification } from "antd";
import { timeout } from "./index";
let timer = null;
function tokenHandler() {
  notification.error({
    message: "错误",
    description: "Facebook访问令牌失效, 请点击重新登录"
  });
  // 失效了清除token 账户id
  localStorage.removeItem(`access_token`);
  localStorage.removeItem(`adaccount_id`);
}
// 封装fb请求方法
export default {
  async get(url, params) {
    // 添加访问令牌
    var obj = Object.assign(
      {
        access_token:
          localStorage.getItem("access_token") ||
          "EAAhFNn6Kjs8BAJfIp8pZCt9LiaJm5TXENTWVhKwuNitXkC5yRrZAlhQG7eM3lz2j3HZBoZADfaNhwJRE1ZCAJilCVbI06li0vsvuqTJ0dZB7pJIOmRqSVPKDYy7poi3V4WZBZAxlP6QBWfZB2F3N3CMwy40Gdq2N1iIZAo8OU8ugRyzCedfouASKDb"
      },
      params
    );
    if (!window.FB) await timeout(() => {}, 1500);
    return new Promise((resolve, reject) => {
      window.FB &&
        window.FB.api(url, "GET", obj, function(res) {
          const error = res.error;
          if (!error) {
            resolve(res);
          } else {
            if (error.error_subcode === 2446079) {
              notification.error({
                message: "错误",
                description:
                  "Facebook访问调用次数、总 CPU 时间或总时间达到使用量的 100%, 过一小时再尝试",
                duration: null
              });
              return false;
            } else if (
              error.error_subcode === 463 ||
              error.error_subcode === 467 ||
              error.code === 190
            ) {
              if (timer) {
                clearTimeout(timer);
                timer = setTimeout(tokenHandler, 500);
              } else {
                timer = setTimeout(tokenHandler, 500);
              }
            } else {
              notification.error({
                message: "错误",
                description: `${error.error_user_msg ||
                  error.message} (请联系开发人员)`,
                duration: null
              });
            }
          }
        });
    });
  },
  async post(url, params) {
    var obj = Object.assign(
      {
        access_token:
          localStorage.getItem("access_token") ||
          "EAAhFNn6Kjs8BAJfIp8pZCt9LiaJm5TXENTWVhKwuNitXkC5yRrZAlhQG7eM3lz2j3HZBoZADfaNhwJRE1ZCAJilCVbI06li0vsvuqTJ0dZB7pJIOmRqSVPKDYy7poi3V4WZBZAxlP6QBWfZB2F3N3CMwy40Gdq2N1iIZAo8OU8ugRyzCedfouASKDb"
      },
      params
    );
    // 调试不从初始页开始需要等待FB
    if (!window.FB) await timeout(() => {}, 1500);
    return new Promise((resolve, reject) => {
      window.FB &&
        window.FB.api(url, "POST", obj, function(res) {
          const error = res.error;
          if (res && !error) {
            resolve(res);
          } else {
            if (error.error_subcode === 2446079) {
              notification.error({
                message: "错误",
                description:
                  "Facebook访问调用次数、总 CPU 时间或总时间达到使用量的 100%, 过一小时再尝试"
              });
            } else if (
              error.error_subcode === 463 ||
              error.error_subcode === 467 ||
              error.code === 190
            ) {
              if (timer) {
                clearTimeout(timer);
                timer = setTimeout(tokenHandler, 500);
              } else {
                timer = setTimeout(tokenHandler, 500);
              }
            } else {
              notification.error({
                message: "错误",
                description: `${error.error_user_msg || error.message} `,
                duration: null
              });
            }
            // 创建广告时 不暂停
            if (url.endsWith("/ads")) {
              resolve(res);
            }
          }
        });
    });
  }
};
