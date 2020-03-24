// 做分页
import React, { useState } from "react";
// 此函数接收一个组件...
const WithPaging = ({ WrappedComponent, ...params }) => {
  // 数据加载
  const [loading, setLoading] = useState(false);
  // paging 分页情况
  const [paging, setPaging] = useState(null);
  // 数据总数
  const [total, setTotal] = useState(0);
  // 当前页数 初始1
  const [defaultCurrent, setDefaultCurrent] = useState(1);
  // ...并返回另一个组件...
  return (
    <WrappedComponent
      paging={paging}
      setPaging={setPaging}
      total={total}
      setTotal={setTotal}
      defaultCurrent={defaultCurrent}
      setDefaultCurrent={setDefaultCurrent}
      loading={loading}
      setLoading={setLoading}
      {...params}
    />
  );
};

export default WithPaging;