// composables/useApi.ts
export function useApi() {
  const config = useRuntimeConfig()

  // Read token from cookie
  const token = useCookie<string | null>('auth_token', {
    sameSite: 'lax',
    path: '/', // ensure it's available globally
  })

  const $fetcher = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      const t = token.value
      if (t) {
        options.headers = {
          ...(options.headers || {}),
          Authorization: `Bearer ${t}`,
        }
      }
    },
  })

  return { $fetcher, token }
}
