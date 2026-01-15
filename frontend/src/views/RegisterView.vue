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
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const validationSchema = toTypedSchema(
  zod.object({
    username: zod.string().min(3, { message: 'Username must be at least 3 characters' }),
    password: zod.string()
      .min(6, { message: 'Password must be at least 6 characters' })
      .regex(/(?=.*[a-z])/, { message: 'Must contain at least one lowercase letter' })
      .regex(/(?=.*[A-Z])/, { message: 'Must contain at least one uppercase letter' })
      .regex(/(?=.*\d)/, { message: 'Must contain at least one number' })
      .regex(/(?=.*[@$!%*?&])/, { message: 'Must contain at least one special character (@$!%*?&)' }),
    confirmPassword: zod.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
);

const { handleSubmit, errors, defineField, isSubmitting, setFieldValue } = useForm({
  validationSchema,
});

const [username, usernameAttrs] = defineField('username');
const [password, passwordAttrs] = defineField('password');
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword');

const generatePassword = () => {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&";
    let newPassword = "";
    
    // Ensure at least one of each required type
    newPassword += "a"; // Lower
    newPassword += "A"; // Upper
    newPassword += "1"; // Number
    newPassword += "@"; // Special

    for (let i = 4; i < length; ++i) {
        newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    // Shuffle the password
    newPassword = newPassword.split('').sort(() => 0.5 - Math.random()).join('');
    
    setFieldValue('password', newPassword);
    setFieldValue('confirmPassword', newPassword);
};

const onSubmit = handleSubmit(async (values) => {
  errorMsg.value = '';
  try {
    await authStore.register({
        username: values.username,
        password: values.password
    });
    await router.push('/login');
  } catch (err: any) {
      if (err.response?.data?.message) {
          if (Array.isArray(err.response.data.message)) {
              errorMsg.value = err.response.data.message.join(', ');
          } else {
              errorMsg.value = err.response.data.message;
          }
      } else if (err.response?.status === 409) {
          errorMsg.value = 'Username already exists';
      } else {
          errorMsg.value = 'Registration failed. Please try again.';
      }
  }
});
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
    <div class="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-10 border border-white/20 transform transition-all hover:scale-[1.01]">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">Create Account</h1>
        <p class="text-gray-500 text-sm">Join the community and start collecting</p>
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
                placeholder="Choose a username"
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
                :type="showPassword ? 'text' : 'password'"
                 placeholder="6+ chars, 1 Upper, 1 Lower, 1 Number, 1 Special"
                class="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
                :class="{ 'border-red-500 focus:ring-red-500': errors.password }"
              />
              <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
              </button>
          </div>
          <p class="mt-2 text-xs text-red-500 font-medium" v-if="errors.password">{{ errors.password }}</p>
          
          <button type="button" @click="generatePassword" class="mt-2 text-xs flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
             </svg>
             Generate Strong Password
          </button>
        </div>

        <div>
          <label class="block mb-2 text-sm font-semibold text-gray-700" for="confirmPassword">Confirm Password</label>
           <div class="relative">
             <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                 </svg>
             </div>
             <input
                v-model="confirmPassword"
                v-bind="confirmPasswordAttrs"
                id="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                 placeholder="Repeat your password"
                class="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
                :class="{ 'border-red-500 focus:ring-red-500': errors.confirmPassword }"
              />
              <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
              </button>
          </div>
          <p class="mt-2 text-xs text-red-500 font-medium" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</p>
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
            {{ isSubmitting ? 'Creating account...' : 'Create Account' }}
          </button>
        </div>
      </form>

      <div class="mt-8 text-center">
         <p class="text-sm text-gray-600">
            Already have an account? 
            <router-link to="/login" class="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                Sign In
            </router-link>
         </p>
      </div>
    </div>
  </div>
</template>
