import React, { useState } from "react";
import { Input, Radio, Divider } from "antd";
import style from "./index.less";
import PromotedObject from "../../components/adset/promoted_object/promoted_object";
import DestinationType from "../../components/adset/DestinationType";
import SaveTargeting from "../../components/adset/SaveTargeting";
import GetSaveTargeting from "../../components/adset/GetSaveTargeting";
import Adgeolocation from "../../components/adset/targeting/Adgeolocation";
import CustomAudience from "../../components/adset/targeting/CustomAudience";
import Age from "../../components/adset/targeting/Age";
import Genders from "../../components/adset/targeting/Genders";
import Adlocale from "../../components/adset/targeting/Adlocale";
import DetailTargeting from "../../components/adset/targeting/DetailTargeting";
import Connections from "../../components/adset/targeting/Connections";
import DevicePlatforms from "../../components/adset/targeting/DevicePlatforms";
import Placements from "../../components/adset/targeting/Placements";
import OS from "../../components/adset/targeting/OS";
import OptimizationGoal from "../../components/adset/Budget&Schedule/OptimizationGoal";
import CostControl from "../../components/adset/Budget&Schedule/CostControl";
import Schedule from "../../components/adset/Budget&Schedule/Schedule";
import Status from "components/common/Status";
/* 
  组表单
  objective -> 创建广告组的几条线路 标识 广告系列的数据
  daily_budget -> 广告系列的数据
  bid_strategy -> 广告系列的数据
  edit -> 编辑的标识 boolean
 */
export default ({
  bid_strategy,
  daily_budget,
  state,
  dispatch,
  objective,
  edit,
  initailTargeting
}) => {
  const [saveSelect, setSaveSelect] = useState(undefined);
  return (
    <div className={style.form}>
      <div>
        <p>广告组名称</p>
        <Input
          placeholder="输入广告组名称"
          value={state.name}
          onChange={e => {
            dispatch({ type: "name", payload: e.target.value });
          }}
        />
      </div>
      {objective !== "APP_INSTALLS" && !edit && (
        <DestinationType
          handleSubmit={destination_type =>
            dispatch({ type: "destination_type", payload: destination_type })
          }
        />
      )}
      <PromotedObject
        edit={edit}
        objective={objective}
        handleSubmit={promoted_object => {
          dispatch({ type: "promoted_object", payload: promoted_object });
        }}
      />
      {!edit && (
        <div>
          <p>动态素材</p>
          <Radio.Group
            onChange={e => {
              dispatch({
                type: "is_dynamic_creative",
                payload: e.target.value
              });
            }}
            defaultValue={state.is_dynamic_creative}
          >
            <Radio value={true}>开</Radio>
            <Radio value={false}>关</Radio>
          </Radio.Group>
        </div>
      )}

      <div className={style.audience_container}>
        <Divider orientation="left">受众</Divider>
        {/* 使用保存的受众 */}
        <GetSaveTargeting
          setSaveSelect={setSaveSelect}
          initailTargeting={initailTargeting}
          handleSubmit={targeting => {
            dispatch({
              type: "targeting",
              payload: { ...targeting }
            });
          }}
        />
        {
          <>
            <CustomAudience
              customAudienceFormData={state.targeting.custom_audiences}
              handleSubmit={custom_audiences =>
                dispatch({
                  type: "targeting",
                  payload: {
                    ...state.targeting,
                    custom_audiences
                  }
                })
              }
            />
            <Adgeolocation
              {...state.targeting.geo_locations}
              handleSubmit={geo_locations =>
                dispatch({
                  type: "targeting",
                  payload: {
                    ...state.targeting,
                    geo_locations
                  }
                })
              }
            />
            <Age
              min={state.targeting.age_min}
              max={state.targeting.age_max}
              handleSubmit={age =>
                dispatch({
                  type: "targeting",
                  payload: {
                    ...state.targeting,
                    ...age
                  }
                })
              }
            />
            <Genders
              genders={state.targeting.genders}
              handleSubmit={genders =>
                dispatch({
                  type: "targeting",
                  payload: {
                    ...state.targeting,
                    genders
                  }
                })
              }
            />
            <Adlocale
              locales={state.targeting.locales}
              handleSubmit={locales =>
                dispatch({
                  type: "targeting",
                  payload: {
                    ...state.targeting,
                    locales
                  }
                })
              }
            />
            {/* { interests, behaviors, life_events, industries, income, family_statuses, } */}
            <DetailTargeting
              // 编辑时 存在再取出id
              editData={{
                interests:
                  state.targeting.interests &&
                  state.targeting.interests.map(d => d.id),
                behaviors:
                  state.targeting.behaviors &&
                  state.targeting.behaviors.map(d => d.id),
                life_events:
                  state.targeting.life_events &&
                  state.targeting.life_events.map(d => d.id),
                industries:
                  state.targeting.industries &&
                  state.targeting.industries.map(d => d.id),
                income:
                  state.targeting.income &&
                  state.targeting.income.map(d => d.id),
                family_statuses:
                  state.targeting.family_statuses &&
                  state.targeting.family_statuses.map(d => d.id),
                flexible_spec: state.targeting.flexible_spec
              }}
              targeting_optimization={state.targeting.targeting_optimization}
              saveSelect={saveSelect}
              handleSubmit={Targeting =>
                dispatch({
                  type: "targeting",
                  payload: {
                    ...state.targeting,
                    ...Targeting
                  }
                })
              }
            />

            <Connections
              app_install_state={state.targeting.app_install_state}
              handleSubmit={app_install_state =>
                dispatch({
                  type: "targeting",
                  payload: {
                    ...state.targeting,
                    app_install_state
                  }
                })
              }
            />

            <DevicePlatforms
              device_platforms={state.targeting.device_platforms}
              handleSubmit={device_platforms =>
                dispatch({
                  type: "targeting",
                  payload: {
                    ...state.targeting,
                    device_platforms
                  }
                })
              }
            />
            <Placements
              publisher_platforms={state.targeting.publisher_platforms}
              handleSubmit={publisher_platforms =>
                dispatch({
                  type: "targeting",
                  payload: {
                    ...state.targeting,
                    publisher_platforms
                  }
                })
              }
            />

            {state.targeting.device_platforms &&
              state.targeting.device_platforms.indexOf("mobile") !== -1 && (
                <OS
                  saveSelect={saveSelect}
                  user_os={state.targeting.user_os}
                  wireless_carrier={state.targeting.wireless_carrier}
                  user_device={state.targeting.user_device}
                  handleSubmit={user_os =>
                    dispatch({
                      type: "targeting",
                      payload: {
                        ...state.targeting,
                        ...user_os
                      }
                    })
                  }
                />
              )}
            <Divider></Divider>
            <SaveTargeting
              saveSelect={saveSelect}
              targeting={state.targeting}
            />
          </>
        }
        <Divider className={style.audience_container} />
        <OptimizationGoal
          objective={objective}
          optimization_goal={state.optimization_goal}
          billing_event={state.billing_event}
          handleEvent={custom_event_type => {
            dispatch({
              type: "promoted_object",
              payload: { ...state.promoted_object, custom_event_type }
            });
          }}
          handleSubmit={(optimization_goal, billing_event) => {
            dispatch({
              type: "optimization_goal",
              payload: optimization_goal
            });
            dispatch({
              type: "billing_event",
              payload: billing_event
            });
            // 处理 optimization_goal === "VALUE"
            if(optimization_goal === "VALUE") {
              dispatch({
                type: "promoted_object",
                payload: {
                  ...state.promoted_object,
                  custom_event_type: "PURCHASE"
                }
              });
            }
          }}
        />
        <CostControl
          objective={objective}
          campaign_bid_strategy={bid_strategy}
          bid_strategy={state.bid_strategy}
          campaign_daily_budget={daily_budget}
          daily_budget={state.daily_budget}
          bid_amount={state.bid_amount}
          handleAmount={bid_amount =>
            dispatch({
              type: "bid_amount",
              payload: bid_amount
            })
          }
          handleStrategy={bid_strategy =>
            dispatch({
              type: "bid_strategy",
              payload: bid_strategy
            })
          }
          state={state}
          dispatch={dispatch}
        />
        <Schedule
          end_time={state.end_time}
          start_time={state.start_time}
          handleSubmit={(start, end) => {
            dispatch({ type: "start_time", payload: start });
            dispatch({ type: "end_time", payload: end });
          }}
        />
      </div>

      <Status
        status={state.status}
        handleSubmit={status => dispatch({ type: "status", payload: status })}
      />
    </div>
  );
};