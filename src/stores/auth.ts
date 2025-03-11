// src/stores/auth.ts
import { defineStore } from 'pinia';
import { useQuery } from '@tanstack/vue-query';
import axios from 'axios';  // or the API client you're using

// Create a store to manage authentication state
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  actions: {
    async fetchUserProfile() {
      try {
        const { data } = await axios.get('/api/auth/me'); // API endpoint for fetching user data
        this.user = data; // Store the user data in the state
      } catch (error) {
        console.error('Error fetching user profile', error);
      }
    },
  },
});
