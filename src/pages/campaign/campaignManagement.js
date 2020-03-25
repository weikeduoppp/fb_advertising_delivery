import React from 'react';
import WithPage from "components/common/withPage";
import { connect } from 'dva'
import Campaign from './campaign'

const campaignManagement = ({ adaccount_id }) => {
  return (
    <WithPage
      WrappedComponent={Campaign}
      method="getCampaign"
      adaccount_id={adaccount_id}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    adaccount_id: state.global.adaccount_id
  };
};

export default connect(mapStateToProps)(campaignManagement);
