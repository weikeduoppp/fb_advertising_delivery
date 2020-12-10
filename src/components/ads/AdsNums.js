import style from './index.less'
import { Input } from "antd";
export default ({ state, dispatch }) => {
  return (
    <>
      <div className={style.other_ads_num}>
        <label>广告系列数量</label>
        <Input
          className={style.other_ads_num_input}
          placeholder="广告系列数量"
          defaultValue={state.campaign_num}
          type="number"
          onChange={e => {
            dispatch({ type: "campaign_num", payload: e.target.value });
          }}
        />
      </div>
      <div className={style.other_ads_num}>
        <label>广告组数量</label>
        <Input
          className={style.other_ads_num_input}
          placeholder="广告数量"
          defaultValue={state.adset_num}
          type="number"
          onChange={e => {
            dispatch({ type: "adset_num", payload: e.target.value });
          }}
        />
      </div>
      <div className={style.other_ads_num}>
        <label>广告数量</label>
        <Input
          className={style.other_ads_num_input}
          placeholder="广告数量"
          defaultValue={state.ads_num}
          type="number"
          onChange={e => {
            dispatch({ type: "ads_num", payload: e.target.value });
          }}
        />
      </div>
    </>
  );
};