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
export const version = "v5.0";

// 域名
// export const host = process.env.NODE_ENV === "production" ? 'https://fb.yewq.top' : ''
export const host = process.env.NODE_ENV === "production" ? '' : 'http://localhost:3001'


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

