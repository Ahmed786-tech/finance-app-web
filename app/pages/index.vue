<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { navigateTo } from '#app'

definePageMeta({
  middleware: 'auth'
})

const auth = useAuthStore()

function logout() {
  auth.logout()
  navigateTo('/login')
}
</script>

<template>
  <div class="max-w-2xl p-6 mx-auto space-y-8">
    <h1 class="text-3xl font-bold">Welcome, {{ auth.user?.email }}!</h1>

    <div class="space-y-4">
      <p class="text-gray-700">
        This is your personal dashboard. You can view and manage transactions based on your role.
      </p>

      <div class="space-y-2">
        <NuxtLink
          to="/transactions"
          class="block px-4 py-2 text-center text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          View Transactions
        </NuxtLink>

        <NuxtLink
          v-if="auth.isManager"
          to="/transactions/create"
          class="block px-4 py-2 text-center text-white bg-green-600 rounded hover:bg-green-700"
        >
          Create Transaction
        </NuxtLink>

        <NuxtLink
          v-if="auth.isManager"
          to="/users"
          class="block px-4 py-2 text-center text-white bg-gray-600 rounded hover:bg-gray-700"
        >
          Manage Users
        </NuxtLink>
      </div>
    </div>

    <div class="pt-6 border-t">
      <button
        @click="logout"
        class="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  </div>
</template>
