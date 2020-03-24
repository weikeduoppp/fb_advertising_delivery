import React from 'react';
import style from "./index.less";
// 多选图片选择组件
const MultiplePicture = ({options, toSelect, select, num}) => {
  return options.map(item => (
    <div key={item.hash} className={style.item_container}>
      <div className={style.item_content} onClick={toSelect.bind(null, item)}>
        <div
          className={
            select.findIndex(d => d.hash === item.hash) !== -1
              ? `${style.item_img_con} ${style.active}`
              : style.item_img_con
          }
        >
          <div
            className={style.item_img}
            style={{ backgroundImage: "url(" + item.url_128 + ")" }}
          >
            {num > 1 && select.findIndex(d => d.hash === item.hash) !== -1 && (
              <i className={style.item_img_number}>
                {select.findIndex(d => d.hash === item.hash) + 1}
              </i>
            )}
          </div>
        </div>
        <div className={style.item_name + " text_ellipsis"}>{item.name || `untitled`}</div>
        <div className={style.item_wh}>{`${item.width} ⨯ ${item.height}`}</div>
      </div>
    </div>
  ));
};

export default MultiplePicture;
