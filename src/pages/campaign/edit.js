import Model from "components/common/_Model";
import { message } from "antd";
import { useReducer } from "react";
import * as api from '../../utils/fb_api'
import * as constant from './constant'
import { usePrevious } from "components/HOOK/uses";
import CampaignForm from './_Form'
/**
 * 旨在更新
 */
export default ({ adaccount_id, title = '创建广告系列',  visible, setVisible, initailState = constant.initail, updateTable, campaign_id }) => {

  // 目标, 投放状态
  const [state, dispatch] = useReducer(constant.reducer, initailState);
  // 编辑时 更新initailState
  const prev_campaign_id = usePrevious(campaign_id);
  if (state.name !== initailState.name && campaign_id !== prev_campaign_id) {
    dispatch({ type: "reset", payload: initailState });
  }
 
  
  // 更新广告系列
  async function updateCampaign(cb) {
    const res = await api.updateCampaign(campaign_id, {
      ...state
    });
    if (res.success) {
      handleRepeat("更新成功 !", cb);
    }
  }
  function handleRepeat(text, cb) {
    cb(false);
    setVisible(false);
    updateTable();
    message.success(text);
  }

  return (
    <Model
      title={title}
      visible={visible}
      handle={setConfirmLoading => {
        // 更新
        updateCampaign(setConfirmLoading); 
      }}
      handleCancel={() => {
        setVisible(false);
        // 编辑时取消 还原数据
        dispatch({ type: "reset", payload: initailState });
      }}
    >
      <CampaignForm state={state} dispatch={dispatch}/>
    </Model>
  );
};
