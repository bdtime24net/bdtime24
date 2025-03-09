<script setup lang="ts">
import { ref } from "vue";
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
const bn_name = ref("");
const url = ref("");
const toast = useToast();
const queryClient = useQueryClient();

// Fetch Divisions
const { data: divisions, isLoading } = useQuery({
  queryKey: ["divisions"],
  queryFn: async () => {
    const response = await axios.get("/api/division");
    return response.data;
  },
});

// Create Division Mutation
const createDivision = useMutation({
  mutationFn: async () => {
    await axios.post("/api/division/create", {
      name: name.value,
      bn_name: bn_name.value,
      url: url.value,
    });
  },
  onSuccess: () => {
    toast.add({ severity: "success", summary: "Success", detail: "Division Created!", life: 3000 });
    queryClient.invalidateQueries({ queryKey: ["divisions"] });
    name.value = "";
    bn_name.value = "";
    url.value = "";
  },
  onError: (error) => {
    toast.add({
      severity: "error",
      summary: "Error",
      detail:"Failed to create division",
      life: 3000,
    });
  },
});

// Submit Form
const submitForm = () => {
  if (!name.value || !bn_name.value || !url.value) {
    toast.add({ severity: "warn", summary: "Warning", detail: "All fields are required", life: 3000 });
    return;
  }
  createDivision.mutate();
};
</script>

<template>
  <Toast />
  <div class="p-6 max-w-3xl mx-auto">
    <!-- Create Division Form -->
    <Card class="shadow-lg rounded-xl">
      <template #title> Create Division </template>
      <template #content>
        <div class="grid gap-4">
          <InputText v-model="name" placeholder="Division Name" class="w-full p-2 border border-gray-300 rounded-md" />
          <InputText v-model="bn_name" placeholder="Bengali Name" class="w-full p-2 border border-gray-300 rounded-md" />
          <InputText v-model="url" placeholder="URL" class="w-full p-2 border border-gray-300 rounded-md" />
          <Button label="Create" icon="pi pi-check" class="w-full" @click="submitForm" />
        </div>
      </template>
    </Card>

    <!-- Division List -->
    <Card class="mt-6 shadow-lg rounded-xl">
      <template #title> Divisions List </template>
      <template #content>
        <DataTable :value="divisions" v-if="divisions && divisions.length">
          <Column field="name" header="Name"></Column>
          <Column field="bn_name" header="Bengali Name"></Column>
          <Column field="url" header="URL"></Column>
        </DataTable>

        <div v-else-if="isLoading">
          <Skeleton width="100%" height="40px" class="mb-2"></Skeleton>
          <Skeleton width="80%" height="40px" class="mb-2"></Skeleton>
          <Skeleton width="60%" height="40px"></Skeleton>
        </div>

        <p v-else class="text-center text-gray-500">No divisions found</p>
      </template>
    </Card>
  </div>
</template>
