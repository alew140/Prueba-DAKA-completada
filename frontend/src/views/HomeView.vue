<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex flex-col items-center justify-center text-white px-4 text-center overflow-hidden relative">
    
    <!-- Background Elements -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div class="absolute -top-24 -left-24 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div class="absolute top-0 -right-4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-32 left-20 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
    </div>

    <div class="z-10 relative max-w-3xl mx-auto">
        <div class="mb-8 inline-block p-4 bg-white/10 backdrop-blur-md rounded-full shadow-2xl border border-white/20 animate-bounce-slow">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
            </svg>
        </div>

        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-white to-purple-200 drop-shadow-sm">
          PokeRealTime
        </h1>
        
        <p class="text-xl md:text-2xl text-indigo-100 mb-10 font-light leading-relaxed">
          The ultimate real-time Pokemon collection experience. <br/>Catch, collect, and manage your sprites instantly.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink 
            to="/login"
            class="px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1 text-lg"
          >
            Login
          </RouterLink>
          <RouterLink 
            to="/register"
            class="px-8 py-4 bg-indigo-600/50 backdrop-blur-sm border border-indigo-400/50 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-600/70 transition-all duration-300 transform hover:-translate-y-1 text-lg hover:border-indigo-300"
          >
            Create Account
          </RouterLink>
        </div>
    </div>

    <!-- Footer -->
    <div class="absolute bottom-6 text-indigo-300/60 text-sm z-10">
      &copy; 2026 PokeRealTime Inc. All rights reserved.
    </div>
  </div>
</template>

<style scoped>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
.animate-bounce-slow {
    animation: bounce 3s infinite;
}
</style>
