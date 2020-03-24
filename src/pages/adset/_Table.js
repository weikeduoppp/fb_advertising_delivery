import { useState } from "react";
import style from "./index.less";
import { Divider } from "antd";
import Table from "components/common/_Table";
import Edit from "./edit";
import { connect } from "dva";
import router from "umi/router";
import * as CampaignContant from "pages/campaign/constant";

const TableComponent = ({
  selectKeys,
  data,
  search,
  loading,
  updateTable,
  dispatch,
  campaigns_select,
  setCopyModel
}) => {
  // 过滤设计以外的营销目标
  const dataSource = data.filter(
    item => CampaignContant.objective.indexOf(item.campaign.objective) !== -1
  );
  // model标识
  const [visible, setVisible] = useState(false);
  const [adset_id, setAdsetId] = useState(null);
  const [initailState, setInitailState] = useState(null);
  // 记录编辑的系列目标
  const [campaignData, setCampaignData] = useState(null);
  // 表格列标题
  const columns = [
    {
      title: "广告组名称",
      dataIndex: "name",
      render: (text, record) => (
        <span
          className={style._a}
          onClick={e => {
            dispatch({ type: "global/set_adsets", payload: [record] });
            router.push("/ad");
          }}
        >
          {text}
        </span>
      )
    },
    {
      title: "营销目标",
      dataIndex: "objective",
      render: (text, record) => <span>{record.campaign.objective}</span>
    },
    {
      title: "投放状态",
      dataIndex: "status",
      sorter: (a, b) => a.status.toString().localeCompare(b.status),
      render: text => text
    },
    {
      title: "操作",
      key: "action",
      width: "15%",
      render: (text, record) => (
        <span>
          <span
            className={style._a}
            onClick={e => {
              // console.log(record);
              setAdsetId(record.id);
              const { campaign, ...other } = record;
              // 赋值的时候 / 100;
              if (other.daily_budget)
                other.daily_budget = other.daily_budget / 100;
              if (other.bid_amount) other.bid_amount = other.bid_amount / 100;
              setCampaignData(campaign);
              setInitailState({
                ...other
              });
              setVisible(true);
            }}
          >
            编辑
          </span>
          <Divider type="vertical" />
          <span
            className={style._a}
            onClick={e => {
              dispatch({ type: "global/set_adsets", payload: [record] });
              setCopyModel(true);
            }}
          >
            复制
          </span>
        </span>
      )
    }
  ];
  // 表格参数
  const params = {
    bordered: true,
    // loading: false,
    // 扩展下拉
    // expandedRowRender,
    rowSelection: {
      onChange(key, row) {
        // 记录选中的广告组
        console.log(key, row);
        dispatch({ type: "global/set_adsets", payload: row });
      },
      // 指定选中的行
      selectedRowKeys: selectKeys
    },
    pagination: {
      defaultPageSize: 200,
      showQuickJumper: true
    },
    scroll: data.length > 20 ? { y: "calc(100vh - 343px)" } : undefined
  };

  return (
    <>
      <Table
        params={params}
        dataSource={
          campaigns_select.length
            ? dataSource.filter(
                item => campaigns_select.indexOf(item.campaign_id) !== -1
              )
            : dataSource
        }
        columns={columns}
        loading={loading}
        search={search}
      />
      {initailState ? (
        <Edit
          campaignData={campaignData}
          title="编辑广告组"
          visible={visible}
          setVisible={setVisible}
          updateTable={updateTable}
          adset_id={adset_id}
          initailState={initailState}
          edit={true}
        ></Edit>
      ) : (
        ""
      )}
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    // 表格选中
    selectKeys: state.global.adsets.map(item => item.key),

    // 选中的广告系列
    campaigns_select: state.global.campaigns.map(item => item.id)
  };
};

export default connect(mapStateToProps)(TableComponent);
