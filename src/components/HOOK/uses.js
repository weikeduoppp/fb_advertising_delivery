import { useEffect, useRef } from "react";
// 上个循环 变量
export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

