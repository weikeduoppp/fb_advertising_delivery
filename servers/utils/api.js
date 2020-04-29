const { fetch } = require('dva')

// fetch 请求
module.exports = function request({ url, params, method, success, fail }) {
  if (method === "GET") {
    if (params) {
      let paramsArray = [];
      //拼接参数
      Object.keys(params).forEach(key =>
        paramsArray.push(key + "=" + params[key])
      );
      if (url.search(/\?/) === -1) {
        url += "?" + paramsArray.join("&");
      } else {
        url += "&" + paramsArray.join("&");
      }
    }
    fetch(url, {
      method: "GET",
      mode: "cors"
    })
      .then(res => res.json())
      .then(res => {
        success && success(res);
      })
      .catch(error => {
        fail && fail(error);
      });
  } else {
    fetch(url, {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => {
        success && success(res);
      })
      .catch(error => {
        fail && fail(error);
      });
  }
}
