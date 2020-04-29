import React, { useState } from "react";
import { connect, fetch } from "dva";
import { Upload, Button, Icon, message, notification, Spin } from "antd";
import { version } from "../../utils/config";

function videoUrl(adaccount_id) {
  return `https://graph-video.facebook.com/${version}/${adaccount_id}/advideos`;
}
const access_token = localStorage.getItem("access_token")

function err(error) {
  notification.warning({
    message: "上传失败",
    description: error,
    duration: null
  });
}

// 封装fetch
function request({id, body, success, fail}) {
  fetch(videoUrl(id), {
    method: "POST",
    body
  })
    .then(res => res.json())
    .then(res => {
      success && success(res);
    })
    .catch(error => {
      fail && fail(error);
      err(error);
    });
}

// import { uploadVideo } from "utils/fb_api";
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
const UploadVideo = React.memo(({ adaccount_id, fetchData, dispatch }) => {
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(null);

  // 成功上传返回
  function successUpload(res, file) {
    if (res) {
      message.success(`${file.name} 上传成功`);
      setLoading(false);
      setTimer(
        setTimeout(() => {
          setLoading(false);
          dispatch({
            type: "global/set_advideos_cache",
            payload: null
          });
        }, 500)
      );
    }
  }

  // 不分段上传
  const simpleUpload = async file => {
    // 加载.
    if (timer) clearTimeout(timer);
    setLoading(true);
    var formdata = new FormData();
    formdata.append("source", file);
    formdata.append("name", file.name);
    formdata.append("access_token", access_token);
    // 视频必须发布到 graph-video.facebook.com，而不是常规的图谱 API 网址 (graph.facebook.com)。
    request({
      id: adaccount_id,
      body: formdata,
      success(res) {
        successUpload(res, file);
      }
    });
  };

  // 分片上传: 开启上传会话    eg: https://developers.facebook.com/docs/marketing-api/advideo/v6.0
  function MultipartUpload(file) {
    if (timer) clearTimeout(timer);
    setLoading(true);
    var formdata = new FormData();
    formdata.append("upload_phase", "start");
    formdata.append("file_size", file.size);
    formdata.append("access_token", access_token);
    // 视频必须发布到 graph-video.facebook.com，而不是常规的图谱 API 网址 (graph.facebook.com)。
    request({
      id: adaccount_id,
      body: formdata,
      success(res) {
        console.log(res);
        fetchUpload({
          ...res,
          chunk: file.slice(res.start_offset, res.end_offset),
          file
        });
      }
    });
  }

  // 上传流程
  function fetchUpload({
    upload_session_id,
    start_offset,
    end_offset,
    chunk,
    file
  }) {
    var formdata = new FormData();
    formdata.append("upload_phase", "transfer");
    formdata.append("upload_session_id", upload_session_id);
    formdata.append("start_offset", start_offset);
    formdata.append("video_file_chunk", chunk);
    formdata.append("access_token", access_token);
    request({
      id: adaccount_id,
      body: formdata,
      success(res) {
        if (res.start_offset < res.end_offset) {
          fetchUpload({
            ...res,
            chunk: file.slice(res.start_offset, res.end_offset),
            upload_session_id,
            file
          });
        } else {
          uploadEnd({ upload_session_id, file });
        }
      }
    });
  }

  // 结束上传会话
  function uploadEnd({ upload_session_id, file }) {
    var formdata = new FormData();
    formdata.append("upload_phase", "finish");
    formdata.append("upload_session_id", upload_session_id);
    formdata.append("title", file.name);
    formdata.append("access_token", access_token);
    request({
      id: adaccount_id,
      body: formdata,
      success(res) {
        console.log(res);
        successUpload(res, file);
      }
    });
  }

  const props = {
    accept: "video/*",
    beforeUpload: file => {
      // 小于10M 简单上传
      file.size > 10 * 1024 * 1024 ? MultipartUpload(file) : simpleUpload(file);
      return false;
    },
    multiple: true,
    fileList: []
  };

  return (
    <span style={{ display: "inline-block" }}>
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
};

export default connect(mapStateToProps)(UploadVideo);
