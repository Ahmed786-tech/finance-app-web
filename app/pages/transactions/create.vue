<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useApi } from "~/composables/useApi";
import { useAuthStore } from "~/stores/auth";
import { useNotifications } from "~/composables/useNotifications";
import { navigateTo } from "#app";
import { ArrowLeft, Plus, Loader2, XCircle } from "lucide-vue-next";

definePageMeta({
  middleware: ["auth", "manager"],
});

const { $api } = useApi();
const { user } = useAuthStore();
const { success, error: showError } = useNotifications();

const sender = ref("");
const receiver = ref("");
const reason = ref("");
const amount = ref<number | null>(null);
const users = ref<any[]>([]);
const error = ref("");
const isSubmitting = ref(false);

onMounted(async () => {
  try {
    const res = await $api("/users");
    users.value = res.data;

    if (user?._id) {
      sender.value = user._id;
    }
  } catch (err: any) {
    error.value = err?.data?.message || "Failed to load users";
  }
});

async function submit() {
  error.value = "";
  isSubmitting.value = true;

  if (
    !sender.value ||
    !receiver.value ||
    !reason.value ||
    amount.value == null
  ) {
    error.value = "Please fill in all fields";
    isSubmitting.value = false;
    return;
  }

  if (sender.value === receiver.value) {
    error.value = "Sender and receiver cannot be the same";
    isSubmitting.value = false;
    return;
  }

  try {
    await $api("/transactions", {
      method: "POST",
      body: {
        sender: sender.value,
        receiver: receiver.value,
        reason: reason.value,
        amount: parseFloat(amount.value.toString()),
      },
    });
    success(
      "Transaction Created",
      "The transaction has been successfully created."
    );
    navigateTo("/transactions");
  } catch (err: any) {
    const errorMessage = err?.data?.message || "Failed to create transaction";
    error.value = errorMessage;
    showError("Creation Failed", errorMessage);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center">
            <NuxtLink
              to="/transactions"
              class="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft class="w-5 h-5 mr-2" />
              Back to Transactions
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Page Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Create Transaction</h1>
          <p class="mt-2 text-sm text-gray-600">
            Add a new transaction between users
          </p>
        </div>

        <!-- Form -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div
              v-if="error"
              class="mb-6 p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg"
            >
              <div class="flex">
                <XCircle class="w-5 h-5 text-red-400 mr-2" />
                {{ error }}
              </div>
            </div>

            <form @submit.prevent="submit" class="space-y-6">
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    for="sender"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Sender
                  </label>
                  <select
                    id="sender"
                    v-model="sender"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option v-if="!users.length" value="">No Users</option>
                    <option v-else value="">Select Sender</option>
                    <option v-for="u in users" :key="u._id" :value="u._id">
                      {{ u.email }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    for="receiver"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Receiver
                  </label>
                  <select
                    id="receiver"
                    v-model="receiver"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option v-if="!users.length" value="">No Users</option>
                    <option v-else value="">Select Receiver</option>
                    <option
                      v-for="u in users.filter((u) => u._id !== sender)"
                      :key="u._id"
                      :value="u._id"
                    >
                      {{ u.email }}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  for="reason"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Reason
                </label>
                <input
                  id="reason"
                  v-model="reason"
                  type="text"
                  placeholder="Enter transaction reason"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  for="amount"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Amount
                </label>
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <span class="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    id="amount"
                    v-model.number="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    class="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div class="flex justify-end space-x-3 pt-6 border-t">
                <NuxtLink
                  to="/transactions"
                  class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </NuxtLink>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Loader2
                    v-if="isSubmitting"
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  />
                  <Plus v-else class="w-4 h-4 mr-2" />
                  {{ isSubmitting ? "Creating..." : "Create Transaction" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
