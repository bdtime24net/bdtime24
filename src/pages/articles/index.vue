<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Articles</h1>
  
      <div v-if="isLoading" class="text-center text-gray-500">Loading...</div>
      <div v-else-if="isError" class="text-red-500 text-center">Failed to load articles</div>
  
      <div v-else>
        <div v-if="articles.length">
          <div
            v-for="article in articles"
            :key="article.id"
            class="border p-4 rounded-lg shadow-lg mb-4 cursor-pointer hover:bg-gray-100"
            @click="goToArticle(article.slug)"
          >
            <img
              v-if="article.urlToImage.length"
              :src="article.urlToImage[0]"
              alt="Article Image"
              class="w-full h-40 object-cover rounded-md mb-2"
            />
            <h2 class="text-xl font-semibold">{{ article.title }}</h2>
            <p class="text-gray-600">{{ article.description }}</p>
          </div>
        </div>
        <div v-else class="text-center text-gray-500">No articles found.</div>
  
        <!-- Pagination Controls -->
        <div class="flex justify-center mt-4 space-x-2">
          <button
            class="px-4 py-2 border rounded"
            :class="{ 'bg-gray-300': page === 1 }"
            :disabled="page === 1"
            @click="setPage(page - 1)"
          >
            Prev
          </button>
          <span class="px-4 py-2">Page {{ page }} of {{ totalPages }}</span>
          <button
            class="px-4 py-2 border rounded"
            :class="{ 'bg-gray-300': page === totalPages }"
            :disabled="page === totalPages"
            @click="setPage(page + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import { useRouter } from "vue-router";
  import { useQuery } from "@tanstack/vue-query";
  
  const router = useRouter();
  const page = ref(1);
  
  const fetchArticles = async ({ queryKey }) => {
    const [_key, { page }] = queryKey;
    const response = await fetch(`/api/article?page=${page}&pageSize=10`);
    if (!response.ok) throw new Error("Failed to fetch articles");
    return response.json();
  };
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ["articles", { page }],
    queryFn: fetchArticles,
    keepPreviousData: true, // Smooth pagination
  });
  
  const articles = computed(() => data.value?.articles || []);
  const totalPages = computed(() => data.value?.totalPages || 1);
  
  const setPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
      page.value = newPage;
    }
  };
  
  const goToArticle = (slug) => {
    router.push(`/articles/${slug}`);
  };
  </script>
  