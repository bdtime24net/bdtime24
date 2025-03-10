<template>
    <div>
      <Toast />
      <div class="p-6 max-w-4xl mx-auto">
        <Card class="shadow-lg rounded-xl">
          <template #title>
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-bold">Update Article</h2>
              <Button label="Back to Articles" icon="pi pi-arrow-left" class="p-button-secondary" @click="navigateTo('/dashboard/articles')" />
            </div>
          </template>
          <template #content>
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Title and Slug -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label for="title" class="block text-sm font-medium text-gray-700">Title *</label>
                  <InputText 
                    id="title" 
                    v-model="title" 
                    @blur="generateSlug"
                    placeholder="Article title" 
                    class="w-full" 
                    :class="{ 'p-invalid': errors.title }"
                  />
                  <small v-if="errors.title" class="p-error">{{ errors.title }}</small>
                </div>
                
                <div class="space-y-2">
                  <label for="slug" class="block text-sm font-medium text-gray-700">Slug *</label>
                  <InputText 
                    id="slug" 
                    v-model="slug" 
                    placeholder="article-slug" 
                    class="w-full" 
                    :class="{ 'p-invalid': errors.slug }"
                  />
                  <small v-if="errors.slug" class="p-error">{{ errors.slug }}</small>
                </div>
              </div>
              
              <!-- Description -->
              <div class="space-y-2">
                <label for="description" class="block text-sm font-medium text-gray-700">Description *</label>
                <Textarea 
                  id="description" 
                  v-model="description" 
                  rows="4" 
                  placeholder="Article description" 
                  class="w-full" 
                  :class="{ 'p-invalid': errors.description }"
                />
                <small v-if="errors.description" class="p-error">{{ errors.description }}</small>
              </div>
              
              <!-- Image URLs -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Image URLs *</label>
                
                <div class="flex mb-2">
                  <InputText v-model="newImageUrl" placeholder="Enter image URL" class="flex-1 mr-2" />
                  <Button label="Add" icon="pi pi-plus" @click="addImageUrl" />
                </div>
                
                <div v-if="errors.urlToImage" class="p-error text-sm mb-2">
                  {{ errors.urlToImage }}
                </div>
                
                <ul v-if="imageUrls.length > 0" class="border rounded-md divide-y divide-gray-200">
                  <li v-for="(url, index) in imageUrls" :key="index" class="flex items-center p-3">
                    <div class="flex-shrink-0 w-12 h-12 overflow-hidden rounded-md mr-4">
                      <img :src="url" :alt="`Image ${index + 1}`" class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm text-gray-700 truncate">{{ url }}</p>
                    </div>
                    <Button 
                      icon="pi pi-trash" 
                      class="p-button-text p-button-danger" 
                      @click="removeImageUrl(index)" 
                    />
                  </li>
                </ul>
              </div>
              
              <!-- Category and Tag selection -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label for="category" class="block text-sm font-medium text-gray-700">Category *</label>
                  <Dropdown
                    id="category"
                    v-model="categoryId"
                    :options="categories"
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Select a category"
                    class="w-full"
                    :class="{ 'p-invalid': errors.categoryId }"
                    :loading="loadingCategories"
                  />
                  <small v-if="errors.categoryId" class="p-error">{{ errors.categoryId }}</small>
                </div>
                
                <div class="space-y-2">
                  <label for="tag" class="block text-sm font-medium text-gray-700">Tag *</label>
                  <Dropdown
                    id="tag"
                    v-model="tagId"
                    :options="tags"
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Select a tag"
                    class="w-full"
                    :class="{ 'p-invalid': errors.tagId }"
                    :loading="loadingTags"
                  />
                  <small v-if="errors.tagId" class="p-error">{{ errors.tagId }}</small>
                </div>
              </div>
              
              <!-- Form Actions -->
              <div class="flex justify-end space-x-3 pt-4 border-t">
                <Button 
                  type="button" 
                  label="Reset" 
                  icon="pi pi-refresh" 
                  class="p-button-outlined" 
                  @click="resetForm" 
                />
                <Button 
                  type="submit" 
                  label="Update Article" 
                  icon="pi pi-check" 
                />
              </div>
            </form>
          </template>
        </Card>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from "vue";
  import { useToast } from "primevue/usetoast";
  import { useRouter, useRoute } from "vue-router";
  import axios from "axios";
  import InputText from "primevue/inputtext";
  import Textarea from "primevue/textarea";
  import Dropdown from "primevue/dropdown";
  import Button from "primevue/button";
  import Card from "primevue/card";
  import Toast from "primevue/toast";
import { useQuery } from "@tanstack/vue-query";
  
  // Initialize router and route
  const router = useRouter();
  const route = useRoute();
  
  // Form state
  const title = ref("");
  const slug = ref("");
  const description = ref("");
  const imageUrls = ref<string[]>([]);
  const newImageUrl = ref("");
  const categoryId = ref("");
  const tagId = ref("");
  const isSubmitting = ref(false);
  const articleId = ref(route.params.id as string);
  
  const token = ref<string | null>(null);
  
  // Validation errors
  const errors = ref<Record<string, string>>({});
  
  // Only access localStorage in client-side context
  onMounted(() => {
    token.value = localStorage.getItem("token");
    fetchArticle();
  });
  
  // Toast for notifications
  const toast = useToast();
  
  // Get categories for dropdown
  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/api/category");
      return response.data.data || [];
    },
  });
  
  // Get tags for dropdown
  const { data: tags, isLoading: loadingTags } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await axios.get("/api/tag");
      return response.data.data || [];
    },
  });
  
  // Fetch article data
  const fetchArticle = async () => {
    try {
      const response = await axios.get(`/api/article/all/${articleId.value}`);
      const data = response.data;
      title.value = data.title;
      slug.value = data.slug;
      description.value = data.description;
      categoryId.value = data.categoryId;
      tagId.value = data.tagId;
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch article data', life: 3000 });
    }
  };
  
  // Auto-generate slug from title
  const generateSlug = () => {
    if (!title.value) return;
    slug.value = title.value
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };
  
  // Add image URL to the array
  const addImageUrl = () => {
    if (!newImageUrl.value) {
      toast.add({ severity: "warn", summary: "Warning", detail: "Please enter a valid image URL", life: 3000 });
      return;
    }
  
    try {
      // Basic URL validation
      new URL(newImageUrl.value);
      imageUrls.value.push(newImageUrl.value);
      newImageUrl.value = "";
      // Clear the error for imageUrls if it exists
      if (errors.value.urlToImage) {
        delete errors.value.urlToImage;
      }
    } catch (e) {
      toast.add({ severity: "error", summary: "Error", detail: "Invalid URL format", life: 3000 });
    }
  };
  
  // Remove image URL from array
  const removeImageUrl = (index: number) => {
    imageUrls.value.splice(index, 1);
    // If we removed all images, add the error back
    if (imageUrls.value.length === 0) {
      errors.value.urlToImage = "At least one image URL is required";
    }
  };
  
  // Validate the form against the schema requirements
  const validateForm = () => {
    errors.value = {};
    
    // Validate required fields
    if (!title.value.trim()) {
      errors.value.title = "Title is required";
    }
    
    if (!slug.value.trim()) {
      errors.value.slug = "Slug is required";
    }
    
    if (!description.value.trim()) {
      errors.value.description = "Description is required";
    }
    
    if (imageUrls.value.length === 0) {
      errors.value.urlToImage = "At least one image URL is required";
    }
    
    if (!categoryId.value) {
      errors.value.categoryId = "Category ID is required";
    }
    
    if (!tagId.value) {
      errors.value.tagId = "Tag ID is required";
    }
    
    return Object.keys(errors.value).length === 0;
  };
  
  // Update article mutation
  const updateArticle = async () => {
    if (!token.value) {
      toast.add({ severity: 'error', summary: 'Unauthorized', detail: 'Please log in to update the article.', life: 3000 });
      throw new Error('Unauthorized');
    }
    
    const articleData = {
      title: title.value,
      slug: slug.value,
      description: description.value,
      urlToImage: imageUrls.value,
      categoryId: categoryId.value,
      tagId: tagId.value,
    };
  
    try {
      await axios.put(`/api/article/update/${articleId.value}`, articleData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.value}`,
        }
      });
      toast.add({ severity: "success", summary: "Success", detail: "Article updated successfully!", life: 3000 });
      router.push("/dashboard/articles");
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message) {
        // Handle validation errors from the server
        toast.add({ severity: "error", summary: "Validation Error", detail: error.response.data.message, life: 5000 });
      } else {
        const errorMessage = error?.response?.data?.statusMessage || "Failed to update article";
        toast.add({ severity: "error", summary: "Error", detail: errorMessage, life: 5000 });
      }
      isSubmitting.value = false;
    }
  };
  
  // Submit form
  const handleSubmit = () => {
    if (validateForm()) {
      isSubmitting.value = true;
      updateArticle();
    } else {
      toast.add({ severity: "warn", summary: "Validation Error", detail: "Please fix the errors in the form", life: 3000 });
      isSubmitting.value = false;
    }
  };
  
  // Reset form
  const resetForm = () => {
    fetchArticle();
    isSubmitting.value = false;
    errors.value = {};
  };
  
  // Form validation status
  const isFormValid = computed(() => {
    return validateForm();
  });
  
  // Define navigation function
  const navigateTo = (path: string) => {
    router.push(path);
  };
  
  definePageMeta({ layout: "dashboard", middleware: "auth" });
  </script>