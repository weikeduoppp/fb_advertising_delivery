import React, { useState } from "react";
import Table from "./_Table";
import style from "./index.less";
import { Icon } from "antd";
import { connect } from "dva";
import TableTop from "components/common/TableTop/TableTop";
import CopyModel from "components/adset/CopyModel";

const Adset = React.memo(
  ({ campaigns_select_length, dispatch, adaccount_id, data, setSearch, defaultCurrent, total, paging, nextOrPrevious, setDefaultCurrent, loading, search, updateTable, adsets }) => {
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
          nextOrPrevious={nextOrPrevious}
          setDefaultCurrent={setDefaultCurrent}
          setCopyModel={setCopyModel}
          copy_bool={adsets.length > 0}
          createDirection="adsets"
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
        </TableTop>

        <Table
          data={data}
          loading={loading}
          search={search}
          updateTable={updateTable}
          setCopyModel={setCopyModel}
        />
        <CopyModel
          title="把广告组复制到"
          visible={copyModel}
          setVisible={setCopyModel}
          updateTable={updateTable}
        />
      </div>
    );
  }
);

const mapStateToProps = (state, ownProps) => {
  return {
    // 选中几项广告系列
    campaigns_select_length: state.global.campaigns.map(item => item.id).length,
    adsets: state.global.adsets
  };
};

export default connect(mapStateToProps)(Adset);
