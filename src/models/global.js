import * as globalServices from "../services/global";

// 制定reducer模式  eg: access_token => set_access_token
function makeReducer(state) {
  const reducer = {};
  for (let key of Object.keys(state)) {
    reducer[`set_${key}`] = function(state, { payload }) {
      return {
        ...state,
        [key]: payload
      };
    };
  }
  return reducer;
}

const state = {
  count: 0,
  // 登录token 访问口令
  access_token:
    "EAAhFNn6Kjs8BAJfIp8pZCt9LiaJm5TXENTWVhKwuNitXkC5yRrZAlhQG7eM3lz2j3HZBoZADfaNhwJRE1ZCAJilCVbI06li0vsvuqTJ0dZB7pJIOmRqSVPKDYy7poi3V4WZBZAxlP6QBWfZB2F3N3CMwy40Gdq2N1iIZAo8OU8ugRyzCedfouASKDb",
  // 用户名字 and 头像
  name: "",
  avatar: "",
  // 账号下的广告账户
  options: [],
  // 选择的广告账户
  adaccount_id: "",
  // 选中的广告系列 [{id: ~}]
  campaigns: [],
  // 选中的广告组
  adsets: [],
  // 选中的广告
  ads: [],
  // 创建时广告系列的数据 => {}
  c_campaign: null,
  // 创建时广告组的数据 => {}
  c_adset: null,
  // 广告创意选中的图片
  images: [],
  // 广告创意选中的视频
  videos: [],
  // 创建来源 (系列, 组)
  createDirection: "campaign",
  // 复制后的id
  copied_id: '',

  /* 缓存公共数据 */
  // 自定义受众
  customAudience: null,
  // 国家/地区
  geolocation: null,
  // 更广泛的地理区域，如欧洲或北美洲
  country_group: null,
  // 语言
  locale: null,
  // 受众
  targeting: null,
  // 设备相关数据
  os_cache: null,
  // 账户下的图片,视频 缓存对象{当前页数据, 总数, 分页对象}, 缓存
  adimages_cache: null,
  adimages: [],
  advideos_cache: null,
  advideos: [],
  // facebook主页
  pages_cache: null,
  // 账户下的应用id 像素id
  application: null,
  pixcel_id: null,
  // 账户下第一页广告系列数据
  campaigns_cache: {
    // 是否可以请求新数据
    isFetch: true,
    data: []
  },
  // 账户下关联的 Instagram 帐户
  instagram_accounts_cache: null
};

export default {
  state,
  reducers: {
    ...makeReducer(state)
    // 而外的
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const data = yield call(globalServices.fetch);
      yield put({ type: "save", payload: data });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      // 路由
      console.log(history);
      // 直接打包的文件 不能自动redirect
      if (history.location.pathname.indexOf("html") !== -1)
        history.push("/campaign");
    }
  }
};
