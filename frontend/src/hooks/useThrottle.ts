import { useRef } from "react";

export const useThrottle = <T>(fn: (n: T) => void) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const valueRef = useRef<T | null>(null);
  const fnRef = useRef(fn);

  return function (n: T) {
    valueRef.current = n;

    if (timerRef.current === null) {
      fnRef.current(n);
      valueRef.current = null;

      timerRef.current = setTimeout(() => {
        timerRef.current = null;

        if (valueRef.current !== null) {
          fn(valueRef.current);
          valueRef.current = null;
        }
      }, 1000);
    }
  };
};
