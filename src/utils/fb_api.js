import api from "./fb_http";
import { message, notification } from "antd";
import { timeout, ParamsUrlQuery } from "./index";
import { client_id, client_secret } from "./config";
// 获取广告账户
export let getAdaccounts = (limit = 1000, after) => {
  let param = {
    fields: "name",
    limit
  };
  if (after) param.after = after;
  return api.get("/me/adaccounts", param).then(async res => {
    if (!res.data.length) return [];
    // 没有下一页
    if (!res.paging.next) {
      // console.log(data)
      return res.data;
    } else {
      // 获取剩下的
      return res.data.concat(
        await getAdaccounts(limit, res.paging.cursors.after)
      );
    }
  });
};

// 获取用户头像和名字
export const getUser = async () => {
  let res = await api.get(`/me`, { fields: "name,picture" });
  return {
    name: res.name,
    avatar: res.picture.data.url
  };
};

function handlePagesReturn(res) {
  // 没有下一页
  const {
    data,
    summary: { total_count },
    paging
  } = res;
  if (!paging) {
    // 就一页
    return {
      data,
      total_count
    };
  } else {
    return {
      data,
      total_count,
      paging: {
        before: paging.previous ? paging.cursors.before : null,
        after: paging.next ? paging.cursors.after : null
      }
    };
  }
}

// 获取广告系列 分页模式修改,  用户来请求下一页 pages分页对象
export let getCampaign = (id, pages = {}, limit = 50) => {
  let param = {
    fields:
      "name,status,daily_budget,objective,lifetime_budget,bid_strategy,special_ad_categories",
    summary: "total_count",
    limit
  };
  if (pages.after) param.after = pages.after;
  if (pages.before) param.before = pages.before;
  return api.get(`/${id}/campaigns`, param).then(async res => {
    return handlePagesReturn(res);
  });
};

// 创建广告系列  模式type  CREATE: 创建模式  COPY: 复制模式
export let createCampaign = (id, param, type = "CREATE") => {
  // {"name":"yewq_test2","objective":"APP_INSTALLS","status":"PAUSED","daily_budget":100},
  if (Number(param.daily_budget) > 0) {
    if (type === "CREATE") param.daily_budget = param.daily_budget * 100;
  } else {
    delete param.daily_budget;
    delete param.bid_strategy;
  }
  if (Number(param.lifetime_budget) > 0) {
    if (type === "CREATE") param.lifetime_budget = param.lifetime_budget * 100;
  } else {
    delete param.lifetime_budget;
  }
  // 更新后兼容之前的版本5.0   7.0之间的创建 special_ad_category -> special_ad_categories
  if (param.special_ad_category) {
    param.special_ad_categories = JSON.stringify([param.special_ad_category]);
    delete param.special_ad_category;
  }
  return api.post(`/${id}/campaigns`, param);
};

// 更新广告系列
export let updateCampaign = (id, param) => {
  if (param.daily_budget > 0) {
    param.daily_budget = param.daily_budget * 100;
  } else {
    delete param.daily_budget;
  }
  return api.post(`/${id}`, param);
};

// 获取账户下的广告组
export let getAdset = (id, pages = {}, limit = 50) => {
  let param = {
    fields:
      "id,name,campaign_id,promoted_object,targeting,optimization_goal,daily_budget,lifetime_budget,bid_amount,billing_event,bid_strategy,start_time,end_time,is_dynamic_creative,campaign{objective,bid_strategy,daily_budget},status",
    summary: "total_count",
    limit
  };
  if (pages.after) param.after = pages.after;
  if (pages.before) param.before = pages.before;
  return api.get(`/${id}/adsets`, param).then(async res => {
    return handlePagesReturn(res);
  });
};
// 获取系列下的广告组
export let getCampaignAdset = (campaign_id, limit = 1000, after) => {
  let param = {
    fields:
      "id,name,campaign_id,promoted_object,targeting,optimization_goal,daily_budget,lifetime_budget,bid_amount,billing_event,bid_strategy,start_time,end_time,is_dynamic_creative,status",
    limit
  };
  if (after) param.after = after;
  return api.get(`/${campaign_id}/adsets`, param).then(async res => {
    if (!res.data.length) return [];
    // 没有下一页
    if (!res.paging.next) {
      return res.data;
    } else {
      // 获取剩下的
      return res.data.concat(
        await getCampaignAdset(campaign_id, limit, res.paging.cursors.after)
      );
    }
  });
};

// 赋值的时候 /100  更新/创建时 再*100
function handleAdsetParam(param, type) {
  if (type === "CREATE") {
    if (param.daily_budget) param.daily_budget = param.daily_budget * 100;
    if (param.lifetime_budget)
      param.lifetime_budget = param.lifetime_budget * 100;
    if (param.bid_amount) param.bid_amount = param.bid_amount * 100;
  }
  // 在最低费用时不用删除策略
  if (!param.bid_amount) {
    if (
      param.bid_strategy !== "LOWEST_COST_WITHOUT_CAP" ||
      param.billing_event === "APP_INSTALLS"
    )
      delete param.bid_strategy;
    delete param.bid_amount;
  }
  if (param.lifetime_budget === 0) delete param.lifetime_budget;
  if (param.daily_budget === 0) delete param.daily_budget;
  return param;
}
// 创建广告组
export let createAdset = (id, param, type = "CREATE") => {
  return api.post(`/${id}/adsets`, handleAdsetParam(param, type));
};

// 更新广告组
export let updateAdset = (id, param) => {
  return api.post(`/${id}`, handleAdsetParam(param, "CREATE"));
};

// 检索外链的应用(app) -> 创建广告组/应用安装量 目前检索两地方"google_play", "itunes"
export let getApp = (id, query, app_store) => {
  return api.get(`/${id}/matched_search_applications`, {
    query_term: query,
    app_store: app_store
  });
};
// 检索账户绑定的app
// export let getAdaccountApp = id => {
//   return api.get(`/${id}/applications`, {
//     fields: "object_store_urls,id,name"
//   });
// };
// 广告帐户可发布广告的应用 (开发者app也在其中)
export let getAdaccountApp = id => {
  return api.get(`/${id}/advertisable_applications`, {
    fields: "app_install_tracked,id,name,object_store_urls"
  });
};

// 检索地区
export let getAdgeolocation = () => {
  return api.get(`/search`, {
    type: "adgeolocation",
    location_types: "['country']",
    q: "",
    limit: "1000"
  });
};

// 检索自定义受众
export let getCustomAudience = id => {
  return api.get(`${id}/customaudiences`, { fields: "name", limit: "1000" });
};

// 检索语言
export let getAdlocale = () => {
  return api.get(`/search`, { type: "adlocale", limit: "1000" });
};

// 检索兴趣
export let getInterests = () => {
  return api.get(`/search`, {
    type: "adTargetingCategory",
    class: "interests",
    limit: "1000"
  });
};

// 检索行为
export let getBehaviors = () => {
  return api.get(`/search`, {
    type: "adTargetingCategory",
    class: "behaviors",
    limit: "1000"
  });
};
// 检索人口统计数据
export let getDemographics = () => {
  return api.get(`/search`, {
    type: "adTargetingCategory",
    class: "demographics",
    limit: "1000"
  });
};

// 批量请求细分定位所需要的数据
export let getDetailTargeting = adaccount_id => {
  return api.post(`/`, {
    batch: [
      {
        method: "GET",
        relative_url:
          "search?type=adTargetingCategory&class=interests&limit=1000"
      },
      {
        method: "GET",
        relative_url:
          "search?type=adTargetingCategory&class=behaviors&limit=1000"
      },
      {
        method: "GET",
        relative_url:
          "search?type=adTargetingCategory&class=demographics&limit=1000"
      },
      {
        method: "GET",
        relative_url: `${adaccount_id}/targetingsuggestions`
      }
    ],
    include_headers: false
  });
};
// 批量请求版位要的数据
export let getPublisherPlatforms = adaccount_id => {
  return api.post(`/`, {
    batch: [
      {
        method: "GET",
        relative_url: "search?type=adTargetingCategory&class=user_os"
      },
      {
        method: "GET",
        relative_url:
          "search?type=adTargetingCategory&class=user_device&limit=10000"
      }
    ],
    include_headers: false
  });
};

// 获取像素代码 pixel_id  => 广告组目标为转换量时
export let getPixelId = id => {
  return api.get(`/${id}/adspixels`, { fields: "name" });
};

/* 
  广告相关
*/

// 获取账户下的广告 和 广告创意
export let getAds = (id, pages = {}, limit = 50) => {
  let param = {
    fields:
      "id,adset_id,name,status,campaign{objective},adcreatives{object_story_spec,asset_feed_spec},adset{promoted_object,is_dynamic_creative}",
    summary: "total_count",
    limit
  };
  if (pages.after) param.after = pages.after;
  if (pages.before) param.before = pages.before;
  return api.get(`/${id}/ads`, param).then(async res => {
    return handlePagesReturn(res);
  });
};

// 创建广告
export let createAds = (id, param) => {
  return api.post(`/${id}/ads`, param);
};

// 更新广告
export let updateAds = (id, param) => {
  return api.post(`/${id}`, param);
};

// 获取账户下的图片库
export let getAdimages = (id, pages = {}, limit = 100) => {
  let param = {
    fields: "hash,name,height,width,permalink_url,url_128",
    summary: "total_count",
    limit
  };
  if (pages.after) param.after = pages.after;
  if (pages.before) param.before = pages.before;
  return api.get(`/${id}/adimages`, param).then(async res => {
    return handlePagesReturn(res);
  });
};

// 上传单张图片库
export let UploadImage = (id, file, name) => {
  return api.post(`/${id}/adimages`, { bytes: file, name });
};

// 获取账户下视频
export let getAdvideos = (id, pages = {}, limit = 100) => {
  let param = {
    fields: "picture,thumbnails,title",
    summary: "total_count",
    limit
  };
  if (pages.after) param.after = pages.after;
  if (pages.before) param.before = pages.before;
  return api.get(`/${id}/advideos`, param).then(async res => {
    return handlePagesReturn(res);
  });
};

// 获取视频信息
export let getVideoInfo = (id, file, name) => {
  return api.get(`/${id}`, { fields: "picture,thumbnails,title" });
};

// 简单上传视频 通过可以下载的视频url
export let uploadVideo = (id, file, name) => {
  // return api.post(`/${id}/advideos`, {
  //   file_url:
  //     "https://video.xx.fbcdn.net/v/t42.1790-2/79508760_518557175405585_702552518143508480_n.mp4?_nc_cat=101&vs=7ab7d7ce7b50bbd5&_nc_vs=HBksFQAYJEdCZzF2UVFSWER3QW9OY0JBQUFBQUFETDk3OEpidjRHQUFBRhUAABUAGCRHRl9RdkFTd3lKX0FNVEVKQUFBQUFBQi1xaHBaYnY0R0FBQUYVAgBLAYgScHJvZ3Jlc3NpdmVfcmVjaXBlATEVACUAHAAAGA8xMDAwNDEwNjExMTE4MzUWgN3v6%2FiKwwIVAhkFGAJDMxgLdnRzX3ByZXZpZXccF0AYDlYEGJN1GClkYXNoX3YzXzEyODBfY3JmXzIzX2hpZ2hfMy4xX2ZyYWdfMl92aWRlbxEAGBh2aWRlb3MudnRzLmNhbGxiYWNrLnByb2QZHBUAFYT5AgAoElZJREVPX1ZJRVdfUkVRVUVTVBsGiBVvZW1fdGFyZ2V0X2VuY29kZV90YWcGb2VwX2hkE29lbV9yZXF1ZXN0X3RpbWVfbXMNMTU3NTQ1OTY5MjUzNgxvZW1fY2ZnX3J1bGUHdW5tdXRlZAxvZW1fdmlkZW9faWQPNzEwNDcyNTQyODA4NzI0Em9lbV92aWRlb19hc3NldF9pZA83MTA0NzI1MzI4MDg3MjUVb2VtX3ZpZGVvX3Jlc291cmNlX2lkDzcxMDQ3MjUyOTQ3NTM5MiUCAA%3D%3D&efg=eyJ2ZW5jb2RlX3RhZyI6Im9lcF9oZCJ9&_nc_ohc=Bhv9jv6PMnMAQmchW3-SajaUducIs0I4vo99gh1N2yrhwKA9dhpyfcfng&_nc_ht=video.xx&oh=1ff511cef3e61abd232a6d9766a4f441&oe=5DE9B3E5&_nc_rid=e3e297fd6dd04c7",
  //   name
  // });
  return api.post(`/${id}/advideos`, {
    file_url: file,
    name
  });
};

// 获取facebook主页, 创建广告创意需要page_id

export let getPageId = (limit = 1000, after) => {
  let param = {
    fields: "name,id",
    limit
  };
  if (after) param.after = after;
  return api.get(`/me/accounts?limit=${limit}`, param).then(async res => {
    if (!res.data.length) return [];
    // 没有下一页
    if (!res.paging.next) {
      return res.data;
    } else {
      // 获取剩下的
      return res.data.concat(await getPageId(limit, res.paging.cursors.after));
    }
  });
};

// 创建广告创意
export let createAdCreative = (id, param) => {
  return api.post(`/${id}/adcreatives`, param);
};

// 更新广告创意
export let updateAdCreative = (id, param) => {
  return api.post(`/${id}`, param);
};

//  创建幻灯片
export let createSlideshow = (id, param) => {
  return api.post(`/${id}/advideos`, { slideshow_spec: param });
};

// 复制广告系列 限制：对于同步呼叫，要复制的子广告总数不得超过3，对于异步呼叫，则不得超过51。 => 选择异步请求

// 异步复制 查看结果 最后返回是否成功  ids: 单个或者多个{}  (广告系列复制) id_string: campaign_id | adset_id
export let Copy = (ids, id_string) => {
  return new Promise(async (resolve, reject) => {
    if (Array.isArray(ids)) {
      // 参数
      let params = `rename_options={rename_suffix:'测试副本'}&status_option=PAUSED&deep_copy=true`;
      const { async_sessions } = await api.post("/", {
        asyncbatch: ids.map((item, i) => ({
          method: "POST",
          relative_url: `${item.id}/copies`,
          name: `${item.name}_copy_序号${i}`,
          // 而外的id_string
          body: id_string ? `${params}&${id_string}` : params
        })),
        name: "copy"
      });
      // resolve(async_sessions); // 删去等待时间
      let res = [];
      for (let i = 0; i < async_sessions.length; i++) {
        await timeout(() => {}, 1000);
        let obj = await getAsyncadrequestsets(async_sessions[i].id);
        if (obj.status === "COMPLETED") {
          message.success(`${obj.name}复制成功`);
          res.push(obj);
        }
      }
      res.length ? resolve(res) : resolve(false);
    }
  });
};

// 复制结果回调通知.
export async function CopyCallback(async_sessions) {
  return new Promise(async (resolve, reject) => {
    let res = [];
    for (let i = 0; i < async_sessions.length; i++) {
      await timeout(() => {}, 1000);
      let obj = await getAsyncadrequestsets(async_sessions[i].id);
      if (obj.status === "COMPLETED") {
        message.success(`${obj.name}复制成功`);
        res.push(obj);
      }
    }
    res.length ? resolve(res) : resolve(false);
  });
}

// 获取异步请求结果 3
async function getAsyncadrequestsets(id, num = 0) {
  return api
    .get(`/${id}`, {
      fields: "result,status,complete_time,name"
    })
    .then(async res => {
      if (res.status !== "COMPLETED") {
        if (res.status === "FAILED") {
          notification.error({
            message: `复制失败`,
            description: `${JSON.parse(res.result).error.error_user_msg}`,
            duration: null
          });
          return {};
        }
        // 限制请求次数
        if (num < 4) {
          num++;
          // 等3秒后再去请求 底下若广告多则缓慢.
          await timeout(() => {}, 5000);
          return await getAsyncadrequestsets(id, num);
        } else {
          notification.error({
            message: `${res.name}复制时间过长, 稍后刷新查看复制结果`,
            duration: null
          });
          return {};
        }
      } else {
        return res;
      }
    });
}

// 异步复制 查看结果 最后返回是否成功  ids: 单个或者多个{}  (广告系列复制) adsets: 广告组id => array
export let copyAds = (ids, adsets) => {
  return new Promise(async (resolve, reject) => {
    // 参数
    let params = `rename_options={rename_suffix:'测试副本'}&status_option=PAUSED&deep_copy=true`;
    let asyncbatchArr = [];
    if (adsets) {
      for (let d = 0; d < adsets.length; d++) {
        asyncbatchArr = asyncbatchArr.concat(
          ids.map((item, i) => ({
            method: "POST",
            relative_url: `${item.id}/copies`,
            name: `${item.name}_copy_序号${d}_${i}`,
            // 而外的id_string
            body: `${params}&adset_id=${adsets[d]}`
          }))
        );
      }
    } else {
      asyncbatchArr = ids.map((item, i) => ({
        method: "POST",
        relative_url: `${item.id}/copies`,
        name: `${item.name}_copy_序号${i}`,
        // 而外的id_string
        body: params
      }));
    }
    if (Array.isArray(ids)) {
      const { async_sessions } = await api.post("/", {
        asyncbatch: asyncbatchArr,
        name: "copy"
      });
      // resolve(async_sessions);
      // 恢复复制等待
      let res = [];
      for (let i = 0; i < async_sessions.length; i++) {
        await timeout(() => {}, 1000);
        let obj = await getAsyncadrequestsets(async_sessions[i].id);
        if (obj.status === "COMPLETED") {
          message.success(`${obj.name}复制成功`);
          res.push(obj);
        }
      }
      res.length ? resolve(res) : resolve(false);
    }
  });
};
/* 
  根据hash值获取图片信息 
  act_749121685269659/adimages?fields=url_128,name,width,height,hash&hashes=['62a17a2366b47c0210334f0e79360286']
 */
export let getImages = (id, hashes) => {
  return api.get(`/${id}/adimages`, {
    fields: `id,url_128,name,width,height,hash,permalink_url`,
    hashes: `${JSON.stringify(hashes)}`
  });
};

// 获取长期访问口令
export let getToken = token => {
  return api.get("/oauth/access_token", {
    grant_type: "fb_exchange_token",
    client_id,
    client_secret,
    fb_exchange_token: token
  });
};

// 获取复制源的数据
export const getCopyInfo = ids => {
  return api.post(`/`, {
    batch: ids.map(id => ({
      method: "GET",
      relative_url: `${id}?fields=id,name,daily_budget,objective,bid_strategy,special_ad_category,status,adsets.limit(100){id,name,promoted_object,destination_type,targeting,optimization_goal,daily_budget,bid_amount,billing_event,bid_strategy,start_time,end_time,is_dynamic_creative,status,ads{id,name,status,creative{object_story_spec,name,asset_feed_spec}}}`
    })),
    include_headers: false
  });
};

// 定位搜索
export let getTargetingsearch = (id, query) => {
  return api.get(`/${id}/targetingsearch`, { q: query });
};

// 获取账户下的ins账户 act_749121685269659/instagram_accounts?fields=username,id
export let getInstagramAccounts = id => {
  return api.get(`/${id}/instagram_accounts`, { fields: `username,id` });
};

// 批量创建广告组
export let batchCreateAdset = (adaccount_id, campaign_id, adsetGroup, app) => {
  return api.post(`/`, {
    batch: adsetGroup.map(({ id, ads, ...adsetState }) => {
      // 过滤自定义受众 关联应用 excluded_connections
      if (adsetState.targeting) {
        delete adsetState.targeting.custom_audiences;
        delete adsetState.targeting.excluded_connections;
      }
      // 如果是应用安装类型 如果有应用事件不覆盖 重置APP
      if (app)
        adsetState.promoted_object = { ...adsetState.promoted_object, ...app };
      return {
        method: "POST",
        relative_url: `${adaccount_id}/adsets`,
        body: ParamsUrlQuery(
          handleAdsetParam({ ...adsetState, campaign_id }, "COPY")
        )
      };
    }),
    include_headers: false
  });
};

// 获取定位更广泛的地理区域，如欧洲或北美洲
export let getCountryGroup = () => {
  return api.get(`/search`, {
    type: "adgeolocation",
    location_types: "['country_group']",
    q: "",
    limit: "1000"
  });
};
