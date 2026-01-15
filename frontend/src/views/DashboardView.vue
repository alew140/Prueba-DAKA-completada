<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { usePokemonSocket } from '@/composables/usePokemonSocket';

const authStore = useAuthStore();
const { sprites, isConnected, requestSprite, deleteSprite, deleteAll } = usePokemonSocket();
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 bg-gradient-to-br from-indigo-50 to-blue-100">
    <!-- Navbar -->
    <nav class="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-indigo-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center">
             <div class="p-2 bg-indigo-600 rounded-lg shadow-lg mr-3">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
             </div>
             <h1 class="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">PokeRealTime</h1>
          </div>
          <div class="flex items-center space-x-4">
             <div class="flex items-center px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm">
                <span :class="{'bg-green-500': isConnected, 'bg-red-500': !isConnected}" class="h-2.5 w-2.5 rounded-full mr-2 animate-pulse"></span>
                <span class="text-sm font-medium text-gray-600">{{ isConnected ? 'Online' : 'Offline' }}</span>
             </div>
             <div class="hidden md:flex items-center text-sm font-medium text-gray-600 border-r border-gray-300 pr-4">
                {{ authStore.user?.username }}
             </div>
            <button
               @click="authStore.logout()"
               class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full">
      
        <!-- Action Bar -->
        <div class="flex flex-col sm:flex-row justify-between items-center mb-10 bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50">
            <div class="mb-4 sm:mb-0">
                <h2 class="text-3xl font-bold text-gray-800">Your Collection</h2>
                <p class="text-gray-500 mt-1">Gotta catch 'em all! Click requests to find new Pokemon.</p>
            </div>
            <div class="flex spaxe-x-4 gap-4">
                <button 
                    @click="requestSprite" 
                    :disabled="!isConnected"
                    class="group relative inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span class="absolute top-0 right-0 -mt-2 -mr-2 flex h-5 w-5">
                      <span v-if="isConnected" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span v-if="isConnected" class="relative inline-flex rounded-full h-5 w-5 bg-indigo-500"></span>
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Find Pokemon
                </button>
                
                <button 
                    @click="deleteAll" 
                    class="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:text-red-600 hover:border-red-300"
                    v-if="sprites.length > 0"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear All
                </button>
            </div>
        </div>

        <!-- Empty State -->
        <transition
             enter-active-class="transition duration-300 ease-out" 
             enter-from-class="transform scale-95 opacity-0" 
             enter-to-class="transform scale-100 opacity-100"
        >
            <div v-if="sprites.length === 0" class="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300">
                <div class="mx-auto h-24 w-24 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
                <h3 class="mt-2 text-xl font-medium text-gray-900">No Pokemon found yet</h3>
                <p class="mt-1 text-gray-500">Wait for the signal and click the button to catch one!</p>
            </div>
        </transition>

        <!-- Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            <transition-group 
                enter-active-class="transform transition duration-500 ease-out" 
                enter-from-class="opacity-0 scale-50 translate-y-8" 
                enter-to-class="opacity-100 scale-100 translate-y-0"
                leave-active-class="transform transition duration-300 ease-in absolute w-full z-0 h-full"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-75"
                move-class="transition duration-500 ease-in-out"
            >
                <div v-for="(pokemon, index) in sprites" :key="pokemon.instanceId" class="relative group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                    
                    <!-- Card Content -->
                    <div class="p-6 flex flex-col items-center z-10 relative">
                        <div class="relative w-32 h-32 mb-4">
                             <!-- Glow Effect -->
                            <div class="absolute inset-0 bg-gradient-to-tr from-indigo-200 to-purple-200 rounded-full opacity-0 group-hover:opacity-70 blur-xl transition-opacity duration-300"></div>
                            <img :src="pokemon.sprites.front_default" :alt="pokemon.name" class="w-full h-full object-contain relative z-10 drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                        </div>
                        
                        <h3 class="capitalize font-bold text-lg text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">{{ pokemon.name }}</h3>
                        <span class="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">#{{ pokemon.id }}</span>
                    </div>

                    <!-- Delete Overlay (Mobile friendly: always button, Desktop: hover) -->
                    <div class="absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 z-20">
                        <button 
                            @click="deleteSprite(pokemon.instanceId, pokemon.id)"
                            class="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                            title="Release Pokemon"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </transition-group>
        </div>
    </main>
  </div>
</template>
