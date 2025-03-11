<template>
    <div>
      <Toast />
      <div class="p-6 max-w-4xl mx-auto">
        <Card class="shadow-lg rounded-xl">
          <template #title>
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-bold">Categories</h2>
              <Button label="Create New Category" icon="pi pi-plus" class="p-button-primary" @click="navigateTo('/dashboard/category/create')" />
            </div>
          </template>
          <template #content>
            <div class="overflow-x-auto">
              <DataTable :value="categories" responsiveLayout="scroll" class="w-full">
                <Column field="name" header="Name" sortable></Column>
                <Column field="createdAt" header="Created At" sortable>
                  <template #body="{ data }">
                    {{ new Date(data.publishedAt).toLocaleDateString() }}
                  </template>
                </Column>
                <Column header="Actions">
                  <template #body="{ data }">
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-info" @click="navigateTo(`/dashboard/category/update/${data.id}`)" />
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" @click="confirmDeleteCategory(data.id)" />
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
  
  // Define the Category interface
  interface Category {
    id: string;
    name: string;
    createdAt: string;
  }
  
  // Initialize router
  const router = useRouter();
  
  // State
  const categories = ref<Category[]>([]);
  const page = ref(1);
  const pageSize = ref(10);
  const totalPages = ref(1);
  const totalCount = ref(0);
  
  // Toast for notifications
  const toast = useToast();
  
  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/category', {
        params: {
          page: page.value,
          pageSize: pageSize.value,
        },
      });
      const data = response.data;
      console.log('Fetched categories:', categories.value); // Debug log
      categories.value = data.data;
      totalPages.value = data.pagination.totalPages;
      totalCount.value = data.pagination.totalCategories;
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch categories', life: 3000 });
    }
  };
  
  // Delete category
  const deleteCategory = async (id: string) => {
    try {
      await axios.delete(`/api/category/${id}`);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Category deleted successfully', life: 3000 });
      fetchCategories();
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete category', life: 3000 });
    }
  };
  
  // Confirm delete category
  const confirmDeleteCategory = (id: string) => {
    toast.add({
      severity: 'warn',
      summary: 'Confirm',
      detail: 'Are you sure you want to delete this category?',
      life: 3000,
    });
  };
  
  // Change page
  const changePage = (newPage: number) => {
    page.value = newPage;
    fetchCategories();
  };
  
  // Navigation function
  const navigateTo = (path: string) => {
    router.push(path);
  };
  
  // Fetch categories on component mount
  fetchCategories();
  
  definePageMeta({ layout: "dashboard", middleware: "auth" });
  </script>
  
  <style scoped>
  .table-auto {
    width: 100%;
  }
  </style>
  