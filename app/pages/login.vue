<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useApi } from "../composables/useApi";
import { navigateTo } from "#app";
import { User, XCircle, LogIn, Loader2 } from "lucide-vue-next";

definePageMeta({
  middleware: "guest",
});

const email = ref("");
const password = ref("");
const errorMsg = ref<string | null>(null);
const isSubmitting = ref(false);

const auth = useAuthStore();
const { $api, token } = useApi();

async function submit() {
  errorMsg.value = null;
  if (!email.value || !password.value) {
    errorMsg.value = "Please enter both email and password.";
    return;
  }

  isSubmitting.value = true;
  try {
    const res = (await $api("/auth/login", {
      method: "POST",
      body: { email: email.value, password: password.value },
    })) as any;
    auth.token = res.data.token;
    auth.user = res.data;
    auth.persist();
    token.value = res.data.token;
    await navigateTo("/");
  } catch (err: any) {
    const serverMsg =
      err?.data?.message ||
      err?.response?._data?.message ||
      err?.response?.statusText ||
      err?.message;
    errorMsg.value =
      err?.response?.status === 401
        ? serverMsg || "Invalid email or password."
        : serverMsg || "Something went wrong. Please try again.";
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
          <User class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900">Welcome Back</h1>
        <p class="mt-2 text-gray-600">Sign in to your account</p>
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
            <XCircle class="w-5 h-5 text-red-400 mr-2" />
            {{ errorMsg }}
          </div>
        </div>

        <div class="space-y-4">
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
              placeholder="Enter your password"
              autocomplete="current-password"
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
            <LogIn class="w-5 h-5 mr-2" />
            Sign In
          </span>
          <span v-else class="flex items-center justify-center">
            <Loader2 class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            Signing in...
          </span>
        </button>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            Don't have an account?
            <NuxtLink
              to="/register"
              class="font-medium text-green-600 hover:text-green-500 transition-colors"
              >Create one now</NuxtLink
            >
          </p>
        </div>
      </form>
    </div>
  </div>
</template>
