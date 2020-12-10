import React, { useState } from "react";
import { connect } from "dva";
import { Button } from "antd";
import style from "../adset/index.less";
import ImageStyle from "./index.less";
import Adimages from "components/ads/Adimages";
import WithPaing from "../HOC/withPaing";
// 单张图片
const PhotoLine = React.memo(({ images, handleSubmit, format, num = 1 }) => {
  // 选择图片
  const [adImagesCon, setAdImagesCon] = useState(false);
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
          <div >
            <div className={ImageStyle.image_content}>
              {images.map(item => (
                <div key={item.hash} className={ImageStyle.item_container}>
                  <div className={ImageStyle.item_content}>
                    <div className={ImageStyle.item_img_con}>
                      <img src={item.url_128} alt="" />
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
      {/* 单张图片的 */}
      {adImagesCon && (
        <WithPaing
          WrappedComponent={Adimages}
          handlePhotoLine={handleSubmit}
          visible={adImagesCon}
          setVisible={setAdImagesCon}
          format={format}
          num={num}
        />
      )}
    </>
  );
});
const mapStateToProps = (state, ownProps) => {
  return { images: state.global.images };
};
export default connect(mapStateToProps)(PhotoLine);
