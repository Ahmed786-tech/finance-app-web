<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { useApi } from '../composables/useApi';
const email = ref('');
const password = ref('');
const auth = useAuthStore();
const { $fetcher, token } = useApi();

async function submit() {
  const res = await $fetcher('/auth/register', { method: 'POST', body: { email: email.value, password: password.value }});
  auth.token = res.token; auth.user = res.user; auth.persist(); token.value = res.token;
  return navigateTo('/');
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <form @submit.prevent="submit" class="w-full max-w-sm space-y-4 p-6 border rounded">
      <h1 class="text-xl font-semibold">Register</h1>
      <input v-model="email" type="email" placeholder="Email" class="w-full border p-2 rounded"/>
      <input v-model="password" type="password" placeholder="Password" class="w-full border p-2 rounded"/>
      <button class="w-full py-2 border rounded">Create account</button>
      <p class="text-sm">Have an account? <NuxtLink to="/login" class="underline">Login</NuxtLink></p>
    </form>
  </div>
</template>
