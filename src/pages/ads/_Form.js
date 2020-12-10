import React from "react";
import { Input, Divider } from "antd";
import style from "../adset/index.less";

import Pages from "components/ads/Pages";
import AdsFormat from "components/ads/AdsFormat";
import DynamicFormat from "components/ads/DynamicFormat";
import PhotoLine from "components/ads/PhotoLine";
import VideoLine from "components/ads/VideoLine";
import Slideshow from "components/ads/Slideshow";
import DynamicSource from "components/ads/DynamicSource";
import DynamicDetail from "components/ads/DynamicDetail";
import ChildAttachments from "components/ads/ChildAttachments";
import Detail from "components/ads/Detail";
import CallToAction from "components/ads/CallToAction";
import Status from "components/common/Status";
import GetOrSaveDetails from "components/ads/GetOrSaveDetails";
import AdsNums from "components/ads/AdsNums";

import * as CampaignContant from "../campaign/constant";
/* 
  广告创意相关数据收集
  state:  dynamicCreativeState | adsCreativeState
 */
export default React.memo(
  ({ state, dispatch, objective, is_dynamic_creative }) => {
    return (
      <div className={style.form}>
        <div>
          <p>广告名称</p>
          <Input
            placeholder="输入广告名称"
            defaultValue={state.ads_name}
            onChange={e => {
              dispatch({ type: "ads_name", payload: e.target.value });
            }}
          />
        </div>
        {CampaignContant.objective.indexOf(objective) !== -1 && (
          <div>
            <Divider orientation="left">广告发布身份</Divider>
            <Pages
              page_id={state.page_id}
              instagram_actor_id={state.instagram_actor_id}
              handleSubmit={(id, key) => {
                key === "page_id" && dispatch({ type: "page_id", payload: id });
                key === "instagram_actor_id" &&
                  dispatch({ type: "instagram_actor_id", payload: id });
              }}
            />
            <Divider />
            {!is_dynamic_creative ? (
              <div className="no_dynamic_creative">
                <AdsFormat
                  format={state.format}
                  handleSubmit={format => {
                    dispatch({ type: "format", payload: format });
                  }}
                />
                {/* 素材相关 */}
                {state.format === "photo_data" && (
                  <PhotoLine
                    format={state.format}
                    handleSubmit={image_hash =>
                      dispatch({ type: "image_hash", payload: image_hash })
                    }
                  />
                )}
                {state.format === "slideshow_spec" && (
                  <Slideshow
                    format={state.format}
                    handleSubmit={(video_id, image_url) => {
                      dispatch({ type: "video_id", payload: video_id });
                      dispatch({ type: "image_url", payload: image_url });
                    }}
                  />
                )}
                {state.format === "video_data" && (
                  <VideoLine
                    handleSubmit={(video_id, image_url) => {
                      dispatch({ type: "video_id", payload: video_id });
                      dispatch({ type: "image_url", payload: image_url });
                    }}
                  />
                )}
                {state.format === "child_attachments" && (
                  <ChildAttachments
                    format={state.format}
                    child_attachments={state.child_attachments}
                    objective={objective}
                    handleSubmit={child_attachments =>
                      dispatch({
                        type: "child_attachments",
                        payload: child_attachments
                      })
                    }
                  />
                )}
                {state.format.indexOf("batch_image_data") !== -1 && (
                  <PhotoLine format={state.format} num={150} />
                )}
                {state.format.indexOf("more") !== -1 && (
                  <AdsNums state={state} dispatch={dispatch}/>
                )}
                {/* 正文模板 */}
                <GetOrSaveDetails
                  handleSubmit={payload => {
                    dispatch({
                      type: "title_message",
                      payload: { ...payload, name: payload.title }
                    });
                  }}
                  model="details"
                  text="正文模板"
                  params={{
                    title: state.name || state.title,
                    message: state.message
                  }}
                  params_name="title"
                />
                <Detail
                  {...state}
                  format={state.format}
                  dispatch={dispatch}
                  objective={objective}
                />
                <CallToAction
                  mode={undefined}
                  objective={objective}
                  call_to_action_default={state.call_to_action || undefined}
                  handleSubmit={type =>
                    dispatch({ type: "call_to_action", payload: type })
                  }
                />
              </div>
            ) : (
              <div className="yes_dynamic_creative">
                <DynamicFormat
                  format={state.ad_formats}
                  handleSubmit={format => {
                    dispatch({ type: "ad_formats", payload: format });
                  }}
                />
                <DynamicSource
                  is_images={state.ad_formats[0] === "SINGLE_IMAGE"}
                  handleVideos={videos =>
                    dispatch({ type: "videos", payload: videos })
                  }
                />
                <DynamicDetail
                  objective={objective}
                  dispatch={dispatch}
                  {...state}
                />
                <CallToAction
                  mode="multiple"
                  objective={objective}
                  call_to_action_default={
                    state.call_to_action_types || undefined
                  }
                  handleSubmit={type =>
                    dispatch({ type: "call_to_action_types", payload: type })
                  }
                />
              </div>
            )}
          </div>
        )}

        <Divider />
        <Status
          status={state.status}
          handleSubmit={status => dispatch({ type: "status", payload: status })}
        />
      </div>
    );
  }
);
