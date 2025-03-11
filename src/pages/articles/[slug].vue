<template>
  <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <div v-if="post">
      <!-- Title and Published Date -->
      <h1 class="text-4xl font-bold text-center sm:text-left mb-4">{{ post.title }}</h1>

      <!-- Post Content -->
      <div class="prose prose-stone max-w-none mt-6">
        <p v-html="sanitizedContent"></p>
      </div>

      <!-- Back Link -->
      <router-link to="/" class="mt-6 inline-block text-blue-500 hover:underline">
        Back to Posts
      </router-link>
    </div>
    <div v-else class="text-center text-gray-500">Loading...</div>
  </div>
  <ScrollTop />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useSeoMeta } from '@unhead/vue';
import DOMPurify from 'dompurify';
import Image from 'primevue/image';
import ScrollTop from 'primevue/scrolltop';

// State
const post = ref(null);
const route = useRoute();

// Fetch Post
const fetchPost = async () => {
  try {
    console.log('Fetching post...');
    const response = await fetch(`/api/article/${route.params.slug}`);
    const data = await response.json();
    console.log('Fetched data:', data);  // Check the fetched data
    if (data.success) {
      post.value = data.article;
    } else {
      console.error('Post not found or error:', data.message);
    }
  } catch (error) {
    console.error('Error fetching post:', error);
  }
};

// Computed Properties
const sanitizedContent = computed(() => post.value ? DOMPurify.sanitize(post.value.content) : '');
const formattedDate = computed(() => post.value ? new Date(post.value.createdAt).toLocaleDateString() : '');

// SEO Metadata
const title = computed(() => post.value ? post.value.title : 'Loading...');
useSeoMeta({ title });

onMounted(fetchPost);
</script>
