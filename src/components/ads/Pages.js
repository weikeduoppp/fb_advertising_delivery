import React, { useState, useEffect } from "react";
import style from '../adset/index.less'
import { Select } from "antd";
import * as api from "utils/fb_api";
import { connect } from 'dva'
const { Option } = Select;

// facebook主页
const Pages = React.memo(({ adaccount_id, page_id, instagram_actor_id, pages_cache, instagram_accounts_cache, dispatch, handleSubmit }) => {
  // PAGE_IDS 数据
  const [options, setData] = useState([]);
  // instagram_accounts
  const [instagram_accounts, setInstagram_accounts] = useState([]);
  // 获取主页id数据
  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const data = await api.getPageId();
      if (!ignore) {
        setData(data);
        dispatch({ type: "global/set_pages_cache", payload: data });
      }
    }
    !pages_cache ? fetchData() : setData(pages_cache);
   
    return () => {
      ignore = true;
    };
  }, [pages_cache, dispatch]);

  // 获取关联ins账户
  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const { data } = await api.getInstagramAccounts(adaccount_id);
      if (!ignore) {
        setInstagram_accounts(data);
        dispatch({ type: "global/set_instagram_accounts_cache", payload: data });
      }
    }
    !instagram_accounts_cache
      ? fetchData()
      : setInstagram_accounts(instagram_accounts_cache);

    return () => {
      ignore = true;
    };
  }, [adaccount_id, instagram_accounts_cache, dispatch]);

  return (
    <>
      <div className={style.targeting_con}>
        <span className={style.targeting_label}>Facebook主页</span>
        <Select
          showSearch
          style={{ width: "30%" }}
          placeholder="选择主页"
          defaultValue={page_id || undefined}
          onChange={val => handleSubmit(val, "page_id")}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          {options.map((d, i) => (
            <Option key={d.id}>{d.name}</Option>
          ))}
        </Select>
      </div>
      <div className={style.targeting_con}>
        <span className={style.targeting_label}>Instagram 帐户(可选)</span>
        <Select
          showSearch
          style={{ width: "30%" }}
          placeholder="选择Instagram"
          defaultValue={instagram_actor_id || undefined}
          onChange={val => handleSubmit(val, "instagram_actor_id")}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          {instagram_accounts.map((d, i) => (
            <Option key={d.id}>{d.username}</Option>
          ))}
        </Select>
      </div>
    </>
  );
});

const mapStateToProps = (state, ownProps) => {
  return {
    adaccount_id: state.global.adaccount_id,
    pages_cache: state.global.pages_cache,
    instagram_accounts_cache: state.global.instagram_accounts_cache
  }
}

export default connect(mapStateToProps)(Pages);
