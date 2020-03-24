import Model from "../common/_Model";
import CopyNum from "../copy/CopyNum";
import { useState, useEffect, useReducer } from "react";
import * as api from "utils/fb_api.js";
import { Divider, Select, message } from "antd";
import { connect } from "umi";
import Pattern from "../copy/Pattern";
import * as campaignConstant from "pages/campaign/constant";
import CampaignForm from "pages/campaign/_Form";
import { filterParams } from "utils";
import style from "./index.less";

const { Option } = Select;

// 复制框
/* 
  原有系列 | 其他系列 | 新建系列
 */
const COPY_PATTERN = [
  {
    name: "原有广告系列",
    key: "ORIGINAL"
  },
  {
    name: "其他广告系列",
    key: "OTHER"
  },
  {
    name: "新广告系列",
    key: "NEW"
  }
];
const CopyModel = ({
  adsets,
  dispatch,
  title,
  visible,
  setVisible,
  updateTable,
  adaccount_id,
  campaigns_cache
}) => {
  const [num, setNum] = useState(1);
  const [pattern, setPattern] = useState("ORIGINAL");
  // 系列数据
  const [options, setData] = useState([]);
  // 现有系列ids
  const [campaignId, setCampaignId] = useState(null);
  // 新建系列的数据
  const [campaignState, campaignDispatch] = useReducer(
    campaignConstant.reducer,
    campaignConstant.initail
  );
  // 获取广告系列
  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const { data } = await api.getCampaign(adaccount_id);
      if (!ignore) {
        setData(data);
        // 缓存存一次
        dispatch({
          type: "global/set_campaigns_cache",
          payload: { data, isFetch: false }
        });
      }
    }
    if (adaccount_id && campaigns_cache.isFetch) {
      fetchData();
      // 如果数据为空 不再请求
    } else {
      setData(campaigns_cache.data);
    }
    return () => {
      ignore = true;
    };
  }, [adaccount_id, campaigns_cache, dispatch]);

  // 复制广告组
  async function Copy(callback) {
    // 要复制到旗下广告系列id  若有的话.
    let campaign_id = campaignId;
    // 新建广告系列
    if (pattern === "NEW") {
      if (!campaignState.name) return message.warning("请输入广告系列名称 !");
      const result = await api.createCampaign(adaccount_id, {
        ...filterParams(campaignState)
      });
      if (result.id) {
        message.success(`创建广告系列${campaignState.name}成功`);
        campaign_id = result.id;
      }
    }

    // 要复制数据id
    let ids = [];
    // 多个副本
    if (num > 1) {
      for (let i = 0; i < num; i++) {
        ids = [...ids, ...adsets.slice()];
      }
    } else {
      ids = [...ids, ...adsets.slice()];
    }
    // eslint-disable-next-line no-unused-vars
    let async_sessions = campaign_id
      ? await api.Copy(ids, `campaign_id=${campaign_id}`)
      : await api.Copy(ids);
    callback(false);
    setVisible(false);
    if (async_sessions) {
      dispatch({ type: "global/set_adsets", payload: [] });
      let res = await api.CopyCallback(async_sessions);
      if (res) {
        updateTable();
      }
    }
  }

  // 选择其他系列进行复制
  function onChange(e) {
    setCampaignId(e);
  }

  return (
    <Model
      width={700}
      title={title}
      visible={visible}
      // ok
      handle={setConfirmLoading => {
        Copy(setConfirmLoading);
      }}
      // 取消
      handleCancel={() => {
        setVisible(false);
      }}
    >
      <div>
        <Pattern
          options={COPY_PATTERN}
          pattern={pattern}
          onChange={e => {
            setPattern(e.target.value);
          }}
        />
        {/* 其他系列 */}
        {pattern === "OTHER" && (
          <div className={style.select_container}>
            <Select
              showSearch
              style={{ width: "100%" }}
              placeholder="选择广告系列"
              optionFilterProp="children"
              onChange={onChange}
              // 搜索
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {options.map((item, i) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </div>
        )}
        {/* 新建系列 */}
        {pattern === "NEW" && (
          <div className={style.select_container}>
            <CampaignForm state={campaignState} dispatch={campaignDispatch} />
          </div>
        )}
        <Divider />
        <CopyNum setNum={setNum} label="每个广告组的副本数量" />
      </div>
    </Model>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    adsets: state.global.adsets,
    campaigns_cache: state.global.campaigns_cache,
    adaccount_id: state.global.adaccount_id
  };
};
export default connect(mapStateToProps)(CopyModel);
