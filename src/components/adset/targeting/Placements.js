import { Checkbox } from "antd";
import { memo } from "react";
import style from '../index.less'


const plainOptions = ["facebook", "audience_network", "instagram", "messenger"];
export default memo(({ handleSubmit, publisher_platforms }) => {
  return (
    
    <div className={style.targeting_con}>
        <span className={style.targeting_label}>平台</span>
        <Checkbox.Group
          className={style.placements_checkbox}
          options={plainOptions}
          defaultValue={publisher_platforms || plainOptions}
          onChange={val => handleSubmit(val)}
        />
      </div>
  );
});
