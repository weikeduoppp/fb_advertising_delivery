import Model from "../common/_Model";
import CopyNum from "../copy/CopyNum";
import { useState, useEffect } from "react";
import * as api from "utils/fb_api.js";
import { Divider, Select } from "antd";
import { connect } from "dva";
import Pattern from "../copy/Pattern";
import style from "../adset/index.less";

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
  }
];
const CopyModel = ({
  ads,
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
  // 系列广告组
  const [adsetData, setAdsetData] = useState([]);
  // 选择要复制到的广告组
  const [asdetIds, setAsdetIds] = useState([]);

  // 获取广告系列
  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const { data } = await api.getCampaign(adaccount_id);
      if (!ignore) {
        setData(data);
        // 缓存存一次
        dispatch({ type: "global/set_campaigns_cache", payload: { data, isFetch: false} });
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

  // 获取系列下的广告组
  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const result = await api.getCampaignAdset(campaignId);
      if (!ignore) {
        setAdsetData(result);
      }
    }
    if (campaignId) fetchData();
    return () => {
      ignore = true;
    };
  }, [campaignId]);

  // 复制广告组
  async function copyAds(callback) {
    // 要复制数据id
    let ids = [];
    // 多个副本
    if (num > 1) {
      for (let i = 0; i < num; i++) {
        ids = [...ids, ...ads.slice()];
      }
    } else {
      ids = [...ids, ...ads.slice()];
    }
    // eslint-disable-next-line no-unused-vars
    let async_sessions =
      asdetIds.length > 0
        ? await api.copyAds(ids, asdetIds)
        : await api.copyAds(ids);
    callback(false);
    setVisible(false);
    if (async_sessions) {
      dispatch({ type: "global/set_ads", payload: [] });
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
        copyAds(setConfirmLoading);
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
          <div>
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
            <Divider />
            <div>
              <p>加入广告组</p>
              <div className={style.select_container}>
                <Select
                  showSearch
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder={campaignId ? "选择广告" : "请先选择广告系列"}
                  optionFilterProp="children"
                  onChange={e => setAsdetIds(e)}
                  // 搜索
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {adsetData.map((item, i) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        )}

        <Divider />
        <CopyNum setNum={setNum} label="每个广告的副本数量" />
      </div>
    </Model>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    ads: state.global.ads,
    campaigns_cache: state.global.campaigns_cache,
    adaccount_id: state.global.adaccount_id
  };
};
export default connect(mapStateToProps)(CopyModel);
