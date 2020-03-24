// 目前分3条线 应用安装, 点击, 转化

export const initail = {
  APP_INSTALLS: {
    // id: "",
    // 组名
    name: "",
    destination_type: "APP",
    // 系列id
    // campaign_id: "",
    // 宣传的对象
    promoted_object: {
      /* 
              CONVERSIONS
                pixel_id （转换w像素ID）
                pixel_id （Facebook像素ID）和 custom_event_type
                pixel_id（Facebook像素ID）pixel_rule和custom_event_type
                event_id （Facebook事件ID）和 custom_event_type
                application_id，，object_store_url以及custom_event_type移动应用事件
                offline_conversion_data_set_id（离线数据集ID）和 custom_event_type离线转化
              LINK_CLICKS
                application_id和object_store_url移动应用或帆布应用互动链接点击
              APP_INSTALLS
                application_id和object_store_url或application_id，object_store_url，和custom_event_type ，如果optimization_goal是OFFSITE_CONVERSIONS
            */
      //  应用id
      // application_id: "",
      //  应用商店地址
      // object_store_url: ""
    },
    // 动态素材 只在创建设置
    is_dynamic_creative: false,
    // 受众对象
    targeting: {
      // 自定义受众
      custom_audiences: [],
      // 13 <= x <= 65
      age_min: 13,
      age_max: 65,
      // 性别  数组 1: 男 2: 女 默认全部
      genders: [1, 2],
      // 定位
      geo_locations: {
        // (国家/地区)
        countries: [],
        country_groups: []
      },
      // 行为
      behaviors: [],
      // 兴趣  [{ id: "<INTEREST_ID>", name: "<INTEREST_NAME>" }]
      interests: [],
      // life_events、industries、income、family_statuses 生活纪实, 行业, 收入, 家庭状况
      life_events: [],
      industries: [],
      income: [],
      family_statuses: [],
      // 细分扩展 expansion_all | none
      targeting_optimization: "none",
      // 语言 [ key, key2 ]
      locales: [],
      // 关系 应用 installed：定位已安装推广对象/应用的用户。 not_installed：定位未安装推广对象/应用的用户 一般和promoted_object的 app 一致
      // app_install_state: "installed",
      // 版位 "facebook", "audience_network" ,"instagram", "messenger"
      publisher_platforms: [
        "facebook",
        "audience_network",
        "instagram",
        "messenger"
      ],
      //  设备 device_platforms：mobile、desktop 默认全部
      device_platforms: ["mobile", "desktop"],
      //  移动设备
      user_os: ["iOS", "Android"]
      //  包含设备
      // user_device
      //  Wifi
      //  wireless_carrier: ['Wifi']
    },
    //  广告投放优化目标  LINK_CLICKS EVENT_RESPONSES 应用事件-> promoted_object.custom_event_type
    optimization_goal: "",
    // 竞价事件 与优化目标关联
    billing_event: "",
    //  费用控制  更新时用到 bid_constraints: {"roas_average_floor": 15000}
    bid_amount: "", // 最低费用竞价策略没有费用控制额。
    //  竞价策略  LOWEST_COST_WITHOUT_CAP / COST_CAP LOWEST_COST_WITH_BID_CAP，TARGET_COST || 最低费用 / 费用上限  竞价上限 目标费用 注意：如果启用广告系列预算优化，则应bid_strategy 在父广告系列级别进行设置。
    bid_strategy: "LOWEST_COST_WITHOUT_CAP",
    // 单日预算
    daily_budget: "",
    // 总预算 如果已指定，则还必须指定一个end_time。=> 设置开始和结束日期
    // lifetime_budget: 0,
    /* 
      排期:
        从今天开始长期投放 start_time end_time=0
        设置开始和结束日期 start_time end_time
    */
    // start_time: "",
    end_time: 0,
    status: "ACTIVE"
  },
  LINK_CLICKS: {
    // 目标位置(推广类型) {UNDEFINED, WEBSITE, APP, MESSENGER, APPLINKS_AUTOMATIC, FACEBOOK}
    destination_type: "WEBSITE",
    is_dynamic_creative: false,
    targeting: {
      custom_audiences: [],
      geo_locations: {
        countries: [],
        country_groups: []
      },
      genders: [1, 2],
      age_min: 13,
      age_max: 65,
      publisher_platforms: [
        "facebook",
        "audience_network",
        "instagram",
        "messenger"
      ],
      device_platforms: ["mobile", "desktop"],
      user_os: ["iOS", "Android"],
      behaviors: [],
      interests: [],
      life_events: [],
      industries: [],
      income: [],
      family_statuses: [],
      targeting_optimization: "none"
    },
    optimization_goal: "",
    billing_event: "",
    bid_strategy: "LOWEST_COST_WITHOUT_CAP",
    status: "ACTIVE"
  },
  CONVERSIONS: {
    //  pixel_id （Facebook像素ID）和 custom_event_type
    promoted_object: {},
    // 目标位置 {UNDEFINED, WEBSITE, APP, MESSENGER, APPLINKS_AUTOMATIC, FACEBOOK}
    destination_type: "WEBSITE",
    is_dynamic_creative: false,
    targeting: {
      custom_audiences: [],
      geo_locations: {
        countries: [],
        country_groups: []
      },
      genders: [1, 2],
      age_min: 13,
      age_max: 65,
      publisher_platforms: [
        "facebook",
        "audience_network",
        "instagram",
        "messenger"
      ],
      device_platforms: ["mobile", "desktop"],
      user_os: ["iOS", "Android"],
      behaviors: [],
      interests: [],
      life_events: [],
      industries: [],
      income: [],
      family_statuses: [],
      targeting_optimization: "none"
    },
    optimization_goal: "",
    billing_event: "",
    bid_strategy: "LOWEST_COST_WITHOUT_CAP",
    status: "ACTIVE"
  }
};

// reducer
export function reducer(state, action) {
  switch (action.type) {
    case "id":
      return { ...state, id: action.payload };
    case "campaign_id":
      return { ...state, campaign_id: action.payload };
    case "promoted_object":
      return { ...state, promoted_object: action.payload };
    case "is_dynamic_creative":
      return { ...state, is_dynamic_creative: action.payload };
    case "name":
      return { ...state, name: action.payload };
    case "daily_budget":
      return { ...state, daily_budget: action.payload };
    case "targeting":
      return { ...state, targeting: action.payload };
    case "optimization_goal":
      return { ...state, optimization_goal: action.payload };
    case "billing_event":
      return { ...state, billing_event: action.payload };
    case "bid_amount":
      return { ...state, bid_amount: action.payload };
    case "bid_strategy":
      return { ...state, bid_strategy: action.payload };
    case "lifetime_budget":
      return { ...state, lifetime_budget: action.payload };
    case "start_time":
      return { ...state, start_time: action.payload };
    case "end_time":
      return { ...state, end_time: action.payload };
    case "status":
      return { ...state, status: action.payload };
    case "reset":
      return { ...action.payload };
    default:
      throw new Error();
  }
}

export const CONVERSIONS_EVENT = [
  "RATE",
  "TUTORIAL_COMPLETION",
  "CONTACT",
  "CUSTOMIZE_PRODUCT",
  "DONATE",
  "FIND_LOCATION",
  "SCHEDULE",
  "START_TRIAL",
  "SUBMIT_APPLICATION",
  "SUBSCRIBE",
  "ADD_TO_CART",
  "ADD_TO_WISHLIST",
  "INITIATED_CHECKOUT",
  "ADD_PAYMENT_INFO",
  "PURCHASE",
  "LEAD",
  "COMPLETE_REGISTRATION",
  "CONTENT_VIEW",
  "SEARCH",
  "SERVICE_BOOKING_REQUEST",
  "MESSAGING_CONVERSATION_STARTED_7D",
  "LEVEL_ACHIEVED",
  "ACHIEVEMENT_UNLOCKED",
  "SPENT_CREDITS",
  "LISTING_INTERACTION",
  "D2_RETENTION",
  "D7_RETENTION",
  "OTHER"
];
