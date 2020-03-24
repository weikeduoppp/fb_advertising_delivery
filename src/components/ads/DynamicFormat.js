import React from 'react'
import style from "../adset/index.less";
import { Radio } from "antd";

// 格式  SINGLE_IMAGE，CAROUSEL_IMAGE，SINGLE_VIDEO
 const DYNAMIC_DATA = [
   { key: "SINGLE_IMAGE", name: "单图片" },
   { key: "SINGLE_VIDEO", name: "单视频" }
 ]
//  广告形式
const AdsFormat = React.memo(({ handleSubmit, format, dispatch }) => {

  function handleCache(e) {
    let val = e.target.value
    handleSubmit([val]);
  }

  return (
    <div className={style.targeting_con}>
      <span className={style.targeting_label}>广告形式</span>
      {/* eg: ad_formats":[ "SINGLE_IMAGE" ], */}
      <Radio.Group onChange={handleCache} defaultValue={format[0]}>
        {DYNAMIC_DATA.map(d => (
          <Radio key={d.key} value={d.key}>
            {d.name}
          </Radio>
        ))}
      </Radio.Group>
    </div>
  );
});
export default AdsFormat;