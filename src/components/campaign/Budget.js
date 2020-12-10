import { useState } from 'react'
import { Input, Select } from "antd";
const { Option } = Select;
const options = [
  {
    key: "daily_budget",
    name: "单日预算"
  },
  {
    key: "lifetime_budget",
    name: "总预算"
  }
];

export default ({ state, dispatch, text = '系列预算(不设置则组预算)'}) => {
  const [isDaily, setIsDaily] = useState(
    (state.daily_budget|| state.lifetime_budget || true)
  );
  return (
    <div>
      <p>{text}</p>
      <div>
        <Select
          style={{ width: "100px" }}
          placeholder="预算"
          defaultValue={"daily_budget"}
          onChange={val => {
            setIsDaily(val === "daily_budget" ? true : false);
            dispatch({
              type: val !== "daily_budget" ? "daily_budget" : "lifetime_budget",
              payload: 0
            });
          }}
        >
          {options &&
            options.map((d, i) => <Option key={d.key}>{d.name}</Option>)}
        </Select>
        <Input
          placeholder="输入金额"
          style={{ width: "30%" }}
          type="number"
          name="budget"
          value={(isDaily ? state.daily_budget : state.lifetime_budget) || 0}
          onChange={e => {
            dispatch({
              type: isDaily ? "daily_budget" : "lifetime_budget",
              payload: e.target.value
            });
          }}
        />
      </div>
    </div>
  );
};