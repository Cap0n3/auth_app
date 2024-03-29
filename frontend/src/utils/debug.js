/**
 * Custom debugging utility for logging and warnings.
 */

const isDebugMode = true;
// const isDebugMode = process.env.REACT_APP_DEBUG === 'true';

export const debugLog = (...messages) => {
  if (isDebugMode) {
    console.log(...messages);
  }
};

export const debugWarn = (...messages) => {
  if (isDebugMode) {
    console.warn(...messages);
  }
};
