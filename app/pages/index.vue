<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { navigateTo } from "#app";
import {
  User,
  Users,
  Plus,
  ChevronRight,
  Loader2,
  LogOut,
  FileText,
  UserPlus,
} from "lucide-vue-next";

definePageMeta({
  middleware: "auth",
});

const auth = useAuthStore();

function logout() {
  const { token } = useApi();
  auth.logout();
  token.value = null;
  navigateTo("/login");
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="flex items-center">
                <div
                  class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
                >
                  <User class="w-5 h-5 text-white" />
                </div>
                <h1 class="ml-3 text-xl font-semibold text-gray-900">
                  Finance App
                </h1>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-700">
              Welcome, <span class="font-medium">{{ auth.user?.email }}</span>
              <span
                v-if="auth.isManager"
                class="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                >Manager</span
              >
            </div>
            <button
              @click="logout"
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <LogOut class="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white overflow-hidden shadow rounded-lg mb-8">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div
                  class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
                >
                  <User class="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div class="ml-4">
                <h2 class="text-lg font-medium text-gray-900">Welcome back!</h2>
                <p class="text-sm text-gray-500">
                  Manage your transactions and
                  {{
                    auth.isManager ? "users" : "view your financial activity"
                  }}.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div
                    class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <FileText class="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900">
                    View Transactions
                  </h3>
                  <p class="text-sm text-gray-500">
                    See all your financial transactions
                  </p>
                </div>
              </div>
              <div class="mt-6">
                <NuxtLink
                  to="/transactions"
                  class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View All
                </NuxtLink>
              </div>
            </div>
          </div>

          <div
            v-if="auth.isManager"
            class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div
                    class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"
                  >
                    <Plus class="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900">
                    Create Transaction
                  </h3>
                  <p class="text-sm text-gray-500">Add a new transaction</p>
                </div>
              </div>
              <div class="mt-6">
                <NuxtLink
                  to="/transactions/create"
                  class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Create New
                </NuxtLink>
              </div>
            </div>
          </div>

          <div
            v-if="auth.isManager"
            class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div
                    class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center"
                  >
                    <Users class="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900">
                    Manage Users
                  </h3>
                  <p class="text-sm text-gray-500">
                    View and edit user accounts
                  </p>
                </div>
              </div>
              <div class="mt-6">
                <NuxtLink
                  to="/users"
                  class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Manage Users
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
