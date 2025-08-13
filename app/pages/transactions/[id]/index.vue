<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { $fetcher } = useApi()
const auth = useAuthStore()

const tx = ref<any>(null)
const error = ref('')
const loading = ref(true)

onMounted(async () => {
  try {
    tx.value = await $fetcher(`/transactions/${route.params.id}`)
  } catch (err: any) {
    error.value = err?.data?.message || 'Transaction not found or access denied.'
  } finally {
    loading.value = false
  }
})

/** Parses Decimal128 or normal number values safely */
function parseAmount(value: any): number {
  return parseFloat(value?.$numberDecimal || value || '0')
}

const isSender = computed(() => {
  const myId = auth.user?.id
  const senderId = tx.value?.sender?._id || tx.value?.sender
  return senderId === myId
})

const sign = computed(() => (isSender.value ? '-' : '+'))
const color = computed(() => (isSender.value ? 'text-red-600' : 'text-green-600'))
const displayAmount = computed(() => {
  return `${sign.value}${parseAmount(tx.value?.amount).toFixed(2)}`
})

async function deleteTransaction() {
  if (confirm('Are you sure you want to delete this transaction?')) {
    try {
      await $fetcher(`/transactions/${route.params.id}`, { method: 'DELETE' })
      router.push('/transactions')
    } catch (err: any) {
      error.value = err?.data?.message || 'Failed to delete transaction.'
    }
  }
}
</script>

<template>
  <div class="max-w-2xl p-6 mx-auto space-y-4">
    <!-- Loading/Error -->
    <div v-if="loading" class="text-gray-600">Loading transaction...</div>
    <div v-if="error" class="p-4 text-red-600 border rounded">{{ error }}</div>

    <!-- Transaction Display -->
    <div v-if="tx && !error">
      <h1 class="text-2xl font-semibold">{{ tx.reason }}</h1>
      <p class="text-gray-600">
        {{ tx.sender?.email || tx.sender }} → {{ tx.receiver?.email || tx.receiver }}
      </p>
      <p :class="['text-xl font-bold', color]">
        {{ displayAmount }}
      </p>
      <p>Status: <span class="font-medium">{{ tx.status }}</span></p>

      <!-- Edit/Delete (Manager only) -->
      <div v-if="auth.isManager" class="flex gap-4 mt-6">
        <NuxtLink
          :to="`/transactions/${tx._id}/edit`"
          class="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Edit
        </NuxtLink>
        <button
          @click="deleteTransaction"
          class="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
