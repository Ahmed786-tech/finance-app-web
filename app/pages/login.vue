<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useApi } from '../composables/useApi'
import { navigateTo } from '#app'

const email = ref('')
const password = ref('')
const errorMsg = ref<string | null>(null)
const isSubmitting = ref(false)

const auth = useAuthStore()
const { $fetcher, token } = useApi()

async function submit() {
  errorMsg.value = null

  // Basic client-side validation
  if (!email.value || !password.value) {
    errorMsg.value = 'Please enter both email and password.'
    return
  }

  isSubmitting.value = true

  try {
    const res = await $fetcher('/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
    })

    // Set auth state
    auth.token = res.token
    auth.user = res.user
    auth.persist()
    token.value = res.token

    await navigateTo('/')
  } catch (err: any) {
    const serverMsg =
      err?.data?.message ||
      err?.response?._data?.message ||
      err?.response?.statusText ||
      err?.message

    if (err?.response?.status === 401) {
      errorMsg.value = serverMsg || 'Invalid email or password.'
    } else {
      errorMsg.value = serverMsg || 'Something went wrong. Please try again.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen px-4">
    <form @submit.prevent="submit" class="w-full max-w-sm p-6 space-y-4 bg-white border rounded shadow">
      <h1 class="text-xl font-semibold text-center">Login</h1>

      <div v-if="errorMsg" class="p-3 text-sm text-red-700 border border-red-300 rounded bg-red-50" aria-live="assertive">
        {{ errorMsg }}
      </div>

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        autocomplete="email"
        class="w-full p-2 border rounded focus:outline-none focus:ring"
        required
        aria-label="Email"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        autocomplete="current-password"
        class="w-full p-2 border rounded focus:outline-none focus:ring"
        required
        aria-label="Password"
      />

      <button
        :disabled="isSubmitting"
        type="submit"
        class="w-full py-2 font-medium text-white bg-blue-500 border rounded hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span v-if="!isSubmitting">Login</span>
        <span v-else>Logging in…</span>
      </button>

      <p class="text-sm text-center">
        Don't have an account?
        <NuxtLink to="/register" class="text-blue-600 hover:underline">Register</NuxtLink>
      </p>
    </form>
  </div>
</template>
