import React, { useState } from "react";
import Table from "./_Table";
import style from "./index.less";
import TableTop from "components/common/TableTop/TableTop";
import CopyModel from "components/campaign/CopyModel";
import { connect } from 'dva'


const Campaign = React.memo(({ adaccount_id, data, setSearch, defaultCurrent, total, paging, nextOrPrevious, setDefaultCurrent, loading, search, updateTable, campaigns }) => {
  
  // 复制框显示标识
  const [copyModel, setCopyModel] = useState(false);
  return (
    <div className={style.Campaign}>
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
        copy_bool={campaigns.length > 0}
        createDirection="campaign"
      />
      <Table
        data={data}
        loading={loading}
        search={search}
        setCopyModel={setCopyModel}
        updateTable={updateTable}
      />
      <CopyModel
        title="复制广告系列"
        visible={copyModel}
        setVisible={setCopyModel}
        updateTable={updateTable}
      />
    </div>
  );
});


const mapStateToProps = (state, ownProps) => {
  return {
    campaigns: state.global.campaigns
  };
};

export default connect(mapStateToProps)(Campaign);
