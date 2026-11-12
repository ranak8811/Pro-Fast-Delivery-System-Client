import { useEffect } from "react";

export function useTitle(title: string = "Home"): void {
  useEffect(() => {
    document.title = title
      ? `${title} || Pro Fast Delivery System`
      : "Pro Fast Delivery System";
  }, [title]);
}

export default useTitle;
