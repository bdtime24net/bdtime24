<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4 text-center">Articles</h1>

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-4">
      <Skeleton v-for="n in 5" :key="n" class="w-full h-20" />
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="text-red-500 text-center">Failed to load articles</div>

    <!-- Articles List -->
    <div v-else>
      <div v-if="articles.length">
        <div 
          v-for="article in articles" 
          :key="article.id"
          class="cursor-pointer"
          @click="goToArticle(article.slug)"
        >
          <Card class="mb-4 shadow-lg hover:shadow-xl transition">
            <template #title>
              <h2 class="text-xl font-semibold">{{ article.title }}</h2>
            </template>
          </Card>
        </div>
      </div>
      <div v-else class="text-center text-gray-500">No articles found.</div>

      <!-- Pagination Controls -->
      <div class="flex justify-center mt-6 space-x-2">
        <Button 
          label="Prev" 
          class="p-button-outlined"
          :disabled="page === 1"
          @click="setPage(page - 1)"
        />
        <span class="px-4 py-2">Page {{ page }} of {{ totalPages }}</span>
        <Button 
          label="Next" 
          class="p-button-outlined"
          :disabled="page === totalPages"
          @click="setPage(page + 1)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import  Card  from "primevue/card";
import  Button  from "primevue/button";
import  Skeleton  from "primevue/skeleton";

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
  keepPreviousData: true, 
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
