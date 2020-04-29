import { useState, memo, useEffect } from "react";
import style from "./index.less";
import { Divider, message, notification } from "antd";
import Table from "components/common/_Table";
import Edit from "./edit";
import { connect } from "dva";
import router from "umi/router";
import * as api from "utils/fb_api";
import { filterParams } from "utils";
import AppModel from "../../components/copy/AppModel";
import * as CampaignContant from "pages/campaign/constant";

// 系列表格数据 相关操作: 编辑 | 复制 | 跨账户复制
const TableComponent = memo(
  ({
    selectKeys,
    data,
    search,
    loading,
    updateTable,
    dispatch,
    adset_select,
    setCopyModel,
    adaccount_id,
    copied_id
  }) => {
    // 跨账户复制的数据
    const [copyData, setCopyData] = useState(null);
    // 跨账户复制标识
    const [copyLoading, setCopyLoading] = useState(false);
    // 跨账户复制源的账户id
    const [prevId, setPrevId] = useState(null);
    // 跨账户复制-重新选择应用
    const [app, setApp] = useState(null);
    // 跨账户复制-选择应用的框
    const [appModel, setAppModel] = useState(false);
    // 跨账户复制-重新选择主页/ins账户
    const [page_id, setPage_id] = useState();
    const [instagram_actor_id, setInstagram_actor_id] = useState();

    // model标识
    const [visible, setVisible] = useState(false);
    const [campaign_id, setCampaignId] = useState(null);
    const [initailState, setInitailState] = useState(null);


    // 进入编辑
    function toEdit(record) {
      setCampaignId(record.id);
      setInitailState({
        objective: record.objective,
        status: record.status,
        name: record.name,
        daily_budget: record.daily_budget && record.daily_budget / 100,
        bid_strategy: record.bid_strategy,
        special_ad_category: record.special_ad_category
      });
      setVisible(true);
    }

    // 监听copied_id, 复制完后编辑
    useEffect(() => {
      if (copied_id) {
        let record = data.find(d => d.id === copied_id);
        toEdit(record);
        // 清空
        dispatch({
          type: "global/set_copied_id",
          payload: ''
        });
      }
      return () => {};
    }, [copied_id, data, dispatch]);

    // 表格列标题
    const columns = [
      {
        title: "广告系列名称",
        dataIndex: "name",
        render: (text, record) => (
          <span
            className={style._a}
            onClick={e => {
              dispatch({ type: "global/set_campaigns", payload: [record] });
              router.push("/adset");
            }}
          >
            {text}
          </span>
        )
      },
      {
        title: "营销目标",
        dataIndex: "objective",
        render: (text, record) => <span>{text}</span>
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
                // 编辑 初始化数据
                toEdit(record);
              }}
            >
              编辑
            </span>
            <Divider type="vertical" />
            <span
              className={style._a}
              onClick={e => {
                dispatch({
                  type: "global/set_campaigns",
                  payload: [record]
                });
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
          // 记录选中的广告系列
          console.log(key, row);
          dispatch({ type: "global/set_campaigns", payload: row });
          // 如果选中的广告组不在系列中 清除广告组
          let adset = adset_select.slice();
          adset.filter(
            item => row.findIndex(d => d.id === item.campaign_id) !== -1
          );
          dispatch({ type: "global/set_adsets", payload: adset });
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

    // 跨账户复制-获取复制源信息
    async function getCopyInfo() {
      let res = await api.getCopyInfo(selectKeys);
      setCopyData(res.map(d => JSON.parse(d.body)));
      message.success("已复制完, 可以更换账号后粘贴");
    }

    // 创建广告系列
    async function createCampaign(params) {
      const res = await api.createCampaign(adaccount_id, params, "COPY");
      if (res.id) {
        return res.id;
      }
    }

    // 创建广告
    async function createAds(params) {
      const { id: ads_id } = await api.createAds(adaccount_id, params);
      return ads_id;
    }

    // 跨账户复制-处理object_story_spec  isApp: 是否是应用安装类型
    /* 
    1.在object_story_spec的video_data字段中，只能指定image_url和image_hash中的一个。 1
    2.如果是应用安装修改应用连接 1
    3.修改广告发布身份(主页/ins账户)
    4.object_story_spec 无数据时候使用动态创意 asset_feed_spec 
    5.image_url临时的 签名日期很快过去 -> hash请求
   */
    async function handleOSS(object_story_spec, isApp) {
      let link_data = object_story_spec.link_data;
      let video_data = object_story_spec.video_data;
      // 主页/ins账户
      object_story_spec.page_id = page_id ? page_id : "";
      object_story_spec.instagram_actor_id = instagram_actor_id
        ? instagram_actor_id
        : "";

      // 应用
      if (link_data) {
        // 轮播
        if (link_data.child_attachments) {
          object_story_spec.link_data.child_attachments = link_data.child_attachments.map(
            async item => {
              let image_hash = link_data.image_hash;
              // 复制的图片源
              let { data } = await api.getImages(prevId, [image_hash]);
              item.picture = data[0].permalink_url;
              // 去除绑定的image_hash
              delete item.image_hash;
              if (isApp) {
                item.link = app.object_store_url;
                item.call_to_action.value.link = app.object_store_url;
                item.call_to_action.value.application = app.application_id;
              }
              return item;
            }
          );
        } else {
          // 图片格式
          let image_hash = link_data.image_hash;
          // 复制的图片源
          const { data } = await api.getImages(prevId, [image_hash]);
          object_story_spec.link_data.picture = data[0].permalink_url;
          // link_data
          delete object_story_spec.link_data.image_hash;
          if (isApp) {
            object_story_spec.link_data.link = app.object_store_url;
            object_story_spec.link_data.call_to_action.value.link =
              app.object_store_url;
            object_story_spec.link_data.call_to_action.value.application =
              app.application_id;
          }
        }
      } else if (video_data) {
        let image_hash = video_data.image_hash;
        // 复制的图片源
        const { data } = await api.getImages(prevId, [image_hash]);
        // 视频 去除image_hash
        delete object_story_spec.video_data.image_hash;
        object_story_spec.video_data.image_url = data[0].permalink_url;
        if (isApp) {
          object_story_spec.video_data.call_to_action.value.link =
            app.object_store_url;
          object_story_spec.video_data.call_to_action.value.application =
            app.application_id;
        }
      }
      return {
        object_story_spec: filterParams(object_story_spec)
      };
    }

    // 跨账户复制-处理动态创意.
    async function handleDynamicCreative(
      object_story_spec,
      isApp,
      asset_feed_spec
    ) {
      object_story_spec.page_id = page_id ? page_id : "";
      object_story_spec.instagram_actor_id = instagram_actor_id
        ? instagram_actor_id
        : "";
      let {
        ad_formats: [format],
        link_urls: [links],
        images,
        videos
      } = asset_feed_spec;

      // 更换应用链接
      if (isApp) {
        links.website_url = app.object_store_url;
        asset_feed_spec.link_urls = [links];
      }

      // 删除 hash值
      if (format === "SINGLE_IMAGE" && images) {
        const { data } = await api.getImages(
          prevId,
          images.map(d => d.hash)
        );
        asset_feed_spec = {
          ...asset_feed_spec,
          images: data.map(d => ({ url: d.permalink_url }))
        };
      } else if (format === "SINGLE_VIDEO" && videos) {
        asset_feed_spec = {
          ...asset_feed_spec,
          videos: videos.map(d => ({
            video_id: d.video_id,
            thumbnail_url: d.thumbnail_url
          }))
        };
      }

      return {
        object_story_spec: filterParams(object_story_spec),
        asset_feed_spec
      };
    }

    // 跨账户复制-复制开始
    async function toCreate() {
      message.success("开始复制!!");
      try {
        for (let i = 0; i < copyData.length; i++) {
          let campagin = copyData[i];
          let { id, adsets, ...campaginState } = campagin;
          // 默认投放状态为关闭
          let campaign_id = await createCampaign({
            ...campaginState,
            status: "PAUSED"
          });
          if (adsets) {
            let adsetGroup = adsets.data;
            // 批量创建广告组
            const res = await api.batchCreateAdset(
              adaccount_id,
              campaign_id,
              adsetGroup,
              app
            );
            // 创建广告改为异步过程 优化流程
            res.forEach(async (item, i) => {
              let body = JSON.parse(item.body);
              if (item.code === 200) {
                let adset_id = body.id;
                let ads = adsetGroup[i].ads;
                let is_dynamic_creative = adsetGroup[i].is_dynamic_creative;
                if (ads) {
                  let adsGroup = ads.data;
                  adsGroup.forEach(async item => {
                    let {
                      id,
                      creative: { id: creative_id, ...creativeState },
                      ...adsState
                    } = item;
                    // 1.在object_story_spec的video_data字段中，只能指定image_url和image_hash中的一个。
                    // 2.修改应用连接
                    creativeState = is_dynamic_creative
                      ? await handleDynamicCreative(
                          creativeState.object_story_spec,
                          campaginState.objective === "APP_INSTALLS",
                          creativeState.asset_feed_spec
                        )
                      : await handleOSS(
                          creativeState.object_story_spec,
                          campaginState.objective === "APP_INSTALLS"
                        );
                    let ads_id = await createAds({
                      ...adsState,
                      creative: creativeState,
                      adset_id
                    });
                    console.log(ads_id);
                  });
                }
              } else {
                // 一些广告组复制失败
                notification.error({
                  message: "复制失败",
                  description: `${adsetGroup[i].name}广告组复制失败 info: ${body.error.message}`,
                  duration: null
                });
              }
            });
          }
        }
        message.success("复制完成");
        setCopyLoading(false);
        updateTable();
      } catch (err) {
        // 失败重置状态
        setCopyLoading(false);
      }
    }

    // 检验要复制的是否有应用安装类型
    function checkObjective() {
      return copyData.filter(item => {
        let { id, adsets, ...campaginState } = item;
        return campaginState.objective === "APP_INSTALLS";
      }).length;
    }

    // 监听键盘的 事件
    function handleKeyDown(e) {
      // ctrl + c
      if (e.keyCode === 67 && e.ctrlKey) {
        if (selectKeys.length) {
          message.success("准备复制源数据");
          setPrevId(adaccount_id);
          getCopyInfo();
        }
      }
      // ctrl + v
      if (e.keyCode === 86 && e.ctrlKey) {
        // 屏蔽误操作
        if (!copyData) return false;
        if (copyLoading || prevId === adaccount_id || !prevId)
          return message.success(
            "不能粘贴, 处于复制中, 没有复制源或者同一账户下"
          );
        if (checkObjective()) {
          setAppModel(true);
        } else {
          setCopyLoading(true);
          toCreate();
        }
      }
    }
    if (!visible) {
      document.onkeydown = handleKeyDown;
    } else {
      document.onkeydown = null;
    }

    return (
      <>
        <Table
          params={params}
          dataSource={data.filter(
            item => CampaignContant.objective.indexOf(item.objective) !== -1
          )}
          columns={columns}
          loading={loading}
          search={search}
        />
        {initailState ? (
          <Edit
            title="编辑广告系列"
            visible={visible}
            setVisible={setVisible}
            updateTable={updateTable}
            campaign_id={campaign_id}
            initailState={initailState}
          ></Edit>
        ) : (
          ""
        )}
        {appModel && (
          <AppModel
            adaccount_id={adaccount_id}
            visible={appModel}
            setVisible={setAppModel}
            title={"更换应用/主页/ins"}
            toCreate={setConfirmLoading => {
              if (app) {
                // 创建
                setConfirmLoading(false);
                setAppModel(false);
                setCopyLoading(true);
                toCreate();
              }
            }}
            handleSubmit={val => setApp(val)}
            handlePages={(id, key) => {
              key === "page_id" && setPage_id(id);
              key === "instagram_actor_id" && setInstagram_actor_id(id);
            }}
          />
        )}
      </>
    );
  }
);

const mapStateToProps = (state, ownProps) => {
  return {
    selectKeys: state.global.campaigns.map(item => item.key),
    // 已选中的广告组
    adset_select: state.global.adsets,
    // 广告账户id
    adaccount_id: state.global.adaccount_id,
    // 复制后要编辑的id
    copied_id: state.global.copied_id
  };
};

export default connect(mapStateToProps)(TableComponent);
