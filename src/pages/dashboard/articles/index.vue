<template>
  <div>
    <Toast />
    <div class="p-6 max-w-4xl mx-auto">
      <Card class="shadow-lg rounded-xl">
        <template #title>
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold">Articles</h2>
            <Button label="Create New Article" icon="pi pi-plus" class="p-button-primary" @click="navigateTo('/dashboard/articles/create')" />
          </div>
        </template>
        <template #content>
          <div class="overflow-x-auto">
            <DataTable :value="articles" responsiveLayout="scroll" class="w-full">
              <Column field="title" header="Title" sortable>
                <template #body="{ data }">
                  {{ data.title.length > 20 ? data.title.substring(0, 20) + '...' : data.title }}
                </template>
              </Column>
              <Column field="category.name" header="Category" sortable></Column>
              <Column field="Tag.name" header="Tag" sortable></Column>
              <Column field="publishedAt" header="Published At" sortable>
                <template #body="{ data }">
                  {{ new Date(data.publishedAt).toLocaleDateString() }}
                </template>
              </Column>
              <Column header="Actions">
                <template #body="{ data }">
                  <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-info" @click="navigateTo(`/dashboard/articles/update/${data.id}`)" />
                  <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" @click="confirmDeleteArticle(data.id)" />
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

// Define the Article interface
interface Article {
  id: string;
  title: string;
  categoryId: string;
  userId: string;
  tagId: string;
  publishedAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
  };
  Tag: {
    id: string;
    name: string;
  };
  User: {
    id: string;
    username: string;
  };
  Comment: [];
}

// Initialize router
const router = useRouter();

// State
const articles = ref<Article[]>([]);
const page = ref(1);
const pageSize = ref(10);
const totalPages = ref(1);
const totalCount = ref(0);

// Toast for notifications
const toast = useToast();

// Fetch articles
const fetchArticles = async () => {
  try {
    const response = await axios.get('/api/article', {
      params: {
        page: page.value,
        pageSize: pageSize.value,
      },
    });
    const data = response.data;
    articles.value = data.articles;
    totalPages.value = data.totalPages;
    totalCount.value = data.totalCount;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch articles', life: 3000 });
  }
};

// Delete article
const deleteArticle = async (id: string) => {
  try {
    await axios.delete(`/api/article/${id}`);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Article deleted successfully', life: 3000 });
    fetchArticles();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete article', life: 3000 });
  }
};

// Confirm delete article
const confirmDeleteArticle = (id: string) => {
  toast.add({
    severity: 'warn',
    summary: 'Confirm',
    detail: 'Are you sure you want to delete this article?',
    life: 3000,
  });
};

// Change page
const changePage = (newPage: number) => {
  page.value = newPage;
  fetchArticles();
};

// Navigation function
const navigateTo = (path: string) => {
  router.push(path);
};

// Fetch articles on component mount
fetchArticles();

definePageMeta({ layout: "dashboard", middleware: "auth", });
</script>

<style scoped>
.table-auto {
  width: 100%;
}
</style>