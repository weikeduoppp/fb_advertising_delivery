import React from 'react';
import Model from '../common/_Model'
import AppInstalls from "../adset/promoted_object/AppInstalls";
import Pages from "../ads/Pages";
const AppModel = ({ adaccount_id, title, visible, setVisible, children, toCreate, handleSubmit, handlePages }) => {
  return (
    <Model
      title={title}
      visible={visible}
      handle={setConfirmLoading => {
        // 是否选择了应用
        toCreate(setConfirmLoading);
      }}
      handleCancel={() => {
        setVisible(false);
      }}
    >
      <>
        <Pages handleSubmit={handlePages} />
        <AppInstalls adaccount_id={adaccount_id} handleSubmit={handleSubmit} />
      </>
    </Model>
  );
};

export default AppModel;
