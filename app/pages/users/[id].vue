<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { useApi } from "../../composables/useApi";
import { useAuthStore } from "../../stores/auth";
import { navigateTo } from "#app";

definePageMeta({
  middleware: ["auth", "manager"],
});

const route = useRoute();
const { $fetcher } = useApi();
const { user: currentUser } = useAuthStore();

const user = ref<any>(null);
const loading = ref(true);
const error = ref("");

onMounted(async () => {
  try {
    const res = await $fetcher(`/users/${route.params.id}`);
    user.value = res.data;
  } catch (err: any) {
    error.value = err?.data?.message || "Failed to load user";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">User Details</h1>
          <p class="mt-1 text-sm text-gray-600">
            View user information and permissions
          </p>
        </div>
        <NuxtLink
          to="/users"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
          Back to Users
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow p-8 text-center">
        <div class="flex items-center justify-center">
          <svg
            class="animate-spin h-8 w-8 text-blue-600 mr-3"
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
          <span class="text-lg text-gray-600">Loading user details...</span>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-50 border border-red-200 rounded-lg p-6"
      >
        <div class="flex">
          <svg
            class="w-6 h-6 text-red-400 mr-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <div>
            <h3 class="text-lg font-medium text-red-800">
              Error loading user details
            </h3>
            <p class="mt-1 text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- User Details -->
      <div v-else class="space-y-6">
        <!-- User Information Card -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 class="text-lg font-semibold text-gray-900">
              User Information
            </h2>
          </div>
          <div class="px-6 py-4 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1"
                  >Name</label
                >
                <p class="text-sm text-gray-900 font-medium">
                  {{ user.name || "Not provided" }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1"
                  >Email</label
                >
                <p class="text-sm text-gray-900 font-medium">
                  {{ user.email }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1"
                  >Role</label
                >
                <p class="text-sm text-gray-900 font-medium">
                  {{ user.role?.name || "No role assigned" }}
                </p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1"
                >Role Description</label
              >
              <p class="text-sm text-gray-900">
                {{ user.role?.description || "No description" }}
              </p>
            </div>
          </div>
        </div>

        <!-- Permissions Card -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 class="text-lg font-semibold text-gray-900">Permissions</h2>
          </div>
          <div class="px-6 py-4">
            <div v-if="user.role?.permissionKeys?.length" class="space-y-3">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="permission in user.role.permissionKeys"
                  :key="permission"
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                >
                  <svg
                    class="w-3 h-3 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  {{ permission }}
                </span>
              </div>
              <p class="text-sm text-gray-500 pt-2 border-t border-gray-100">
                Total permissions: {{ user.role.permissionKeys.length }}
              </p>
            </div>
            <div v-else class="text-center py-8">
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">
                No permissions
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                This user has no permissions assigned.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
