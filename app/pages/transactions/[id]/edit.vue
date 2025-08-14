<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { useApi } from "~/composables/useApi";
import { useNotifications } from "~/composables/useNotifications";

definePageMeta({
  middleware: ["auth", "manager"],
});

const route = useRoute();
const router = useRouter();
const { $api } = useApi();
const { success, error: showError } = useNotifications();

const transactionEdit = ref<any>(null);
const users = ref<any[]>([]);
const senderUser = ref<any>(null);
const error = ref("");
const saving = ref(false);
const loading = ref(true);

onMounted(async () => {
  try {
    loading.value = true;

    const transactionRes = await $api(`/transactions/${route.params.id}`);

    const usersRes = await $api("/users");

    users.value = usersRes.data;

    // Process transaction data
    const processedTransaction = {
      ...transactionRes,
      sender: transactionRes.sender?._id || transactionRes.data.sender,
      receiver: transactionRes.receiver?._id || transactionRes.data.receiver,
      amount: parseFloat(
        transactionRes.data.amount?.$numberDecimal ||
          transactionRes.data.amount ||
          "0"
      ),
      reason: transactionRes.data.reason || "",
      status: transactionRes.data.status || "pending",
    };

    // Find the sender user from the users list
    const senderId = processedTransaction.sender;
    senderUser.value =
      users.value.find((user) => user._id === senderId) || null;

    transactionEdit.value = processedTransaction;
  } catch (err: any) {
    error.value = err?.data?.message || "Failed to load transaction";
    showError("Load Failed", error.value);
  } finally {
    loading.value = false;
  }
});

async function save() {
  saving.value = true;
  error.value = "";

  try {
    // Validate form data
    if (
      !transactionEdit.value.sender ||
      !transactionEdit.value.receiver ||
      !transactionEdit.value.reason ||
      !transactionEdit.value.amount
    ) {
      error.value = "Please fill in all required fields";
      return;
    }

    if (transactionEdit.value.sender === transactionEdit.value.receiver) {
      error.value = "Sender and receiver cannot be the same";
      return;
    }

    await $api(`/transactions/${route.params.id}`, {
      method: "PUT",
      body: {
        sender: transactionEdit.value.sender,
        receiver: transactionEdit.value.receiver,
        reason: transactionEdit.value.reason,
        amount: parseFloat(transactionEdit.value.amount),
        status: transactionEdit.value.status,
      },
    });

    success(
      "Transaction Updated",
      "The transaction has been successfully updated."
    );
    router.push("/transactions");
  } catch (err: any) {
    error.value = err?.data?.message || "Update failed";
    showError("Update Failed", error.value);
  } finally {
    saving.value = false;
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
              <svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
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
          <h1 class="text-3xl font-bold text-gray-900">Edit Transaction</h1>
          <p class="mt-2 text-sm text-gray-600">
            Update transaction details and status
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="flex items-center">
            <svg
              class="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span class="text-lg text-gray-600">Loading transaction...</span>
          </div>
        </div>

        <!-- Error State -->
        <div
          v-else-if="error"
          class="bg-red-50 border border-red-200 rounded-lg p-6"
        >
          <div class="flex">
            <svg
              class="w-6 h-6 text-red-400 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <div>
              <h3 class="text-lg font-medium text-red-800">
                Error loading transaction
              </h3>
              <p class="mt-1 text-red-700">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div v-else-if="transactionEdit" class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div
              v-if="error"
              class="mb-6 p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg"
            >
              <div class="flex">
                <svg
                  class="w-5 h-5 text-red-400 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                {{ error }}
              </div>
            </div>

            <form @submit.prevent="save" class="space-y-6">
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <!-- Sender -->
                <div>
                  <label
                    for="sender"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Sender
                  </label>

                  <select
                    id="sender"
                    v-model="transactionEdit.sender"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled
                  >
                    <option v-if="senderUser" :value="senderUser._id">
                      {{ senderUser.email }}
                    </option>
                    <option v-else value="">Loading sender...</option>
                  </select>
                </div>

                <!-- Receiver -->
                <div>
                  <label
                    for="receiver"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Receiver
                  </label>
                  <select
                    id="receiver"
                    v-model="transactionEdit.receiver"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Receiver</option>
                    <option
                      v-for="user in users"
                      :key="user._id"
                      :value="user._id"
                    >
                      {{ user.email }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Reason -->
              <div>
                <label
                  for="reason"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Reason
                </label>
                <input
                  id="reason"
                  v-model="transactionEdit.reason"
                  type="text"
                  placeholder="Enter transaction reason"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <!-- Amount -->
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
                    v-model.number="transactionEdit.amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    class="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <!-- Status -->
              <div>
                <label
                  for="status"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Status
                </label>
                <select
                  id="status"
                  v-model="transactionEdit.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end space-x-3 pt-6 border-t">
                <NuxtLink
                  to="/transactions"
                  class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </NuxtLink>
                <button
                  type="submit"
                  :disabled="saving"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    v-if="saving"
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {{ saving ? "Saving..." : "Save Changes" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
