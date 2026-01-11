import http from '@/lib/http';
import { useAuthStore } from '@/hooks/useAuthStore';

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: number;
        email: string;
        fullName: string;
        role: 'admin' | 'staff' | 'customer';
        avatarUrl?: string;
    };
}

export const AuthService = {
    login: async (email: string, password: string) => {
        // Current backend expects { email, password }
        const response = await http.post<LoginResponse>('/auth/login', { email, password });
        return response.data;
    },

    logout: async () => {
        try {
            await http.post('/auth/logout');
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            useAuthStore.getState().logout();
        }
    },

    // Helper to handle login success and state update
    handleLoginSuccess: (data: LoginResponse) => {
        const { user, accessToken } = data;
        useAuthStore.getState().login(user, accessToken);
    }
};
