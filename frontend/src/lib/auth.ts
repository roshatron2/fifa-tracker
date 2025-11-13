import { User } from '@/types';
import axios, { AxiosError } from 'axios';
import { API_BASE_URL, createAuthenticatedRequest, debugError } from './shared';

export async function register(
  first_name: string,
  last_name: string,
  email: string,
  password: string,
  username: string
): Promise<User | null> {
  try {
    const payload = { first_name, last_name, email, password, username };

    const response = await axios.post(`${API_BASE_URL}/auth/register`, payload);
    const { data } = response.data;
    return data;
  } catch (error) {
    debugError('Error registering:', error);
    return null;
  }
}

export async function login(
  identifier: string,
  password: string
): Promise<User | null> {
  try {
    // The API expects username field, so we'll use the identifier as username
    const payload = { username: identifier, password };

    const response = await axios.post(`${API_BASE_URL}/auth/login`, payload);
    const { data } = response.data;

    // Store the access token if it's included in the response
    if (data?.access_token) {
      localStorage.setItem('fifa-tracker-token', data.access_token);
    }

    // Store refresh token if provided
    if (data?.refresh_token) {
      localStorage.setItem('fifa-tracker-refresh-token', data.refresh_token);
    }

    return data;
  } catch (error) {
    debugError('Error logging in:', error);
    if (axios.isAxiosError(error)) {
      debugError('Login error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        },
      });
    }
    return null;
  }
}

export async function onGoogleSignInClick(): Promise<void> {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/google/login`);
    const { data } = response.data;
    window.location.href = data.auth_url;
  } catch (error) {
    debugError('Error initiating Google Sign-In:', error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
    }
    throw new Error('Failed to initiate Google Sign-In. Please try again.');
  }
}

export async function handleGoogleCallback(
  token: string
): Promise<User | null> {
  try {
    // Store the token temporarily
    localStorage.setItem('fifa-tracker-token', token);

    // Fetch user data using the token
    const axiosInstance = createAuthenticatedRequest();
    const response = await axiosInstance.get('/auth/me');
    const { data: userData } = response.data;

    // Store user data
    localStorage.setItem('fifa-tracker-user', JSON.stringify(userData));

    return userData;
  } catch (error) {
    debugError('Error handling Google callback:', error);
    // Clear tokens on error
    localStorage.removeItem('fifa-tracker-token');
    localStorage.removeItem('fifa-tracker-refresh-token');
    return null;
  }
}

export async function refreshToken(): Promise<string | null> {
  try {
    const refreshToken = localStorage.getItem('fifa-tracker-refresh-token');
    if (!refreshToken) {
      return null;
    }

    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refresh_token: refreshToken,
    });
    const { data } = response.data;

    if (data?.access_token) {
      localStorage.setItem('fifa-tracker-token', data.access_token);
      return data.access_token;
    }

    return null;
  } catch (error) {
    debugError('Error refreshing token:', error);
    // Clear tokens on refresh failure
    localStorage.removeItem('fifa-tracker-token');
    localStorage.removeItem('fifa-tracker-refresh-token');
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    const response = await axiosInstance.get('/auth/me');
    const { data } = response.data;
    return data;
  } catch (error) {
    debugError('Error fetching current user:', error);
    return null;
  }
}

export async function checkUsernameAvailability(
  username: string
): Promise<boolean> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    const payload = { username: username };
    const response = await axiosInstance.post(`/auth/check-username`, payload);
    const { data } = response.data;
    return !data.exists;
  } catch (error) {
    debugError('Error checking username availability:', error);
    // If the API call fails, we'll assume the username is taken to be safe
    return false;
  }
}

export async function deleteUserAccount(
  confirmationText: string
): Promise<boolean> {
  try {
    const axiosInstance = createAuthenticatedRequest();
    await axiosInstance.delete('/auth/me', {
      data: { confirmation_text: confirmationText },
    });
    return true;
  } catch (error) {
    debugError('Error deleting user account:', error);
    return false;
  }
}
