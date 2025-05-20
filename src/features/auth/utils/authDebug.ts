
import { createLogger } from '@/lib/debug';

const logger = createLogger('auth');

/**
 * Utility to help debug authentication state
 */
export const debugAuthState = (session: any, user: any, profile: any) => {
  logger.info('Auth state:', {
    isAuthenticated: !!user,
    hasSession: !!session,
    hasProfile: !!profile,
    userId: user?.id || 'none',
    sessionExpiry: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'none',
    role: profile?.role || 'undefined'
  });
};

/**
 * Debug auth events
 */
export const logAuthEvent = (event: string, details?: any) => {
  logger.info(`Auth event: ${event}`, details || {});
};

/**
 * Debug auth errors
 */
export const logAuthError = (context: string, error: any) => {
  logger.error(`Auth error in ${context}:`, error);
};

/**
 * Check if there's inconsistency in auth state
 */
export const checkAuthConsistency = (session: any, user: any, profile: any) => {
  // User exists but no session
  if (user && !session) {
    logger.warn('Inconsistent auth state: User exists but no session');
    return false;
  }
  
  // Session exists but no user
  if (session && !user) {
    logger.warn('Inconsistent auth state: Session exists but no user');
    return false;
  }
  
  // User exists but no profile (after a reasonable delay)
  if (user && !profile) {
    logger.warn('Possible inconsistent auth state: User exists but no profile');
    // This isn't necessarily an error, as profile may be loading
  }
  
  return true;
};
