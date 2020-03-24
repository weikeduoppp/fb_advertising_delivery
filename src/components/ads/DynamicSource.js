import React, { useState } from "react";
import { connect } from "umi";
import { Button } from "antd";
import style from "../adset/index.less";
import ImageStyle from "./index.less";
import Adimages from "components/ads/Adimages";
import Advideos from "components/ads/Advideos";
import WithPaing from "../HOC/withPaing";
import Picture from "./Picture";

// 动态创意的素材
const DynamicSource = React.memo(
  ({ images, handleVideos, is_images, videos }) => {
    // model控制
    const [modelCon, setModelCon] = useState(false);

    return (
      <>
        <div className={style.targeting_con}>
          <span className={style.targeting_label}>多媒体素材</span>
          <span className={style.targeting_label}>
            <Button icon="plus-square" onClick={() => setModelCon(true)}>
              选择(更换){is_images ? `图片` : `视频`}
            </Button>
          </span>
        </div>
        <div className={ImageStyle.select_container}>
          {/* 图片 */}
          {is_images && images.length > 0 && <Picture options={images} />}
          {/* 视频 */}
          {!is_images && videos.length > 0 && <Picture options={videos} />}
        </div>

        {modelCon && (
          <WithPaing
            WrappedComponent={is_images ? Adimages : Advideos}
            num={10}
            visible={modelCon}
            setVisible={setModelCon}
            handleDynamicVideos={
              !is_images
                ? select => {
                    handleVideos(
                      select.map(d => ({
                        video_id: d.hash,
                        thumbnail_url: d.url_128
                      }))
                    );
                  }
                : null
            }
          />
        )}
      </>
    );
  }
);
const mapStateToProps = (state, ownProps) => {
  return { images: state.global.images, videos: state.global.videos };
};
export default connect(mapStateToProps)(DynamicSource);
