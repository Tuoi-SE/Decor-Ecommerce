import axios from 'axios';

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for cookies (refresh token)
});

// Request Interceptor: Attach Access Token
http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Refresh Token
http.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Build absolute URL for login redirect check if needed, but usually we just redirect via router or state
        // Check if error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Call refresh token endpoint (cookies are sent automatically withCredentials: true)
                const response = await http.post('/auth/refresh'); // Use same http instance? No, might loop. Better use a clean separate instance or just axios.post if simple. 
                // actually using http.post(refresh) might trigger another 401 loop if refresh fails. 
                // But refresh endpoint is usually public or cookie based, not bearer based. 
                // Wait, current backend refresh is POST /auth/refresh. It uses cookie.
                // It returns { accessToken: ... }

                const { accessToken } = response.data;

                // Save new token
                localStorage.setItem('accessToken', accessToken);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return http(originalRequest);
            } catch (refreshError) {
                // Refresh failed (token expired or invalid)
                // Clear local storage and redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                // Ideally emit an event or use a callback to redirect user to login
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default http;
