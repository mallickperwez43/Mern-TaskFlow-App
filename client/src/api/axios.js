import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

// api.interceptors.response.use((response) => response, async (error) => {
//     const originalRequest = error.config;

//     if (originalRequest.url.includes('/user/login')) {
//         return Promise.reject(error);
//     }

//     if (originalRequest.url.includes('/user/refresh')) {
//         useAuthStore.getState().logout();
//         // Don't use window.location.href here if you can avoid it, 
//         // but if you do, ensure state is cleared first.
//         if (window.location.pathname !== '/login') {
//             window.location.href = '/login?message=session_expired';
//         }
//         return Promise.reject(error);
//     }

//     if (error.response?.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true;

//         try {
//             await axios.post(
//                 'http://localhost:5000/api/v1/user/refresh',
//                 {},
//                 { withCredentials: true }
//             );

//             return api(originalRequest);
//         } catch (error) {
//             useAuthStore.getState().logout();
//             if (window.location.pathname !== '/login') {
//                 window.location.href = '/login?message=session_expired';
//             }
//             return Promise.reject(error);
//         }
//     }

//     return Promise.reject(error);
// })
api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;

    // 1. Skip logic for login
    if (originalRequest.url.includes('/user/login')) {
        return Promise.reject(error);
    }

    // 2. Handle refresh token failure 
    if (originalRequest.url.includes('/user/refresh')) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
    }

    // 3. Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/user/refresh`,
                {},
                { withCredentials: true }
            );
            return api(originalRequest);
        } catch (refreshError) {
            useAuthStore.getState().logout();

            const wasLoggedIn = useAuthStore.getState().isAuthenticated;

            if (wasLoggedIn && window.location.pathname !== '/login') {
                window.location.href = '/login?message=session_expired';
            }
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
});
export default api;