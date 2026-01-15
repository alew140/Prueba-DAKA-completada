import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

// Ensure cookies are sent with requests
axios.defaults.withCredentials = true;

export const useAuthStore = defineStore('auth', () => {
    const user = ref<any | null>(null);
    const isAuthenticated = computed(() => !!user.value);

    async function checkAuth() {
        try {
            const response = await axios.get('/api/auth/profile');
            user.value = response.data;
        } catch (error) {
            user.value = null;
        }
    }

    async function login(credentials: any) {
        try {
            const response = await axios.post('/api/auth/login', credentials);
            user.value = response.data.user;
        } catch (error) {
            throw error;
        }
    }

    async function register(credentials: any) {
        try {
            await axios.post('/api/auth/register', credentials);
        } catch (error) {
            throw error;
        }
    }

    async function logout() {
        try {
            await axios.post('/api/auth/logout');
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            user.value = null;
        }
    }

    return { user, isAuthenticated, login, register, logout, checkAuth };
});
