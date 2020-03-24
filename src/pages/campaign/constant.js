// 营销目标
export const objective = ["APP_INSTALLS", "LINK_CLICKS", "CONVERSIONS"];
export const APP_INSTALLS = "APP_INSTALLS";
export const LINK_CLICKS = "LINK_CLICKS";
export const CONVERSIONS = "CONVERSIONS";

// 广告系列参数初始化  创建和更新 参数同在
export const initail = {
  // 飞书 应用23843892992130598 转化 23843883922970598 访问 23843939270380598    yewq 23844148806370023
  id: "",
  // 目标
  objective: APP_INSTALLS,
  // 名称
  name: "",
  // 单日预算
  daily_budget: 0,
  // 竟价策略 LOWEST_COST_WITHOUT_CAP，LOWEST_COST_WITH_BID_CAP，TARGET_COST || 费用上限 竞价上限 目标费用
  bid_strategy: "LOWEST_COST_WITHOUT_CAP",
  status: "ACTIVE",
  // 特殊广告类别 V5.0开始
  special_ad_category: "NONE"
};

// reducer
export function reducer(state, action) {
  switch (action.type) {
    case "id":
      return { ...state, id: action.payload };
    case "objective":
      return { ...state, objective: action.payload };
    case "name":
      return { ...state, name: action.payload };
    case "daily_budget":
      return { ...state, daily_budget: action.payload };
    case "bid_strategy":
      return { ...state, bid_strategy: action.payload };
    case "special_ad_category":
      return { ...state, special_ad_category: action.payload };
    case "status":
      return { ...state, status: action.payload };
    case "reset":
      return { ...action.payload };
    default:
      throw new Error();
  }
}
