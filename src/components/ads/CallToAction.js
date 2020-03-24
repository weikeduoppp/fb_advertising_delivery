// 行动号召
import { Select } from "antd";
import { memo } from "react";
import style from "../adset/index.less";
import { call_to_action } from "../../pages/ads/CreativeContant";
const { Option } = Select;

export default memo(
  ({ call_to_action_default, handleSubmit, objective, mode }) => {
    return (
      <div className={style.targeting_con}>
        <span className={style.targeting_label}>行动号召{mode ? "/可多选(最多5个)": ''}</span>
        <Select
          mode={mode}
          style={{ width: "30%" }}
          placeholder="无按钮"
          defaultValue={call_to_action_default}
          onChange={val => {
            handleSubmit(val);
          }}
        >
          {call_to_action[objective].map((d, i) => (
            <Option key={d}>{d}</Option>
          ))}
        </Select>
      </div>
    );
  }
);
