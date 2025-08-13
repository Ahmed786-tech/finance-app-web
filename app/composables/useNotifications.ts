import { ref, readonly } from "vue";

export interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
  duration?: number;
}

const notifications = ref<Notification[]>([]);

export function useNotifications() {
  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      id,
      duration: 5000,
      ...notification,
    };
    notifications.value.push(newNotification);
    if (newNotification.duration) {
      setTimeout(() => removeNotification(id), newNotification.duration);
    }
  };

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  const success = (title: string, message?: string) => {
    addNotification({ type: "success", title, message });
  };

  const error = (title: string, message?: string) => {
    addNotification({ type: "error", title, message });
  };

  const info = (title: string, message?: string) => {
    addNotification({ type: "info", title, message });
  };

  const warning = (title: string, message?: string) => {
    addNotification({ type: "warning", title, message });
  };

  return {
    notifications: readonly(notifications),
    addNotification,
    removeNotification,
    success,
    error,
    info,
    warning,
  };
}
