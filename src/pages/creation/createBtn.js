import React from "react";
import { Button, message, notification } from "antd";
import * as api from "utils/fb_api";
import * as campaignConstant from "../campaign/constant";
import { handleAdCreative } from "../ads/CreativeContant";
import { handleDynamicCreative } from "../ads/dynamicCreativeContant";
import { filterParams } from "utils";
import { connect } from 'dva'
import router from "umi/router";
const createBtn = React.memo(
  ({
    setLoading,
    adaccount_id,
    campaignState,
    adsCreativeState,
    adsetState,
    images
  }) => {
    // 整理广告创意数据
    function handleCreateCreativeData() {
      // 拿应用广告的数据
      if (campaignState.objective === campaignConstant.APP_INSTALLS) {
        // return handleAppAdCreative("https://itunes.apple.com/app/id944846798");
        return createAdCreative(
          adsetState.promoted_object.object_store_url,
          adsCreativeState
        );
      } else {
        return createAdCreative(adsCreativeState.link, adsCreativeState);
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
    async function createCampaign() {
      if (!campaignState.name) return message.warning("请输入广告系列名称 !");
      const res = await api.createCampaign(adaccount_id, {
        ...filterParams(campaignState)
      });
      if (res.id) {
        // handleRepeat("创建成功 !", cb);
        return res.id;
      }
    }

    // 创建广告组
    async function createAdset(id) {
      if (!adsetState.name) return message.warning("请输入广告组名称 !");
      let param = filterParams(adsetState);
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
    async function createAds(id, creative_id) {
      const { id: ads_id } = await api.createAds(adaccount_id, {
        adset_id: id,
        name: adsCreativeState.ads_name,
        creative: {
          creative_id: creative_id
        },
        status: adsCreativeState.status
      });
      return ads_id;
    }

    // 进行创建
    async function toCreate() {
      setLoading(true);
      // 跳过等待创建时间
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
      }
    }

    return (
      <Button type="primary" onClick={toCreate}>
        确认
      </Button>
    );
  }
);

const mapStateToProps = (state, ownProps) => {
  return {
    images: state.global.images
  }
}

export default connect(mapStateToProps)(createBtn);
