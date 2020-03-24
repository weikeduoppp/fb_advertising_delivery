import React, { useState, useEffect, useCallback } from "react";
import { connect } from "umi";
import { getAdvideos } from "utils/fb_api";
import Model from "../common/_Model";
import style from "./index.less";
import { Spin } from "antd";
import Pages from "../common/Paging";
import MultiplePicture from "./MultiplePicture";
// 获取数组最后一项
function lengthLastIndex(params) {
  return params.length - 1;
}

function handleDataMap(d) {
  return {
    hash: d.id,
    width: d.thumbnails.data[lengthLastIndex(d.thumbnails.data)].width,
    height: d.thumbnails.data[lengthLastIndex(d.thumbnails.data)].height,
    url_128: d.thumbnails.data[0].uri,
    name: d.title
  };
}

// 选择视频
const Advideos = React.memo(
  ({
    paging,
    setPaging,
    total,
    setTotal,
    defaultCurrent,
    setDefaultCurrent,
    loading,
    setLoading,
    advideos,
    advideos_cache,
    visible: bool,
    setVisible,
    adaccount_id,
    num = 1,
    dispatch,
    handleSubmit,
    handleDynamicVideos,
    videos
  }) => {
    // 拉取视频库
    const [options, setData] = useState([]);
    // 选中的视频库
    const [select, setSelect] = useState(videos);

    // 赋值
    const setAll = useCallback(
      ({ data, total_count, pages }) => {
        let videos = data.map(handleDataMap);
        setData(videos);
        setTotal(total_count);
        setPaging(pages);
        setLoading(false);
      },
      [setData, setTotal, setPaging, setLoading]
    );
    // 初始缓存
    const initCache = useCallback(
      (data, total_count, pages) => {
        let videos = data.map(handleDataMap);
        dispatch({
          type: "global/set_advideos_cache",
          payload: { data, total_count, pages }
        });
        dispatch({ type: "global/set_advideos", payload: [videos] });
      },
      [dispatch]
    );

    // 获取数据
    useEffect(() => {
      let ignore = false;
      async function fetchData() {
        const { data, total_count, paging: pages } = await getAdvideos(adaccount_id);
        if (!ignore) {
          setAll({ data, total_count, pages });
          initCache(data, total_count, pages);
        }
      }
      if (adaccount_id && !advideos_cache) {
        fetchData();
      } else {
        setAll(advideos_cache);
      }
      return () => {
        ignore = true;
      };
    }, [adaccount_id, advideos_cache, setAll, initCache]);

    // 下一页或者上一页   方向,页码(对应advideos数组格式)
    async function nextOrPrevious(direction, page) {
      if (direction === 'before') {
        if(page === 0) setPaging({...paging, before: false})
        setData(advideos[page]);
      } else {
        if (advideos[page]) {
          setData(advideos[page]);
          setPaging({ ...paging, before: true });
        } else {
          setLoading(true)
          // 没缓存的情况
          const { data, total_count, paging: pages } = await getAdvideos(
            adaccount_id,
            {
              [direction]: paging[direction]
            }
          );
          let videos = data.map(handleDataMap);
          setAll({data, total_count, pages});
          dispatch({
            type: "global/set_advideos",
            payload: advideos.concat([videos])
          });
        }
      }
    }

    // 选中的视频
    function toSelect(target) {
      if (num === 1) {
        setSelect(data => {
          if (data.length) {
            return data[0].hash === target.hash ? [] : [target];
          } else {
            return [target];
          }
        });
      } else {
        setSelect(data => {
          let i = data.findIndex(d => d.hash === target.hash);
          if (i !== -1) {
            let arr = data.slice();
            arr.splice(i, 1);
            return arr;
          } else {
            return data.length < num ? [...data, target] : data;
          }
        });
      }
    }

    return (
      <Model
        width={1000}
        title={
          <div className={style.model_top}>
            <span>
              选择视频（{select.length}/{num}）
            </span>
            {paging && (
              <Pages
                num={100}
                className={style.paging_container}
                loading={loading}
                paging={paging}
                defaultCurrent={defaultCurrent}
                total={total}
                nextOrPrevious={nextOrPrevious}
                setDefaultCurrent={setDefaultCurrent}
              />
            )}
          </div>
        }
        visible={bool}
        handle={setConfirmLoading => {
          // ok
          dispatch({ type: "global/set_videos", payload: select });
          // 填充视频数据
          handleSubmit && handleSubmit(select[0].hash, select[0].url_128);
          handleDynamicVideos && handleDynamicVideos(select);
          setVisible(false);
        }}
        handleCancel={() => {
          // 取消
          setVisible(false);
        }}
      >
        <div className={style.image_container}>
          <div className={style.image_content}>
            {!loading && options.length ? (
              <MultiplePicture
                options={options}
                toSelect={toSelect}
                select={select}
                num={num}
              />
            ) : (
              <Spin size="small" />
            )}
          </div>
        </div>
      </Model>
    );
  }
);
const mapStateToProps = (state, ownProps) => {
  return {
    adaccount_id: state.global.adaccount_id,
    advideos_cache: state.global.advideos_cache,
    videos: state.global.videos,
    advideos: state.global.advideos
  };
};
export default connect(mapStateToProps)(Advideos);
