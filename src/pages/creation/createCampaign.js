import { useState, useEffect } from "react";
import { Tabs } from "antd";
import CampaignForm from "../campaign/_Form";
import { Select } from "antd";
import * as api from "utils/fb_api";
import { connect } from "dva";
const { TabPane } = Tabs;
const { Option } = Select;
const CreateCampaign = ({
  campaigns_cache,
  adaccount_id,
  state,
  dispatch,
  initailState,
  campaignDispatch,
  createDirection,
  campaigns,
  setStep
}) => {
  // 系列数据
  const [options, setData] = useState([]);
  // 现有系列选中值
  const [value, setValue] = useState(undefined);
  const [activKey, setActivKey] = useState("new");
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

  // 创建时选择是否现有系列
  useEffect(() => {
    if (createDirection !== "campaign") {
      setActivKey("prev");
      if (campaigns.length === 1) {
        setValue(campaigns[0].id);
        campaignDispatch({ type: "reset", payload: campaigns[0] });
        setStep("adset");
      }
    }
    return () => {};
  }, [createDirection, campaigns, campaignDispatch, setStep]);

  // 使用现有系列
  function onChange(e) {
    setValue(e);
    const res = options.find(item => item.id === e);
    campaignDispatch({ type: "reset", payload: res });
  }

  // 切换tab
  function tabsChange(key) {
    setActivKey(key);
    // 清除记录
    if (key === "new") {
      setValue(undefined);
    }
    campaignDispatch({ type: "reset", payload: initailState });
  }

  return (
    <Tabs
      tabPosition="top"
      animated={false}
      activeKey={activKey}
      onChange={tabsChange}
    >
      <TabPane tab="新建广告系列" key="new">
        <CampaignForm state={state} dispatch={campaignDispatch} />
      </TabPane>
      <TabPane tab="使用现有广告系列" key="prev">
        <Select
          showSearch
          style={{ width: "100%" }}
          placeholder="请选择广告系列"
          optionFilterProp="children"
          onChange={onChange}
          value={value}
          // defaultValue={adaccount_id || undefined}
          // onFocus={onFocus}
          // onBlur={onBlur}
          // onSearch={onSearch}
          // 搜索
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          {options.map((item, i) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      </TabPane>
    </Tabs>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    campaigns_cache: state.global.campaigns_cache,
    createDirection: state.global.createDirection,
    campaigns: state.global.campaigns
  };
};

export default connect(mapStateToProps)(CreateCampaign);
