interface TruncateConfig {
  mobileLength: number;
  tabletLength: number;
  desktopLength?: number;
}
export const getTruncatedText = (
  text: string,
  isMobile: boolean | undefined,
  isTablet: boolean | undefined,
  config: TruncateConfig
): string => {
  // Fallback to desktop view if screen size is undefined
  const isMobileView = isMobile ?? false;
  const isTabletView = isTablet ?? false;

  const { mobileLength, tabletLength, desktopLength = text.length } = config;

  // Handle mobile view truncation
  if (isMobileView) {
    return text.length > mobileLength
      ? `${text.slice(0, mobileLength)}...`
      : text;
  }

  // Handle tablet view truncation
  if (isTabletView) {
    return text.length > tabletLength
      ? `${text.slice(0, tabletLength)}...`
      : text;
  }

  // Handle desktop view truncation
  return text.length > desktopLength
    ? `${text.slice(0, desktopLength)}...`
    : text;
};
