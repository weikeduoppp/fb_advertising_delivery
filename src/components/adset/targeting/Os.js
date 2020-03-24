import React, { useState, useEffect } from "react";
import { Checkbox, Select } from "antd";
import { getPublisherPlatforms } from "utils/fb_api";
import style  from '../index.less'
import { connect } from 'umi'
const { Option } = Select;
const plainOptions = ["iOS", "Android"];
// 数据格式
let commonData = {
  "iOS": [],
  "Android": []
}
// os: iOS_ver_ | Android_ver_
function aboveOrTo(str, os) {
  // _and_above
  if(str.indexOf('_and_above') !== -1) {
    let arr = str.replace(os, '').replace('_and_above', '').split(' ')
    arr.push(undefined)
    return arr;
  } else {
    return str.replace(os, '').replace('_to_', ',').split(',')
  }
}
function handleEdit(user_os) {
  // 处理编辑时的情况
  if (user_os.length === 1 && user_os[0].indexOf("_ver_") !== -1) {
    let os_str = user_os[0];
    // iOS
    if (os_str.indexOf("iOS") !== -1) {
      return [["iOS"], ...aboveOrTo(os_str, "iOS_ver_")];
    } else {
      return [["Android"], ...aboveOrTo(os_str, "Android_ver_")];
    }

  } else {
    return [user_os, undefined, undefined];
  }
}
// 移动设备  编辑时 user_os可能是["iOS_ver_4.0_and_above"] ['Android_ver_4.2_and_above'] ['iOS_ver_8.0_to_9.0']
const DevicePlatforms = React.memo(
  ({ os_cache, dispatch, handleSubmit, user_os, wireless_carrier, user_device }) => {
    let [defaultOS, defaultMin, defaultMax] = handleEdit(
      user_os || plainOptions
    );
    const [OS, setOS] = useState(defaultOS || []);
    // 设备的版本号
    const [edition, setEdition] = useState(commonData);
    // 对应设备
    const [device, setDevice] = useState(commonData);
    // 版本号的最值
    const [min, setMin] = useState(defaultMin);
    const [max, setMax] = useState(defaultMax);

    // 处理版本号数据
    function handleEditionData(data) {
      let arr = data.filter(item => plainOptions.indexOf(item.platform) !== -1);
      setEdition({
        // "description": "0.5;1.0;1.1;1.5"
        Android: arr.find(d => d.platform === "Android").description.split(";"),
        iOS: arr.find(d => d.platform === "iOS").description.split(";")
      });
    }
    // 处理所有设备
    function handleDeviceData(data) {
      /* 
        { "name": "iPad", "description": "iPads (all)", "platform": "iOS", "audience_size": 89000000, "type": "user_device" }
       */
      setDevice({
        Android: data.filter(item => item.platform === "Android"),
        iOS: data.filter(item => item.platform === "iOS")
      });
    }

    // 获取相关数据
    useEffect(() => {
      let ignore = false;
      async function fetchData() {
        const res = await getPublisherPlatforms();
        if (!ignore) {
          let Edition = JSON.parse(res[0].body).data;
          let Device = JSON.parse(res[1].body).data;
          handleEditionData(Edition);
          handleDeviceData(Device);
          dispatch({
            type: "global/set_os_cache",
            payload: {
              Edition,
              Device
            }
          });
        }
      }
      if (!os_cache) {
        fetchData();
      } else {
        handleEditionData(os_cache.Edition);
        handleDeviceData(os_cache.Device);
      }
      return () => {
        ignore = true;
      };
    }, [os_cache, dispatch]);

    // 选中版本号
    function handleEditionMin(val) {
      console.log(min, max);
      if (max === undefined) {
        handleSubmit({
          // iOS_ver_4.0_and_above
          user_os: [`${OS[0]}_ver_${val}_and_above`]
        });
      }
      setMin(val);
    }
    function handleEditionMax(val) {
      console.log(min, max);
      if (min !== undefined) {
        handleSubmit({
          // iOS_ver_8.0_to_9.0
          user_os: [`${OS[0]}_ver_${min}_to_${val}`]
        });
      }
      setMax(val);
    }

    // 仅在连接 Wi-Fi 时
    function onChange(e) {
      e.target.checked
        ? handleSubmit({
            wireless_carrier: ["Wifi"]
          })
        : handleSubmit({ wireless_carrier: [] });
    }

    return (
      <>
        <div className={style.targeting_con}>
          <span className={style.targeting_label}>移动设备(全选或两选一)</span>
          <Checkbox.Group
            className={style.placements_checkbox}
            options={plainOptions}
            defaultValue={OS}
            onChange={val => {
              handleSubmit({
                user_os: val
              });
              // 清除之前设置过操作系统版本号
              if (val.length === 1 && val[0] !== OS[0]) {
                setMin(undefined);
                setMax(undefined);
              }
              setOS(val);
              // 清除包含设备
              if (val.length === 2) handleSubmit({ user_device: [] });
            }}
          />
        </div>
        {OS.length === 1 && (
          <>
            <div className={style.targeting_con}>
              <p>包含的设备</p>
              <Select
                mode="multiple"
                style={{ width: "50%" }}
                placeholder="输入设备"
                defaultValue={user_device || []}
                onChange={val => handleSubmit({ user_device: val })}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {device[OS].map((d, i) => (
                  <Option key={d.name}>{d.description}</Option>
                ))}
              </Select>
            </div>
            <div className={style.targeting_con}>
              <span className={style.targeting_label}>操作系统版本</span>
              <Select
                defaultValue={min || "无"}
                style={{ width: 80 }}
                onChange={handleEditionMin}
              >
                {edition[OS].map(item => (
                  <Option
                    key={item + "min"}
                    value={item}
                    // 小数比较 -> 整数比较
                    disabled={item * 10 >= max * 10 ? true : false}
                  >
                    {item}
                  </Option>
                ))}
              </Select>
              <span> - </span>
              <Select
                defaultValue={max || "无"}
                style={{ width: 80 }}
                onChange={handleEditionMax}
              >
                {edition[OS].map(item => (
                  <Option
                    key={item + "max"}
                    value={item}
                    disabled={item * 10 <= min * 10 ? true : false}
                  >
                    {item}
                  </Option>
                ))}
              </Select>
            </div>
            <div className={style.targeting_con}>
              <Checkbox
                defaultChecked={wireless_carrier && wireless_carrier.length}
                onChange={onChange}
              >
                仅在连接 Wi-Fi 时
              </Checkbox>
            </div>
          </>
        )}
      </>
    );
  }
);

const mapStateToProps = (state, ownProps) => {
  return {
    os_cache: state.global.os_cache
  };
}

export default connect(mapStateToProps)(DevicePlatforms);
