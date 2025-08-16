<script setup lang="ts">
import { useApi } from "../../composables/useApi";
import { ref, onMounted } from "vue";
import {
  User,
  Loader2,
  XCircle,
  ChevronRight,
  Users,
  UserPlus,
  UserCircle,
  FileWarning,
} from "lucide-vue-next";

definePageMeta({
  middleware: ["auth", "manager"],
});

const { $api } = useApi();
const users = ref<any[]>([]);
const loading = ref(true);
const error = ref("");

onMounted(async () => {
  try {
    const response = await $api("/users");
    users.value = response.data;
  } catch (err: any) {
    error.value = err?.data?.message || "Failed to load users";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center">
            <NuxtLink
              to="/"
              class="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ChevronRight class="w-5 h-5 mr-2 rotate-180" />
              Back to Dashboard
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Main  -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!--  Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">User Management</h1>
          <p class="mt-2 text-sm text-gray-600">
            Manage user accounts and permissions
          </p>
        </div>

        <!-- Loading  -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="flex items-center">
            <Loader2 class="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600" />
            <span class="text-lg text-gray-600">Loading users...</span>
          </div>
        </div>

        <!-- Error  -->
        <div
          v-else-if="error"
          class="bg-red-50 border border-red-200 rounded-lg p-6"
        >
          <div class="flex">
            <XCircle class="w-6 h-6 text-red-400 mr-3" />
            <div>
              <h3 class="text-lg font-medium text-red-800">
                Error loading users
              </h3>
              <p class="mt-1 text-red-700">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Empty  -->
        <div v-else-if="users.length === 0" class="text-center py-12">
          <FileWarning class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-4 text-lg font-medium text-gray-900">No users found</h3>
          <p class="mt-2 text-gray-500">
            There are no users in the system yet.
          </p>
        </div>

        <!-- Users List -->
        <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul class="divide-y divide-gray-200">
            <li
              v-for="user in users"
              :key="user._id"
              class="hover:bg-gray-50 transition-colors"
            >
              <NuxtLink :to="`/users/${user._id}`" class="block">
                <div class="px-4 py-4 sm:px-6">
                  <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center">
                          <div class="flex-shrink-0">
                            <div
                              class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center"
                            >
                              <User class="w-6 h-6 text-gray-600" />
                            </div>
                          </div>
                          <div class="ml-4">
                            <p class="text-lg font-medium text-gray-900">
                              {{ user.email }}
                            </p>
                            <div class="flex items-center mt-1">
                              <div class="flex space-x-2">
                                <span
                                  v-if="user.role"
                                  :class="[
                                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                    user.role.toLowerCase() === 'manager'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-gray-100 text-gray-800',
                                  ]"
                                >
                                  {{ user.role }}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="ml-4 flex items-center">
                      <ChevronRight class="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>
