import React, { useState } from "react";
import { connect } from "dva";
import { Button, Radio, message } from "antd";
import style from "../adset/index.less";
import ImageStyle from "./index.less";
import Adimages from "components/ads/Adimages";
import { createSlideshow } from "utils/fb_api";
import WithPaing from "../HOC/withPaing";
// 时间间隔 上传单位为毫秒
const IMAGE_DURATION = [0.5, 1, 2, 3, 4, 5];

// 是否有淡化效果
const TRANSITION = [
  {
    key: 0,
    name: "无"
  },
  {
    key: 1000,
    name: "淡化"
  }
];

// 幻灯片
const Slideshow = React.memo(
  ({ adaccount_id, images, handleSubmit, format }) => {
    // 选择图片
    const [adImagesCon, setAdImagesCon] = useState(false);
    //  时间间隔
    const [imageDuration, setImageDuration] = useState(IMAGE_DURATION[1]);
    // 淡化
    const [transition, setTransition] = useState(0);

    /* 
  格式:
  'slideshow_spec={\
     "images_urls":[\
       "https://example.com/picture1.png",\
       "https://example.com/picture2.png",\
       "https://example.com/picture3.png",\
     ],\
     "duration_ms": 2000,\
     "transition_ms": 200\
   }'
 */
    // 创建幻灯片 permalink_url线上图片
    async function handleSlideshow(images) {
      if (images.length < 3) return message.warning("图片数量：3-7 张图片");
      let images_urls = images.map(d => d.permalink_url);
      const res = await createSlideshow(adaccount_id, {
        images_urls,
        duration_ms: imageDuration * 1000,
        transition_ms: transition
      });
      console.log(res);
      if (res.id) {
        message.success("幻灯片创建成功");
        handleSubmit({
          video_id: res.id,
          image_url: images_urls[0]
        });
      }
    }

    return (
      <>
        <div className={style.targeting_con}>
          <span className={style.targeting_label}>
            图片显示间隔(不能超15秒)
          </span>
          <span className={style.targeting_label}>
            <Radio.Group
              onChange={e => setImageDuration(e.target.value)}
              defaultValue={imageDuration}
              buttonStyle="solid"
            >
              {IMAGE_DURATION.map(d => (
                <Radio.Button value={d} key={d}>
                  {d}
                </Radio.Button>
              ))}
            </Radio.Group>
          </span>
        </div>
        <div className={style.targeting_con}>
          <span className={style.targeting_label}>切换效果</span>
          <span className={style.targeting_label}>
            <Radio.Group
              onChange={e => setTransition(e.target.value)}
              defaultValue={transition}
              buttonStyle="solid"
            >
              {TRANSITION.map(d => (
                <Radio.Button value={d.key} key={d.name}>
                  {d.name}
                </Radio.Button>
              ))}
            </Radio.Group>
          </span>
        </div>
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
        {/* 幻灯片的图片 */}
        {adImagesCon && (
          <WithPaing
            WrappedComponent={Adimages}
            num={10}
            format={format}
            // 创建幻灯片
            handleSlideshow={handleSlideshow}
            visible={adImagesCon}
            setVisible={setAdImagesCon}
          />
        )}
      </>
    );
  }
);
const mapStateToProps = (state, ownProps) => {
  return {
    images: state.global.images,
    adaccount_id: state.global.adaccount_id
  };
};
export default connect(mapStateToProps)(Slideshow);
