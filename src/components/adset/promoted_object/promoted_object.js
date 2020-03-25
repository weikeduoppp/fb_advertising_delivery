import React from "react";
import { connect } from "dva";
import AppInstalls from "./AppInstalls";
import Conversions from "./Conversions";

// 根据系列选择的目标 展示不同内容
const PromotedObject = React.memo(
  ({ objective, adaccount_id, handleSubmit, edit }) => {
    return (
      <>
        {objective === "APP_INSTALLS" && !edit && (
          <AppInstalls
            adaccount_id={adaccount_id}
            handleSubmit={handleSubmit}
          />
        )}
        {objective === "CONVERSIONS" && (
          <Conversions
            adaccount_id={adaccount_id}
            handleSubmit={handleSubmit}
          />
        )}
      </>
    );
  }
);

const mapStateToProps = (state, ownProps) => {
  return {
    adaccount_id: state.global.adaccount_id
  };
};

export default connect(mapStateToProps)(PromotedObject);
