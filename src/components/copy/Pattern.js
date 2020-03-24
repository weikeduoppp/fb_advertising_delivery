// 复制的模式
import React from 'react';
import { Radio } from "antd";
import style from './index.less'
const Pattern = ({ pattern, options, onChange }) => {
  return (
    <div className={style.targeting_con}>
      <span className={style.targeting_label}></span>
      <Radio.Group onChange={onChange} defaultValue={pattern}>
        {options.map(d => (
          <Radio key={d.key} value={d.key}>
            {d.name}
          </Radio>
        ))}
      </Radio.Group>
    </div>
  );
};

export default Pattern;
