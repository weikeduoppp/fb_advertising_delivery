import React, { useState, useEffect, useCallback } from "react";
import { connect } from "dva";
import * as api from "utils/fb_api";
import Model from "../common/_Model";
import UploadImage from "./UploadImage";
import style from "./index.less";
import { Spin } from "antd";
import Pages from "../common/Paging";
import MultiplePicture from "./MultiplePicture";
import FilterInput from "./FilterInput";

// 选择图片 单张或者多张  handleChildAttachments: 图片更改时单独处理轮播图的文案 format: 广告形式  同时组合了分页器
const Adimages = React.memo(
  ({
    paging,
    setPaging,
    total,
    setTotal,
    defaultCurrent,
    setDefaultCurrent,
    loading,
    setLoading,
    adimages_cache,
    adimages,
    visible: bool,
    setVisible,
    adaccount_id,
    num = 1,
    dispatch,
    images,
    handleChildAttachments,
    child_attachments,
    handlePhotoLine,
    format,
    handleSlideshow,
    filter,
    setFilter,
    shiftKey,
    removeShiftKeydown
  }) => {
    // 拉取图片库
    const [options, setData] = useState([]);
    // 选中的图片库
    const [select, setSelect] = useState(images);

    const [childAttachments, setChildAttachments] = useState(child_attachments);
    // 赋值
    const setAll = useCallback(
      ({ data, total_count, pages }) => {
        setData(data);
        setTotal(total_count);
        setPaging(pages);
        setLoading(false);
      },
      [setData, setTotal, setPaging, setLoading]
    );

    // 初始缓存
    const initCache = useCallback(
      (data, total_count, pages) => {
        dispatch({
          type: "global/set_adimages_cache",
          payload: { data, total_count, pages }
        });
        dispatch({ type: "global/set_adimages", payload: [data] });
      },
      [dispatch]
    );

    // 获取数据
    useEffect(() => {
      let ignore = false;
      async function fetchData() {
        const { data, total_count, paging: pages } = await api.getAdimages(
          adaccount_id
        );
        if (!ignore) {
          setAll({ data, total_count, pages });
          initCache(data, total_count, pages);
        }
      }
      // 没缓存
      if (adaccount_id && !adimages_cache) {
        fetchData();
      } else {
        setAll(adimages_cache);
      }
      return () => {
        ignore = true;
      };
    }, [adaccount_id, adimages_cache, setAll, initCache]);

    // 刷新数据
    async function getAdimages() {
      const { data, total_count, paging: pages } = await api.getAdimages(
        adaccount_id
      );
      setAll({ data, total_count, pages });
      initCache(data, total_count, pages);
    }

    // 下一页或者上一页   方向,页码(对应adimages数组格式)
    async function nextOrPrevious(direction, page) {
      if (direction === "before") {
        if (page === 0) setPaging({ ...paging, before: false });
        setData(adimages[page]);
      } else {
        if (adimages[page]) {
          setData(adimages[page]);
          setPaging({ ...paging, before: true });
        } else {
          setLoading(true);
          // 没缓存的情况
          const { data, total_count, paging: pages } = await api.getAdimages(
            adaccount_id,
            {
              [direction]: paging[direction]
            }
          );
          setAll({ data, total_count, pages });
          dispatch({
            type: "global/set_adimages",
            payload: adimages.concat([data])
          });
        }
      }
    }

    // 选中的图片
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
          // shift选择
          if (shiftKey === true && data.length > 0) {
            let begin = options.findIndex(d => d.hash === data[0].hash);
            let end = options.findIndex(d => d.hash === target.hash);
            // 包括 begin，不包括end
            return options.slice(begin, end+1)
          }
          // 正常依次选择
          let i = data.findIndex(d => d.hash === target.hash);
          if (i !== -1) {
            let arr = data.slice();
            arr.splice(i, 1);
            // 是轮播才处理
            if (num > 1 && format === "child_attachments") {
              setChildAttachments(item => {
                let childAttachments_copy = item.slice();
                childAttachments_copy.splice(i, 1);
                return childAttachments_copy;
              });
            }
            return arr;
          } else {
            if (data.length < num) {
              // 是轮播才处理
              if (format === "child_attachments") {
                setChildAttachments(item => {
                  return [
                    ...item,
                    {
                      image_hash: target.hash
                    }
                  ];
                });
              }
              return [...data, target];
            } else {
              return data;
            }
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
              选择图片（{select.length}/{num}）
              <UploadImage
                className={style.upload_btn}
                fetchData={getAdimages}
              />
            </span>
            <FilterInput setFilter={setFilter} />

            {paging && (
              <Pages
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
        handle={async setConfirmLoading => {
          // ok
          dispatch({ type: "global/set_images", payload: select });
          console.log(select);
          // 填充数据
          if (num > 1 && format === "child_attachments")
            handleChildAttachments(childAttachments);
          // permalink_url线上图片
          if (format === "slideshow_spec") await handleSlideshow(select);
          if (num === 1 && select.length) handlePhotoLine(select[0].hash);
          setConfirmLoading(false);
          setVisible(false);
        }}
        handleCancel={() => {
          // 取消
          setVisible(false);
          // 移除监听
          removeShiftKeydown()
        }}
      >
        <div className={style.image_container}>
          <div className={style.image_content}>
            {!loading && options.length ? (
              <MultiplePicture
                options={
                  filter
                    ? options.filter(d => {
                        return d?.name?.indexOf(filter) !== -1;
                      })
                    : options
                }
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
    images: state.global.images,
    adimages_cache: state.global.adimages_cache,
    adimages: state.global.adimages
  };
};
export default connect(mapStateToProps)(Adimages);
