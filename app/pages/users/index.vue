<script setup lang="ts">
import { useApi } from '../../composables/useApi'

// definePageMeta({
//   middleware: ['auth', 'manager']
// })

const { $fetcher } = useApi()
const users = ref([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    users.value = await $fetcher('/users')
  } catch (err: any) {
    error.value = err?.data?.message || 'Failed to load users'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-4xl p-6 mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">All Users</h1>
      <NuxtLink to="/" class="text-blue-600 hover:underline">← Back to Dashboard</NuxtLink>
    </div>

    <div v-if="loading">Loading users...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else-if="users.length === 0" class="text-gray-600">No users found.</div>

    <div v-else class="border divide-y rounded">
      <div
        v-for="user in users"
        :key="user._id"
        class="flex items-center justify-between p-4 hover:bg-gray-50"
      >
        <div>
          <div class="font-medium">{{ user.email }}</div>
          <div class="text-sm text-gray-500">Roles: {{ user.roles.join(', ') }}</div>
        </div>
        <NuxtLink
          :to="`/users/${user._id}`"
          class="text-sm text-blue-600 hover:underline"
        >
          Edit
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
