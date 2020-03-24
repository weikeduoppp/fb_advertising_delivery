import React from 'react';
import style from "./index.less";
import { Input } from "antd";

const CopyNum = ({ label, setNum }) => {
  return (
    <div className={style.targeting_con}>
      <span className={style.targeting_label}>{label}</span>
      <Input
        style={{ width: "100px" }}
        type="number"
        name="daily_budget"
        defaultValue={1}
        onChange={e => setNum(e.target.value)}
      />
    </div>
  );
};

export default CopyNum;
