
/**
 * Utility for better debugging across the application
 * Includes namespaced logs and conditional logging based on environment
 */

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

/**
 * Creates a namespaced logger
 * @param namespace The namespace for the logger (e.g., 'auth', 'notes', etc.)
 * @returns Object with logging methods
 */
export const createLogger = (namespace: string) => {
  const formatMessage = (message: string) => `[${namespace}] ${message}`;
  
  return {
    log: (message: string, ...args: any[]) => {
      if (isDev) {
        console.log(formatMessage(message), ...args);
      }
    },
    
    info: (message: string, ...args: any[]) => {
      if (isDev) {
        console.info(formatMessage(message), ...args);
      }
    },
    
    warn: (message: string, ...args: any[]) => {
      console.warn(formatMessage(message), ...args);
    },
    
    error: (message: string, ...args: any[]) => {
      console.error(formatMessage(message), ...args);
    },
    
    // Track performance with namespaced timing
    time: (label: string) => {
      if (isDev) {
        console.time(`[${namespace}] ${label}`);
      }
    },
    
    timeEnd: (label: string) => {
      if (isDev) {
        console.timeEnd(`[${namespace}] ${label}`);
      }
    }
  };
};

/**
 * Debug utility for tracking state changes
 * @param componentName Name of the component
 * @param prevState Previous state
 * @param nextState New state
 */
export const debugStateChange = (componentName: string, prevState: any, nextState: any) => {
  if (isDev) {
    console.group(`[${componentName}] State Change`);
    console.log('Previous:', prevState);
    console.log('Current:', nextState);
    console.log('Diff:', Object.keys(nextState).reduce((diff, key) => {
      if (prevState[key] !== nextState[key]) {
        diff[key] = {
          from: prevState[key],
          to: nextState[key]
        };
      }
      return diff;
    }, {} as Record<string, {from: any, to: any}>));
    console.groupEnd();
  }
};

/**
 * Add debug information to an error
 */
export const enhanceError = (error: any, context: Record<string, any>) => {
  console.error(`Error with context:`, { error, context });
  return error;
};
