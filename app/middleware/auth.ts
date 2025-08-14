import { useAuthStore } from "~/stores/auth";
import { navigateTo } from "#app";

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore();
  const { token } = useApi();

  if (!auth.token && process.client) {
    auth.loadFromStorage();
  }

  if (token.value && !auth.token) {
    auth.token = token.value;
  }

  if (
    !auth.isAuthenticated &&
    to.path !== "/login" &&
    to.path !== "/register"
  ) {
    return navigateTo("/login");
  }
});
