import { useState, memo } from 'react'
import { Select } from 'antd';

const { Option } = Select;
const age = {
  min: 13,
  max: 65
}
const children = [];

for (let i = age.min; i <= age.max; i++) {
  children.push(i);
}
// 年龄选择器
export default memo(({ handleSubmit, min, max }) => {
  const [age_min, setAge_min] = useState(min);
  const [age_max, setAge_max] = useState(max);

  function handleAge_min(value) {
    setAge_min(value);
    handleSubmit({ age_min: value, age_max });
  }
  function handleAge_max(value) {
    setAge_max(value);
    handleSubmit({ age_min, age_max: value });
  }
  return (
    <div>
      <p>年龄</p>
      <Select defaultValue={min} style={{ width: 80 }} onChange={handleAge_min}>
        {children.map(item => (
          <Option
            key={item + "age_min"}
            value={item}
            disabled={item > age_max ? true : false}
          >
            {item}
          </Option>
        ))}
      </Select>
      <span> - </span>
      <Select defaultValue={max} style={{ width: 80 }} onChange={handleAge_max}>
        {children.map(item => (
          <Option
            key={item + "age_max"}
            value={item}
            disabled={item < age_min ? true : false}
          >
            {item}
          </Option>
        ))}
      </Select>
    </div>
  );
});
