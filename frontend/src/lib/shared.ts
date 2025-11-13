import { PaginatedResponse } from '@/types';
import axios from 'axios';

/**
 * Debug Configuration
 *
 * To enable debug logging, set the environment variable:
 * NEXT_PUBLIC_DEBUG_MODE=true
 *
 * This can be done by:
 * 1. Creating a .env.local file with: NEXT_PUBLIC_DEBUG_MODE=true
 * 2. Setting it in your shell: export NEXT_PUBLIC_DEBUG_MODE=true
 * 3. Adding it to your deployment environment variables
 *
 * When enabled, all console.log, console.warn, and console.error statements
 * will be displayed. When disabled, no debug output will be shown.
 */

// Debug configuration
const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true' || false;

// Debug logging functions
export const debugLog = (...args: unknown[]) => {
  if (DEBUG_MODE) {
    console.log(...args);
  }
};

export const debugWarn = (...args: unknown[]) => {
  if (DEBUG_MODE) {
    console.warn(...args);
  }
};

export const debugError = (...args: unknown[]) => {
  if (DEBUG_MODE) {
    console.error(...args);
  }
};

// Environment variables for API base URLs
const API_BASE_URL_NGROK = process.env.NEXT_PUBLIC_API_BASE_URL_NGROK;
const API_BASE_URL_LOCAL =
  process.env.NEXT_PUBLIC_API_BASE_URL_LOCAL || 'http://localhost:8000';
const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV;

// Dynamic API base URL that works for both local and network access
export const getApiBaseUrl = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    debugLog('getApiBaseUrl() called with:', {
      ENVIRONMENT,
      API_BASE_URL_NGROK,
      API_BASE_URL_LOCAL,
      hostname: window.location.hostname,
      protocol: window.location.protocol,
    });

    // Check environment variable first
    if (ENVIRONMENT === 'production' && API_BASE_URL_NGROK) {
      // Production environment - use ngrok URL
      let ngrokUrl = API_BASE_URL_NGROK.replace('http://', 'https://');
      ngrokUrl = ngrokUrl.replace(/\/$/, ''); // Remove trailing slash if present
      const result = `${ngrokUrl}/api/v1`;
      debugLog('Production with ngrok URL:', {
        original: API_BASE_URL_NGROK,
        result,
      });
      return result;
    }

    // Check if we're in development (localhost)
    if (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    ) {
      const result = `${API_BASE_URL_LOCAL}/api/v1`;
      debugLog('Development (localhost):', result);
      return result;
    }

    // Production - ensure HTTPS for ngrok URLs to avoid mixed content issues
    if (API_BASE_URL_NGROK) {
      // Force HTTPS for ngrok URLs and ensure no trailing slash
      let ngrokUrl = API_BASE_URL_NGROK.replace('http://', 'https://');
      ngrokUrl = ngrokUrl.replace(/\/$/, ''); // Remove trailing slash if present
      const result = `${ngrokUrl}/api/v1`;
      debugLog('Production with ngrok URL (fallback):', {
        original: API_BASE_URL_NGROK,
        result,
      });
      return result;
    }

    // Fallback to localhost if no ngrok URL is configured
    debugWarn('No ngrok URL configured, falling back to localhost');
    const result = `${API_BASE_URL_LOCAL}/api/v1`;
    debugLog('Fallback to localhost:', result);
    return result;
  }
  // Server-side rendering - default to localhost
  const result = `${API_BASE_URL_LOCAL}/api/v1`;
  debugLog('Server-side rendering:', result);
  return result;
};

export const API_BASE_URL = getApiBaseUrl();

// Debug logging
debugLog('API Configuration:', {
  API_BASE_URL_NGROK,
  API_BASE_URL_LOCAL,
  ENVIRONMENT,
  finalApiBaseUrl: API_BASE_URL,
});

// Debug logging to help troubleshoot API URL issues
if (typeof window !== 'undefined') {
  // Validate that we're using HTTPS in production
  if (
    window.location.protocol === 'https:' &&
    API_BASE_URL.startsWith('http:')
  ) {
    debugError('SECURITY WARNING: Using HTTP API URL in HTTPS environment!');
    debugError('This will cause mixed content errors.');
  }
}

// Helper function to get access token from localStorage
export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('fifa-tracker-token');
  }
  return null;
};

// Helper function to create authenticated axios instance
export const createAuthenticatedRequest = () => {
  const token = getAccessToken();

  // Get fresh API base URL to avoid caching issues
  const freshApiBaseUrl = getApiBaseUrl();

  // Force HTTPS for production environments - more aggressive enforcement
  let finalBaseUrl = freshApiBaseUrl;
  if (typeof window !== 'undefined') {
    // Always force HTTPS if we're on HTTPS or in production
    if (
      window.location.protocol === 'https:' ||
      window.location.hostname !== 'localhost'
    ) {
      finalBaseUrl = freshApiBaseUrl.replace('http://', 'https://');

      // Double-check and log if we're still using HTTP
      if (finalBaseUrl.startsWith('http://')) {
        debugError('WARNING: Still using HTTP after HTTPS enforcement!');
        debugError('Original URL:', freshApiBaseUrl);
        debugError('Final URL:', finalBaseUrl);
        debugError('Environment:', ENVIRONMENT);
        debugError('Ngrok URL:', API_BASE_URL_NGROK);
      }
    }
  }

  // Final safety check - if we're in production and still have HTTP, force HTTPS
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    finalBaseUrl.startsWith('http://')
  ) {
    debugError('CRITICAL: Forcing HTTPS conversion for production!');
    finalBaseUrl = finalBaseUrl.replace('http://', 'https://');
  }

  debugLog('Creating authenticated request:', {
    hasToken: !!token,
    tokenLength: token?.length,
    baseURL: finalBaseUrl,
    originalBaseUrl: freshApiBaseUrl,
    protocol:
      typeof window !== 'undefined' ? window.location.protocol : 'server',
  });

  const config: {
    baseURL: string;
    headers?: {
      Authorization: string;
      'Content-Type': string;
    };
  } = {
    baseURL: finalBaseUrl,
  };

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  const axiosInstance = axios.create(config);

  // Add request interceptor to log the actual request URL and add cache-busting
  axiosInstance.interceptors.request.use(
    config => {
      // Log the actual request URL being made
      const fullUrl = (config.baseURL || '') + (config.url || '');
      debugLog('Making request to:', {
        method: config.method,
        url: config.url,
        baseURL: config.baseURL,
        fullUrl: fullUrl,
        headers: config.headers,
      });

      // Add cache-busting headers for production
      if (
        typeof window !== 'undefined' &&
        window.location.protocol === 'https:'
      ) {
        if (config.headers) {
          config.headers['Cache-Control'] =
            'no-cache, no-store, must-revalidate';
          config.headers['Pragma'] = 'no-cache';
          config.headers['Expires'] = '0';
        }
      }

      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle authentication errors
  axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      if (error.response?.status === 401) {
        // Try to refresh the token
        const refreshTokenValue = localStorage.getItem(
          'fifa-tracker-refresh-token'
        );
        if (refreshTokenValue) {
          try {
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refresh_token: refreshTokenValue,
            });

            const { data } = response.data;
            if (data?.access_token) {
              localStorage.setItem('fifa-tracker-token', data.access_token);
              // Retry the original request with the new token
              error.config.headers.Authorization = `Bearer ${data.access_token}`;
              return axiosInstance.request(error.config);
            }
          } catch (_refreshError) {
            // Token refresh failed, clear everything and redirect to login
            localStorage.removeItem('fifa-tracker-token');
            localStorage.removeItem('fifa-tracker-user');
            localStorage.removeItem('fifa-tracker-refresh-token');

            // Redirect to login page if we're in a browser environment
            if (typeof window !== 'undefined') {
              window.location.href = '/auth';
            }
          }
        } else {
          // No refresh token, clear everything and redirect to login
          localStorage.removeItem('fifa-tracker-token');
          localStorage.removeItem('fifa-tracker-user');
          localStorage.removeItem('fifa-tracker-refresh-token');

          // Redirect to login page if we're in a browser environment
          if (typeof window !== 'undefined') {
            window.location.href = '/auth';
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

// Response unwrapping utilities
export function unwrapResponse<T>(response: {
  success: boolean;
  data: T | null;
  message: string;
}): T | null {
  return response.data;
}

export function unwrapListResponse<T>(response: {
  success: boolean;
  data: { [key: string]: T[] };
  message: string;
}): T[] {
  const { data } = response;
  // Get the first array from the data object (since key is dynamic)
  const arrays = Object.values(data);
  return arrays.length > 0 ? arrays[0] : [];
}

export function unwrapPaginatedResponse<T>(response: {
  success: boolean;
  data: PaginatedResponse<T>;
  message: string;
}): PaginatedResponse<T> {
  return response.data;
}
