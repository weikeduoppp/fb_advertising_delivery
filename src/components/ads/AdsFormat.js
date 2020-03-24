import React from 'react'
import style from "../adset/index.less";
import { connect } from 'dva'
import { Radio } from "antd";
/* 
  非动态素材
  child_attachments 轮播
    video_data 单视频
    photo_data 单图片
 */
 const FORMAT_DATA = [
   // ，，TARGET_COST
   { key: "photo_data", name: "单图片" },
   { key: "child_attachments", name: "轮播" },
   { key: "video_data", name: "单视频" },
   { key: "slideshow_spec", name: "幻灯片" }
 ];
//  广告形式
const AdsFormat = React.memo(({ handleSubmit, format, dispatch }) => {

  function handleCache(e) {
    let val = e.target.value
    // 清除图片记录
    if (val !== format) dispatch({ type: "global/set_images", payload: [] });
    handleSubmit(val);
  }

  return (
    <div className={style.targeting_con}>
      <span className={style.targeting_label}>广告形式</span>
      <Radio.Group onChange={handleCache} defaultValue={format}>
        {FORMAT_DATA.map(d => (
          <Radio key={d.key} value={d.key}>
            {d.name}
          </Radio>
        ))}
      </Radio.Group>
    </div>
  );
});
export default connect()(AdsFormat);