<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { useAuthStore } from "../../stores/auth";
import { navigateTo } from "#app";
import { ArrowLeft, Check, Info, XCircle, Loader2 } from "lucide-vue-next";
import { useApi } from "../../composables/useApi";

definePageMeta({
  middleware: ["auth", "manager"],
});

const route = useRoute();
const { $api } = useApi();
const { user: currentUser } = useAuthStore();

const user = ref<any>(null);
const loading = ref(true);
const error = ref("");
const editing = ref(false);
const editName = ref("");
const editEmail = ref("");
const editPassword = ref("");
const editError = ref("");
const editLoading = ref(false);
const showDeleteConfirm = ref(false);
const deleteLoading = ref(false);
const deleteError = ref("");

onMounted(async () => {
  try {
    const res = await $api(`/users/${route.params.id}`);
    user.value = res.data;
  } catch (err: any) {
    error.value = err?.data?.message || "Failed to load user";
  } finally {
    loading.value = false;
  }
});

function userEdit() {
  editing.value = true;
  editName.value = user.value?.name || "";
  editEmail.value = user.value?.email || "";
  editPassword.value = "";
  editError.value = "";
}

async function submitEdit() {
  editError.value = "";
  editLoading.value = true;
  try {
    const body = { name: editName.value, email: editEmail.value };
    if (editPassword.value) body.password = editPassword.value;
    const res = await $api(`/users/${route.params.id}`, {
      method: "PUT",
      body,
    });
    user.value = res.data;
    editing.value = false;
  } catch (err: any) {
    editError.value = err?.data?.message || "Failed to update user.";
  } finally {
    editLoading.value = false;
  }
}

async function deleteUser() {
  deleteError.value = "";
  deleteLoading.value = true;
  try {
    await $api(`/users/${route.params.id}`, { method: "DELETE" });
    navigateTo("/users");
  } catch (err: any) {
    deleteError.value = err?.data?.message || "Failed to delete user.";
  } finally {
    deleteLoading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <ArrowLeft class="w-4 h-4 mr-2" />
          Back to Users
        </NuxtLink>
      </div>

      <!-- Loading  -->
      <div v-if="loading" class="bg-white rounded-lg shadow p-8 text-center">
        <div class="flex items-center justify-center">
          <Loader2 class="animate-spin h-8 w-8 text-blue-600 mr-3" />
          <span class="text-lg text-gray-600">Loading user details...</span>
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
              Error loading user details
            </h3>
            <p class="mt-1 text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- User Details -->
      <div v-else class="space-y-6">
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div
            class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between"
          >
            <h2 class="text-lg font-semibold text-gray-900">
              User Information
            </h2>
            <div class="flex gap-2">
              <button
                v-if="!editing"
                @click="userEdit"
                class="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Edit User
              </button>
              <button
                v-if="!editing"
                @click="showDeleteConfirm = true"
                class="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
              >
                Delete User
              </button>
            </div>
          </div>
          <div class="px-6 py-4 space-y-4">
            <form v-if="editing" @submit.prevent="submitEdit" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1"
                  >Name</label
                >
                <input
                  v-model="editName"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1"
                  >Email</label
                >
                <input
                  v-model="editEmail"
                  type="email"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1"
                  >Password</label
                >
                <input
                  v-model="editPassword"
                  type="password"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Leave blank to keep unchanged"
                />
              </div>
              <div v-if="editError" class="text-red-600 text-sm">
                {{ editError }}
              </div>
              <div class="flex gap-2">
                <button
                  type="button"
                  @click="editing = false"
                  class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="editLoading"
                  class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                >
                  <Loader2
                    v-if="editLoading"
                    class="animate-spin h-4 w-4 inline-block mr-2"
                  />
                  Save Changes
                </button>
              </div>
            </form>
            <template v-else>
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
            </template>
          </div>
        </div>

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
                  <Check class="w-3 h-3 mr-1.5" />
                  {{ permission }}
                </span>
              </div>
              <p class="text-sm text-gray-500 pt-2 border-t border-gray-100">
                Total permissions: {{ user.role.permissionKeys.length }}
              </p>
            </div>
            <div v-else class="text-center py-8">
              <Info class="mx-auto h-12 w-12 text-gray-400" />
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

  <!-- Delete Confirmation Dialog -->
  <div
    v-if="showDeleteConfirm"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-semibold mb-4">Confirm Delete</h3>
      <p class="text-gray-600 mb-6">
        Are you sure you want to delete this user? This action cannot be undone.
      </p>
      <div v-if="deleteError" class="text-red-600 text-sm mb-2">
        {{ deleteError }}
      </div>
      <div class="flex gap-3 justify-end">
        <button
          @click="showDeleteConfirm = false"
          class="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          @click="deleteUser"
          :disabled="deleteLoading"
          class="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 disabled:opacity-60"
        >
          <Loader2
            v-if="deleteLoading"
            class="animate-spin h-4 w-4 inline-block mr-2"
          />
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
