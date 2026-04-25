import { useState, useEffect } from "react";

export const TABLET_BREAKPOINT = 768;
export const DESKTOP_BREAKPOINT = 1024;

interface DeviceState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
}

export function useDevice() {
  const [device, setDevice] = useState<DeviceState>(() => {
    if (typeof window === "undefined") {
      return { isMobile: false, isTablet: false, isDesktop: true, width: DESKTOP_BREAKPOINT + 1 };
    }
    return getDeviceState(window.innerWidth);
  });

  function getDeviceState(width: number): DeviceState {
    return {
      isMobile: width < TABLET_BREAKPOINT,
      isTablet: width >= TABLET_BREAKPOINT && width < DESKTOP_BREAKPOINT,
      isDesktop: width >= DESKTOP_BREAKPOINT,
      width,
    };
  }

  useEffect(() => {
    const handleResize = () => {
      setDevice(getDeviceState(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return device;
}

export function useIsMobile() {
  const { isMobile } = useDevice();
  return isMobile;
}

export function useIsTablet() {
  const { isTablet } = useDevice();
  return isTablet;
}

export function useIsDesktop() {
  const { isDesktop } = useDevice();
  return isDesktop;
}