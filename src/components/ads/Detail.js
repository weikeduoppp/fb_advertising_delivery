import React from 'react'
import {  Divider, Input } from "antd";

// 广告创意部分公用表单
const Detail = React.memo(({ format, dispatch, objective, ...state }) => {
  return (
    <>
      <Divider orientation="left">文字和链接</Divider>
      <div>
        <p>正文</p>
        <Input.TextArea
          rows={3}
          defaultValue={state.message}
          placeholder="向大家介绍广告内容"
          onChange={e => {
            dispatch({ type: "message", payload: e.target.value });
          }}
        />
      </div>
      {format !== "child_attachments" && (
        <div>
          <p>广告标题（非必填）</p>
          <Input
            placeholder="输入简短标题"
            defaultValue={state.name || state.title}
            onChange={e => {
              dispatch({ type: "name", payload: e.target.value });
            }}
          />
        </div>
      )}

      {objective !== "APP_INSTALLS" && format !== "child_attachments" && (
        <div>
          <p>描述（非必填）</p>
          <Input
            placeholder="添加其他详情"
            defaultValue={state.description}
            onChange={e => {
              dispatch({ type: "description", payload: e.target.value });
            }}
          />
        </div>
      )}
      {objective !== "APP_INSTALLS" && format !== "child_attachments" && (
        <div>
          <p>网址</p>
          <Input
            placeholder="http://www.example.com/page"
            defaultValue={state.link}
            onChange={e => {
              dispatch({ type: "link", payload: e.target.value });
            }}
          />
        </div>
      )}
      {objective === "APP_INSTALLS" && (
        <div>
          <p>延迟深度链接（非必填）</p>
          <Input
            placeholder="输入延迟深度链接网址"
            defaultValue={state.app_link}
            onChange={e => {
              dispatch({ type: "app_link", payload: e.target.value });
            }}
          />
        </div>
      )}
      {format === "child_attachments" && objective !== "APP_INSTALLS" && (
        <div>
          <p>“查看更多”显示链接（非必填）</p>
          <Input
            placeholder="输入你希望在最后一张轮播图卡中展示的链接。"
            defaultValue={state.caption}
            onChange={e => {
              dispatch({ type: "caption", payload: e.target.value });
            }}
          />
        </div>
      )}
    </>
  );
});
export default Detail;