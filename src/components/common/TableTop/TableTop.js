import React from "react";
import { Input, Button, message } from "antd";
import style from "./index.less";
import { history as router } from 'umi';
import { connect } from "dva";
import Pages from "../Paging";
const { Search } = Input;
// 表格顶部相关操作  创建 | 检索 | 复制 | 翻页
const TableTop = React.memo(
  ({
    nextOrPrevious,
    adaccount_id,
    paging,
    setSearch,
    defaultCurrent,
    total,
    setDefaultCurrent,
    loading,
    children,
    setCopyModel,
    copy_bool,
    createDirection,
    dispatch,
    num
  }) => {
    return (
      <div className={style.table_top_container}>
        <div>
          <Button
            onClick={() => {
              if (adaccount_id) {
                dispatch({
                  type: "global/set_createDirection",
                  payload: createDirection
                });
                router.push("/creation");
              } else {
                message.warning("请先选择广告账户 !");
              }
            }}
            icon="plus-square"
            className={style.create_btn}
          >
            创建
          </Button>
          <Button
            onClick={() => {
              setCopyModel(true);
            }}
            icon="copy"
            disabled={!copy_bool}
          >
            复制
          </Button>
          <Search
            placeholder="search text"
            onSearch={value => setSearch(value)}
            style={{ width: 200 }}
            className={style.search_btn}
          />
          {children}
        </div>
        <div>
          {paging && (
            <Pages
              loading={loading}
              paging={paging}
              num={num}
              defaultCurrent={defaultCurrent}
              total={total}
              nextOrPrevious={nextOrPrevious}
              setDefaultCurrent={setDefaultCurrent}
            />
          )}
        </div>
      </div>
    );
  }
);
export default connect()(TableTop);
