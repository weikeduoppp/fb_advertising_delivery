import React, { useState } from "react";
import { connect } from "dva";
import { Button } from "antd";
import style from "../adset/index.less";
import ImageStyle from './index.less'
import Advideos from "components/ads/Advideos";
import WithPaing from "../HOC/withPaing";
// 单张视频
const VideoLine = React.memo(({ videos, handleSubmit }) => {
  // 选择视频
  const [advideosCon, setAdvideosCon] = useState(false);
  return (
    <>
      <div className={style.targeting_con}>
        <span className={style.targeting_label}>多媒体素材</span>
        <span className={style.targeting_label}>
          <Button icon="plus-square" onClick={() => setAdvideosCon(true)}>
            选择(更换)视频
          </Button>
        </span>
      </div>
      {/* 视频 */}
      <div className={ImageStyle.select_container}>
        {videos.length > 0 && (
          <div className={ImageStyle.image_container}>
            <div className={ImageStyle.image_content}>
              {videos.map(item => (
                <div key={item.hash} className={ImageStyle.item_container}>
                  <div className={ImageStyle.item_content}>
                    <div className={ImageStyle.item_img_con}>
                      <div
                        className={ImageStyle.item_img}
                        style={{ backgroundImage: "url(" + item.url_128 + ")" }}
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
      {/* 单张视频的 */}
      {advideosCon && (
        <WithPaing
          WrappedComponent={Advideos}
          handleSubmit={handleSubmit}
          visible={advideosCon}
          setVisible={setAdvideosCon}
        />
      
      )}
    </>
  );
});
const mapStateToProps = (state, ownProps) => {
  return { videos: state.global.videos };
};
export default connect(mapStateToProps)(VideoLine);
