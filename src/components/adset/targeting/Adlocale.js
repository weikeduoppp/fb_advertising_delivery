import React, { useState, useEffect } from "react";
import { getAdlocale } from "utils/fb_api";
import { Select } from "antd";
import { connect } from "dva";
const { Option } = Select;
const Adlocale = React.memo(({ locale, dispatch, handleSubmit, locales }) => {
  const [options, setData] = useState([]);
  // 语言结果
  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const { data } = await getAdlocale();
      if (!ignore) {
        setData(data);
        dispatch({ type: "global/set_locale", payload: data });
      }
    }
    !locale ? fetchData() : setData(locale);
    return () => {
      ignore = true;
    };
  }, [locale, dispatch]);
  return (
    <div>
      <p>语言</p>
      <Select
        mode="multiple"
        style={{ width: "50%" }}
        placeholder="输入语言"
        defaultValue={locales ? [...locales.map(d => d.toString())] : []}
        onChange={val => handleSubmit(val)}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {options.map((d, i) => (
          <Option key={d.key}>{d.name}</Option>
        ))}
      </Select>
    </div>
  );
});

const mapStateToProps = (state, ownProps) => {
  return {
    locale: state.global.locale
  };
};

export default connect(mapStateToProps)(Adlocale);
