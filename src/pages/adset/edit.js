import Model from "components/common/_Model";
import { message } from "antd";
import { useReducer } from "react";
import * as api from '../../utils/fb_api'
import { usePrevious } from "components/HOOK/uses";
import AdsetForm from "./_Form";
import * as constant from "./constant";


/**
 * adaccount_id 存在为创建
 * campaign_id 存在为更新
 */
export default ({ adaccount_id, title = '创建广告组',  visible, setVisible, initailState, updateTable, adset_id ,campaignData}) => {

  // 目标, 投放状态
  const [state, dispatch] = useReducer(constant.reducer, initailState);

  // 编辑时 更新initailState
  const prev_adset_id = usePrevious(adset_id);
  if (state.name !== initailState.name && adset_id !== prev_adset_id) {
    dispatch({ type: "reset", payload: initailState });
  }
 

  // 更新广告组
  async function updateAdset(cb) {
    const res = await api.updateAdset(adset_id, {
      ...state
    });
    if (res.success) {
      handleRepeat("更新成功 !", cb);
    }
  }
  function handleRepeat(text, cb) {
    cb(false);
    updateTable();
    message.success(text);
    setVisible(false);
  }

  return (
    <Model
      width={1000}
      title={title}
      visible={visible}
      handle={setConfirmLoading => {
        // 创建
        updateAdset(setConfirmLoading);
      }}
      handleCancel={() => {
        // 编辑时取消 还原数据
        dispatch({ type: "reset", payload: initailState });
        setVisible(false);
      }}
    >
      <AdsetForm state={state} dispatch={dispatch} {...campaignData} edit={true} />
    </Model>
  );
};
