import React, { useState, useEffect } from "react";
import { Select, Spin } from "antd";
import { getAdaccountApp } from "utils/fb_api";
import { connect } from 'dva'
import style from "./index.less";
const { Option } = Select;

// 根据系列选择的目标 展示不同内容
const AppInstalls = React.memo(({ application, dispatch, adaccount_id, handleSubmit }) => {
  const [options, setData] = useState([]);
  const [val, setVal] = useState();
  // 选择的商店
  const [appStore, setAppStore] = useState("google_play");
  const [fetching, setFetching] = useState(true);
  // 应用商店查询结果
  useEffect(() => {
    let ignore = false;
    setFetching(true);
    async function fetchData() {
      const { data } = await getAdaccountApp(adaccount_id);
      if (!ignore) {
        setFetching(false);
        setData(data);
        dispatch({ type: "global/set_application", payload: data });
      }
    }
    if (adaccount_id) {
      !application ? fetchData() : setData(application);
    }
    return () => {
      ignore = true;
    };
  }, [adaccount_id, application, dispatch]);

  function handleChange(val) {
    let obj = options.filter(item => item.id === val);
    handleSubmit({
      application_id: val,
      object_store_url: obj[0].object_store_urls[appStore]
    });
    setVal(val);
  }

  /* 
  {
      "unique_id": "680998125",
      "name": "天天爱拼爹 - 低调奢华有内涵的益智休闲拼字对战游戏,超越连连看祖玛俄罗斯方块,水果找茬QQ宠物华容道,猜图三国炸金花,农场钻石迷情泡泡龙,牧场西瓜塔防找你妹,植物捕鱼火拼斗地主",
      "icon_url": "",
      "url": "",
      "store": "itunes",
      "search_source_store": "apple_store"
    }
*/
  return (
    <div>
      <p>应用</p>
      <Select
        defaultValue="google_play"
        style={{ width: 120 }}
        onChange={value => setAppStore(value)}
      >
        <Option value="google_play">Google Play</Option>
        <Option value="itunes">iTunes</Option>
      </Select>
      <Select
        className={style.app_store}
        showSearch
        placeholder="选择账户绑定的应用"
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onChange={handleChange}
        style={{ width: "100%" }}
        value={val}
      >
        {options
          .filter(item => item.object_store_urls[appStore])
          .map(d => (
            <Option key={d.id}>{d.name}</Option>
          ))}
      </Select>
    </div>
  );
});

const mapStateToProps = (state, ownProps) => {
  return {
    application: state.global.application
  }
}

export default connect(mapStateToProps)(AppInstalls);
