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
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tag</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published At</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class=" divide-y divide-gray-200">
                  <tr v-for="article in articles" :key="article.id">
                    <td class="px-6 py-4 whitespace-nowrap">{{ article.title }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ article.category.name }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ article.Tag.name }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ new Date(article.publishedAt).toLocaleDateString() }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-info" @click="navigateTo(`/dashboard/articles/update/${article.id}`)" />
                      <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" @click="confirmDeleteArticle(article.id)" />
                    </td>
                  </tr>
                </tbody>
              </table>
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
  
  // Define the Article interface
  interface Article {
    id: string;
    title: string;
    slug: string;
    description: string;
    urlToImage: string[];
    categoryId: string;
    userId: string;
    tagId: string;
    publishedAt: string;
    updatedAt: string;
    category: {
      id: string;
      name: string;
      description: string;
      publishedAt: string;
      updatedAt: string;
    };
    Tag: {
      id: string;
      name: string;
      createdAt: string;
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
      // sticky: true,
      // closable: true,
      // accept: () => deleteArticle(id),
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
  </script>
  
  <style scoped>
  .table-auto {
    width: 100%;
  }
  </style>