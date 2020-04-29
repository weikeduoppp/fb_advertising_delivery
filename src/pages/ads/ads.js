import React, { useState } from "react";
import Table from "./_Table";
import style from "../adset/index.less";
import { Icon } from "antd";
import { connect } from "dva";
import TableTop from "components/common/TableTop/TableTop";
import CopyModel from "components/ads/CopyModel";

const Adset = React.memo(({ adaccount_id, campaigns_select_length, adset_select_length,  dispatch, data, setSearch, defaultCurrent, total, paging, nextOrPrevious, setDefaultCurrent, loading, search, updateTable, ads }) => {
  
  // 复制框显示标识
  const [copyModel, setCopyModel] = useState(false);
  
  return (
    <div className={style.adset}>
      <TableTop
        adaccount_id={adaccount_id}
        setSearch={setSearch}
        defaultCurrent={defaultCurrent}
        total={total}
        paging={paging}
        loading={loading}
        num={50}
        nextOrPrevious={nextOrPrevious}
        setDefaultCurrent={setDefaultCurrent}
        setCopyModel={setCopyModel}
        copy_bool={ads.length > 0}
        createDirection="ads"
      >
        {campaigns_select_length > 0 && (
          <span
            className={style.select_close}
            onClick={() =>
              dispatch({ type: "global/set_campaigns", payload: [] })
            }
          >
            已选中{campaigns_select_length}项广告系列{" "}
            <Icon type="close-circle" />
          </span>
        )}
        {adset_select_length > 0 && (
          <span
            className={style.select_close}
            onClick={() => dispatch({ type: "global/set_adsets", payload: [] })}
          >
            已选中{adset_select_length}项广告组 <Icon type="close-circle" />
          </span>
        )}
      </TableTop>
      <Table
        data={data}
        loading={loading}
        search={search}
        setCopyModel={setCopyModel}
        updateTable={updateTable}
      />
      <CopyModel
        title="把广告复制到"
        visible={copyModel}
        setVisible={setCopyModel}
        updateTable={updateTable}
      />
    </div>
  );
});

const mapStateToProps = (state, ownProps) => {
  return {
    adset_select_length: state.global.adsets.map(item => item.id).length,
    // 选中几项广告系列
    campaigns_select_length: state.global.campaigns.map(item => item.id).length,
    ads: state.global.ads
  };
};

export default connect(mapStateToProps)(Adset);
