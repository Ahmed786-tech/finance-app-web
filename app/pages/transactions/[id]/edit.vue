<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { useApi } from "~/composables/useApi";

definePageMeta({
  middleware: ["auth", "manager"],
});

const route = useRoute();
const router = useRouter();
const { $fetcher } = useApi();

const tx = ref<any>(null);
const users = ref<any[]>([]);
const error = ref("");
const saving = ref(false);

onMounted(async () => {
  try {
    const res = await $fetcher(`/transactions/${route.params.id}`);
    res.sender = res.sender?._id || res.sender;
    res.receiver = res.receiver?._id || res.receiver;
    res.amount = parseFloat(res.amount?.$numberDecimal || res.amount);
    tx.value = res;
    users.value = await $fetcher("/users");
  } catch (err: any) {
    error.value = err?.data?.message || "Failed to load transaction";
  }
});

async function save() {
  saving.value = true;
  error.value = "";
  try {
    await $fetcher(`/transactions/${route.params.id}`, {
      method: "PATCH",
      body: {
        sender: tx.value.sender,
        receiver: tx.value.receiver,
        reason: tx.value.reason,
        amount: parseFloat(tx.value.amount),
        status: tx.value.status,
      },
    });
    router.push("/transactions");
  } catch (err: any) {
    error.value = err?.data?.message || "Update failed";
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="max-w-2xl p-6 mx-auto space-y-6">
    <h1 class="text-2xl font-bold">Edit Transaction</h1>

    <div v-if="error" class="p-4 text-red-600 border rounded">
      {{ error }}
    </div>

    <div v-if="tx">
      <!-- Sender -->
      <label class="block mb-1 font-medium">Sender</label>
      <select v-model="tx.sender" class="w-full p-2 mb-4 border rounded">
        <option v-for="u in users" :key="u._id" :value="u._id">
          {{ u.email }}
        </option>
      </select>

      <!-- Receiver -->
      <label class="block mb-1 font-medium">Receiver</label>
      <select v-model="tx.receiver" class="w-full p-2 mb-4 border rounded">
        <option v-for="u in users" :key="u._id" :value="u._id">
          {{ u.email }}
        </option>
      </select>

      <!-- Reason -->
      <label class="block mb-1 font-medium">Reason</label>
      <input
        v-model="tx.reason"
        class="w-full p-2 mb-4 border rounded"
        placeholder="Transaction reason"
      />

      <!-- Amount -->
      <label class="block mb-1 font-medium">Amount</label>
      <input
        v-model.number="tx.amount"
        type="number"
        class="w-full p-2 mb-4 border rounded"
        placeholder="0.00"
      />

      <!-- Status -->
      <label class="block mb-1 font-medium">Status</label>
      <select v-model="tx.status" class="w-full p-2 mb-4 border rounded">
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <!-- Save Button -->
      <button
        @click="save"
        :disabled="saving"
        class="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {{ saving ? "Saving..." : "Save Changes" }}
      </button>
    </div>
  </div>
</template>
