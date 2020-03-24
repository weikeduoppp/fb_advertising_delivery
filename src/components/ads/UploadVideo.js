import React from 'react'
import { connect } from 'umi'
import { Upload, Button, Icon, message } from "antd";
import { uploadVideo } from "utils/fb_api";
// 
// function getBlob(file) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsBinaryString(file);
//     // 去掉字符串中的文件头信息
//     reader.onload = (e) => {
//       //每10M切割一段,这里只做一个切割演示，实际切割需要循环切割，
//       // var slice = e.target.result.slice(0, 10*1024*1024);
//       resolve(e.target.result);
//     }
//     reader.onerror = error => reject(error);
//   });
// }

// 上传素材库
const UploadIamge = React.memo(({ adaccount_id }) => {
  const handleUpload = async (file) => 
  {
    console.log(file);
    var formdata = new FormData();
    formdata.append("source", file);
    formdata.append("name", file.name);
    formdata.append(
      "access_token",
      localStorage.getItem("access_token") ||
        "EAAhFNn6Kjs8BAJfIp8pZCt9LiaJm5TXENTWVhKwuNitXkC5yRrZAlhQG7eM3lz2j3HZBoZADfaNhwJRE1ZCAJilCVbI06li0vsvuqTJ0dZB7pJIOmRqSVPKDYy7poi3V4WZBZAxlP6QBWfZB2F3N3CMwy40Gdq2N1iIZAo8OU8ugRyzCedfouASKDb"
    );
    // 不行
    const res = await uploadVideo(
      adaccount_id,
      JSON.stringify(formdata),
      file.name
    );

    console.log(res);

    // if(res.images) {
    message.success(`${file.name} 上传成功`);
    // }
  };
  
  const props = {
    accept: "video/*",
    beforeUpload: file => {
      handleUpload(file);
      return false;
      
    },
    multiple: true,
    fileList: []
  };

  return (
    <Upload {...props}>
      <Button>
        <Icon type="upload" /> 上传
      </Button>
    </Upload>
  );
});

const mapStateToProps = (state, ownProps) => {
  return {
    adaccount_id: state.global.adaccount_id
  };
}

export default connect(mapStateToProps)(UploadIamge);