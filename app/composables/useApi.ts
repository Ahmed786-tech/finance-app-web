export function useApi() {
  const config = useRuntimeConfig();
  const token = useCookie<string | null>("auth_token", {
    sameSite: "lax",
    path: "/",
  });

  const $fetcher = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      if (token.value) {
        options.headers = {
          ...(options.headers || {}),
          Authorization: `Bearer ${token.value}`,
        };
      }
    },
  });

  return { $fetcher, token };
}
