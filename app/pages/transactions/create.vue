<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { useAuthStore } from '~/stores/auth'
import { navigateTo } from '#app'

definePageMeta({
  middleware: ['auth', 'manager']
})

const { $fetcher } = useApi()
const { user } = useAuthStore()

const sender = ref('')
const receiver = ref('')
const reason = ref('')
const amount = ref<number | null>(null)
const users = ref<any[]>([])
const error = ref('')

onMounted(async () => {
  try {
    users.value = await $fetcher('/users')
  } catch (err: any) {
    error.value = err?.data?.message || 'Failed to load users'
  }
})

async function submit() {
  error.value = ''

  if (!sender.value || !receiver.value || !reason.value || amount.value == null) {
    error.value = 'Please fill in all fields'
    return
  }

  try {
    await $fetcher('/transactions', {
      method: 'POST',
      body: {
        sender: sender.value,
        receiver: receiver.value,
        reason: reason.value,
        amount: parseFloat(amount.value.toString())
      }
    })
    navigateTo('/transactions')
  } catch (err: any) {
    error.value = err?.data?.message || 'Failed to create transaction'
  }
}
</script>

<template>
  <div class="max-w-xl mx-auto mt-10">
    <h1 class="mb-4 text-2xl font-bold">Create Transaction</h1>

    <div v-if="error" class="p-2 mb-4 text-red-700 bg-red-100 border border-red-200 rounded">
      {{ error }}
    </div>

    <div class="space-y-4">
      <div>
        <label class="block mb-1 font-medium">Sender</label>
        <select v-model="sender" class="w-full p-2 border rounded">
          <option value="">Select Sender</option>
          <option v-for="u in users" :key="u._id" :value="u._id">
            {{ u.email }}
          </option>
        </select>
      </div>

      <div>
        <label class="block mb-1 font-medium">Receiver</label>
        <select v-model="receiver" class="w-full p-2 border rounded">
          <option value="">Select Receiver</option>
          <option v-for="u in users" :key="u._id" :value="u._id">
            {{ u.email }}
          </option>
        </select>
      </div>

      <div>
        <label class="block mb-1 font-medium">Reason</label>
        <input
          v-model="reason"
          type="text"
          placeholder="Reason for transaction"
          class="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label class="block mb-1 font-medium">Amount</label>
        <input
          v-model.number="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          class="w-full p-2 border rounded"
        />
      </div>

      <button
        @click="submit"
        class="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Create Transaction
      </button>
    </div>
  </div>
</template>
