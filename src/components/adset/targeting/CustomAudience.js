import React, { useState, useEffect } from "react";
import { getCustomAudience } from "utils/fb_api";
import { connect } from "dva";
import { Select } from "antd";
const { Option } = Select;
const CustomAudience = React.memo(
  ({ adaccount_id, customAudience, dispatch, handleSubmit, customAudienceFormData }) => {
    const [options, setData] = useState([]);
    // 检索自定义受众
    useEffect(() => {
      let ignore = false;
      async function fetchData() {
        const { data } = await getCustomAudience(adaccount_id);
        // 缓存
        if (!ignore) {
          setData(data);
          dispatch({ type: "global/set_customAudience", payload: data });
        }
      }
      // 存在拿缓存, 不存在则请求
      !customAudience ? fetchData() : setData(customAudience);
      return () => {
        ignore = true;
      };
    }, [adaccount_id, customAudience, dispatch]);
    return (
      <div>
        <p>自定义受众</p>
        <Select
          mode="multiple"
          style={{ width: "50%" }}
          placeholder="添加之前创建的自定义受众或类似受众"
          value={
            customAudienceFormData ? customAudienceFormData.map(d => d.id) : []
          }
          onChange={val =>
            handleSubmit(
              options.filter(item => {
                return val.findIndex(id => id === item.id) !== -1;
              })
            )
          }
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          {options.map((d, i) => (
            <Option key={d.id}>{d.name}</Option>
          ))}
        </Select>
      </div>
    );
  }
);

const mapStateToProps = (state, ownProps) => {
  return {
    customAudience: state.global.customAudience,
    adaccount_id: state.global.adaccount_id
  };
};

export default connect(mapStateToProps)(CustomAudience);
