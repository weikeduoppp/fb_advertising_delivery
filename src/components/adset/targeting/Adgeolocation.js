import React, { useState, useEffect } from "react";
import { getAdgeolocation, getCountryGroup } from "utils/fb_api";
import { connect } from "dva";
import { Select } from "antd";
import style from '../index.less'
const { Option } = Select;
const Adgeolocation = React.memo(
  ({ geolocation, dispatch, handleSubmit, countries, country_groups, country_group }) => {
    const [options, setData] = useState([]);
    const [CountryGroup, setCountryGroup] = useState([]);
    // 检索地区结果 && 检索更广泛的地理区域
    useEffect(() => {
      let ignore = false;
      async function fetchData() {
        const { data } = await getAdgeolocation();
        const { data: CountryGroups } = await getCountryGroup();
        // 缓存
        if (!ignore) {
          let CountryGroupData = CountryGroups.map(d => ({ key: d.key, name: d.name }))
          setData(data);
          setCountryGroup(CountryGroupData);
          dispatch({ type: "global/set_geolocation", payload: data });
          dispatch({
            type: "global/set_country_group",
            payload: CountryGroupData
          });
        }
      }
      // 存在拿缓存, 不存在则请求
      if (!geolocation) {
        fetchData(); 
      }else {
        setData(geolocation)
        setCountryGroup(country_group);
      }
      return () => {
        ignore = true;
      };
    }, [geolocation, country_group, dispatch]);

   
    return (
      <div className={style.location_contianer}>
        <div className={style.location_item}>
          <p>地区</p>
          <Select
            mode="multiple"
            style={{ width: "80%" }}
            placeholder="输入国家/地区"
            defaultValue={countries ? [...countries] : []}
            onChange={val => {
              handleSubmit({
                countries: val,
                country_groups
              });
            }}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {options &&
              options.map((d, i) => <Option key={d.key}>{d.name}</Option>)}
          </Select>
        </div>
        <div className={style.location_item}>
          <p>更广泛的地理区域</p>
          <Select
            mode="multiple"
            style={{ width: "80%" }}
            placeholder="全球,欧洲或北美洲"
            defaultValue={country_groups ? [...country_groups] : []}
            onChange={val => {
              handleSubmit({
                countries,
                country_groups: val
              });
            }}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {CountryGroup &&
              CountryGroup.map((d, i) => <Option key={d.key}>{d.name}</Option>)}
          </Select>
        </div>
      </div>
    );
  }
);

const mapStateToProps = (state, ownProps) => {
  return {
    geolocation: state.global.geolocation,
    country_group: state.global.country_group
  };
};

export default connect(mapStateToProps)(Adgeolocation);
