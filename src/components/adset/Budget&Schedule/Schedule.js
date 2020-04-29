import { Radio, DatePicker } from "antd";
import { memo, useState } from "react";
import style from "../index.less";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

// 禁用时间表
// eslint-disable-next-line  
function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

export default memo(({ start_time, end_time, handleSubmit }) => {
  // now: 不设定结束日期，长期投放 set: 设定结束日期
  const [time, setTime] = useState(end_time ? "set" : "now");
  // 提交
  function onChange(value, dateString) {
    // 毫秒转秒
    handleSubmit(
      parseInt(value[0].valueOf()),
      parseInt(value[1].valueOf())
    );
  }

  function onOk(value) {
    console.log("onOk: ", value);
  }

  function disabledDate(current) {
    // Can not select days before today and today
    return current && current < new Date(Date.now() - 24 * 60 * 60 * 1000);
  }

  // ok 失效 不使用.
  // function disabledRangeTime(_, type) {
  //   return {
  //     disabledHours: () => range(0, 60).splice(0, 23),
  //     disabledMinutes: () => range(0, 60)
  //   };
  // }
  return (
    <>
      <div className={style.targeting_con}>
        <span className={style.targeting_label}>排期</span>
        <Radio.Group
          onChange={e => {
            setTime(e.target.value);
            if (e.target.value === "now") {
              let time = start_time ? new Date(start_time).valueOf(): Date.now();
              handleSubmit(time, 0);
            }
          }}
          defaultValue={time}
          buttonStyle="solid"
        >
          <Radio.Button value="now">
            {start_time ? "不设定结束日期，长期投放" : "从今天开始长期投放"}
          </Radio.Button>
          <Radio.Button value="set">设置开始和结束日期</Radio.Button>
        </Radio.Group>
      </div>
      {time === "now" && (
        <div className={style.targeting_con}>
          <span className={style.targeting_label}>开始日期</span>
          <span>{dayjs(start_time).format("YYYY-MM-DD HH:mm")}</span>
        </div>
      )}
      {time === "set" && (
        <div className={style.targeting_con}>
          <RangePicker
            defaultValue={
              end_time ? [dayjs(start_time), dayjs(end_time)] : undefined
            }
            showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD HH:mm"
            disabledDate={disabledDate}
            // disabledTime={disabledRangeTime}
            placeholder={["Start Time", "End Time"]}
            onChange={onChange}
            onOk={onOk}
          />
        </div>
      )}
    </>
  );
});
