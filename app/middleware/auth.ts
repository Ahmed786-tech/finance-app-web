import { useAuthStore } from "~/stores/auth";
import { navigateTo } from "#app";

export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware on server side for now
  if (process.server) {
    return;
  }

  const auth = useAuthStore();
  const { token } = useApi();

  // Load from storage if not already loaded (client-side only)
  if (!auth.token && process.client) {
    auth.loadFromStorage();
  }

  // Sync token from cookie to auth store if needed
  if (token.value && !auth.token) {
    auth.token = token.value;
  }

  // If user is authenticated and trying to access login/register, redirect to dashboard
  if (
    auth.isAuthenticated &&
    (to.path === "/login" || to.path === "/register")
  ) {
    return navigateTo("/");
  }

  // If user is not authenticated and trying to access protected routes, redirect to login
  if (
    !auth.isAuthenticated &&
    to.path !== "/login" &&
    to.path !== "/register"
  ) {
    return navigateTo("/login");
  }
});
