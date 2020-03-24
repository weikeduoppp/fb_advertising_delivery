import { Select } from "antd";
import { memo } from "react";
import style from "./index.less";
const { Option } = Select;

const options = [
  {
    key: "WEBSITE",
    name: "网站"
  },
  {
    key: "APP",
    name: "应用"
  },
  {
    key: "MESSENGER",
    name: "messenger"
  }
];
export default memo(({ app_install_state, handleSubmit }) => {
  return (
    <div className={style.targeting_con}>
      <span className={style.targeting_label}>目标</span>
      <Select
        style={{ width: "30%" }}
        placeholder="Destination"
        defaultValue={options[0].key}
        onChange={val => handleSubmit(val)}
      >
        {options.map((d, i) => (
          <Option key={d.key}>{d.name}</Option>
        ))}
      </Select>
    </div>
  );
});
