import { Select } from "antd";
import { memo } from "react";
import style from "../index.less";
const { Option } = Select;

// 广告投放优化目标数据
const options = {
  APP_INSTALLS: [
    {
      key: "APP_INSTALLS",
      name: "APP_INSTALLS"
    },
    {
      key: "LINK_CLICKS",
      name: "LINK_CLICKS"
    },
    {
      key: "VALUE",
      name: "VALUE"
    },
    {
      key: "OFFSITE_CONVERSIONS",
      name: "OFFSITE_CONVERSIONS"
    },
    {
      key: "REACH",
      name: "REACH"
    },
    {
      key: "IMPRESSIONS",
      name: "IMPRESSIONS"
    },
    {
      key: "POST_ENGAGEMENT",
      name: "POST_ENGAGEMENT"
    }
  ],
  CONVERSIONS: [
    {
      key: "OFFSITE_CONVERSIONS",
      name: "OFFSITE_CONVERSIONS"
    },
    {
      key: "IMPRESSIONS",
      name: "IMPRESSIONS"
    },
    {
      key: "REACH",
      name: "REACH"
    },
    {
      key: "SOCIAL_IMPRESSIONS",
      name: "SOCIAL_IMPRESSIONS"
    },
    {
      key: "VALUE",
      name: "VALUE"
    },
    {
      key: "LINK_CLICKS",
      name: "LINK_CLICKS"
    },
    {
      key: "LANDING_PAGE_VIEWS",
      name: "LANDING_PAGE_VIEWS"
    },
    {
      key: "POST_ENGAGEMENT",
      name: "POST_ENGAGEMENT"
    }
  ],
  LINK_CLICKS: [
    {
      key: "LINK_CLICKS",
      name: "LINK_CLICKS"
    },
    {
      key: "IMPRESSIONS",
      name: "IMPRESSIONS"
    },
    {
      key: "LANDING_PAGE_VIEWS",
      name: "LANDING_PAGE_VIEWS"
    },
    {
      key: "REACH",
      name: "REACH"
    },
    {
      key: "POST_ENGAGEMENT",
      name: "POST_ENGAGEMENT"
    }
  ]
};

// 优化目标和竞价事件 计费方式
const BILLING_EVENT = {
  APP_INSTALLS: ["IMPRESSIONS", "APP_INSTALLS"],
  LINK_CLICKS: ["IMPRESSIONS", "LINK_CLICKS"],
  IMPRESSIONS: ["IMPRESSIONS"],
  REACH: ["IMPRESSIONS"],
  LANDING_PAGE_VIEWS: ["IMPRESSIONS"],
  VALUE: ["IMPRESSIONS"],
  SOCIAL_IMPRESSIONS: ["IMPRESSIONS"],
  OFFSITE_CONVERSIONS: ["IMPRESSIONS"],
  POST_ENGAGEMENT: ["IMPRESSIONS"]
};

export default memo(
  ({ objective, optimization_goal, billing_event, handleSubmit }) => {
    return (
      <>
        <div className={style.targeting_con}>
          <span className={style.targeting_label}>广告投放优化目标</span>
          <Select
            style={{ width: "30%" }}
            placeholder="优化目标"
            defaultValue={optimization_goal || undefined}
            onChange={val => handleSubmit(val, BILLING_EVENT[val][0])}
          >
            {options[objective] &&
              options[objective].map((d, i) => (
                <Option key={d.key}>{d.name}</Option>
              ))}
          </Select>
        </div>
        {optimization_goal && (
          <div className={style.targeting_con}>
            <span className={style.targeting_label}>
              竞价事件/计费方式(billing_event)
            </span>
            <Select
              style={{ width: "30%" }}
              defaultValue={
                billing_event || BILLING_EVENT[optimization_goal][0]
              }
              onChange={val => handleSubmit(optimization_goal, val)}
            >
              {BILLING_EVENT[optimization_goal].map(item => (
                <Option key={`${item}`}>{item}</Option>
              ))}
            </Select>
          </div>
        )}
      </>
    );
  }
);
