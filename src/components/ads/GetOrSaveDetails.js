import React, { useState, useEffect } from "react";
import { connect } from "dva";
import { Select, message, Button, Input } from "antd";
import request from "utils/api";
import { host } from "utils/config";
import style from "./index.less";
import Model from "../common/_Model";
const { Option } = Select;

const GetOrSave = ({ adaccount_id, handleSubmit, model, text, params,params_name }) => {
  const [options, setData] = useState([]);
  // 选择
  const [saveSelect, setSaveSelect] = useState(undefined);
  // model
  const [visible, setVisible] = useState(false);
  const [val, setVal] = useState("");

  // 检索保存的受众
  useEffect(() => {
    let ignore = false;
    if (!visible) {
      request({
        url: `${host}/api/${model}`,
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
    }
    
    return () => {
      ignore = true;
    };
  }, [adaccount_id, model, visible]);

  // 保存受众
  function Save(cb, value) {
    
    request({
      url: `${host}/api/${model}`,
      method: "POST",
      params: {
        name: val || value,
        adaccount_id,
        ...params
      },
      success(res) {
        console.log(res);
        cb && cb(false);
        if (res.status === 1) {
          setVisible(false);
          message.success(`${text}:${val || value},${res.msg}`);
        } else {
          message.warning(res.msg);
        }
      }
    });
  }

  return (
    <div className={style.details_container}>
      <div className={style.detail_item}>
        <p>使用保存的{text}</p>
        <Select
          allowClear
          style={{ width: "50%" }}
          placeholder={`使用保存的${text}`}
          defaultValue={[]}
          onChange={val => {
            console.log(val);
            // 过滤其他属性
            if (val) {
              let {
                _id,
                __v,
                create_time,
                last_update_time,
                adaccount_id,
                name,
                ...params
              } = options.find(d => d._id === val);
              console.log(params);
              handleSubmit(params);
              setSaveSelect(name);
            } else {
              // 清除
              handleSubmit({ title: '', message: '' });
              setSaveSelect(undefined);
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
      <div className={style.detail_item}>
        <p>保存/更新</p>
        <Button
          onClick={() => {
            if (!params[params_name])
              return message.warning(`${params_name} 不能为空`);
            saveSelect ? Save(null, saveSelect) : setVisible(true)
          }
          }
        >
          保存{text}
        </Button>
        <Model
          width={700}
          title={`保存${text}`}
          visible={visible}
          // ok
          handle={setConfirmLoading => {
            Save(setConfirmLoading);
          }}
          // 取消
          handleCancel={() => {
            setVisible(false);
          }}
        >
          <div className={style.targeting_con}>
            <span className={style.targeting_label}>{text}名称</span>
            <Input
              style={{ width: "50%" }}
              placeholder={`输入${text}名称`}
              onChange={e => {
                setVal(e.target.value);
              }}
            />
          </div>
        </Model>
      </div>
    </div>
  );
};
const mapStateToProps = (state, ownProps) => {
  return {
    adaccount_id: state.global.adaccount_id
  };
};

export default connect(mapStateToProps)(GetOrSave);
