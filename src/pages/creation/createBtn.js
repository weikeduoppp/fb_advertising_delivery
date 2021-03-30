import React, { useEffect } from "react";
import { Button, message, notification } from "antd";
import * as api from "utils/fb_api";
import * as campaignConstant from "../campaign/constant";
import { handleAdCreative } from "../ads/CreativeContant";
import { handleDynamicCreative } from "../ads/dynamicCreativeContant";
import { filterParams } from "utils";
import { connect } from "dva";
import { resetVideoInfo } from "../uploadModel/upload";
import router from "umi/router";
import array from "lodash/array";
const createBtn = React.memo(
  ({
    setLoading,
    adaccount_id,
    campaignState,
    adsCreativeState,
    adsetState,
    images,
    video_ids,
    setVideoIds,
    clearStateCache
  }) => {
    // 获取缓存
    useEffect(() => {
      let ids = JSON.parse(localStorage.getItem("video_ids"));
      async function fetchData() {
        setVideoIds(await resetVideoInfo(ids));
      }
      if (ids?.length && !video_ids.length) {
        fetchData();
      }
      return () => {};
    }, [setVideoIds, video_ids]);

    // 整理广告创意数据
    function handleCreateCreativeData(state = adsCreativeState) {
      // 拿应用广告的数据
      if (campaignState.objective === campaignConstant.APP_INSTALLS) {
        // return handleAppAdCreative("https://itunes.apple.com/app/id944846798");
        return createAdCreative(
          adsetState.promoted_object.object_store_url,
          state
        );
      } else {
        return createAdCreative(state.link, state);
      }
    }

    // 创建广告创意
    async function createAdCreative(link, state) {
      let is_dynamic_creative = adsetState.is_dynamic_creative;
      const res = await api.createAdCreative(
        adaccount_id,
        is_dynamic_creative
          ? handleDynamicCreative(link, state, images)
          : handleAdCreative(link, state)
      );
      if (!res.error) {
        return res.id;
      } else {
        notification.error({
          message: `创建广告创意失败`,
          description: `${res.error.error_user_msg}`,
          duration: null
        });
      }
    }

    // 创建广告系列
    async function createCampaign(i) {
      if (!campaignState.name) return message.warning("请输入广告系列名称 !");
      const res = await api.createCampaign(adaccount_id, {
        ...filterParams(
          i !== undefined
            ? { ...campaignState, name: campaignState.name + `_${i}` }
            : campaignState
        )
      });
      if (res.id) {
        // handleRepeat("创建成功 !", cb);
        return res.id;
      }
    }

    // 创建广告组
    async function createAdset(id, i) {
      if (!adsetState.name) return message.warning("请输入广告组名称 !");
      let param = filterParams(
        i !== undefined
          ? { ...adsetState, name: adsetState.name + `_${i}` }
          : adsetState
      );
      // 创建单位是秒
      if (param.start_time)
        param.start_time = parseInt(param.start_time / 1000);
      if (param.end_time) param.end_time = parseInt(param.end_time / 1000);
      const { id: adset_id } = await api.createAdset(adaccount_id, {
        campaign_id: id,
        ...param
      });
      return adset_id;
    }

    // 创建广告
    async function createAds(id, creative_id, name) {
      const { id: ads_id } = await api.createAds(adaccount_id, {
        adset_id: id,
        name: name || adsCreativeState.ads_name,
        creative: {
          creative_id: creative_id
        },
        status: adsCreativeState.status
      });
      return ads_id;
    }

    // 树对象 6-6-5
    /**
      生成树结构
      campaign_num: 广告系列数
      adset_num: 一个系列的广告组数量
      ads_num: 一个广告组的广告数量
      _data: 切割成以一个广告组的广告数(ads_num)为底的数组
     */
    function AdsTree(campaign_num, adset_num, ads_num, data) {
      let _data = data.slice();
      let campagin = [];
      for (let i = 0; i < campaign_num; i++) {
        // 代表一个系列
        let campagin_children = {};
        campagin_children.adset = [];
        for (let j = 0; j < adset_num; j++) {
          // 代表一个广告组
          let adset_children = {};
          let ads = _data.shift();
          adset_children.ads = ads;
          campagin_children.adset.push(adset_children);
        }
        campagin.push(campagin_children);
      }
      // campagin = [
      //   {
      //     adset: [
      //       {
      //         ads: []
      //       }
      //     ]
      //   }
      // ];
      return campagin;
    }

    // 批量视频广告
    async function batchVideoMore() {
      let { campaign_num, adset_num, ads_num } = adsCreativeState;
      // 生成树结构
      let campaign = AdsTree(
        campaign_num,
        adset_num,
        ads_num,
        array.chunk(video_ids, ads_num)
      );
      // 切割数组
      try {
        await Promise.all(
          campaign.map(async ({ adset }, j) => {
            // 多个广告系列处理
            let campagin_id = campaignState.id
              ? campaignState.id
              : await createCampaign(j);
            await Promise.all(
              adset.map(async ({ ads }, i) => {
                // 多个组
                let adset_id = adsetState.id
                  ? adsetState.id
                  : await createAdset(campagin_id, i);
                await Promise.all(
                  ads.map(async ({ video_id, image_url, name }) => {
                    const creative_id = await handleCreateCreativeData({
                      ...adsCreativeState,
                      video_id,
                      image_url
                    });
                    const ads_id = await createAds(adset_id, creative_id, name);
                    if (ads_id) {
                      message.success("创建广告成功");
                    }
                  })
                );
              })
            );
          })
        );
        setLoading(false);
        message.success("创建广告完成");
        // 成功清除
        clearStateCache();
        router.push("/campaign");
      } catch (e) {
        message.warning(e);
        setLoading(false);
      }
    }

    // 处理批量图片广告
    async function batchImageMore() {
      let { campaign_num, adset_num, ads_num } = adsCreativeState;
      // 生成树结构
      let campaign = AdsTree(
        campaign_num,
        adset_num,
        ads_num,
        array.chunk(images, ads_num)
      );
      // 切割数组
      try {
        await Promise.all(
          campaign.map(async ({ adset }, j) => {
            // 多个广告系列处理
            let campagin_id = campaignState.id
              ? campaignState.id
              : await createCampaign(j);
            await Promise.all(
              adset.map(async ({ ads }, i) => {
                // 多个组
                let adset_id = adsetState.id
                  ? adsetState.id
                  : await createAdset(campagin_id, i);
                await Promise.all(
                  ads.map(async ({ hash, name }) => {
                    const creative_id = await handleCreateCreativeData({
                      ...adsCreativeState,
                      format: "photo_data",
                      image_hash: hash
                    });
                    const ads_id = await createAds(adset_id, creative_id, name);
                    if (ads_id) {
                      message.success("创建广告成功");
                    }
                  })
                );
              })
            );
          })
        );
        setLoading(false);
        message.success("创建广告完成");
        // 成功清除
        clearStateCache();
        router.push("/campaign");
      } catch (e) {
        message.warning(e);
        setLoading(false);
      }
    }

    function checkState() {
      console.log(adsCreativeState);
      if (!adsCreativeState.page_id) {
        message.warning("请选择主页");
        return false;
      }
      // 过滤动态创意
      if (!adsCreativeState.call_to_action && !adsetState.is_dynamic_creative) {
        message.warning("请选择行动号召");
        return false;
      }
      return true;
    }

    // 进行创建
    async function toCreate() {
      if (checkState()) {
        setLoading(true);
        let format = adsCreativeState.format;
        // 进入批量操作 其中动态创意没有format
        if (format && format.indexOf("batch_video_data") !== -1) {
          if (!video_ids.length) return message.warning("请先上传视频");
          return batchVideoMore();
        }
        if (format && format.indexOf("batch_image_data") !== -1) {
          if (!images.length) return message.warning("请先选择图片");
          return batchImageMore();
        }

        // 正常创建 -> 跳过等待创建时间
        setTimeout(() => {
          setLoading(false);
          router.replace("/campaign");
        }, 1000);
        // 现有广告系列处理
        const campagin_id = campaignState.id
          ? campaignState.id
          : await createCampaign();
        // if (campagin_id) message.success("创建广告系列成功");
        const adset_id = adsetState.id
          ? adsetState.id
          : await createAdset(campagin_id);
        // if (adset_id) message.success("创建广告组成功");
        const creative_id = await handleCreateCreativeData();
        const ads_id = await createAds(adset_id, creative_id);
        if (ads_id) {
          message.success("创建广告成功");
          // 成功清除
          clearStateCache();
        }
      }
    }

    return (
      <Button type="primary" onClick={toCreate}>
        确认
      </Button>
    );
  }
);

const mapStateToProps = ({ global }) => {
  return {
    images: global.images,
    video_ids: global.video_ids
  };
};
const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    setVideoIds: ids =>
      dispatch({ type: "global/set_video_ids", payload: ids }),
    // 清除state缓存
    clearStateCache: () => {
      dispatch({
        type: "global/set_c_adset",
        payload: null
      });
      dispatch({
        type: "global/set_c_campaign",
        payload: null
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(createBtn);
