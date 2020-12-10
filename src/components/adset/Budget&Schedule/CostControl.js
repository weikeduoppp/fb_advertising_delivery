import { InputNumber, Radio } from "antd";
import { memo, useState } from "react";
import style from "../index.less";
import Budget from "../../campaign/Budget.js";

// 最低费用
const LOWEST_COST_WITHOUT_CAP = "LOWEST_COST_WITHOUT_CAP";

const bid_strategy_options = [
  // ，，TARGET_COST
  { key: "COST_CAP", name: "费用上限" },
  { key: "LOWEST_COST_WITH_BID_CAP", name: "竞价上限" },
  { key: "TARGET_COST", name: "目标费用" }
];
// 系列若开启预算优化, 最低费用竞价策略没有费用控制额 广告组的预算没有 campaign_daily_budget > 0 代表 系列开启预算优化

export default memo(
  ({
    objective,
    campaign_bid_strategy,
    bid_strategy,
    bid_amount,
    campaign_daily_budget,
    daily_budget,
    handleAmount,
    handleStrategy,
    state,
    dispatch
  }) => {
    const [Cost, setCost] = useState(bid_amount || 0);
    const [strategy, setStrategy] = useState("COST_CAP");
    console.log(campaign_daily_budget);
    return (
      <>
        <div className={style.targeting_con}>
          <span className={style.targeting_label}>费用控制额</span>
          <InputNumber
            defaultValue={Cost}
            name="bid_amount"
            disabled={
              campaign_daily_budget > 0 &&
              campaign_bid_strategy === LOWEST_COST_WITHOUT_CAP
            }
            formatter={value =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={value => value.replace(/\$\s?|(,*)/g, "")}
            onChange={value => {
              setCost(value);
              // 数值单独*100
              handleAmount(value);
              if (value) {
                handleStrategy(strategy);
              } else {
                // bid_amount为0 默认最低费用模式
                handleStrategy("LOWEST_COST_WITHOUT_CAP");
              }
            }}
            min={0}
          />
        </div>
        {/* 竟价策略只能二者设置一次(系列和广告组)) */}
        {campaign_daily_budget === 0 && (
          <>
            <div>
              <p>竟价策略</p>
              <Radio.Group
                disabled={!Cost}
                onChange={e => {
                  setStrategy(e.target.value);
                  handleStrategy(e.target.value);
                }}
                defaultValue={bid_strategy_options[0].key}
              >
                {bid_strategy_options.map(d => {
                  // 目标费用 只支持的优化目标为应用程序下载、应用程序安装、异地转换、潜在客户开发
                  if (d.key === "TARGET_COST") {
                    return objective === "APP_INSTALLS" ? (
                      <Radio key={d.key} value={d.key}>
                        {d.name}
                      </Radio>
                    ) : (
                      ""
                    );
                  }
                  return (
                    <Radio key={d.key} value={d.key}>
                      {d.name}
                    </Radio>
                  );
                })}
              </Radio.Group>
            </div>
            <Budget state={state} dispatch={dispatch} text={"广告组预算"} />
            {/* <div className={style.targeting_con}>
              <span className={style.targeting_label}>预算</span>
              <InputNumber
                defaultValue={daily_budget || 0}
                name="daily_budget"
                formatter={value =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={value => value.replace(/\$\s?|(,*)/g, "")}
                onChange={value => {
                  handleBudget(value);
                }}
                min={0}
              />
            </div> */}
          </>
        )}
      </>
    );
  }
);
