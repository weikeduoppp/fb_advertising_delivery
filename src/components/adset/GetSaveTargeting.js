import React, { useState, useEffect } from "react";
import { connect } from "dva";
import { Select, message } from "antd";
import request from "utils/api";
import { host } from "utils/config";
const { Option } = Select;

const GetSaveTargeting = React.memo(
  ({ adaccount_id, handleSubmit, setSaveSelect, initailTargeting }) => {
    const [options, setData] = useState([]);
    // 检索保存的受众
    useEffect(() => {
      let ignore = false;
      request({
        url: `${host}/api/targeting`,
        method: "GET",
        params: {
          adaccount_id
        },
        success(res) {
          if (res.status === 1 && !ignore) {
            setData(res.data);
          } else {
            message.warning(res.msg);
          }
        }
      });
      return () => {
        ignore = true;
      };
    }, [adaccount_id]);
    return (
      <div>
        <p>使用保存的受众</p>
        <Select
          allowClear
          style={{ width: "50%" }}
          placeholder="使用保存的受众"
          defaultValue={[]}
          onChange={val => {
            console.log(val);
            // 过滤其他属性
            if (val) {
              let {
                _id,
                __v,
                name,
                create_time,
                last_update_time,
                adaccount_id,
                ...targeting
              } = options.find(d => d._id === val);
              console.log(targeting);
              handleSubmit(targeting);
              setSaveSelect(name);
            } else {
              handleSubmit(initailTargeting);
              setSaveSelect(val);
            }
          }}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          {options.map((d, i) => (
            <Option key={d._id}>{d.name}</Option>
          ))}
        </Select>
      </div>
    );
  }
);

const mapStateToProps = (state, ownProps) => {
  return {
    adaccount_id: state.global.adaccount_id
  };
};

export default connect(mapStateToProps)(GetSaveTargeting);
