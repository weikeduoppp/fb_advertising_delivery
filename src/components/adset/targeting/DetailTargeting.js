import React, { useState, useEffect, useRef } from "react";
import { getDetailTargeting, getTargetingsearch } from "utils/fb_api";
import { TreeSelect, Divider, Select, Checkbox, Spin } from "antd";
import { connect } from "umi";
import style from "../index.less";
import { debounce } from "utils";
const { SHOW_ALL } = TreeSelect;
const { Option } = Select;

/* 
  {
    title: 'Child Node3',
    value: '0-1-0',
    key: '0-1-0',
  }
 */
// 数据处理成树结构
function handleInterests(data) {
  let arr = [];
  for (let i = 0; i < data.length; i++) {
    let current = data[i];
    let step1 = arr.findIndex(item => item.title === current.path[0]);
    let target = {};
    let length = current.path.length;
    switch (length) {
      // 只有一层的情况下
      case 1:
        // 如果
        if (step1 === -1) {
          target = {
            title: current.path[0],
            value: current.id,
            key: current.id,
            children: []
          };
          arr.push(target);
        }
        break;
      // 只有二层的情况下
      case 2:
        target = {
          title: current.path[1],
          value: current.id,
          key: current.id,
          children: []
        };
        // 如果第一层不存在
        if (step1 === -1) {
          let parentStep1 = {
            title: current.path[0],
            value: current.path[0],
            key: current.path[0],
            children: []
          };

          parentStep1.children.push(target);
          arr.push(parentStep1);
        } else {
          // 存在
          let step2 = arr[step1].children.findIndex(
            item => item.title === current.path[1]
          );
          // 如果第二层已经创建 那就只覆盖value key
          if (step2 !== -1) {
            arr[step1].children[step2] = {
              ...arr[step1].children[step2],
              value: current.id,
              key: current.id
            };
          } else {
            arr[step1].children.push(target);
          }
        }
        break;
      // 有三层的情况下
      case 3:
        target = {
          title: current.path[2],
          value: current.id,
          key: current.id,
          children: []
        };
        let parentStep1 = {
          title: current.path[0],
          value: current.path[0],
          key: current.path[0],
          children: []
        };
        let parentStep2 = {
          title: current.path[1],
          value: current.path[1],
          key: current.path[1],
          children: []
        };
        // 如果第一层不存在
        if (step1 === -1) {
          parentStep2.children.push(target);
          parentStep1.children.push(parentStep2);
          arr.push(parentStep1);
        } else {
          // 存在
          let step2 = arr[step1].children.findIndex(
            item => item.title === current.path[1]
          );
          // 如果第二层已经创建 那就只覆盖value key
          if (step2 !== -1) {
            let step3 = arr[step1].children[step2].children.findIndex(
              item => item.title === current.path[2]
            );
            // 查询第3层
            if (step3 !== -1) {
              arr[step1].children[step2].children[step3] = {
                ...arr[step1].children[step2].children[step3],
                value: current.id,
                key: current.id
              };
            } else {
              arr[step1].children[step2].children.push(target);
            }
          } else {
            // 第二层 不存在

            parentStep2.children.push(target);
            arr[step1].children.push(parentStep2);
          }
        }
        break;
      // 有四层
      case 4:
        target = {
          title: current.path[3],
          value: current.id,
          key: current.id,
          children: []
        };

        // 如果第一层不存在
        if (step1 === -1) {
          let parentStep1 = {
            title: current.path[0],
            value: current.path[0],
            key: current.path[0],
            children: []
          };
          let parentStep2 = {
            title: current.path[1],
            value: current.path[1],
            key: current.path[1],
            children: []
          };
          let parentStep3 = {
            title: current.path[2],
            value: current.path[2],
            key: current.path[2],
            children: []
          };

          parentStep3.children.push(target);
          parentStep2.children.push(parentStep3);
          parentStep1.children.push(parentStep2);
          arr.push(parentStep1);
        } else {
          // 存在
          let step2 = arr[step1].children.findIndex(
            item => item.title === current.path[1]
          );
          if (step2 !== -1) {
            let step3 = arr[step1].children[step2].children.findIndex(
              item => item.title === current.path[2]
            );
            // 查询第3层
            if (step3 !== -1) {
              let step4 = arr[step1].children[step2].children[
                step3
              ].children.findIndex(item => item.title === current.path[3]);
              // 查询第3层
              if (step4 !== -1) {
                arr[step1].children[step2].children[step3].children[step4] = {
                  ...arr[step1].children[step2].children[step3].children[step4],
                  value: current.id,
                  key: current.id
                };
              } else {
                arr[step1].children[step2].children[step3].children.push(
                  target
                );
              }
            } else {
              let parentStep3 = {
                title: current.path[2],
                value: current.path[2],
                key: current.path[2],
                children: []
              };
              parentStep3.children.push(target);
              arr[step1].children[step2].children.push(parentStep3);
            }
          } else {
            // 第二层不存在
            let parentStep2 = {
              title: current.path[1],
              value: current.path[1],
              key: current.path[1],
              children: []
            };
            let parentStep3 = {
              title: current.path[2],
              value: current.path[2],
              key: current.path[2],
              children: []
            };
            parentStep3.children.push(target);
            parentStep2.children.push(parentStep3);
            arr[step1].children.push(parentStep2);
          }
        }
        break;
      default:
        return false;
    }
  }
  return arr;
}

// 合并人口统计相关数据
function mergeDemographics(obj) {
  return (obj.life_events || [])
    .concat(obj.industries || [])
    .concat(obj.income || [])
    .concat(obj.family_statuses || []);
}

// 细分定位 handleSubmit({ 细分定位的相关对象 })
/* 
 editData: 受众相关数据
  { interests, behaviors, life_events, industries, income, family_statuses, }
 */
const DetailTargeting = React.memo(
  ({
    targeting,
    dispatch,
    handleSubmit,
    adaccount_id,
    editData,
    targeting_optimization
  }) => {
    // 原始数据
    // 兴趣
    const [interests, setInterests] = useState([]);
    // 行为
    const [behaviors, setBehaviors] = useState([]);
    // 人口统计数据 包含了 type: life_events、industries、income、family_statuses
    const [demographics, setDemographics] = useState([]);
    // 建议
    const [proposal, setProposal] = useState([]);

    // 树结构
    const [interestsData, setInterestsData] = useState([]);
    const [behaviorsData, setBehaviorsData] = useState([]);
    const [demographicsData, setDemographicsData] = useState([]);

    // 各表单值 不能整合 因为会有取消的可能
    // 因为是异步处理 所以用ref保存
    const interestsForm = useRef(editData.interests || []);
    const behaviorsForm = useRef(editData.behaviors || []);
    const demographicsForm = useRef(mergeDemographics(editData) || []);
    const proposalForm = useRef([]);

    // 定位搜索相关
    const [searchLoading, setSearchLoading] = useState(true);
    const [searchData, setSearchData] = useState([]);
    const [searchValue, setSearchValue] = useState(handleFlexibleSpec() || []);
    // 保存灵活定位内部数据结构 [{}] => {}  修改时给予这结构[{}]
    // eslint-disable-next-line no-unused-vars
    const [flexibleSpecObject, setFlexibleSpecObject] = useState(
      saveFlexibleSpecObject() || []
    );

    // 灵活定位数据

    // 处理flexible_spec数据结构
    function handleFlexibleSpec() {
      const { flexible_spec } = editData;
      /* 
        "flexible_spec": [
          { "behaviors": [{"id":6002714895372,"name":"All travelers"}], "interests": [ {"id":6003107902433,"name":"Association football (Soccer)"}, {"id":6003139266461,"name":"Movies"} ] }, 
          { "interests": [{"id":6003020834693,"name":"Music"}], "life_events": [{"id":6002714398172,"name":"Newlywed (1 year)"}] } ]
       */
      if (flexible_spec) {
        // 拼合起来并转成一维数组
        let val = flexible_spec.reduce((accumulator, currentValue) => {
          // Array.flat() 指定要提取嵌套数组的结构深度，默认值为 1。
          return accumulator.concat(Object.values(currentValue).flat());
        }, []);
        return val.map(d => ({
          key: d.id,
          label: d.name
        }));
      }
    }

    // 保存灵活定位内部数据结构
    function saveFlexibleSpecObject() {
      const { flexible_spec } = editData;
      if (!flexible_spec) return false;
      let temp = [];
      for (let i = 0; i < flexible_spec.length; i++) {
        for (let [key, value] of Object.entries(flexible_spec[i])) {
          temp = [
            ...temp,
            ...value.map(d => ({ type: key, id: d.id, name: d.name }))
          ];
        }
      }
      return temp;
    }

    // 排序后处理成树结构
    function handleData(data) {
      return handleInterests(
        data.sort((a, b) => a.path.length - b.path.length)
      );
    }

    // 初始数据
    useEffect(() => {
      let ignore = false;
      async function fetchData() {
        const res = await getDetailTargeting(adaccount_id);
        // console.log(JSON.parse(res[1].body));
        if (!ignore) {
          let Proposal = JSON.parse(res[3].body).data;
          let Interests = JSON.parse(res[0].body).data;
          let Behaviors = JSON.parse(res[1].body).data;
          let Demographics = JSON.parse(res[2].body).data;
          let InterestsData = handleData(Interests);
          let BehaviorsData = handleData(Behaviors);
          let DemographicsData = handleData(Demographics);
          setProposal(Proposal);
          setInterests(Interests);
          setBehaviors(Behaviors);
          setDemographics(Demographics);
          setInterestsData(InterestsData);
          setBehaviorsData(BehaviorsData);
          setDemographicsData(DemographicsData);

          dispatch({
            type: "global/set_targeting",
            payload: {
              Proposal,
              Interests,
              Behaviors,
              Demographics,
              InterestsData,
              BehaviorsData,
              DemographicsData
            }
          });
        }
      }
      if (adaccount_id && !targeting) {
        fetchData();
      } else {
        // 取缓存
        setProposal(targeting.Proposal);
        setInterests(targeting.Interests);
        setBehaviors(targeting.Behaviors);
        setDemographics(targeting.Demographics);
        setInterestsData(targeting.InterestsData);
        setBehaviorsData(targeting.BehaviorsData);
        setDemographicsData(targeting.DemographicsData);
      }
      return () => {
        ignore = true;
      };
    }, [adaccount_id, targeting, dispatch]);

    // 定位搜索
    async function toSearch(query) {
      setSearchLoading(true);
      if (query) {
        const { data } = await getTargetingsearch(adaccount_id, query);
        // 累积搜索数据
        setSearchData(d => [...d, ...data]);
        setSearchLoading(false);
      }
    }

    // 修改 flexible_spec 结构错误: 待修改
    function handleSearchChange(val) {
      // 全部搜索数据 = 原始的 + 检索的
      let allData = [...flexibleSpecObject, ...searchData];
      let currentSelect = val.map(d => ({
        id: d.key,
        name: d.label,
        type: allData.find(item => item.id === d.key).type
      }));
      setSearchValue(val);
      handleFlexibleSpecSubmit(currentSelect);
    }

    // 处理成上传的数据结构
    function handleFlexibleSpecSubmit(arr) {
      let temp = {};
      for (let i = 0; i < arr.length; i++) {
        let { type, ...other } = arr[i];
        temp[type] = temp[type] ? [...temp[type], other] : [other];
      }
      handleSubmit({
        flexible_spec: [temp]
      });
    }

    // 上传数据
    function interestsChange(val) {
      interestsForm.current = val;
      handleDispatchData();
    }
    function behaviorsChange(val) {
      behaviorsForm.current = val;
      handleDispatchData();
    }
    // 人口统计数据另外处理
    function demographicsChange(val) {
      demographicsForm.current = val;
      handleDispatchData();
    }

    // 建议 从中添加到其他三个数据里 去重 (a) => [...new Set(a)]
    function proposalChange(val) {
      proposalForm.current = val;
      handleDispatchData();
    }

    // 统一dispatch
    function handleDispatchData() {
      let last = [
        ...new Set(
          interestsForm.current.concat(
            behaviorsForm.current,
            demographicsForm.current,
            proposalForm.current
          )
        )
      ];
      let allData = interests.concat(behaviors, demographics, proposal);
      let obj = {};
      // 过滤无效id
      let filterData = last.filter(id => allData.find(d => id === d.id));
      let arr = filterData.map(id => {
        let current = allData.find(d => id === d.id);
        return { id: current.id, name: current.name, type: current.type };
      });
      for (let i = 0; i < arr.length; i++) {
        let { type, ...other } = arr[i];
        if (obj[type]) {
          obj[type].push(other);
        } else {
          obj[type] = [other];
        }
      }
      handleSubmit(obj);
    }

    function onChange(e) {
      e.target.checked
        ? handleSubmit({
            targeting_optimization: "expansion_all"
          })
        : handleSubmit({ targeting_optimization: "none" });
    }

    // 树结构相关参数
    const behaviorsProps = {
      showSearch: true,
      treeData: behaviorsData,
      defaultValue: behaviorsForm.current,
      onChange: behaviorsChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_ALL,
      searchPlaceholder: "添加行为",
      style: {
        width: "50%"
      }
    };
    const interestsProps = {
      showSearch: true,
      treeData: interestsData,
      defaultValue: interestsForm.current,
      onChange: interestsChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_ALL,
      searchPlaceholder: "添加兴趣",
      style: {
        width: "50%"
      }
    };
    const demographicsProps = {
      showSearch: true,
      treeData: demographicsData,
      defaultValue: demographicsForm.current,
      onChange: demographicsChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_ALL,
      searchPlaceholder: "添加人口统计数据",
      style: {
        width: "50%"
      }
    };

    return (
      <div className={style.detailTargeting}>
        <Divider orientation="left">细分定位</Divider>
        <div>
          <p>兴趣</p> <TreeSelect {...interestsProps} showSearch={true} />
        </div>
        <div>
          <p>行为</p> <TreeSelect {...behaviorsProps} />
        </div>
        <div>
          <p>人口统计数据</p>
          <TreeSelect {...demographicsProps} showSearch={true} />
        </div>
        <div>
          <p>建议</p>
          <Select
            mode="multiple"
            style={{ width: "50%" }}
            placeholder="添加人口统计数据、兴趣和行为"
            defaultValue={[]}
            onChange={proposalChange}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {/* 建议需要过滤掉灵活定位flexible_spec */}
            {proposal
              .filter(
                item => searchValue.findIndex(val => val.key === item.id) === -1
              )
              .map((d, i) => (
                <Option key={d.id}>
                  {d.name} - {d.path[0]}
                </Option>
              ))}
          </Select>
        </div>
        <div>
          <p>定位搜索(系统外的人口统计数据、兴趣和行为)</p>
          <Select
            mode="multiple"
            labelInValue
            style={{ width: "50%" }}
            placeholder="search"
            value={searchValue}
            notFoundContent={searchLoading ? <Spin size="small" /> : null}
            onSearch={debounce(toSearch, 800)}
            onChange={handleSearchChange}
            filterOption={false}
          >
            {searchData.map((d, i) => (
              <Option key={d.id}>{d.name}</Option>
            ))}
          </Select>
        </div>
        <div className={style.targeting_optimization}>
          <Checkbox
            defaultChecked={targeting_optimization !== "none"}
            onChange={onChange}
          >
            扩展细分定位，有机会提升广告表现时，向更多用户推广。
          </Checkbox>
        </div>
      </div>
    );
  }
);

const mapStateToProps = (state, ownProps) => {
  return {
    adaccount_id: state.global.adaccount_id,
    targeting: state.global.targeting
  };
};
export default connect(mapStateToProps)(DetailTargeting);
