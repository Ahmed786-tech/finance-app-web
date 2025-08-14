import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null as string | null,
    user: null as null | {
      _id: string;
      name: string;
      email: string;
      role: {
        _id: string;
        name: string;
        description: string;
        permissionKeys: string[];
      };
    },
  }),
  getters: {
    isManager: (s) => {
      if (!s.user?.role?.name) return false;
      return s.user.role.name.toLowerCase() === "manager";
    },
    isAuthenticated: (s) => !!s.token,
  },
  actions: {
    loadFromStorage() {
      if (process.client) {
        const raw = localStorage.getItem("auth");
        if (raw) {
          const parsed = JSON.parse(raw);
          this.user = parsed.user;
        }
      }
    },
    persist() {
      if (process.client) {
        localStorage.setItem("auth", JSON.stringify({ user: this.user }));
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      if (process.client) {
        localStorage.removeItem("auth");
      }
    },
  },
});
