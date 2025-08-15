<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <NuxtPage />
    <NotificationToast />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Money App",
  meta: [{ name: "description", content: "A finance management application" }],
});
</script>

<style>
html,
body {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
}
* {
  transition: all 0.2s ease-in-out;
}
</style>
