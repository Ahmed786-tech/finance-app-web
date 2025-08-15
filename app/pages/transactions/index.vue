<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useApi } from "~/composables/useApi";
import { navigateTo } from "#app";
import {
  ArrowLeft,
  Plus,
  Users,
  Loader2,
  XCircle,
  User,
  ChevronRight,
  UserPlus,
  UserCircle,
  FileWarning,
} from "lucide-vue-next";

definePageMeta({
  middleware: ["auth"],
});

const auth = useAuthStore();
const { $api } = useApi();

const items = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const showDeleteConfirm = ref(false);
const transactionToDelete = ref<string | null>(null);

onMounted(async () => {
  await fetchTransactions();
});

async function fetchTransactions() {
  loading.value = true;
  error.value = null;
  try {
    const res = (await $api("/transactions")) as any[];
    items.value = res.data;
  } catch (err: any) {
    error.value = err?.data?.message || "Failed to load transactions.";
  } finally {
    loading.value = false;
  }
}

function formatAmount(tx: any, myId: string | undefined): string {
  const raw = tx?.amount?.$numberDecimal || tx?.amount || "0";
  const amount = parseFloat(raw);
  const senderId = tx?.sender?._id || tx?.sender;
  const isSender = senderId === myId;
  const sign = isSender ? "-" : "+";
  return `${sign}${amount.toFixed(2)}`;
}

function amountClass(tx: any) {
  const myId = auth.user?._id;
  const isSender = tx.sender?._id === myId || tx.sender === myId;
  return isSender ? "text-red-600" : "text-green-600";
}

async function deleteTransaction(id: string) {
  try {
    await $api(`/transactions/${id}`, { method: "DELETE" });
    items.value = items.value.filter((tx) => tx._id !== id);
    showDeleteConfirm.value = false;
    transactionToDelete.value = null;
  } catch (err: any) {
    error.value = err?.data?.message || "Failed to delete transaction.";
  }
}

function confirmDelete(id: string) {
  transactionToDelete.value = id;
  showDeleteConfirm.value = true;
}

function cancelDelete() {
  showDeleteConfirm.value = false;
  transactionToDelete.value = null;
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
              to="/"
              class="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft class="w-5 h-5 mr-2" />
              Back to Dashboard
            </NuxtLink>
          </div>

          <div class="flex items-center space-x-4">
            <NuxtLink
              v-if="auth.isManager"
              to="/transactions/create"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus class="w-4 h-4 mr-2" />
              New Transaction
            </NuxtLink>
            <NuxtLink
              v-if="auth.isManager"
              to="/users"
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Users class="w-4 h-4 mr-2" />
              Manage Users
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Page Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Transactions</h1>
          <p class="mt-2 text-sm text-gray-600">
            {{
              auth.isManager
                ? "All transactions in the system"
                : "Your transaction history"
            }}
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="flex items-center">
            <Loader2 class="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600" />
            <span class="text-lg text-gray-600">Loading transactions...</span>
          </div>
        </div>

        <!-- Error State -->
        <div
          v-else-if="error"
          class="bg-red-50 border border-red-200 rounded-lg p-6"
        >
          <div class="flex">
            <XCircle class="w-6 h-6 text-red-400 mr-3" />
            <div>
              <h3 class="text-lg font-medium text-red-800">
                Error loading transactions
              </h3>
              <p class="mt-1 text-red-700">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="items.length === 0" class="text-center py-12">
          <FileWarning class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-4 text-lg font-medium text-gray-900">
            No transactions found
          </h3>
          <p class="mt-2 text-gray-500">
            {{
              auth.isManager
                ? "Get started by creating a new transaction."
                : "You haven't made any transactions yet."
            }}
          </p>
          <div v-if="auth.isManager" class="mt-6">
            <NuxtLink
              to="/transactions/create"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus class="w-4 h-4 mr-2" />
              Create Transaction
            </NuxtLink>
          </div>
        </div>

        <!-- Transaction List -->
        <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul class="divide-y divide-gray-200">
            <li
              v-for="tx in items"
              :key="tx._id"
              class="hover:bg-gray-50 transition-colors"
            >
              <div class="block">
                <div class="px-4 py-4 sm:px-6">
                  <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between">
                        <p class="text-lg font-medium text-gray-900 truncate">
                          {{ tx.reason }}
                        </p>
                        <div class="ml-2 flex-shrink-0 flex">
                          <p
                            :class="[
                              'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                              amountClass(tx),
                            ]"
                          >
                            {{ formatAmount(tx, auth.user?._id) }}
                          </p>
                        </div>
                      </div>
                      <div class="mt-2 flex">
                        <div class="flex items-center text-sm text-gray-500">
                          <User
                            class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                          />
                          {{ tx.sender?.email || tx.sender }} →
                          {{ tx.receiver?.email || tx.receiver }}
                        </div>
                        <div
                          class="ml-6 flex items-center text-sm text-gray-500"
                        >
                          <ChevronRight
                            class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                          />
                          <span class="capitalize">{{ tx.status }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Manager Actions -->
                    <div
                      v-if="auth.isManager"
                      class="ml-4 flex items-center space-x-2"
                    >
                      <NuxtLink
                        :to="`/transactions/${tx._id}/edit`"
                        class="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        @click.stop
                      >
                        Edit
                      </NuxtLink>
                      <button
                        @click.stop="confirmDelete(tx._id)"
                        class="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </main>

    <!-- Delete Confirmation Dialog -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete this transaction? This action cannot
          be undone.
        </p>
        <div class="flex gap-3 justify-end">
          <button
            @click="cancelDelete"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="deleteTransaction(transactionToDelete!)"
            class="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
