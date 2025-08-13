<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useApi } from '../../composables/useApi'
import { useAuthStore } from '../../stores/auth';
import { navigateTo } from '#app'

// definePageMeta({
//   middleware: ['auth', 'manager']
// })

const route = useRoute()
const { $fetcher } = useApi()
const { user: currentUser } = useAuthStore()

const user = ref<any>(null)
const roles = ref<string[]>([])
const loading = ref(true)
const error = ref('')
const saving = ref(false)
const success = ref(false)

onMounted(async () => {
  try {
    const res = await $fetcher(`/users/${route.params.id}`)
    user.value = res
    roles.value = [...res.roles]
  } catch (err: any) {
    error.value = err?.data?.message || 'Failed to load user'
  } finally {
    loading.value = false
  }
})

async function updateRoles() {
  try {
    saving.value = true
    await $fetcher(`/users/${route.params.id}`, {
      method: 'PATCH',
      body: { roles: roles.value }
    })
    success.value = true
    setTimeout(() => (success.value = false), 2000)
  } catch (err: any) {
    error.value = err?.data?.message || 'Failed to update'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-xl p-6 mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">User Details</h1>
      <NuxtLink to="/users" class="text-sm text-blue-600 hover:underline">← Back to Users</NuxtLink>
    </div>

    <div v-if="loading">Loading user...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else>
      <p class="mb-2"><strong>Email:</strong> {{ user.email }}</p>

      <div class="mb-4">
        <label class="block mb-1 font-medium">Roles:</label>
        <label class="inline-flex items-center mr-4">
          <input type="checkbox" value="user" v-model="roles" class="mr-1" />
          User
        </label>
        <label class="inline-flex items-center">
          <input type="checkbox" value="manager" v-model="roles" class="mr-1" />
          Manager
        </label>
      </div>

      <button
        @click="updateRoles"
        :disabled="saving"
        class="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        <span v-if="!saving">Save</span>
        <span v-else>Saving…</span>
      </button>

      <p v-if="success" class="mt-3 text-green-600">User updated successfully.</p>
    </div>
  </div>
</template>
