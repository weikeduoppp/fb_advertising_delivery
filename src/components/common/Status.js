import { Switch } from "antd";
import { memo } from "react";
import style from "../adset/index.less";

export default memo(({status, handleSubmit }) => {
  return (
    <div className={style.targeting_con}>
      <span className={style.targeting_label}>投放状态</span>
      <Switch
        checkedChildren="开"
        unCheckedChildren="关"
        onChange={checked => {handleSubmit(checked ? "ACTIVE" : "PAUSED");}}
        defaultChecked={status === "ACTIVE" ? true : false}
      />
    </div>
  );
});
