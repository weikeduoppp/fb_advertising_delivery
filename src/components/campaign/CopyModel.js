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
    // 模式修改 => 复制后进入编辑
    let res = await api.Copy(ids);
    if (res) {
      console.log(res)
      callback(false);
      setVisible(false);
      dispatch({
        type: "global/set_campaigns",
        payload: []
      });
      // 复制后进入编辑
      await updateTable();
      // 取复制完的id
      let copied_id = JSON.parse(res[0].result).copied_campaign_id;
      dispatch({
        type: "global/set_copied_id",
        payload: copied_id
      });
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
