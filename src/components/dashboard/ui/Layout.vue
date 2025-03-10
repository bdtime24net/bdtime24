<template>
    <!-- Example of how to use the sidebar in a layout -->
    <div class="app-layout flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <!-- Sidebar navigation -->
      <div class="sidebar w-full md:w-64 lg:w-72 flex-shrink-0 bg-white dark:bg-gray-800 p-4 h-screen overflow-y-auto">
        <SidebarContainer />
      </div>
      
      <!-- Main content area -->
      <div class="flex-grow overflow-y-auto">
        <header class="bg-white dark:bg-gray-800 shadow-sm p-4">
          <!-- Header content -->
        </header>
        
        <main class="p-4">
          <router-view />
        </main>
      </div>
    </div>
  </template>
  
  <script setup>
  import SidebarContainer from '@/components/dashboard/Sidebar.vue';
  import { useAuthStore } from '@/stores/auth';
  import { onMounted } from 'vue';
  
  const authStore = useAuthStore();
  
  onMounted(() => {
    // Initialize authentication when app loads
    authStore.fetchUser();
  });
  </script>