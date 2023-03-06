import { useState, useEffect, CSSProperties } from "react";

export function useDelayUnmount(isMounted: boolean, delayTime: number) {
  const mountedStyle: CSSProperties = {
    opacity: 1,
    transform: "scale(1)",
    transition: `all ${delayTime}ms ease-out`,
  };
  const unmountedStyle: CSSProperties = {
    opacity: 0,
    transform: "scale(0)",
    transition: `all ${delayTime}ms ease-out`,
  };

  const [style, setStyle] = useState(isMounted ? mountedStyle : unmountedStyle);
  const [showComponent, setShowComponent] = useState(isMounted);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isMounted) {
      setShowComponent(true);
      timeoutId = setTimeout(() => setStyle(mountedStyle), 10);
    } else {
      timeoutId = setTimeout(() => setShowComponent(false), delayTime);
      setStyle(unmountedStyle);
    }
    return () => clearTimeout(timeoutId);
  }, [isMounted, delayTime]);
  return { showComponent, style };
}
