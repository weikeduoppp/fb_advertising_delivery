// 防抖
export function debounce(func, delay = 300) {
  let timer;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = window.setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
}

// 延迟执行动画, 完后在操作 作同步写
export let timeout = (cb, time) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      cb();
      resolve();
    }, time);
  });

// 过滤对象中的空值  这个方法不会影响原来的对象，而是返回一个新对象
export function filterParams(obj) {
  var _newPar = {};
  for (var key in obj) {
    if (
      (obj[key] === 0 || obj[key] === false || obj[key]) &&
      obj[key].toString().replace(/(^\s*)|(\s*$)/g, "") !== ""
    ) {
      _newPar[key] = obj[key];
    }
  }
  return _newPar;
}

//  获取google_play返回uri里面的参数对应的值 /store/apps/details?id=com.app_mo.splayer
export function get_querystring(url, name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var i = url.indexOf("?");
  var r = url.substr(i + 1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

// 对象转URL参数
export function ParamsUrlQuery(param) {
  let arr = []
  for (let [key, value] of Object.entries(param)) {
    let val = value
    if (value instanceof Object) val = JSON.stringify(value)
    arr.push(key + "=" + val);
  }
  return arr.join("&");
}
