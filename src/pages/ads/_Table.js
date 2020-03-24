import { useState, useRef } from "react";
import style from "../adset/index.less";
import { Divider, Spin } from "antd";
import Table from "components/common/_Table";
import Edit from "./edit";
import { connect } from "dva";
import * as api from "utils/fb_api.js";
import { filterParams } from "utils";
import * as CampaignContant from "../campaign/constant";

// 获取数组最后一项
function lengthLastIndex(params) {
  return params.length - 1;
}

// 处理编辑时的数据 => CreativeContant.initail格式
async function handleEditAdsData(
  other,
  objective,
  dispatch,
  adaccount_id,
  is_dynamic_creative
) {
  // 如果是动态创意. 进行动态创意编辑
  if (is_dynamic_creative)
    return handleDynamicCreativeState(other, objective, dispatch, adaccount_id);
  // asset_feed_spec 针对 object_story_spec没有素材的情况下 生成对应素材
  let { object_story_spec, asset_feed_spec } = other.adcreatives.data[0];
  if (CampaignContant.objective.indexOf(objective) === -1) {
    return {
      ads_name: other.name,
      status: other.status
    };
  }
  let initail = {
    ads_name: other.name,
    page_id: object_story_spec.page_id,
    instagram_actor_id: object_story_spec.instagram_actor_id,
    status: other.status
  };
  let link_data = object_story_spec.link_data;
  let video_data = object_story_spec.video_data;
  if (link_data) {
    initail = { ...initail, ...link_data };
    // 轮播
    if (link_data.child_attachments) {
      initail.format = "child_attachments";
      initail.call_to_action =
        link_data.child_attachments[0].call_to_action.type;
      let hashes = link_data.child_attachments.map(d => d.image_hash);
      // 有image_hash的情况下
      if (hashes.length > 0) {
        const { data } = await api.getImages(
          adaccount_id,
          // 同时过滤没有图片的.
          hashes.filter(d => d !== null && d !== undefined)
        );
        dispatch({ type: "global/set_images", payload: data });
      }
      // 处理深度链接
      initail.child_attachments = initail.child_attachments.map(item => {
        item.app_link = item.call_to_action.value.app_link;
        return filterParams(item);
      });
      if (!initail.link)
        initail.link =
          link_data.child_attachments[0].link ||
          link_data.child_attachments[0].call_to_action.value.link;
    } else {
      // 图片格式
      initail.format = "photo_data";
      initail.call_to_action = link_data.call_to_action.type;
      if (link_data.image_hash) {
        const { data } = await api.getImages(adaccount_id, [
          link_data.image_hash
        ]);
        dispatch({ type: "global/set_images", payload: data });
      }
      if (!initail.link) initail.link = link_data.call_to_action.value.link;
      initail.app_link = link_data.call_to_action.value.app_link;
    }
  } else if (video_data) {
    // 视频
    initail.format = "video_data";
    initail = { ...initail, ...video_data };
    initail.call_to_action =
      video_data.call_to_action && video_data.call_to_action.type;
    if (video_data.image_hash) {
      const { data } = await api.getImages(adaccount_id, [
        video_data.image_hash
      ]);
      dispatch({
        type: "global/set_videos",
        // 视频中 hash对应视频id
        payload: [{ ...data[0], hash: video_data.video_id }]
      });
    }
    if (!initail.link) initail.link = video_data.call_to_action.value.link;
    initail.app_link = video_data.call_to_action.value.app_link;
  } else {
    // 动态素材规范有的话 (asset_feed_spec)
    if (asset_feed_spec) {
      initail = await hanleAssetFeedSpec(
        initail,
        asset_feed_spec,
        dispatch,
        adaccount_id
      );
    }
  }
  return filterParams(initail);
}

async function handleDynamicCreativeState(
  other,
  objective,
  dispatch,
  adaccount_id
) {
  let { object_story_spec, asset_feed_spec } = other.adcreatives.data[0];
  let initail = {
    ads_name: other.name,
    page_id: object_story_spec.page_id,
    instagram_actor_id: object_story_spec.instagram_actor_id,
    status: other.status,
    ...asset_feed_spec
  };
  // 处理显示的图片/视频
  let ad_formats = asset_feed_spec.ad_formats[0]
  if (ad_formats === "SINGLE_IMAGE") {
    let images = asset_feed_spec.images
     const { data } = await api.getImages(
       adaccount_id,
       // 同时过滤没有图片的.
       images.map(d => d.hash)
     );
     dispatch({ type: "global/set_images", payload: data });
  } else if (ad_formats === "SINGLE_VIDEO") {
    let videos = asset_feed_spec.videos;
    const { data } = await api.getImages(
      adaccount_id,
      // 同时过滤没有图片的.
      videos.map(d => d.thumbnail_hash)
    );
    dispatch({
      type: "global/set_videos",
      payload: data.map((d, i) => ({
        ...d,
        hash: videos[i].video_id
      }))
    });
  }
  return filterParams(initail);
}

// 处理object_story_spec内无素材数据的情况  动态创意
async function hanleAssetFeedSpec(
  initail,
  asset_feed_spec,
  dispatch,
  adaccount_id
) {
  let images = asset_feed_spec.images;
  let videos = asset_feed_spec.videos;
  let titles = asset_feed_spec.titles;
  let bodies = asset_feed_spec.bodies;
  let call_to_action_types = asset_feed_spec.call_to_action_types;
  let link_urls = asset_feed_spec.link_urls;
  let descriptions = asset_feed_spec.descriptions;
  let image_hash = videos
    ? videos[lengthLastIndex(videos)].thumbnail_hash
    : images[lengthLastIndex(images)].hash;
  const { data } = await api.getImages(adaccount_id, [image_hash]);
  // 视频
  if (videos) {
    initail.format = "video_data";
    initail.video_id = videos[lengthLastIndex(videos)].video_id;
    initail.image_url = videos[lengthLastIndex(videos)].thumbnail_url;
    dispatch({
      type: "global/set_videos",
      payload: [{ ...data[0], hash: initail.video_id }]
    });
  } else {
    // 图片
    initail.format = "photo_data";
    initail.image_hash = image_hash;
    dispatch({ type: "global/set_images", payload: data });
  }

  initail = {
    ...initail,
    name: titles && titles[lengthLastIndex(titles)].text,
    message: bodies && bodies[lengthLastIndex(bodies)].text,
    link: link_urls && link_urls[lengthLastIndex(bodies)]?.website_url,
    app_link: link_urls && link_urls[lengthLastIndex(bodies)]?.deeplink_url,
    call_to_action:
      call_to_action_types &&
      call_to_action_types[lengthLastIndex(call_to_action_types)],
    description:
      descriptions && descriptions[lengthLastIndex(descriptions)].text
  };
  return initail;
}

// 广告表格
const TableComponent = ({
  data,
  search,
  loading,
  updateTable,
  dispatch,
  campaigns_select,
  adset_select,
  selectKeys,
  adaccount_id,
  setCopyModel,
  global_images
}) => {
  // 过滤设计以外的营销目标
  const dataSource = data.filter(
    item => CampaignContant.objective.indexOf(item.campaign.objective) !== -1
  );
  // model标识
  const [visible, setVisible] = useState(false);
  const [ads_id, setAds_id] = useState(null);
  // const [initailState, setInitailState] = useState(null);
  const initailState = useRef(null);
  // 记录编辑的系列目标
  const [campaignData, setCampaignData] = useState(null);
  // 若是应用安装 记录编辑的app_url
  const [object_store_url, set_object_store_url] = useState(null);
  // 准备编辑信息的加载标识
  const [editLoading, setEditLoading] = useState(false);
  const [isDynamicCreative, setIsDynamicCreative] = useState(false);

  async function handleEdit(record) {
    const { campaign, adset, ...other } = record;
    let is_dynamic_creative = adset.is_dynamic_creative;
    setEditLoading(true);
    const initail = await handleEditAdsData(
      other,
      campaign.objective,
      dispatch,
      adaccount_id,
      is_dynamic_creative
    );
    setIsDynamicCreative(is_dynamic_creative);
    set_object_store_url(adset?.promoted_object?.object_store_url);
    setCampaignData(campaign);
    setEditLoading(false);
    setAds_id(record.id);
    initailState.current = initail;
    setVisible(true);
  }

  // 表格列标题
  const columns = [
    {
      title: "广告名称",
      dataIndex: "name",
      render: (text, record) => (
        <span
          className={style._a}
          onClick={e => {
            // 处理编辑数据
            handleEdit(record);
          }}
        >
          {text}
        </span>
      )
    },
    {
      title: "营销目标",
      dataIndex: "objective",
      render: (text, record) => <span>{record.campaign.objective}</span>
    },
    {
      title: "投放状态",
      dataIndex: "status",
      sorter: (a, b) => a.status.toString().localeCompare(b.status),
      render: text => text
    },
    {
      title: "操作",
      key: "action",
      width: "15%",
      render: (text, record) => (
        <span>
          <span
            className={style._a}
            onClick={e => {
              // 处理编辑数据
              handleEdit(record);
            }}
          >
            编辑
          </span>
          <Divider type="vertical" />
          <span
            className={style._a}
            onClick={e => {
              dispatch({ type: "global/set_ads", payload: [record] });
              setCopyModel(true);
            }}
          >
            复制
          </span>
        </span>
      )
    }
  ];
  // 表格参数
  const params = {
    bordered: true,
    // loading: false,
    // 扩展下拉
    // expandedRowRender,
    rowSelection: {
      onChange(key, row) {
        // 记录选中的广告
        dispatch({ type: "global/set_ads", payload: row });
      },
      // 指定选中的行
      selectedRowKeys: selectKeys
    },
    pagination: {
      defaultPageSize: 200,
      showQuickJumper: true
    },
    scroll: data.length > 20 ? { y: "calc(100vh - 343px)" } : undefined
  };

  // 过滤未选中的广告系列,组
  function handleDataSource() {
    let ads = [];
    if (campaigns_select.length) {
      ads = dataSource.filter(
        item => campaigns_select.indexOf(item.campaign.id) !== -1
      );
      return adset_select.length
        ? ads.filter(item => adset_select.indexOf(item.adset_id) !== -1)
        : ads;
    } else {
      return adset_select.length
        ? dataSource.filter(item => adset_select.indexOf(item.adset_id) !== -1)
        : dataSource;
    }
  }

  return (
    <>
      <Spin spinning={editLoading} tip="正在加载编辑信息..." delay={500}>
        <Table
          params={params}
          dataSource={handleDataSource()}
          columns={columns}
          loading={loading}
          search={search}
        />
      </Spin>
      {initailState.current ? (
        <Edit
          adaccount_id={adaccount_id}
          objective={campaignData.objective}
          title="编辑广告"
          visible={visible}
          setVisible={setVisible}
          updateTable={updateTable}
          ads_id={ads_id}
          initailState={initailState.current}
          object_store_url={object_store_url}
          is_dynamic_creative={isDynamicCreative}
          // 重置数据
          reset={dispatch =>
            dispatch({ type: "reset", payload: initailState.current })
          }
          images={global_images}
        ></Edit>
      ) : (
        ""
      )}
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    adaccount_id: state.global.adaccount_id,
    selectKeys: state.global.ads.map(item => item.key),
    adset_select: state.global.adsets.map(item => item.id),
    campaigns_select: state.global.campaigns.map(item => item.id),
    global_images: state.global.images,
  };
};

export default connect(mapStateToProps)(TableComponent);
