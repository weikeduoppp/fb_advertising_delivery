import React from 'react';
import { Input, Row, Col, Icon } from "antd";
import style from "./index.less";
const DynamicMore = ({ options, type, dispatch, placeholder }) => {
  // 添加其他版本
  function AddText(target) {
    let arr = target.slice();
    arr.push({ text: "" });
    dispatch({ type, payload: arr });
  }
  // 删除其他版本
  function delText(target, i) {
    let arr = target;
    arr.splice(i, 1);
    dispatch({ type, payload: arr });
  }
  return (
    <div>
      <Row gutter={8}>
        {options.map((d, i) => (
          <div key={`${options}_${i}`}>
            <Col span={14} className={style.DynamicDetail_input}>
              <Input.TextArea
                autoSize
                defaultValue={d.text || undefined}
                placeholder={placeholder}
                onChange={e => {
                  // 修改正文
                  let arr = options.slice();
                  arr[i].text = e.target.value;
                  dispatch({ type, payload: arr });
                }}
              />
            </Col>
            {i > 0 && (
              <Col span={2} className={style.DynamicDetail_close_con}>
                <Icon
                  type="close"
                  className={style.DynamicDetail_close}
                  onClick={() => delText(options.slice(), i)}
                />
              </Col>
            )}
          </div>
        ))}
      </Row>
      {options.length < 5 && (
        <Row className={style.DynamicDetail_icon_container}>
          <Col span={8}>
            <span
              className={style.DynamicDetail_icon_con}
              onClick={() => AddText(options)}
            >
              <Icon type="plus-circle" className={style.DynamicDetail_icon} />
              <span>添加其他版本</span>
            </span>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default DynamicMore;
