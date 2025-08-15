<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <TransitionGroup name="notification" tag="div" class="space-y-2">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden',
          'transform transition-all duration-300 ease-in-out',
        ]"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <!-- Success Icon -->
              <CheckCircle
                v-if="notification.type === 'success'"
                class="h-6 w-6 text-green-400"
              />
              <!-- Error Icon -->
              <XCircle
                v-else-if="notification.type === 'error'"
                class="h-6 w-6 text-red-400"
              />
              <!-- Info Icon -->
              <Info
                v-else-if="notification.type === 'info'"
                class="h-6 w-6 text-blue-400"
              />
              <!-- Warning Icon -->
              <AlertTriangle
                v-else-if="notification.type === 'warning'"
                class="h-6 w-6 text-yellow-400"
              />
            </div>

            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-gray-900">
                {{ notification.title }}
              </p>
              <p v-if="notification.message" class="mt-1 text-sm text-gray-500">
                {{ notification.message }}
              </p>
            </div>

            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="removeNotification(notification.id)"
                class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span class="sr-only">Close</span>
                <X class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useNotifications } from "~/composables/useNotifications";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-vue-next";

const { notifications, removeNotification } = useNotifications();
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}
.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.notification-move {
  transition: transform 0.3s ease;
}
</style>
