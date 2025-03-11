<script setup>
import { useQuery } from '@tanstack/vue-query'

// Fetch the user profile data
const { data, isLoading, error } = useQuery({
  queryKey: ['profile'],
  queryFn: async () => {
    const response = await fetch('/api/auth/me')

    // Check for non-OK responses (e.g., 404, 500)
    if (!response.ok) {
      throw new Error('Failed to fetch user profile')
    }

    return response.json()
  }
})
</script>

<template>
  <div v-if="isLoading" class="loading-state">
    Loading your profile...
  </div>
  
  <div v-else-if="error" class="error-state">
    <p>Error loading profile: {{ error.message }}</p>
  </div>

  <div v-else class="profile">
    <h1>{{ data.name }}</h1>
    <p>{{ data.email }}</p>
    <div v-if="data.avatarUrl">
      <img :src="data.avatarUrl" alt="User Avatar" class="avatar" />
    </div>
  </div>
</template>

<style scoped>
.loading-state {
  font-size: 1.5rem;
  color: #0070f3;
}

.error-state {
  color: red;
  font-size: 1.2rem;
}

.profile {
  padding: 20px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-top: 10px;
}
</style>
