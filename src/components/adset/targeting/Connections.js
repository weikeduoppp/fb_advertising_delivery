import { Select } from "antd";
import { memo } from "react";
import style from "../index.less";
const {Option} = Select

const options = [
  {
    key: "installed",
    name: "应用用户"
  },
  {
    key: "not_installed",
    name: "排除应用用户"
  }
];
export default memo(({ app_install_state, handleSubmit }) => {
  return (
    <div className={style.targeting_con}>
      <span className={style.targeting_label}>关系</span>
      <Select
        style={{ width: "30%" }}
        placeholder="添加关系类型"
        value={app_install_state || undefined}
        onChange={val => handleSubmit(val)}
      >
        {options.map((d, i) => (
          <Option key={d.key}>{d.name}</Option>
        ))}
      </Select>
    </div>
  );
});
