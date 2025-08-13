export default defineNuxtPlugin(() => {
  const auth = useAuthStore();
  auth.loadFromStorage();
  const { token } = useApi();
  token.value = auth.token;
});
