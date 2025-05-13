
// Animation utility constants for consistent animations across the app

// Animation durations
export const DURATIONS = {
  fast: '0.2s',
  default: '0.3s',
  slow: '0.5s',
  slower: '0.8s'
};

// Animation timing functions
export const EASINGS = {
  default: 'ease',
  linear: 'linear',
  in: 'ease-in',
  out: 'ease-out',
  inOut: 'ease-in-out',
  bounce: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)'
};

// Tailwind animation class names
export const ANIMATIONS = {
  fadeIn: 'animate-fade-in',
  slideIn: 'animate-slide-in',
  pulse: 'animate-pulse-slow',
  scaleIn: 'animate-scale-in',
  accordionDown: 'animate-accordion-down',
  accordionUp: 'animate-accordion-up'
};

// Animation delay classes (to be used with Tailwind)
export const DELAYS = {
  none: 'delay-0',
  tiny: 'delay-75',
  short: 'delay-150',
  default: 'delay-300',
  long: 'delay-500',
  longer: 'delay-700'
};

// Helper function to compose animation classes
export const composeAnimations = (...animations: string[]) => {
  return animations.join(' ');
};
