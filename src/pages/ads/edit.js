import Model from "components/common/_Model";
import { message } from "antd";
import { useReducer, useEffect } from "react";
import AdsForm from "./_Form";
import { reducer, handleAdCreative } from "./CreativeContant";
import * as dynamicCreativeContant from "./dynamicCreativeContant";
import * as api from '../../utils/fb_api'
import { usePrevious } from "components/HOOK/uses";
const handleDynamicCreative = dynamicCreativeContant.handleDynamicCreative;


/**
 * adaccount_id 存在为创建
 * campaign_id 存在为更新
 */
export default ({
  adaccount_id,
  title = "创建广告",
  visible,
  setVisible,
  initailState,
  updateTable,
  ads_id,
  objective,
  object_store_url,
  reset,
  is_dynamic_creative,
  images
}) => {
  // 目标, 投放状态
  const [state, dispatch] = useReducer(
    is_dynamic_creative ? dynamicCreativeContant.reducer : reducer,
    initailState
  );

  // 编辑时 更新initailState
  const prev_ads_id = usePrevious(ads_id);

  useEffect(() => {
    // 广告id不同时重置数据
    if (ads_id !== prev_ads_id) {
      reset(dispatch);
    }
    return () => {};
  }, [ads_id, prev_ads_id, dispatch, reset]);

  // 更新广告 同时生成新的广告创意 -> 更新广告创意id
  async function updateAds(cb) {
    // 存在创意才更新创意
    if ((state.link || object_store_url, state)) {
      // 是否是动态创意
      let param = is_dynamic_creative
        ? handleDynamicCreative(state.link || object_store_url, state, images)
        : handleAdCreative(state.link || object_store_url, state);
      const creative = await api.createAdCreative(adaccount_id, param);
      const res = await api.updateAds(ads_id, {
        name: state.ads_name,
        status: state.status,
        creative: { creative_id: creative.id }
      });
      if (res.success) {
        handleRepeat("更新成功 !", cb);
      }
    } else {
      const res = await api.updateAds(ads_id, {
        name: state.ads_name,
        status: state.status
      });
      if (res.success) {
        handleRepeat("更新成功 !", cb);
      }
    }
  }
  // 结束的回调
  function handleRepeat(text, cb) {
    cb(false);
    updateTable();
    message.success(text);
    setVisible(false);
  }

  return (
    <Model
      width={750}
      title={title}
      visible={visible}
      handle={setConfirmLoading => {
        // 更新
        updateAds(setConfirmLoading);
      }}
      handleCancel={() => {
        // 编辑时取消 还原数据
        dispatch({ type: "reset", payload: initailState });
        setVisible(false);
      }}
    >
      <AdsForm
        objective={objective}
        state={state}
        dispatch={dispatch}
        is_dynamic_creative={is_dynamic_creative}
      />
    </Model>
  );
};
