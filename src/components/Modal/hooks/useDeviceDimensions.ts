import { useEffect, useState } from "react";
import { Dimensions, type ScaledSize } from "react-native";

export type DeviceDimensions = {
  width: number;
  height: number;
};

/**
 * Tracks the device window dimensions and re-renders when they change
 * (orientation, split-screen, foldables, etc.). Optional overrides allow the
 * caller to pin a specific size.
 */
export const useDeviceDimensions = (
  overrideWidth?: number | null,
  overrideHeight?: number | null,
  useScreen = false,
): DeviceDimensions => {
  const [size, setSize] = useState<DeviceDimensions>(() => {
    const { width, height } = Dimensions.get(useScreen ? "screen" : "window");
    return { width, height };
  });

  useEffect(() => {
    const handler = ({ window, screen }: { window: ScaledSize; screen: ScaledSize }) => {
      const next = useScreen ? screen : window;
      setSize({ width: next.width, height: next.height });
    };
    const sub = Dimensions.addEventListener("change", handler);
    return () => sub.remove();
  }, [useScreen]);

  return {
    width: overrideWidth ?? size.width,
    height: overrideHeight ?? size.height,
  };
};
