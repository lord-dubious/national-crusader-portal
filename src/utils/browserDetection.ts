export const isOldBrowser = (): boolean => {
  // Check for basic modern features
  const hasModernFeatures = (
    'querySelector' in document &&
    'addEventListener' in window &&
    'localStorage' in window &&
    'fetch' in window
  );

  // Check for specific browser versions
  const ua = window.navigator.userAgent;
  const isIE = ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1;
  const isSafari = ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1;
  const safariVersion = isSafari ? parseInt(ua.split('Version/')[1]) : Infinity;
  
  return !hasModernFeatures || isIE || safariVersion < 10;
};