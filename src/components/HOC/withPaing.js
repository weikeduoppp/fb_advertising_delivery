// 做分页
import React, { useState, useEffect } from "react";
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
  // 过滤名字
  const [filter, setFilter] = useState();

  // shift标识   
  const [shiftKey, setShiftKey] = useState(false);

  function shiftKeydown(e) {
    if (e.keyCode === 16 && e.shiftKey) {
       setShiftKey(true)
    } else {
      setShiftKey(false);
    }
  }
  function shiftKeyUp(e) {
    console.log(e.keyCode, e.shiftKey);
    if (e.keyCode === 16 && !e.shiftKey) {
      setShiftKey(false);
    } 
  }

  // function selectstart() {
  //   return false;
  // };

  function removeShiftKeydown() {
    window.removeEventListener("keydown", shiftKeydown, false);
  }

  // 监听shift键
  useEffect(() => {
    window.addEventListener('keydown', shiftKeydown, false);
    window.addEventListener("keyup", shiftKeyUp, false);
    return () => {
      window.removeEventListener("keydown", shiftKeydown, false);
      window.removeEventListener("keyup", shiftKeyUp, false);
    } 
  }, [])
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
      filter={filter}
      setFilter={setFilter}
      shiftKey={shiftKey}
      removeShiftKeydown={removeShiftKeydown}
      {...params}
    />
  );
};

export default WithPaging;