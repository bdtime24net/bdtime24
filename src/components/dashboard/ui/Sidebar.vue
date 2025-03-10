<template>
  <div class="sidebar-container transition-all duration-300">
    <Menu :model="items" class="w-full md:w-64 lg:w-72 shadow-md rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <!-- Submenu Label Template with Enhanced Styling -->
      <template #submenulabel="{ item }">
        <div class="flex items-center py-2 px-3 text-blue-600 dark:text-blue-400 font-medium">
          <span v-if="item.icon" :class="[item.icon, 'mr-2']"></span>
          <span>{{ item.label }}</span>
        </div>
      </template>
      
      <!-- Menu Item Template with Enhanced Styling -->
      <template #item="{ item, props }">
        <router-link v-if="item.to" 
                    v-ripple 
                    :to="item.to" 
                    custom 
                    v-slot="{ navigate, isActive }">
          <a @click="navigate" 
             :class="['flex items-center py-2 px-3 rounded-md transition-colors duration-200', 
                     isActive ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 
                     'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800']"
             v-bind="props.action">
            <span v-if="item.icon" :class="[item.icon, 'mr-2', isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400']"></span>
            <span>{{ item.label }}</span>
            <Badge v-if="item.badge" 
                  class="ml-auto bg-blue-500 text-white px-2 py-1 text-xs rounded-full" 
                  :value="item.badge" />
            <span v-if="item.shortcut" 
                  class="ml-auto text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">
              {{ item.shortcut }}
            </span>
          </a>
        </router-link>
        
        <a v-else-if="item.url" 
           v-ripple 
           :href="item.url" 
           :target="item.target || '_self'"
           class="flex items-center py-2 px-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200" 
           v-bind="props.action">
          <span v-if="item.icon" :class="[item.icon, 'mr-2 text-gray-500 dark:text-gray-400']"></span>
          <span>{{ item.label }}</span>
          <i v-if="item.target === '_blank'" class="pi pi-external-link ml-2 text-xs text-gray-400"></i>
          <Badge v-if="item.badge" 
                 class="ml-auto bg-blue-500 text-white px-2 py-1 text-xs rounded-full" 
                 :value="item.badge" />
          <span v-if="item.shortcut" 
                class="ml-auto text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">
            {{ item.shortcut }}
          </span>
        </a>
        
        <a v-else 
           v-ripple 
           class="flex items-center py-2 px-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200" 
           v-bind="props.action"
           @click="item.command ? item.command() : undefined">
          <span v-if="item.icon" :class="[item.icon, 'mr-2 text-gray-500 dark:text-gray-400']"></span>
          <span>{{ item.label }}</span>
          <Badge v-if="item.badge" 
                 class="ml-auto bg-blue-500 text-white px-2 py-1 text-xs rounded-full" 
                 :value="item.badge" />
          <span v-if="item.shortcut" 
                class="ml-auto text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">
            {{ item.shortcut }}
          </span>
        </a>
      </template>
      
      <!-- User Profile at Bottom -->
      <template #end>
        <div class="border-t border-gray-200 dark:border-gray-700 mt-2">
          <router-link to="/profile" custom v-slot="{ navigate }">
            <button v-ripple 
                    @click="navigate"
                    class="w-full flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
              <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" 
                      class="mr-3" 
                      size="large" 
                      shape="circle" />
              <div class="flex flex-col items-start">
                <span class="font-medium text-gray-800 dark:text-gray-200">Amy Elsner</span>
                <span class="text-sm text-gray-500 dark:text-gray-400">Administrator</span>
              </div>
              <i class="pi pi-angle-down ml-auto text-gray-400"></i>
            </button>
          </router-link>
        </div>
      </template>
    </Menu>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Comprehensive menu items with complete route navigation
const items = ref([
  {
    label: 'Dashboard',
    icon: 'pi pi-home',
    to: '/dashboard'
  },
  {
    label: 'Analytics',
    icon: 'pi pi-chart-bar',
    to: '/dashboard/analytics'
  },
  {
    separator: true
  },
  {
    label: 'Posts',
    icon: 'pi pi-folder',
    items: [
      {
        label: 'Posts',
        icon: 'pi pi-file',
        to: '/dashboard/post'
      },
      {
        label: 'New Post',
        icon: 'pi pi-plus',
        shortcut: '⌘+N',
        to: '/dashboard/post/create'
      },
      {
        label: 'Search Files',
        icon: 'pi pi-search',
        shortcut: '⌘+S',
        to: '/dashboard/post/search'
      },
      {
        label: 'Recent Files',
        icon: 'pi pi-clock',
        to: '/dashboard/post/recent'
      },
      {
        label: 'Shared With Me',
        icon: 'pi pi-share-alt',
        to: '/dashboard/post/shared'
      },
      {
        label: 'Favorites',
        icon: 'pi pi-star',
        to: '/dashboard/post/favorites'
      },
      {
        label: 'Trash',
        icon: 'pi pi-trash',
        to: '/dashboard/post/trash'
      }
    ]
  },
  {
    label: 'Projects',
    icon: 'pi pi-briefcase',
    items: [
      {
        label: 'All Projects',
        icon: 'pi pi-list',
        to: '/dashboard/projects'
      },
      {
        label: 'Create Project',
        icon: 'pi pi-plus',
        to: '/dashboard/projects/create'
      },
      {
        label: 'My Tasks',
        icon: 'pi pi-check-square',
        badge: '5',
        to: '/dashboard/projects/tasks'
      },
      {
        label: 'Calendar',
        icon: 'pi pi-calendar',
        to: '/dashboard/projects/calendar'
      },
      {
        label: 'Team',
        icon: 'pi pi-users',
        to: '/dashboard/projects/team'
      }
    ]
  },

  {
    separator: true
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    items: [
      {
        label: 'Account Settings',
        icon: 'pi pi-user-edit',
        to: '/settings/account'
      },
      {
        label: 'Appearance',
        icon: 'pi pi-palette',
        to: '/settings/appearance'
      },
      {
        label: 'Security',
        icon: 'pi pi-shield',
        to: '/settings/security'
      },
      {
        label: 'Notifications',
        icon: 'pi pi-bell',
        to: '/settings/notifications'
      },
      {
        label: 'Billing',
        icon: 'pi pi-money-bill',
        to: '/settings/billing'
      },
      {
        label: 'API Keys',
        icon: 'pi pi-key',
        to: '/settings/api'
      }
    ]
  },
  {
    separator: true
  },
  {
    label: 'Help & Support',
    icon: 'pi pi-question-circle',
    items: [
      {
        label: 'Documentation',
        icon: 'pi pi-book',
        url: 'https://docs.example.com',
        target: '_blank'
      },
      {
        label: 'Knowledge Base',
        icon: 'pi pi-info-circle',
        to: '/support/knowledge-base'
      },
      {
        label: 'Contact Support',
        icon: 'pi pi-envelope',
        to: '/support/contact'
      },
      {
        label: 'Profile',
        icon: 'pi pi-question',
        to: '/dashboard/profile'
      }
    ]
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: () => {
      // Logout logic would go here
      console.log('Logging out...');
      // Example: router.push('/login');
    }
  }
]);


</script>

<style scoped>
/* Optional - Add any additional custom styles here if needed */
.sidebar-container :deep(.p-menu) {
  border: none;
  background: transparent;
  width: 100%;
}

.sidebar-container :deep(.p-menuitem-separator) {
  margin: 0.5rem 0;
  border-top: 1px solid rgb(229 231 235 / 1);
}

.dark .sidebar-container :deep(.p-menuitem-separator) {
  border-top-color: rgb(55 65 81 / 1);
}

/* Ensure proper avatar sizing */
.sidebar-container :deep(.p-avatar.p-avatar-large) {
  width: 2.5rem;
  height: 2.5rem;
}

/* Enhance responsive behavior */
@media (max-width: 768px) {
  .sidebar-container :deep(.p-avatar.p-avatar-large) {
    width: 2rem;
    height: 2rem;
  }
}

/* Active route styling */
.sidebar-container :deep(.router-link-active) {
  background-color: rgb(239 246 255 / 1);
  color: rgb(37 99 235 / 1);
}

.dark .sidebar-container :deep(.router-link-active) {
  background-color: rgba(30, 58, 138, 0.3);
  color: rgb(96 165 250 / 1);
}
</style>