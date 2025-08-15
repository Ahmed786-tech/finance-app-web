export default defineNuxtPlugin(() => {
  if (process.client) {
    const auth = useAuthStore();
    const { token } = useApi();

    // Load user data from localStorage
    auth.loadFromStorage();

    // Set token from cookie to auth store
    auth.token = token.value;

    // Watch for token changes
    watch(
      () => token.value,
      (newToken) => {
        auth.token = newToken;
      }
    );

    watch(
      () => auth.token,
      (newToken) => {
        if (newToken !== token.value) {
          token.value = newToken;
        }
      }
    );
  }
});
