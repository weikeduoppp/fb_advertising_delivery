import { filterParams } from "utils";
// 创建动态素材相关

// 动态素材参数
export const initail = {
  // 广告标题或名字
  ads_name: "",
  // 主页id
  page_id: "",
  // ins账户id
  instagram_actor_id: "",
  // 格式  SINGLE_IMAGE，CAROUSEL_IMAGE，SINGLE_VIDEO
  ad_formats: ["SINGLE_IMAGE"],
  images: [],
  videos: [],
  // 正文
  bodies: [
    {
      text: ""
    }
  ],
  // 正文
  call_to_action_types: ["LEARN_MORE"],
  // 标题
  titles: [
    {
      text: ""
    }
  ],
  // 描述
  descriptions: [
    {
      text: ""
    }
  ],
  // 链接
  link_urls: [
    {
      website_url: "",
      // 应用安装类型的深度链接
      deeplink_url: "",
      // 显示链接
      display_url: ""
    }
  ],
  status: "PAUSED"
};

// reducer
export function reducer(state, action) {
  switch (action.type) {
    case "page_id":
      return { ...state, page_id: action.payload };
    case "instagram_actor_id":
      return { ...state, instagram_actor_id: action.payload };
    case "ads_name":
      return { ...state, ads_name: action.payload };
    case "reset":
      return { ...action.payload };
    case "ad_formats":
      return { ...state, ad_formats: action.payload };
    case "link_urls":
      return { ...state, link_urls: action.payload };
    case "images":
      return { ...state, images: action.payload };
    case "videos":
      return { ...state, videos: action.payload };
    case "bodies":
      return { ...state, bodies: action.payload };
    case "descriptions":
      return { ...state, descriptions: action.payload };
    case "titles":
      return { ...state, titles: action.payload };
    case "call_to_action_types":
      return { ...state, call_to_action_types: action.payload };
    case "status":
      return { ...state, status: action.payload };
    default:
      throw new Error();
  }
}

// 转换为创建参数 eg: https://developers.facebook.com/docs/marketing-api/dynamic-creative/dynamic-creative-optimization
export function handleDynamicCreative(link, DynamicCreative, images) {
  let {
    ads_name,
    status,
    link_urls: [links],
    page_id,
    instagram_actor_id,
    ...state
  } = JSON.parse(JSON.stringify(DynamicCreative));
  let object_story_spec = { page_id, instagram_actor_id };
  links.website_url = link;
  // 图片格式
  if (state.ad_formats[0] === "SINGLE_IMAGE") {
    state.images = images.map(d => ({
      hash: d.hash
    }));
  } 
  return {
    object_story_spec: filterParams(object_story_spec),
    asset_feed_spec: {
      ...state,
      link_urls: [filterParams(links)]
    }
  };
}
