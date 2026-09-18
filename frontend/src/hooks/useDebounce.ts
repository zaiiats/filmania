import { useRef } from "react";

export const useDebounce = <T>(fn: (n: T) => void) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return function (n: T) {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = setTimeout(() => {
      fn(n);
      timerRef.current = null;
    }, 1000);
  };
};
