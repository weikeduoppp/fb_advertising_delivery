import React, { useState, useEffect } from "react";
import { getPixelId } from "utils/fb_api";
import style from "./index.less";
import { connect } from 'dva'
import CustomEventType from './CustomEventType'

// 根据系列选择的目标 展示不同内容
const Conversions = React.memo(({ pixcel_id, dispatch, adaccount_id, handleSubmit }) => {
  const [pixcel, setPixcel] = useState();
  // 应用商店查询结果
  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const { data } = await getPixelId(adaccount_id);
      if (!ignore) {
        setPixcel(data[0]);
        dispatch({ type: "global/set_pixcel_id", payload: data[0] });
      }
    }
    if (adaccount_id) {
      !pixcel_id ? fetchData() : setPixcel(pixcel_id);
    }
    return () => {
      ignore = true;
    };
  }, [adaccount_id, pixcel_id, dispatch]);

  function onChange(val) {
    if (pixcel.id) {
      handleSubmit({
        pixel_id: pixcel.id,
        custom_event_type: val
      });
    }
  }

  return (
    <>
      <div className={style.targeting_con}>
        <span className={style.targeting_label}>Pixel</span>
        {pixcel ? (
          <span>{`${pixcel.name}(${pixcel.id})`}</span>
        ) : (
          <a
            href="https://www.facebook.com/events_manager/?act=440084046714089"
            rel="noopener norefferrer"
            // eslint-disable-next-line react/jsx-no-target-blank
            target="_blank"
          >
            请先为该账户创建 Pixel 像素代码
          </a>
        )}
      </div>
      {pixcel && <CustomEventType onChange={onChange} />}
    </>
  );
});

const mapStateToProps = (state, ownProps) => {
  return {
    pixcel_id: state.global.pixcel_id
  }
}

export default connect(mapStateToProps)(Conversions);
