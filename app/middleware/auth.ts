// middleware/auth.ts
import { useAuthStore } from '~/stores/auth'
import { navigateTo } from '#app'
// import { defineNuxtRouteMiddleware } from 'nuxt/app'

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()

  // If user is not authenticated and not already on login/register
  if (!auth.isAuthenticated && to.path !== '/login' && to.path !== '/register') {
    return navigateTo('/login')
  }
})
