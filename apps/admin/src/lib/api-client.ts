import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

export const apiClient = axios.create({ 
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1' 
});

apiClient.interceptors.request.use(
  async (config) => {
    // Only fetch session on the client side
    if (typeof window !== "undefined") {
      const session = await getSession();
      if (session && (session as any).accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (typeof window !== "undefined") {
          const session = await getSession();
          
          if (session && (session as any).refreshToken) {
            // Attempt to refresh token
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/auth/refresh`, {
              refreshToken: (session as any).refreshToken
            });

            if (res.data?.success && res.data?.data?.accessToken) {
              const newAccessToken = res.data.data.accessToken;
              
              // We optionally could update NextAuth session here, 
              // but for now we just retry the failed request with the new token
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              
              // Also update the interceptor to use the new token for future requests? 
              // If we don't update NextAuth session, subsequent requests might fail again until NextAuth session is updated.
              // We'll update the config directly.
              return apiClient(originalRequest);
            }
          }
          
          // If no refresh token or refresh failed
          await signOut({ callbackUrl: '/login' });
        }
        return Promise.reject(error);
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          await signOut({ callbackUrl: '/login' });
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);