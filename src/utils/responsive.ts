import { Grid } from "antd";

const { useBreakpoint } = Grid;

export const useResponsive = () => {
  const screens = useBreakpoint();

  return {
    isMobile: !screens.sm,
    isTablet: screens.sm && !screens.lg,
    isDesktop: screens.lg,
    showLabel: screens.sm,
  };
};
