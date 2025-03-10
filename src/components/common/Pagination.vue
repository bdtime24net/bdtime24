<template>
    <div class="flex items-center justify-between">
      <button 
        @click="prevPage" 
        :disabled="currentPage === 1"
        class="px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span class="px-4 py-2 text-gray-700">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button 
        @click="nextPage" 
        :disabled="currentPage === totalPages"
        class="px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  });
  
  const emits = defineEmits(['changePage']);
  
  const prevPage = () => {
    if (props.currentPage > 1) {
      emits('changePage', props.currentPage - 1);
    }
  };
  
  const nextPage = () => {
    if (props.currentPage < props.totalPages) {
      emits('changePage', props.currentPage + 1);
    }
  };
  </script>
  
  <style scoped>
  button:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
  </style>