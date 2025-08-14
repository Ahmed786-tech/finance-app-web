<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useApi } from "../composables/useApi";
import { navigateTo } from "#app";

definePageMeta({
  middleware: "guest",
});

const email = ref("");
const name = ref("");
const password = ref("");
const errorMsg = ref<string | null>(null);
const isSubmitting = ref(false);
const auth = useAuthStore();
const { $api, token } = useApi();

async function submit() {
  errorMsg.value = null;
  if (!name.value || !email.value || !password.value) {
    errorMsg.value = "Please fill in all fields.";
    return;
  }
  if (password.value.length < 6) {
    errorMsg.value = "Password must be at least 6 characters long.";
    return;
  }

  isSubmitting.value = true;
  try {
    const res = (await $api("/auth/register", {
      method: "POST",
      body: { name: name.value, email: email.value, password: password.value },
    })) as any;
    auth.token = res.data.token;
    auth.user = res.data;
    auth.persist();
    token.value = res.data.token;
    return navigateTo("/");
  } catch (err: any) {
    errorMsg.value =
      err?.data?.message ||
      err?.response?._data?.message ||
      err?.message ||
      "Registration failed.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div
    class="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-green-50 to-emerald-100"
  >
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 mb-4 bg-green-600 rounded-full"
        >
          <svg
            class="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            ></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900">Create Account</h1>
        <p class="mt-2 text-gray-600">Join our money management platform</p>
      </div>

      <form
        @submit.prevent="submit"
        class="bg-white rounded-xl shadow-lg p-8 space-y-6"
      >
        <div
          v-if="errorMsg"
          class="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg"
        >
          <div class="flex">
            <svg
              class="w-5 h-5 text-red-400 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              ></path>
            </svg>
            {{ errorMsg }}
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-2"
              >Name</label
            >
            <input
              id="name"
              v-model="name"
              type="text"
              placeholder="Enter your Name"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              required
            />
          </div>
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-2"
              >Email Address</label
            >
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="Enter your email"
              autocomplete="email"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 mb-2"
              >Password</label
            >
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Create a password"
              autocomplete="new-password"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              required
            />
          </div>
        </div>

        <button
          :disabled="isSubmitting"
          type="submit"
          class="w-full py-3 px-4 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="!isSubmitting" class="flex items-center justify-center">
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              ></path>
            </svg>
            Create Account
          </span>
          <span v-else class="flex items-center justify-center">
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Creating account...
          </span>
        </button>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <NuxtLink
              to="/login"
              class="font-medium text-green-600 hover:text-green-500 transition-colors"
              >Sign in here</NuxtLink
            >
          </p>
        </div>
      </form>
    </div>
  </div>
</template>
