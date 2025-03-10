<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import axios from "axios";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Card from "primevue/card";
import Toast from "primevue/toast";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Skeleton from "primevue/skeleton";

// State for form inputs
const name = ref("");
const description = ref("");
const toast = useToast();
const queryClient = useQueryClient();

// State for pagination
const currentPage = ref(1);
const pageSize = ref(10);
const totalCategories = ref(0);
const totalPages = ref(0);
const first = ref(0);

// Fetch Categories
const { data: response, isLoading, refetch } = useQuery({
  queryKey: ["categories", currentPage.value, pageSize.value],
  queryFn: async () => {
    const res = await axios.get(`/api/category?page=${currentPage.value}&limit=${pageSize.value}`);
    // Update pagination values from response
    if (res.data.pagination) {
      totalCategories.value = res.data.pagination.totalCategories || res.data.pagination.total || 0;
      totalPages.value = res.data.pagination.totalPages || 0;
      // Ensure currentPage stays in sync with API response
      currentPage.value = res.data.pagination.currentPage || 1;
      // Calculate first for DataTable
      first.value = (currentPage.value - 1) * pageSize.value;
    }
    return res.data;
  },
});

// Computed property for categories data
const categories = computed(() => response.value?.data || []);

// Watch for page changes to trigger refetch
watch([currentPage, pageSize], () => {
  refetch();
});

// Create Category Mutation
const createCategory = useMutation({
  mutationFn: async () => {
    await axios.post("/api/category/create", {
      name: name.value,
      description: description.value
    });
  },
  onSuccess: () => {
    toast.add({ severity: "success", summary: "Success", detail: "Category Created!", life: 3000 });
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    resetForm();
  },
  onError: (error) => {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to create category",
      life: 3000,
    });
  },
});

// Reset form fields
const resetForm = () => {
  name.value = "";
  description.value = "";
};

// Submit Form
const submitForm = () => {
  if (!name.value) {
    toast.add({ severity: "warn", summary: "Warning", detail: "Category name is required", life: 3000 });
    return;
  }
  createCategory.mutate();
};

// Handle page changes
const onPageChange = (event: { first: number; rows: number; }) => {
  currentPage.value = Math.floor(event.first / event.rows) + 1;
  pageSize.value = event.rows;
  first.value = event.first;
};

// Format date for display
const formatDate = (rowData: { createdAt: string | number | Date; }) => {
  return rowData.createdAt ? new Date(rowData.createdAt).toLocaleDateString() : '';
};
</script>

<template>
  <Toast />
  <div class="p-6 max-w-3xl mx-auto">
    <!-- Create Category Form -->
    <Card class="shadow-lg rounded-xl">
      <template #title> Create Category </template>
      <template #content>
        <div class="grid gap-4">
          <div>
            <label for="categoryName" class="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
            <InputText 
              id="categoryName" 
              v-model="name" 
              placeholder="Enter category name" 
              class="w-full p-2 border border-gray-300 rounded-md" 
            />
          </div>
          
          <div>
            <label for="categoryDescription" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <Textarea 
              id="categoryDescription" 
              v-model="description" 
              placeholder="Enter category description (optional)" 
              rows="3" 
              class="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div class="flex gap-2">
            <Button label="Create Category" icon="pi pi-plus" class="flex-1" @click="submitForm" />
            <Button label="Reset" icon="pi pi-refresh" class="p-button-outlined" @click="resetForm" />
          </div>
        </div>
      </template>
    </Card>

    <!-- Category List -->
    <Card class="mt-6 shadow-lg rounded-xl">
      <template #title> Category List </template>
      <template #content>
        <DataTable
          :value="categories"
          v-if="categories && categories.length"
          :paginator="true"
          :rows="pageSize"
          :totalRecords="totalCategories"
          :first="first"
          @page="onPageChange"
          :rowsPerPageOptions="[10, 20, 30]"
          :loading="isLoading"
          :lazy="true"
          stripedRows
          responsiveLayout="scroll"
        >
          <Column field="name" header="Name" sortable></Column>
          <Column field="description" header="Description">
            <template #body="slotProps">
              <div class="line-clamp-2">{{ slotProps.data.description || "—" }}</div>
            </template>
          </Column>
          <Column field="createdAt" header="Created At" sortable>
            <template #body="slotProps">
              {{ formatDate(slotProps.data) }}
            </template>
          </Column>
        </DataTable>
        <div v-else-if="isLoading">
          <Skeleton width="100%" height="40px" class="mb-2"></Skeleton>
          <Skeleton width="80%" height="40px" class="mb-2"></Skeleton>
          <Skeleton width="60%" height="40px"></Skeleton>
        </div>
        <p v-else class="text-center text-gray-500">No categories found</p>
      </template>
    </Card>

    <div class="mt-4 text-sm text-gray-500">
      <p>Page {{ currentPage }} of {{ totalPages }} (Total: {{ totalCategories }} categories)</p>
    </div>
  </div>
</template>