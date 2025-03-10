<template>
    <div>
      <Toast />
      <div class="p-6 max-w-4xl mx-auto">
        <Card class="shadow-lg rounded-xl">
          <template #title>
            <h2 class="text-2xl font-bold">{{ article.title }}</h2>
          </template>
          <template #content>
            <div class="mb-4">
              <span class="text-sm text-gray-500">Category: {{ article.category.name }}</span>
              <span class="ml-2 text-sm text-gray-500">Tag: {{ article.Tag.name }}</span>
              <span class="ml-2 text-sm text-gray-500">Published: {{ new Date(article.publishedAt).toLocaleDateString() }}</span>
            </div>
            <div>
              <p class="text-gray-700">{{ article.description }}</p>
              <div v-if="article.urlToImage.length" class="mt-4">
                <h3 class="text-lg font-semibold">Images</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div v-for="(url, index) in article.urlToImage" :key="index" class="w-full h-64 overflow-hidden rounded-md">
                    <img :src="url" :alt="`Image ${index + 1}`" class="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useToast } from 'primevue/usetoast';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  import Card from 'primevue/card';
  import Toast from 'primevue/toast';
  
  // Initialize route
  const route = useRoute();
  
  // State
  const article = ref({
    title: '',
    description: '',
    urlToImage: [],
    category: { name: '' },
    Tag: { name: '' },
    publishedAt: '',
  });
  
  // Toast for notifications
  const toast = useToast();
  
  // Fetch article by slug
  const fetchArticle = async () => {
    try {
      const response = await axios.get(`/api/article/${route.params.slug}`);
      const data = response.data;
  
      if (data.success) {
        article.value = data.article;
      } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch article: ' + data.error, life: 3000 });
      }
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Error fetching article: ' + error, life: 3000 });
    }
  };
  
  // Fetch article on component mount
  onMounted(fetchArticle);
  </script>