<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as zod from 'zod';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const errorMsg = ref('');

const validationSchema = toTypedSchema(
  zod.object({
    username: zod.string().min(3, { message: 'Username must be at least 3 characters' }),
    password: zod.string().min(6, { message: 'Password must be at least 6 characters' }),
  })
);

const { handleSubmit, errors, defineField, isSubmitting } = useForm({
  validationSchema,
});

const [username, usernameAttrs] = defineField('username');
const [password, passwordAttrs] = defineField('password');

const onSubmit = handleSubmit(async (values) => {
  errorMsg.value = '';
  try {
    await authStore.login(values);
    await router.push('/dashboard');
  } catch (err: any) {
    if (err.response?.status === 401) {
        errorMsg.value = 'Invalid credentials';
    } else {
        errorMsg.value = 'An error occurred. Please try again.';
    }
  }
});
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
    <div class="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-10 border border-white/20 transform transition-all hover:scale-[1.01]">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">Welcome Back</h1>
        <p class="text-gray-500 text-sm">Sign in to access your Pokemon collection</p>
      </div>

      <form @submit="onSubmit" class="space-y-6">
        <div>
          <label class="block mb-2 text-sm font-semibold text-gray-700" for="username">Username</label>
          <div class="relative">
             <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                 </svg>
             </div>
             <input
                v-model="username"
                v-bind="usernameAttrs"
                id="username"
                type="text"
                placeholder="Enter your username"
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
                :class="{ 'border-red-500 focus:ring-red-500': errors.username }"
              />
          </div>
          <p class="mt-2 text-xs text-red-500 font-medium" v-if="errors.username">{{ errors.username }}</p>
        </div>
        
        <div>
          <label class="block mb-2 text-sm font-semibold text-gray-700" for="password">Password</label>
           <div class="relative">
             <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                 </svg>
             </div>
              <input
                v-model="password"
                v-bind="passwordAttrs"
                id="password"
                type="password"
                placeholder="Enter your password"
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
                :class="{ 'border-red-500 focus:ring-red-500': errors.password }"
              />
          </div>
          <p class="mt-2 text-xs text-red-500 font-medium" v-if="errors.password">{{ errors.password }}</p>
        </div>

        <div v-if="errorMsg" class="rounded-lg bg-red-50 p-4 border border-red-200">
           <div class="flex">
             <div class="flex-shrink-0">
               <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                 <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
               </svg>
             </div>
             <div class="ml-3">
               <p class="text-sm text-red-700 font-medium">{{ errorMsg }}</p>
             </div>
           </div>
        </div>

        <div>
          <button
            :disabled="isSubmitting"
            type="submit"
            class="group w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30 transition-all duration-200 transform hover:-translate-y-0.5"
          >
             <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
            {{ isSubmitting ? 'Signing in...' : 'Sign In' }}
          </button>
        </div>
      </form>
      
      <div class="mt-8 text-center">
         <p class="text-sm text-gray-600">
            Don't have an account? 
            <router-link to="/register" class="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                Create Account
            </router-link>
         </p>
      </div>
    </div>
  </div>
</template>
