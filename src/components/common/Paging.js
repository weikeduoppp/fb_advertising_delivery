import React from "react";
import { Button } from "antd";
import style from "./TableTop/index.less";
// 按键左右分页
const Pages = ({
  className,
  loading,
  paging,
  defaultCurrent,
  total,
  nextOrPrevious,
  setDefaultCurrent,
  num = 200
}) => {
  return (
    <span className={className}>
      <span>
        {(defaultCurrent - 1) * num + 1}-
        {defaultCurrent * num > total ? total : defaultCurrent * num}/{total}
      </span>
      <Button.Group className={style.buttonGroup}>
        <Button
          onClick={e => {
            if (loading) return false;
            // 上一页
            nextOrPrevious("before", defaultCurrent - 2);
            setDefaultCurrent(current => {
              return current - 1;
            });
          }}
          icon="caret-left"
          disabled={!paging.before}
        ></Button>
        <Button
          onClick={e => {
            if (loading) return false;
            // 下一页
            nextOrPrevious("after", defaultCurrent);
            setDefaultCurrent(current => {
              return current + 1;
            });
          }}
          icon="caret-right"
          disabled={defaultCurrent === Math.ceil(total / num)}
        ></Button>
      </Button.Group>
    </span>
  );
};

export default Pages;
