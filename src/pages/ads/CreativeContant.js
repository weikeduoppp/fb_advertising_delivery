import { filterParams } from "utils";

// 临时广告创意表单参数 携带 广告名字 点击创建时 进行整理成创建格式
export const initail = {
  ads_name: "",
  // 广告标题或名字
  name: "",
  // 广告形式
  format: "photo_data",
  /* 
    创意包含的页面ID等内容
    child_attachments 轮播
    video_data 单视频
    photo_data 单图片
    slideshow_spec 幻灯片
    batch_video_data 批量视频
      batch_video_data_one 1对1
      batch_video_data_more 1对多
    
    视频: object_story_spec：page_id，video_data {title, image_url, video_id, call_to_action, message}

    https://developers.facebook.com/docs/marketing-api/reference/ad-creative-object-story-spec/   
  */
  //  创建格式例子
  object_story_spec: {
    link_data: {
      call_to_action: {
        type: "INSTALL_MOBILE_APP",
        value: {
          link: "<APP_STORE_URL>",
          // 深度链接 应用安装线
          app_link: ""
        }
      },
      image_hash: "<IMAGE_HASH>",
      link: "https://itunes.apple.com/app/id944846798",
      //  正文
      message: "",
      //  描述
      description: "",
      //  标题
      name: ""
    },
    video_data: {
      call_to_action: {
        type: "INSTALL_MOBILE_APP",
        value: { link: "<APP_STORE_URL>" }
      },
      image_url: "<THUMBNAIL_URL>",
      video_id: "<VIDEO_ID>",
      title: ""
    },
    child_attachments: [
      {
        link: "http://www.example.com/appstoreurl",
        image_hash: "<IMAGE_HASH>",
        call_to_action: {
          type: "USE_MOBILE_APP",
          value: {
            app_link: "<DEEP_LINK>"
          }
        }
      },
      {
        link: "http://www.example.com/appstoreurl",
        image_hash: "<IMAGE_HASH>",
        call_to_action: {
          type: "USE_MOBILE_APP",
          value: {
            app_link: "<DEEP_LINK>"
          }
        }
      }
    ],
    // 主页id
    page_id: "",
    // link
    instagram_actor_id: ""
  },
  // 主页id
  page_id: "",
  // ins账户id
  instagram_actor_id: "",
  // 应用的链接
  object_store_url: "",
  // 网站
  object_url: "",
  image_hash: "",
  video_id: "",
  // 视频的预览图
  image_url: "",
  message: "",
  title: "",
  link: "",
  app_link: "",
  //  描述
  description: "",
  call_to_action: "",
  // 轮播的数据
  child_attachments: [],
  // 轮播结尾 查看更多的网址
  caption: "",
  // 轮播自动排序
  multi_share_optimized: true,
  status: "ACTIVE",
  // 批量时一对多 . 组下多少个广告
  ads_num: 1,
  campaign_num: 1,
  adset_num: 1
};

// reducer
export function reducer(state, action) {
  switch (action.type) {
    case "page_id":
      return { ...state, page_id: action.payload };
    case "instagram_actor_id":
      return { ...state, instagram_actor_id: action.payload };
    case "name":
      return { ...state, name: action.payload };
    case "title":
      return { ...state, title: action.payload };
    case "ads_name":
      return { ...state, ads_name: action.payload };
    case "format":
      return { ...state, format: action.payload };
    case "image_hash":
      return { ...state, image_hash: action.payload };
    case "message":
      return { ...state, message: action.payload };
    case "link":
      return { ...state, link: action.payload };
    case "app_link":
      return { ...state, app_link: action.payload };
    case "description":
      return { ...state, description: action.payload };
    case "child_attachments":
      return { ...state, child_attachments: action.payload };
    case "video_id":
      return { ...state, video_id: action.payload };
    case "image_url":
      return { ...state, image_url: action.payload };
    case "object_story_spec":
      return { ...state, object_story_spec: action.payload };
    case "call_to_action":
      return { ...state, call_to_action: action.payload };
    case "status":
      return { ...state, status: action.payload };
    case "ads_num":
      return { ...state, ads_num: action.payload };
    case "adset_num":
      return { ...state, adset_num: action.payload };
    case "campaign_num":
      return { ...state, campaign_num: action.payload };
    case "title_message":
      return { ...state, ...action.payload };
    case "reset":
      return { ...action.payload };
    default:
      throw new Error();
  }
}

// 行动号召
export const call_to_action = {
  LINK_CLICKS: [
    "GET_OFFER",
    "GET_QUOTE",
    "GET_SHOWTIMES",
    "LEARN_MORE",
    "REQUEST_TIME",
    "SEE_MENU",
    "SHOP_NOW",
    "SIGN_UP",
    "SUBSCRIBE",
    "WATCH_MORE",
    "LISTEN_NOW",
    "APPLY_NOW",
    "BOOK_NOW",
    "CONTACT_US",
    "DOWNLOAD"
  ],
  CONVERSIONS: [
    "GET_OFFER",
    "GET_QUOTE",
    "GET_SHOWTIMES",
    "LEARN_MORE",
    "REQUEST_TIME",
    "SEE_MENU",
    "SHOP_NOW",
    "SIGN_UP",
    "SUBSCRIBE",
    "WATCH_MORE",
    "PLAY_GAME",
    "LISTEN_NOW",
    "APPLY_NOW",
    "BOOK_NOW",
    "CONTACT_US",
    "DOWNLOAD"
  ],
  APP_INSTALLS: [
    "SHOP_NOW",
    "BOOK_TRAVEL",
    "LEARN_MORE",
    "SIGN_UP",
    "DOWNLOAD",
    "SUBSCRIBE",
    "INSTALL_MOBILE_APP",
    "USE_MOBILE_APP",
    "WATCH_VIDEO",
    "WATCH_MORE",
    "OPEN_LINK",
    "USE_APP",
    "PLAY_GAME",
    "BUY_NOW",
    "GET_OFFER"
  ]
};

// adsCreativeState转换成创建参数 - 广告创意
export function handleAdCreative(link, state) {
  // 创意规范
  let object_story_spec = {
    page_id: state.page_id
  };
  if (state.instagram_actor_id)
    object_story_spec.instagram_actor_id = state.instagram_actor_id;
  // 行动号召
  let call_to_action = state.call_to_action;
  // 应用安装时的深度链接
  let app_link = state.app_link;
  // 看是什么形式的广告
  switch (state.format) {
    // 单张图片广告
    case "photo_data":
      object_story_spec.link_data = {
        name: state.name,
        image_hash: state.image_hash,
        message: state.message,
        description: state.description,
        link
      };
      // 过滤空键值对
      object_story_spec.link_data = filterParams(object_story_spec.link_data);
      if (call_to_action)
        object_story_spec.link_data.call_to_action = {
          type: call_to_action,
          value: {
            link
          }
        };
      if (app_link)
        object_story_spec.link_data.call_to_action.value.app_link = app_link;

      break;

    case "child_attachments":
      // 轮播格式
      object_story_spec.link_data = {
        name: state.name,
        image_hash: state.image_hash,
        message: state.message,
        description: state.description,
        link,
        caption: state.caption,
        multi_share_optimized: true
      };
      //  过滤
      object_story_spec.link_data = filterParams(object_story_spec.link_data);
      // 轮播数据处理
      object_story_spec.link_data.child_attachments = state.child_attachments.map(
        item => {
          if (call_to_action)
            item.call_to_action = {
              type: call_to_action,
              value: {
                link
              }
            };
          if (item.link) {
            item.call_to_action.value.link = item.link;
          } else {
            item.link = link;
          }
          if (app_link) item.call_to_action.value.app_link = app_link;
          return item;
        }
      );
      break;

    // 视频广告 / 幻灯片 / 批量视频
    default:
      object_story_spec.video_data = {
        image_url: state.image_url,
        video_id: state.video_id,
        title: state.name,
        message: state.message
      };
      object_story_spec.video_data = filterParams(object_story_spec.video_data);
      if (call_to_action)
        object_story_spec.video_data.call_to_action = {
          type: call_to_action,
          value: {
            link,
            // 深度链接 应用安装线
            app_link: state.app_link
          }
        };
      if (app_link)
        object_story_spec.video_data.call_to_action.value.app_link = app_link;
      break;
  }
  return {
    name: state.name,
    object_story_spec
  };
}
