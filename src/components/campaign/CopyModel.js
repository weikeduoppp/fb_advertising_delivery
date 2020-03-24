import Model from "../common/_Model";
import CopyNum from "../copy/CopyNum";
import { useState } from "react";
import * as api from "utils/fb_api.js";
import { connect } from "dva";
// 复制框
const CopyModel = ({ campaigns, dispatch, title, visible, setVisible, updateTable }) => {
  const [num, setNum] = useState(1);

  // 复制广告系列
  async function copyCampaign(callback) {
    let ids = [];
    // 多个副本
    if (num > 1) {
      for (let i = 0; i < num; i++) {
        ids = [...ids, ...campaigns.slice()];
      }
    } else {
      ids = [...ids, ...campaigns.slice()];
    }
    let async_sessions = await api.Copy(ids);
    callback(false);
    setVisible(false);
    if (async_sessions) {
      dispatch({ type: "global/set_campaigns", payload: [] });
      let res = await api.CopyCallback(async_sessions);
      if (res) {
        updateTable();
      }
    } 
  }

  return (
    <Model
      title={title}
      visible={visible}
      // ok
      handle={setConfirmLoading => {
        copyCampaign(setConfirmLoading);
      }}
      // 取消
      handleCancel={() => {
        setVisible(false);
      }}
    >
      <div>
        <CopyNum setNum={setNum} label="每个广告系列的副本数量" />
      </div>
    </Model>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    campaigns: state.global.campaigns
  };
};
export default connect(mapStateToProps)(CopyModel);
