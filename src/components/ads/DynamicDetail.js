import React from 'react'
import { Divider, Input, Row, Col } from "antd";
import style from './index.less'
import DynamicMore from "./DynamicMore";

// 动态创意部分公用表单 link_urls 取出 链接对象
const DynamicDetail = React.memo(({ format, dispatch, objective, bodies, titles, descriptions, link_urls: [links] }) => {
  // 修改link_urls
  function handleLinkUrls(val, key) {
    let copy = JSON.parse(JSON.stringify(links));
    copy[key] = val;
    dispatch({ type: "link_urls", payload: [copy] });
  }
  return (
    <>
      <Divider orientation="left">文字和链接</Divider>
      <div>
        <p className={style.DynamicDetail_title}>正文(不可重复)</p>
        <DynamicMore
          options={bodies}
          type="bodies"
          dispatch={dispatch}
          placeholder="向大家介绍广告内容"
        />
      </div>
      <div>
        <p className={style.DynamicDetail_title}>广告标题（非必填/不可重复）</p>
        <DynamicMore
          options={titles}
          type="titles"
          dispatch={dispatch}
          placeholder="输入简短标题"
        />
      </div>
      {objective !== "APP_INSTALLS" && (
        <div>
          <p className={style.DynamicDetail_title}>描述（非必填/不可重复）</p>
          <DynamicMore
            options={descriptions}
            type="descriptions"
            dispatch={dispatch}
            placeholder="添加其他详情"
          />
        </div>
      )}
      <Row gutter={8}>
        <Col span={14}>
          {objective !== "APP_INSTALLS" && (
            <div>
              <p>网址</p>
              <Input
                placeholder="http://www.example.com/page"
                defaultValue={links.website_url || undefined}
                onChange={e => {
                  handleLinkUrls(e.target.value, "website_url");
                }}
              />
            </div>
          )}
          {objective === "APP_INSTALLS" && (
            <div>
              <p>延迟深度链接（非必填）</p>
              <Input
                placeholder="输入延迟深度链接网址"
                defaultValue={links.deeplink_url || undefined}
                onChange={e => {
                  handleLinkUrls(e.target.value, "deeplink_url");
                }}
              />
            </div>
          )}
          {objective !== "APP_INSTALLS" && (
            <div>
              <p>“查看更多”显示链接（非必填）</p>
              <Input
                placeholder="输入你希望在最后一张轮播图卡中展示的链接。"
                defaultValue={links.display_url || undefined}
                onChange={e => {
                  handleLinkUrls(e.target.value, "display_url");
                }}
              />
            </div>
          )}
        </Col>
      </Row>
    </>
  );
});
export default DynamicDetail;