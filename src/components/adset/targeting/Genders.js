import { Radio } from "antd";
import { memo } from 'react'

// 性别 
const genders = {
  all: [1,2],
  man: [1],
  woman: [2]
}

export default memo(({ handleSubmit, genders: state }) => {
  function checkGenders() {
    if (!state || state.length === 2) return "all";
    return state[0] === 1 ? "man" : "woman";
  }

  return (
    <div>
      <p>年龄</p>
      <Radio.Group
        onChange={e => handleSubmit(genders[e.target.value])}
        defaultValue={checkGenders()}
        buttonStyle="solid"
      >
        <Radio.Button value="all">不限</Radio.Button>
        <Radio.Button value="man">男性</Radio.Button>
        <Radio.Button value="woman">女性</Radio.Button>
      </Radio.Group>
    </div>
  );
});
