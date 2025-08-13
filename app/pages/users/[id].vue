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
    user.value = res;
  } catch (err: any) {
    error.value = err?.data?.message || "Failed to load user";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="max-w-xl p-6 mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">User Details</h1>
      <NuxtLink to="/users" class="text-sm text-blue-600 hover:underline"
        >← Back to Users</NuxtLink
      >
    </div>

    <div v-if="loading">Loading user...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else>
      <p class="mb-2"><strong>Name:</strong> {{ user.name }}</p>
      <p class="mb-2"><strong>Email:</strong> {{ user.email }}</p>
      <p class="mb-2">
        <strong>Role:</strong> {{ user.role?.name || "No role assigned" }}
      </p>
      <p class="mb-2">
        <strong>Role Description:</strong>
        {{ user.role?.description || "No description" }}
      </p>

      <div class="mb-4">
        <label class="block mb-1 font-medium">Permissions:</label>
        <div v-if="user.role?.permissionKeys?.length" class="space-y-1">
          <span
            v-for="permission in user.role.permissionKeys"
            :key="permission"
            class="inline-block px-2 py-1 mr-2 mb-2 text-xs bg-blue-100 text-blue-800 rounded"
          >
            {{ permission }}
          </span>
        </div>
        <p v-else class="text-gray-500 text-sm">No permissions assigned</p>
      </div>

      <!-- Note: Role management is now handled through the role object structure -->
      <!-- This functionality may need to be updated based on your backend API -->
    </div>
  </div>
</template>
