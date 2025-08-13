import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as null | { id: string; email: string; roles: string[] }
  }),
  getters: {
    isManager: (s) => s.user?.roles?.includes('manager') ?? false,
    isAuthenticated: (s) => !!s.token
  },
  actions: {
    loadFromStorage() {
      const raw = localStorage.getItem('auth');
      if (raw) {
        const parsed = JSON.parse(raw);
        this.token = parsed.token;
        this.user = parsed.user;
      }
    },
    persist() {
      localStorage.setItem('auth', JSON.stringify({ token: this.token, user: this.user }));
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('auth');
    }
  }
});
