import React from 'react';
import ImageStyle from "./index.less";
// 图片显示组件
const Picture = ({options}) => {
  return (
    <div className={ImageStyle.image_container}>
      <div className={ImageStyle.image_content}>
        {options.map(item => (
          <div
            key={item.hash || item.picture}
            className={ImageStyle.item_container}
          >
            <div className={ImageStyle.item_content}>
              <div className={ImageStyle.item_img_con}>
                <div
                  className={ImageStyle.item_img}
                  style={{
                    backgroundImage: "url(" + item.url_128 + ")"
                  }}
                ></div>
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
  );
}

export default Picture;
