<script setup lang="ts">
import DivisionComponent from "~/components/dashboard/category/CreateCategory.vue";

definePageMeta({ layout: "dashboard", middleware: "auth", });
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold mb-4">Division Management</h1>
    <DivisionComponent />
  </div>
</template>
