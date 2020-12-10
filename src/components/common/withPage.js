import React, { useEffect, useState } from "react";
import * as api from "../../utils/fb_api";

// 此函数接收一个组件...
const WithPage = ({ WrappedComponent, method, adaccount_id }) => {
  // 系列数据
  const [data, setData] = useState([]);
  // 表格加载
  const [loading, setLoading] = useState(false);
  // 检索词
  const [search, setSearch] = useState("");
  // paging 分页情况
  const [paging, setPaging] = useState(null);
  // 数据总数
  const [total, setTotal] = useState(0);
  // 当前页数
  const [defaultCurrent, setDefaultCurrent] = useState(1);

  // model标识
  // 获取广告系列
  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      setLoading(true);
      const { data, total_count, paging: pages } = await api[method](
        adaccount_id
      );
      if (!ignore) {
        setAll(data, total_count, pages);
      }
    }

    if (adaccount_id) {
      fetchData();
      // 切换账户时清空搜索
      setSearch("");
    }
    return () => {
      ignore = true;
    };
  }, [adaccount_id, method]);

  // 更新表
  async function updateTable() {
    setLoading(true);
    const { data, total_count, paging: pages } = await api[method](
      adaccount_id
    );
    setAll(data, total_count, pages);
  }

  // 下一页或者上一页
  async function nextOrPrevious(direction) {
    setLoading(true);
    const { data, total_count, paging: pages } = await api[method](
      adaccount_id,
      {
        [direction]: paging[direction]
      }
    );
    setAll(data, total_count, pages);
  }

  // 赋值
  function setAll(data, total_count, pages) {
    setData(data.map((item, i) => ({ ...item, key: item.id })));
    setTotal(total_count);
    setPaging(pages);
    setLoading(false);
  }

  // 清除一下键盘事件
  if (method !== "getCampaign") {
    document.onkeydown = null;
  }


  // ...并返回另一个组件...
  return (
    <WrappedComponent
      adaccount_id={adaccount_id}
      data={data}
      setSearch={setSearch}
      defaultCurrent={defaultCurrent}
      total={total}
      paging={paging}
      nextOrPrevious={nextOrPrevious}
      setDefaultCurrent={setDefaultCurrent}
      loading={loading}
      search={search}
      updateTable={updateTable}
    />
  );
};

export default WithPage;
