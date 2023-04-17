import { RefObject, useEffect, useRef } from "react";

export const useClickedOutside = (
  callback: () => void,
  ref2?: RefObject<HTMLDivElement>
) => {
  const ref = useRef<HTMLDivElement>(ref2?.current || null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);

  return ref;
};
