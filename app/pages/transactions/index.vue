<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'
import { navigateTo } from '#app'

definePageMeta({
  middleware: ['auth']
})

const auth = useAuthStore()
const { $fetcher } = useApi()

const items = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  await fetchTransactions()
})

async function fetchTransactions() {
  loading.value = true
  error.value = null
  try {
    const res = await $fetcher('/transactions')
    items.value = res
  } catch (err: any) {
    error.value = err?.data?.message || 'Failed to load transactions.'
  } finally {
    loading.value = false
  }
}

// 🔧 Handles Decimal128 and formats amount with sign
function formatAmount(tx: any, myId: string | undefined): string {
  const raw = tx?.amount?.$numberDecimal || tx?.amount || '0'
  const amount = parseFloat(raw)
  const senderId = tx?.sender?._id || tx?.sender
  const isSender = senderId === myId
  const sign = isSender ? '-' : '+'
  return `${sign}${amount.toFixed(2)}`
}

// Returns red or green based on sender
function amountClass(tx: any) {
  const myId = auth.user?.id
  const isSender = tx.sender?._id === myId || tx.sender === myId
  return isSender ? 'text-red-600' : 'text-green-600'
}

async function deleteTransaction(id: string) {
  if (confirm('Are you sure you want to delete this transaction?')) {
    try {
      await $fetcher(`/transactions/${id}`, { method: 'DELETE' })
      items.value = items.value.filter((tx) => tx._id !== id)
    } catch (err: any) {
      error.value = err?.data?.message || 'Failed to delete transaction.'
    }
  }
}
</script>

<template>
  <div class="max-w-4xl p-6 mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Dashboard</h1>
      <div class="space-x-2">
        <NuxtLink
          v-if="auth.isManager"
          to="/transactions/create"
          class="px-4 py-1 text-white bg-blue-600 border rounded hover:bg-blue-700"
        >
          New Transaction
        </NuxtLink>
        <NuxtLink
          v-if="auth.isManager"
          to="/users"
          class="px-4 py-1 bg-gray-200 border rounded hover:bg-gray-300"
        >
          Manage Users
        </NuxtLink>
        <button
          @click="auth.logout(); navigateTo('/login')"
          class="px-4 py-1 text-white bg-red-500 border rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>

    <!-- Loading/Error -->
    <div v-if="loading" class="text-gray-600">Loading transactions...</div>
    <div v-else-if="error" class="p-4 text-red-600 border border-red-300 rounded">
      {{ error }}
    </div>
    <div v-else-if="items.length === 0" class="text-gray-600">
      No transactions found.
    </div>

    <!-- Transaction List -->
    <div v-else class="border divide-y rounded shadow">
      <div
        v-for="tx in items"
        :key="tx._id"
        class="flex items-center justify-between p-4 transition hover:bg-gray-50"
      >
        <!-- Left side: reason, parties -->
        <NuxtLink :to="`/transactions/${tx._id}`" class="flex-1">
          <div class="font-medium">{{ tx.reason }}</div>
          <div class="text-sm text-gray-500">
            {{ tx.sender?.email || tx.sender }} → {{ tx.receiver?.email || tx.receiver }} • {{ tx.status }}
          </div>
        </NuxtLink>

        <!-- Right side: amount + actions -->
        <div class="ml-4 space-y-1 text-right">
          <div :class="['font-semibold', amountClass(tx)]">
            {{ formatAmount(tx, auth.user?.id) }}
          </div>

          <div v-if="auth.isManager" class="flex justify-end space-x-2 text-sm">
            <NuxtLink
              :to="`/transactions/${tx._id}`"
              class="text-blue-600 hover:underline"
            >
              View
            </NuxtLink>
            <button
              @click="deleteTransaction(tx._id)"
              class="text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
