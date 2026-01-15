import { ref, onMounted, onUnmounted } from 'vue';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/auth';

export function usePokemonSocket() {
    const authStore = useAuthStore();
    const socket = ref<Socket | null>(null);
    const sprites = ref<any[]>([]);
    const isConnected = ref(false);

    const connect = () => {
        if (!authStore.isAuthenticated) return;

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        socket.value = io(apiUrl, {
            withCredentials: true,
            transports: ['websocket'],
        });

        socket.value.on('connect', () => {
            isConnected.value = true;
        });

        socket.value.on('disconnect', () => {
            isConnected.value = false;
        });

        socket.value.on('new-sprite', (pokemon) => {
            sprites.value.unshift({ ...pokemon, instanceId: crypto.randomUUID() });
        });

        socket.value.on('error', (err) => {
            console.error('WebSocket Error:', err);
        });
    };

    const disconnect = () => {
        if (socket.value) {
            socket.value.disconnect();
            socket.value = null;
        }
    };

    const requestSprite = () => {
        if (socket.value && isConnected.value) {
            socket.value.emit('request-sprite');
        }
    };

    const deleteSprite = (instanceId: string, id: number) => {
        const index = sprites.value.findIndex(p => p.instanceId === instanceId);
        if (index !== -1) {
            sprites.value.splice(index, 1);
            if (socket.value && isConnected.value) {
                socket.value.emit('delete-sprite', { id });
            }
        }
    };

    const deleteAll = () => {
        sprites.value = [];
    };

    onMounted(() => {
        connect();
    });

    onUnmounted(() => {
        disconnect();
    });

    return {
        sprites,
        isConnected,
        requestSprite,
        deleteSprite,
        deleteAll
    };
}
