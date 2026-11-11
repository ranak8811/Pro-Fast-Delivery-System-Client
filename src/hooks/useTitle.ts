import { useEffect } from "react";

export function useTitle(path: string): void {
  useEffect(() => {
    document.title = `${path} || Pro Fast Delivery System`;
    return () => {};
  }, [path]);
}

export default useTitle;
