export function useApi() {
  const config = useRuntimeConfig();
  const token = useCookie<string | null>("auth_token", {
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  const $api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      if (token.value && process.client) {
        options.headers = {
          ...(options.headers || {}),
          Authorization: `Bearer ${token.value}`,
        } as any;
      }
    },
  });

  return { $api, token };
}
