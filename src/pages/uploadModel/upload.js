import React, { useEffect, useState } from "react";
import { connect } from "dva";
import UploadVideo from "components/ads/UploadVideo";
import UploadImage from "components/ads/UploadImage";
import { Button, message } from "antd";
import router from "umi/router";
import { getVideoInfo } from "utils/fb_api";
import style from "./index.less";
export async function resetVideoInfo(video_ids, img_urls, select) {
  if (img_urls.length && img_urls.length === video_ids.length) {
    return video_ids.map(({ id, name }, i) => ({
      video_id: id,
      name,
      image_url: select.length ? select[i] : img_urls[i].url
    }));
  } else {
    let images_urls = [];
    await Promise.all(
      video_ids.map(async ({ id, name }) => {
        const res = await getVideoInfo(id);
        images_urls.push({
          video_id: res.id,
          name,
          image_url: res?.thumbnails?.data[0]?.uri || res.picture
        });
      })
    );
    return images_urls;
  }
  
}

const Upload = ({ adaccount_id, video_ids, setVideoIds }) => {
  const [img_urls, setImg_urls] = useState([]);
  const [select, setSelect] = useState([]);
  // 获取缓存
  useEffect(() => {
    let ids = JSON.parse(localStorage.getItem("video_ids"));
    if (ids?.length) {
      setVideoIds(ids);
    }
    return () => {};
  }, [setVideoIds]);

  const handleUpload = async () => {
    if (adaccount_id && video_ids?.length) {
      router.push("/creation");
      setVideoIds(await resetVideoInfo(video_ids, img_urls, select));
    } else {
      message.warning("请先选择广告账户或上传视频 !");
    }
  };

  const toSelect = item => {
    let index = select.findIndex(d => d.url === item.url);
    let arr = select.slice();
    console.log(index);
    if (index !== -1) {
      arr.splice(index, 1);
      setSelect(arr);
    } else {
      arr.push(item);
      setSelect(arr);
    }
  };

  return (
    <div>
      <h2>选择好广告账户,进行批量上传视频</h2>
      <h2>现在保存的视频id</h2>
      {video_ids.length ? (
        <>
          <p>视频数量: {video_ids.length}</p>
          {video_ids.map(({ id, name }) => (
            <p key={id}>{name}</p>
          ))}
        </>
      ) : (
        <p>暂无</p>
      )}
      {(img_urls.length && (
        <>
          <p>封面图(点击可排序, 无需排序就按原来顺序, 数量需要和视频对应)</p>
          {img_urls.map((item, i) => (
            <p
              key={item.url}
              onClick={toSelect.bind(null, item)}
              className={style.click}
            >
              {item.name}{" "}
              <span className={style.p_span}>
                {select.findIndex(d => d.url === item.url) !== -1
                  ? select.findIndex(d => d.url === item.url) + 1
                  : ""}
              </span>
            </p>
          ))}
        </>
      )) ||
        ""}
      <div className={style.upload_con}>
        <UploadVideo record={true} video_ids={video_ids} />
        <span className={style.margin_left}>
          {" "}
          <UploadImage
            record={true}
            setImg_urls={setImg_urls}
            text="上传封面"
          />{" "}
        </span>
        <Button
          icon="plus-square"
          onClick={() => {
            setVideoIds([]);
            localStorage.removeItem("video_ids");
          }}
          className={style.button_left}
        >
          清除记录
        </Button>
      </div>
      <div
        className={style.margin_top}
        style={{
          marginTop: "20px"
        }}
      >
        <Button
          icon="plus-square"
          onClick={handleUpload}
          className={style.button_right}
        >
          上传完创建
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = ({ global }) => ({
  adaccount_id: global.adaccount_id,
  video_ids: global.video_ids
});

const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    setVideoIds: ids => dispatch({ type: "global/set_video_ids", payload: ids })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Upload);
