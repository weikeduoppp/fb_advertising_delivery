import React from "react";
import { Select } from "antd";
import style from "./index.less";
import { CONVERSIONS_EVENT } from "../../../pages/adset/constant";
const { Option } = Select;


export default React.memo(({onChange}) => {
  return (
    <div className={style.targeting_con}>
      <span className={style.targeting_label}>Conversion Event</span>
      <Select
        style={{ width: "40%" }}
        placeholder="选择应用事件"
        defaultValue={[]}
        onChange={onChange}
      >
        {CONVERSIONS_EVENT.map((d, i) => (
          <Option key={d}>{d}</Option>
        ))}
      </Select>
    </div>
  );
});