import { debounce } from "../../utils/index";
import { Input } from "antd";
export default ({setFilter}) => {
  return (
    <span>
      <Input
        placeholder="检索"
        onChange={e => {
          // 以异步方式访问事件属性
          e.persist();
          debounce(() => {
            setFilter(e.target.value);
          }, 500)();
        }}
      />
    </span>
  );
};