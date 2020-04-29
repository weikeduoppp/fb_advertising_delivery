import { useState, useReducer, lazy, Suspense, useEffect } from "react";
import * as campaignConstant from "../campaign/constant";
import * as adsetConstant from "../adset/constant";
import * as adsCreativeContant from "../ads/CreativeContant";
import * as dynamicCreativeContant from "../ads/dynamicCreativeContant"
import { Tabs, Button, message, Spin } from "antd";
import style from "./index.less";
import { connect } from "dva";
import CreateBtn from "./createBtn";
const CreateAdset = lazy(() => import("./createAdset"));
const CreateCampaign = lazy(() => import("./createCampaign"));
const CreateAds = lazy(() => import("./createAds"));
const { TabPane } = Tabs;
// 顶层作数据管理
const Creation = ({ adaccount_id, dispatch }) => {
  // 创建状态
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("campaign");
  // 系列的数据
  const [campaignState, campaignDispatch] = useReducer(
    campaignConstant.reducer,
    campaignConstant.initail
  );
  // 组的数据
  const [adsetState, adsetDispatch] = useReducer(
    adsetConstant.reducer,
    adsetConstant.initail[campaignState.objective]
  );

  // 广告创意的数据
  const [adsCreativeState, adsCreativeDispatch] = useReducer(
    adsCreativeContant.reducer,
    adsCreativeContant.initail
  );

  // 动态创意的数据 如果开启
  const [dynamicCreativeState, dynamicCreativeDispatch] = useReducer(
    dynamicCreativeContant.reducer,
    dynamicCreativeContant.initail
  );

  // 保存系列数据
  function setCampaign() {
    dispatch({
      type: "global/set_c_campaign",
      payload: campaignState
    });
  }
  // 保存组数据
  function setAdset() {
    dispatch({
      type: "global/set_c_adset",
      payload: adsetState
    });
  }

  // 关闭键盘事件
  useEffect(() => {
    if(document.onkeydown) document.onkeydown = null
    return () => {
      document.onkeydown = null;
    };
  }, []);

  return (
    <Spin tip="努力创建中..." spinning={loading} size="large" delay={500}>
      <Tabs
        className={style.content}
        tabPosition="left"
        activeKey={step}
        onTabClick={e => {
          setStep(e);
          // if (campaignState.name) setStep(e);
        }}
      >
        <TabPane className={style.campaign} tab="广告系列" key="campaign">
          <Suspense fallback={<Spin size="small" />}>
            <CreateCampaign
              adaccount_id={adaccount_id}
              state={campaignState}
              campaignDispatch={campaignDispatch}
              initailState={campaignConstant.initail}
              setStep={setStep}
            />
            <div className={style.next_btn}>
              <Button
                type="primary"
                onClick={() => {
                  // 下一步 创建广告组
                  if (campaignState.name) {
                    setStep("adset");
                    setCampaign();
                  } else {
                    message.warning("请输入广告系列名称");
                  }
                }}
              >
                继续
              </Button>
            </div>
          </Suspense>
        </TabPane>
        <TabPane tab="广告组" key="adset">
          <Suspense fallback={<Spin size="small" />}>
            <CreateAdset
              campaign_id={campaignState.id}
              bid_strategy={campaignState.bid_strategy}
              daily_budget={campaignState.daily_budget}
              state={adsetState}
              dispatch={adsetDispatch}
              initailState={adsetConstant.initail[campaignState.objective]}
              objective={campaignState.objective}
            />
            <div className={style.next_btn}>
              <Button
                type="primary"
                onClick={() => {
                  // 下一步 创建广告
                  if (adsetState.name) {
                    setStep("ads");
                    setAdset();
                  } else {
                    message.warning("请输入广告组名称");
                  }
                }}
              >
                继续
              </Button>
            </div>
          </Suspense>
        </TabPane>
        <TabPane tab="广告" key="ads">
          <Suspense fallback={<Spin size="small" />}>
            <CreateAds
              state={adsetState.is_dynamic_creative ? dynamicCreativeState : adsCreativeState}
              dispatch={adsetState.is_dynamic_creative ? dynamicCreativeDispatch : adsCreativeDispatch}
              objective={campaignState.objective}
              is_dynamic_creative={adsetState.is_dynamic_creative}
            />
            <div className={style.next_btn}>
              <CreateBtn
                setLoading={setLoading}
                adaccount_id={adaccount_id}
                campaignState={campaignState}
                adsetState={adsetState}
                adsCreativeState={adsetState.is_dynamic_creative ? dynamicCreativeState : adsCreativeState}
              />
            </div>
          </Suspense>
        </TabPane>
      </Tabs>
    </Spin>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    adaccount_id: state.global.adaccount_id
  };
};

export default connect(mapStateToProps)(Creation);
