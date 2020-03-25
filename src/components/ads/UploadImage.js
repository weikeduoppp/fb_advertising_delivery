import React, { useState } from 'react'
import { connect } from 'dva'
import { Upload, Button, Icon, message, Spin } from "antd";
import { UploadImage } from "utils/fb_api";

// 图片转base64
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file, "UTF-8");
    // 去掉字符串中的文件头信息
    reader.onload = () => resolve(reader.result.substring(
      reader.result.indexOf(",") + 1,
      reader.result.length
    ));
    reader.onerror = error => reject(error);
  });
}

// 上传素材库
const UploadImageCon = React.memo(({ adaccount_id, fetchData }) => {
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(null);
  const handleUpload = async file => {
    if(timer) clearTimeout(timer);
    setLoading(true)
    const base64 = await getBase64(file);

    const res = await UploadImage(adaccount_id, base64, file.name);

    if (res.images) {
      message.success(`${file.name} 上传成功`);
      setTimer(setTimeout(() => {
        setLoading(false);
        fetchData();
      }, 500));
    }
  };

  const props = {
    accept: "image/*",
    beforeUpload: file => {
      handleUpload(file);
      return false;
    },
    multiple: true,
    fileList: []
  };

  return (
    <span style={{display: 'inline-block'}}>
      <Spin spinning={loading} delay={500}>
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> 上传
          </Button>
        </Upload>
      </Spin>
    </span>
  );
});

const mapStateToProps = (state, ownProps) => {
  return {
    adaccount_id: state.global.adaccount_id
  };
}

export default connect(mapStateToProps)(UploadImageCon);