
// Re-export all pages from their respective modules
export * from './auth';
export * from './dashboard';
export * from './notes';
export * from './tasks';
export * from './settings';
export * from './help';

// Export other pages directly
export { default as HomePage } from './HomePage';
export { default as Index } from './Index';
export { default as NotFound } from './NotFound';
