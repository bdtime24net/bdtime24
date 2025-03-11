<template>
    <div>
      <Toast />
      <div class="p-6 max-w-4xl mx-auto">
        <Card class="shadow-lg rounded-xl">
          <template #title>
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-bold">Tags</h2>
              <Button label="Create New Tag" icon="pi pi-plus" class="p-button-primary" @click="navigateTo('/dashboard/tag/create')" />
            </div>
          </template>
          <template #content>
            <div class="overflow-x-auto">
              <DataTable :value="tags" responsiveLayout="scroll" class="w-full">
                <Column field="name" header="Name" sortable></Column>
                <Column field="createdAt" header="Created At" sortable>
                  <template #body="{ data }">
                    {{ new Date(data.createdAt).toLocaleDateString() }}
                  </template>
                </Column>
                <Column header="Actions">
                  <template #body="{ data }">
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-info" @click="navigateTo(`/dashboard/tag/update/${data.id}`)" />
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" @click="confirmDeleteTag(data.id)" />
                  </template>
                </Column>
              </DataTable>
            </div>
            <div class="flex justify-end mt-4">
              <Pagination 
                :currentPage="page" 
                :totalPages="totalPages" 
                @changePage="changePage" 
              />
            </div>
          </template>
        </Card>
      </div>
      <ConfirmDialog />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useToast } from 'primevue/usetoast';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import Card from 'primevue/card';
  import Button from 'primevue/button';
  import ConfirmDialog from 'primevue/confirmdialog';
  import Pagination from '@/components/common/Pagination.vue';
  import Toast from 'primevue/toast';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  
  // Define the Tag interface
  interface Tag {
    id: string;
    name: string;
    createdAt: string;
  }
  
  // Initialize router
  const router = useRouter();
  
  // State
  const tags = ref<Tag[]>([]);
  const page = ref(1);
  const pageSize = ref(10);
  const totalPages = ref(1);
  const totalCount = ref(0);
  
  // Toast for notifications
  const toast = useToast();
  
  // Fetch tags
  const fetchTags = async () => {
  try {
    const response = await axios.get('/api/tag', {
      params: {
        page: page.value,
        limit: pageSize.value, // Fix: Your API expects "limit", not "pageSize"
      },
    });

    const data = response.data;
    console.log('Fetched response:', data); // Debugging log

    tags.value = data.data; // Fix: Assign tags from `data.data`
    totalPages.value = data.pagination.totalPages; // Fix: Correctly access pagination
    totalCount.value = data.pagination.totalTags;

    console.log('Updated tags:', tags.value); // Debugging log to confirm tags are set
  } catch (error) {
    console.error('Fetch error:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch tags', life: 3000 });
  }
};

  
  // Delete tag
  const deleteTag = async (id: string) => {
    try {
      await axios.delete(`/api/tag/${id}`);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Tag deleted successfully', life: 3000 });
      fetchTags();
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete tag', life: 3000 });
    }
  };
  
  // Confirm delete tag
  const confirmDeleteTag = (id: string) => {
    toast.add({
      severity: 'warn',
      summary: 'Confirm',
      detail: 'Are you sure you want to delete this tag?',
      life: 3000,
    });
  };
  
  // Change page
  const changePage = (newPage: number) => {
    page.value = newPage;
    fetchTags();
  };
  
  // Navigation function
  const navigateTo = (path: string) => {
    router.push(path);
  };
  
  // Fetch tags on component mount
  fetchTags();
  
  definePageMeta({ layout: "dashboard", middleware: "auth", });
  </script>
  
  <style scoped>
  .table-auto {
    width: 100%;
  }
  </style>