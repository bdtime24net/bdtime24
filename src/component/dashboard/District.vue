<template>
    <div class="p-6">
      <h2 class="text-2xl font-semibold mb-4">Create District</h2>
  
      <form @submit.prevent="handleSubmit">
        <!-- District Name -->
        <div class="mb-4">
          <label for="name" class="block font-medium">District Name</label>
          <input
            v-model="form.name"
            type="text"
            id="name"
            class="w-full p-2 border rounded"
            placeholder="Enter district name"
            required
          />
          <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</p>
        </div>
  
        <!-- Bengali Name -->
        <div class="mb-4">
          <label for="bn_name" class="block font-medium">Bengali Name</label>
          <input
            v-model="form.bn_name"
            type="text"
            id="bn_name"
            class="w-full p-2 border rounded"
            placeholder="Enter Bengali name"
            required
          />
          <p v-if="errors.bn_name" class="text-red-500 text-sm">{{ errors.bn_name }}</p>
        </div>
  
        <!-- URL -->
        <div class="mb-4">
          <label for="url" class="block font-medium">URL</label>
          <input
            v-model="form.url"
            type="text"
            id="url"
            class="w-full p-2 border rounded"
            placeholder="Enter valid slug URL"
            required
          />
          <p v-if="errors.url" class="text-red-500 text-sm">{{ errors.url }}</p>
        </div>
  
        <!-- Area -->
        <div class="mb-4">
          <label for="area" class="block font-medium">Area</label>
          <input
            v-model.number="form.area"
            type="number"
            id="area"
            class="w-full p-2 border rounded"
            placeholder="Enter area"
            required
          />
          <p v-if="errors.area" class="text-red-500 text-sm">{{ errors.area }}</p>
        </div>
  
        <!-- Population -->
        <div class="mb-4">
          <label for="population" class="block font-medium">Population</label>
          <input
            v-model.number="form.population"
            type="number"
            id="population"
            class="w-full p-2 border rounded"
            placeholder="Enter population"
            required
          />
          <p v-if="errors.population" class="text-red-500 text-sm">{{ errors.population }}</p>
        </div>
  
        <!-- ISO Code -->
        <div class="mb-4">
          <label for="iso_code" class="block font-medium">ISO Code</label>
          <input
            v-model="form.iso_code"
            type="text"
            id="iso_code"
            class="w-full p-2 border rounded"
            placeholder="Enter ISO code"
            required
          />
          <p v-if="errors.iso_code" class="text-red-500 text-sm">{{ errors.iso_code }}</p>
        </div>
  
        <!-- Established Year -->
        <div class="mb-4">
          <label for="established" class="block font-medium">Established Year</label>
          <input
            v-model.number="form.established"
            type="number"
            id="established"
            class="w-full p-2 border rounded"
            placeholder="Enter year of establishment"
            required
          />
          <p v-if="errors.established" class="text-red-500 text-sm">{{ errors.established }}</p>
        </div>
  
        <!-- Division ID -->
        <div class="mb-4">
          <label for="divisionId" class="block font-medium">Division ID</label>
          <input
            v-model="form.divisionId"
            type="text"
            id="divisionId"
            class="w-full p-2 border rounded"
            placeholder="Enter division ID"
            required
          />
          <p v-if="errors.divisionId" class="text-red-500 text-sm">{{ errors.divisionId }}</p>
        </div>
  
        <!-- Submit Button -->
        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded" :disabled="loading">
          Create District
        </button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import { useMutation } from "@tanstack/vue-query";
  import axios from "axios";
  import { useToast } from "primevue/usetoast";
  
  const form = ref({
    name: "",
    bn_name: "",
    url: "",
    area: 0,
    population: 0,
    iso_code: "",
    established: 0,
    divisionId: "",
  });
  
  const errors = ref({
    name: "",
    bn_name: "",
    url: "",
    area: "",
    population: "",
    iso_code: "",
    established: "",
    divisionId: "",
  });
  
  const toast = useToast();
  const loading = ref(false);
  
  // Handle form submission
  const createDistrict = useMutation({
    mutationFn: async (data: typeof form.value) => {
      try {
        const response = await axios.post("/api/district/create", data);
        return response.data;
      } catch (error) {
        throw new Error("Failed to create district");
      }
    },
    onSuccess: (data) => {
      toast.add({
        severity: "success",
        summary: "District Created!",
        detail: "The district was successfully created.",
        life: 3000,
      });
      // Clear form on success
      form.value = {
        name: "",
        bn_name: "",
        url: "",
        area: 0,
        population: 0,
        iso_code: "",
        established: 0,
        divisionId: "",
      };
    },
    onError: (error) => {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000,
      });
    },
    onMutate: () => {
      loading.value = true;
    },
    onSettled: () => {
      loading.value = false;
    },
  });
  
  // Validate form
  const handleSubmit = () => {
    // Basic client-side validation
    errors.value = {
      name: form.value.name ? "" : "District name is required",
      bn_name: form.value.bn_name ? "" : "Bengali name is required",
      url: form.value.url ? "" : "URL is required",
      area: form.value.area > 0 ? "" : "Area must be a positive number",
      population: form.value.population > 0 ? "" : "Population must be a positive integer",
      iso_code: form.value.iso_code ? "" : "ISO code is required",
      established: form.value.established > 0 ? "" : "Established year must be a positive integer",
      divisionId: form.value.divisionId ? "" : "Division ID is required",
    };
  
    // If no errors, submit form
    if (Object.values(errors.value).every((err) => !err)) {
      createDistrict.mutate(form.value);
    }
  };
  </script>
  
  <style scoped>
  /* Add custom styles or use Tailwind CSS for the form */
  </style>
  