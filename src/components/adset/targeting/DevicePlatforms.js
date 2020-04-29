import React from "react";
import { Checkbox, Divider } from "antd";
import style  from '../index.less'
const plainOptions = ["mobile", "desktop"];
// 设备
const DevicePlatforms = React.memo(({ handleSubmit, device_platforms }) => {
  return (
    <div className={style.detailTargeting}>
      <Divider orientation="left">版位</Divider>
      <div className={style.targeting_con}>
        <span className={style.targeting_label}>设备</span>
        <Checkbox.Group
          className={style.placements_checkbox}
          options={plainOptions}
          value={device_platforms || plainOptions}
          onChange={val => handleSubmit(val)}
        />
      </div>
    </div>
  );
});

export default DevicePlatforms;
