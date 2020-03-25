import React from 'react';
import WithPage from "components/common/withPage";
import { connect } from 'dva'
import Ads from './ads'

const adsetManagement = ({ adaccount_id }) => {
  return (
    <WithPage
      WrappedComponent={Ads}
      method="getAds"
      adaccount_id={adaccount_id}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    adaccount_id: state.global.adaccount_id
  };
};

export default connect(mapStateToProps)(adsetManagement);
