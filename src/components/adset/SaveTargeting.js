import { Button, Input, message } from "antd";
import { memo, useState} from "react";
import style from "./index.less";
import Model from "../common/_Model";
import request from 'utils/api'
import { host } from 'utils/config'
import { connect } from "dva";


const SaveTargeting = memo(({ adaccount_id, targeting, saveSelect }) => {
  const [visible, setVisible] = useState(false);
  const [val, setVal] = useState("");
  // 保存受众
  function Save(cb, value) {
    request({
      url: `${host}/api/targeting`,
      method: "POST",
      params: {
        name: val || value,
        adaccount_id,
        ...targeting
      },
      success(res) {
        console.log(res);
        cb && cb(false);
        if (res.status === 1) {
          setVisible(false);
          message.success(`受众:${val || value},${res.msg}`);
        } else {
          message.warning(res.msg);
        }
      }
    });
  }

  return (
    <div className={style.targeting_con}>
      <Button
        onClick={() => (saveSelect ? Save(null, saveSelect) : setVisible(true))}
      >
        保存受众
      </Button>
      <Model
        width={700}
        title={"保存受众"}
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
          <span className={style.targeting_label}>受众名称</span>
          <Input
            style={{ width: "50%" }}
            placeholder="输入受众名称"
            onChange={e => {
              setVal(e.target.value);
            }}
          />
        </div>
      </Model>
    </div>
  );
});

export default connect(({ global }) => ({
  adaccount_id: global.adaccount_id
}))(SaveTargeting);
