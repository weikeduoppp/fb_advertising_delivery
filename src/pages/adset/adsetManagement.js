import React from 'react';
import WithPage from "components/common/withPage";
import { connect } from 'umi'
import Adset from './adset'

const adsetManagement = ({ adaccount_id }) => {
  return (
    <WithPage
      WrappedComponent={Adset}
      method="getAdset"
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
