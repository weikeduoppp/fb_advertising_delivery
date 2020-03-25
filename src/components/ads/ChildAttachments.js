import React, { useState } from "react";
import { connect } from "dva";
import { Button, Input, Tabs } from "antd";
import style from "../adset/index.less";
import ImageStyle from "./index.less";
import Adimages from "components/ads/Adimages";
import WithPaing from "../HOC/withPaing";
const { TabPane } = Tabs;


// 轮播

const ChildAttachments = React.memo(
  ({ objective, images, handleSubmit, child_attachments, format }) => {
    // 选择图片
    const [adImagesCon, setAdImagesCon] = useState(false);
    // 选中修改相关说明
    const [select, setSelect] = useState(0);

    function callback(key) {
      console.log(key);
    }

    // 修改child_attachments
    function changeChildAttachments(i, key, val) {
      let copy = child_attachments.slice();
      copy[i][key] = val;
      handleSubmit(copy);
    }
    return (
      <>
        <div className={style.targeting_con}>
          <span className={style.targeting_label}>多媒体素材</span>
          <span className={style.targeting_label}>
            <Button icon="plus-square" onClick={() => setAdImagesCon(true)}>
              选择(更换)图片
            </Button>
          </span>
        </div>
        <div className={ImageStyle.select_container}>
          {/* 图片 */}
          {images.length > 0 && (
            <div className={ImageStyle.image_container}>
              <div className={ImageStyle.image_content}>
                {images.map((item, i) => (
                  <div
                    key={item.hash || item.picture}
                    className={ImageStyle.item_container}
                  >
                    <div
                      className={ImageStyle.item_content}
                      onClick={() => {
                        setSelect(i);
                      }}
                    >
                      <div
                        className={
                          i === select
                            ? `${ImageStyle.item_img_con} ${ImageStyle.active}`
                            : ImageStyle.item_img_con
                        }
                      >
                        <div
                          className={ImageStyle.item_img}
                          style={{
                            backgroundImage: "url(" + item.url_128 + ")"
                          }}
                        ></div>
                      </div>
                      <div className={ImageStyle.item_name + " text_ellipsis"}>
                        {item.name}
                      </div>
                      <div
                        className={ImageStyle.item_wh}
                      >{`${item.width} ⨯ ${item.height}`}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {child_attachments && child_attachments.length > 0 && (
          <div className={ImageStyle.childAttachments_con}>
            <Tabs onChange={callback} type="card" activeKey={select.toString()}>
              {child_attachments.map((item, i) => (
                <TabPane tab={`tab${i}`} key={i.toString()}>
                  <div>
                    <p>标题（非必填）</p>
                    <Input
                      placeholder="输入简短标题"
                      defaultValue={item.name}
                      onChange={e => {
                        changeChildAttachments(i, "name", e.target.value);
                      }}
                    />
                  </div>
                  {objective !== "APP_INSTALLS" && (
                    <>
                      <div>
                        <p>说明（非必填）</p>
                        <Input
                          placeholder="添加其他详情"
                          defaultValue={item.description}
                          onChange={e => {
                            changeChildAttachments(
                              i,
                              "description",
                              e.target.value
                            );
                          }}
                        />
                      </div>
                      <div>
                        <p>网址</p>
                        <Input
                          defaultValue={item.link}
                          placeholder="http://www.example.com/page"
                          onChange={e => {
                            changeChildAttachments(i, "link", e.target.value);
                          }}
                        />
                      </div>
                    </>
                  )}
                  {objective === "APP_INSTALLS" && (
                    <div>
                      <p>延迟深度链接（非必填）</p>
                      <Input
                        defaultValue={item.app_link}
                        placeholder="输入延迟深度链接网址"
                        onChange={e => {
                          changeChildAttachments(i, "app_link", e.target.value);
                        }}
                      />
                    </div>
                  )}
                </TabPane>
              ))}
            </Tabs>
          </div>
        )}

        {/* 轮播图片的 */}
        {adImagesCon && (
          <WithPaing
            WrappedComponent={Adimages}
            format={format}
            child_attachments={child_attachments}
            num={10}
            visible={adImagesCon}
            setVisible={setAdImagesCon}
            handleChildAttachments={data => handleSubmit(data)}
          />
         
        )}
      </>
    );
  }
);
const mapStateToProps = (state, ownProps) => {
  return { images: state.global.images };
};
export default connect(mapStateToProps)(ChildAttachments);
