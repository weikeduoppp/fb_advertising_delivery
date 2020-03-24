import {useState} from 'react'
import { Modal } from "antd";
// 系列中各种表单
export default ({ title, visible, handle, children, handleCancel, width = 520 }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  function handleOk() {
    setConfirmLoading(true);
    handle(setConfirmLoading);
  }

  return (
    <Modal
      width={width}
      title={title}
      visible={visible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      destroyOnClose={true}
      // maskClosable={false}
    >
      {children}
    </Modal>
  );
};
