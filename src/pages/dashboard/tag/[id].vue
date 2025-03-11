<template>
    <div>
      <Toast />
      <div class="p-6 max-w-lg mx-auto">
        <Card class="shadow-lg rounded-xl">
          <template #title>
            <h2 class="text-2xl font-bold">Update Tag</h2>
          </template>
          <template #content>
            <form @submit.prevent="updateTag">
              <div class="mb-4">
                <label for="name" class="block text-sm font-medium text-gray-700">Tag Name</label>
                <InputText v-model="tag.name" id="name" class="w-full mt-1 p-inputtext-lg" required />
              </div>
              <div class="flex justify-end space-x-2">
                <Button label="Cancel" class="p-button-secondary" @click="navigateTo('/dashboard/tag')" />
                <Button type="submit" label="Update" class="p-button-primary" :loading="loading" />
              </div>
            </form>
          </template>
        </Card>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';
  import { useToast } from 'primevue/usetoast';
  import Card from 'primevue/card';
  import Button from 'primevue/button';
  import InputText from 'primevue/inputtext';
  import Toast from 'primevue/toast';
  
  // Initialize router and toast
  const route = useRoute();
  const router = useRouter();
  const toast = useToast();
  
  // State
  const tag = ref<{ id: string; name: string }>({ id: '', name: '' });
  const loading = ref(false);
  
  // Fetch tag details
  const fetchTag = async () => {
    try {
      const { id } = route.params;
      const response = await axios.get(`/api/tag/get/${id}`);
      tag.value = response.data;
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch tag', life: 3000 });
    }
  };
  
  // Update tag
  const updateTag = async () => {
    if (!tag.value.name.trim()) {
      toast.add({ severity: 'warn', summary: 'Warning', detail: 'Tag name cannot be empty', life: 3000 });
      return;
    }
  
    try {
      loading.value = true;
      await axios.put(`/api/tag/update/${tag.value.id}`, { name: tag.value.name });
      toast.add({ severity: 'success', summary: 'Success', detail: 'Tag updated successfully', life: 3000 });
      setTimeout(() => navigateTo('/dashboard/tag'), 1500);
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update tag', life: 3000 });
    } finally {
      loading.value = false;
    }
  };
  
  // Navigation function
  const navigateTo = (path: string) => {
    router.push(path);
  };
  
  // Fetch tag when component is mounted
  onMounted(fetchTag);
  </script>
  
  <style scoped>
  .p-inputtext-lg {
    height: 2.5rem;
    font-size: 1rem;
  }
  </style>
  