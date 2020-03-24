import { Input, Radio } from "antd";
import style from "./index.less";
import * as constant from "./constant";
import Status from "components/common/Status";
import SpecialAdCategory from "components/campaign/SpecialAdCategory.js";
// 系列表单
export default ({ state, dispatch }) => {
  return (
    <div className={style.form}>
      <div>
        <p>广告系列名称</p>
        <Input
          placeholder="输入广告系列名称"
          value={state.name}
          onChange={e => {
            dispatch({ type: "name", payload: e.target.value });
          }}
        />
      </div>
      {/* 如果不存在设计的路线. 不宜修改 */}
      {constant.objective.indexOf(state.objective) !== -1 && (
        <div>
          <p>目标</p>
          <Radio.Group
            onChange={e => {
              dispatch({ type: "objective", payload: e.target.value });
            }}
            value={state.objective}
          >
            {constant.objective.map(item => (
              <Radio key={item} value={item}>
                {item}
              </Radio>
            ))}
          </Radio.Group>
        </div>
      )}

      <div>
        <p>系列预算</p>
        <Input
          placeholder="输入金额"
          type="number"
          name="daily_budget"
          value={state.daily_budget}
          onChange={e => {
            dispatch({ type: "daily_budget", payload: e.target.value });
          }}
        />
      </div>
      <div>
        <p>竟价策略(若开启广告系列预算优化, 默认最低费用)</p>
        <Radio.Group
          onChange={e => {
            dispatch({ type: "bid_strategy", payload: e.target.value });
          }}
          disabled={!state.daily_budget}
          value={state.bid_strategy}
        >
          <Radio value={"LOWEST_COST_WITHOUT_CAP"}>最低费用</Radio>
          <Radio value={"COST_CAP"}>费用上限</Radio>
          <Radio value={"LOWEST_COST_WITH_BID_CAP"}>竞价上限</Radio>
          <Radio value={"TARGET_COST"}>目标费用</Radio>
        </Radio.Group>
      </div>
      <SpecialAdCategory
        special_ad_category={state.special_ad_category}
        handleSubmit={special_ad_category =>
          dispatch({
            type: "special_ad_category",
            payload: special_ad_category
          })
        }
      />
      <Status
        status={state.status}
        handleSubmit={status => dispatch({ type: "status", payload: status })}
      />
    </div>
  );
};
