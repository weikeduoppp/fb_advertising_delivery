import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import AdsetForm from "../adset/_Form";
import { Select } from "antd";
import { getCampaignAdset } from "utils/fb_api";
const { TabPane } = Tabs;
const { Option } = Select;
export default React.memo(
  ({ campaign_id, bid_strategy,daily_budget, state, dispatch, initailState, objective }) => {
    // 组数据
    const [options, setData] = useState([]);
    // 现有组选中值
    const [value, setValue] = useState(undefined);
    // 获取现有广告组
    useEffect(() => {
      let ignore = false;
      async function fetchData() {
        const result = await getCampaignAdset(campaign_id);
        if (!ignore) {
          setData(result);
        }
      }
      if (campaign_id) fetchData();
      return () => {
        ignore = true;
      };
    }, [campaign_id]);

    // 使用现有组
    function onChange(e) {
      setValue(e);
      const res = options.find(item => item.id === e);
      dispatch({ type: "reset", payload: res });
    }

    function tabsChange(key) {
      // 清除记录
      if (key === "new") {
        setValue(undefined);
        dispatch({ type: "reset", payload: initailState });
      }
    }

    return (
      <Tabs tabPosition="top" animated={false} onChange={tabsChange}>
        <TabPane tab="新建广告组" key="new">
          <AdsetForm
            bid_strategy={bid_strategy}
            daily_budget={daily_budget}
            state={state}
            dispatch={dispatch}
            objective={objective}
          />
        </TabPane>
        {campaign_id ? (
          <TabPane tab="使用现有广告组" key="prev">
            <Select
              showSearch
              style={{ width: "100%" }}
              placeholder="请选择广告组"
              optionFilterProp="children"
              onChange={onChange}
              value={value}
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
          </TabPane>
        ) : (
          ""
        )}
      </Tabs>
    );
  }
);
