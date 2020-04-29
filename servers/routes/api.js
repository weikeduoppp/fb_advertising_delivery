const express = require("express");
const router = express.Router();
const Targeting = require("../db/models/targeting");
const request = require("../utils/api");
// 应用信息
const client_id = "2327900167245519";
const client_secret = "0bf41f7783541275b9ed05f4ca51fdd7";
// const redirect_uri = "https://shared.ydstatic.com/";
const version = "v5.0";

// 获取服务器保存的自定义的受众
router.get("/targeting", async (req, res) => {
  try {
    const data = await Targeting.find({
      adaccount_id: req.query.adaccount_id
    });
    res.json({
      status: 1,
      data
    });
  } catch (e) {
    res.json({
      status: 0,
      msg: e
    });
  }
});

// 保存受众 账户id
router.post("/targeting", async (req, res) => {
  let body = req.body;
  try {
    let data = await Targeting.findOne({
      name: body.name,
      adaccount_id: body.adaccount_id
    });
    // 空为 null
    if (data) {
      await Targeting.updateOne({ name: body.name }, body);
      res.json({
        status: 1,
        msg: "更新成功"
      });
    } else {
      const result = await Targeting.create(body);
      res.json({
        status: 1,
        msg: "保存成功",
        result
      });
    }
  } catch (e) {
    console.log(e);
    res.json({
      status: 0,
      msg: e
    });
  }
});

// 获取长期访问口令  query:  accessToken
router.get("/token", (req, res) => {
  let host = req.hostname;
  console.log(host);
  // fb.yewq.top
  let redirect_uri = host.indexOf("fb") !== -1 ? "https://fb.yewq.top/" : "https://shared.ydstatic.com/";
  // let redirect_uri = "https://fb.yewq.top/";
  console.log(redirect_uri);
  request({
    url: "https://graph.facebook.com/" + version + "/oauth/client_code",
    method: "GET",
    params: {
      client_id,
      client_secret,
      access_token: req.query.accessToken,
      redirect_uri
    },
    success({code}) {
      console.log(code)
      request({
        url: "https://graph.facebook.com/" + version + "/oauth/access_token",
        method: "GET",
        params: {
          code,
          client_id,
          redirect_uri
        },
        success(response) {
          console.log(response)
          res.json({
            status: 1,
            access_token: response.access_token
          });
        },
        fail(error) {
          res.json({
            status: 0,
            msg: error
          });
        }
      });
    }, 
    fail(error) {
      res.json({
        status: 0,
        msg: error
      });
    }
  });
});

module.exports = router;
