<script setup lang="ts">
definePageMeta({ middleware: ["auth", "manager"] });
const { $fetcher } = useApi();
const users = ref<any[]>([]);

async function load() {
  users.value = await $fetcher("/users");
}
onMounted(load);

async function toggleManager(u: any) {
  const roles = u.roles.includes("manager") ? ["user"] : ["manager"];
  await $fetcher(`/users/${u._id}`, { method: "PATCH", body: { roles } });
  await load();
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold mb-4">Users</h1>
    <div class="border rounded divide-y">
      <div v-for="u in users" :key="u._id" class="p-3 flex justify-between">
        <div>
          <div class="font-medium">{{ u.email }}</div>
          <div class="text-sm text-gray-500">{{ u.roles.join(", ") }}</div>
        </div>
        <button class="border px-3 py-1 rounded" @click="toggleManager(u)">
          {{ u.roles.includes("manager") ? "Revoke Manager" : "Make Manager" }}
        </button>
      </div>
    </div>
  </div>
</template>
