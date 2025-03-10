<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import axios from "axios";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Card from "primevue/card";
import Toast from "primevue/toast";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Skeleton from "primevue/skeleton";

// State for form inputs
const name = ref("");
const toast = useToast();
const queryClient = useQueryClient();

// State for pagination
const currentPage = ref(1);
const pageSize = ref(10);
const totalTags = ref(0);
const totalPages = ref(0);
const first = ref(0); // Starting index for DataTable (0-based)

// Fetch Tags
const { data: response, isLoading, refetch } = useQuery({
  queryKey: ["tags", currentPage.value, pageSize.value],
  queryFn: async () => {
    const res = await axios.get(`/api/tag?page=${currentPage.value}&limit=${pageSize.value}`);
    // Update pagination values from response
    if (res.data.pagination) {
      totalTags.value = res.data.pagination.totalTags;
      totalPages.value = res.data.pagination.totalPages;
      // Ensure currentPage stays in sync with API response
      currentPage.value = res.data.pagination.currentPage;
      // Calculate first for DataTable
      first.value = (currentPage.value - 1) * pageSize.value;
    }
    return res.data;
  },
});

// Computed property for tags data
const tags = computed(() => response.value?.data || []);

// Watch for page changes to trigger refetch
watch([currentPage, pageSize], () => {
  refetch();
});

// Create Tag Mutation
const createTag = useMutation({
  mutationFn: async () => {
    await axios.post("/api/tag/create", {
      name: name.value,
    });
  },
  onSuccess: () => {
    toast.add({ severity: "success", summary: "Success", detail: "Tag Created!", life: 3000 });
    queryClient.invalidateQueries({ queryKey: ["tags"] });
    name.value = "";
  },
  onError: (error) => {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to create tag",
      life: 3000,
    });
  },
});

// Submit Form
const submitForm = () => {
  if (!name.value) {
    toast.add({ severity: "warn", summary: "Warning", detail: "All fields are required", life: 3000 });
    return;
  }
  createTag.mutate();
};

// Handle page changes
const onPageChange = (event: { first: number; rows: number; }) => {
  // DataTable pagination is 0-based, but our API is 1-based
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
    <!-- Create Tag Form -->
    <Card class="shadow-lg rounded-xl">
      <template #title> Create Tag </template>
      <template #content>
        <div class="grid gap-4">
          <InputText v-model="name" placeholder="Tag Name" class="w-full p-2 border border-gray-300 rounded-md" />
          <Button label="Create" icon="pi pi-check" class="w-full" @click="submitForm" />
        </div>
      </template>
    </Card>

    <!-- Tag List -->
    <Card class="mt-6 shadow-lg rounded-xl">
      <template #title> Tag List </template>
      <template #content>
        <DataTable
          :value="tags"
          v-if="tags && tags.length"
          :paginator="true"
          :rows="pageSize"
          :totalRecords="totalTags"
          :first="first"
          @page="onPageChange"
          :rowsPerPageOptions="[10, 20, 30]"
          :loading="isLoading"
          :lazy="true"
        >
          <Column field="name" header="Name"></Column>
          <Column field="createdAt" header="Created At">
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
        <p v-else class="text-center text-gray-500">No Tags found</p>
      </template>
    </Card>

    <div class="mt-4 text-sm text-gray-500">
      <p>Page {{ currentPage }} of {{ totalPages }} (Total: {{ totalTags }} tags)</p>
    </div>
  </div>
</template>