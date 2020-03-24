import { Select } from "antd";
import { memo } from "react";
import style from "../adset/index.less";
const { Option } = Select;

// 广告投放优化目标数据
const options = [
  {
    key: "NONE",
    name: "无"
  },
  {
    key: "HOUSING",
    name: "住房"
  },
  {
    key: "EMPLOYMENT",
    name: "就业"
  },
  {
    key: "CREDIT",
    name: "信贷"
  }
];

export default memo(({ special_ad_category, handleSubmit }) => {
  return (
    <>
      <div className={style.targeting_con}>
        <span className={style.targeting_label}>特殊广告类别</span>
        <Select
          style={{ width: "30%" }}
          placeholder="特殊广告类别"
          defaultValue={special_ad_category || undefined}
          onChange={val => handleSubmit(val)}
        >
          {options &&
            options.map((d, i) => <Option key={d.key}>{d.name}</Option>)}
        </Select>
      </div>
    </>
  );
});
