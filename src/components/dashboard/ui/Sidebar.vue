<script setup>
import { ref } from "vue";
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';

// Define the reactive state for visibility
const visible = ref(false);

// Define the menu items structure with links
const menuItems = [
  {
    label: "FAVORITES",
    icon: "pi pi-chevron-down",
    items: [
      { label: "Dashboard", icon: "pi pi-home", link: "/dashboard" },
      { label: "Bookmarks", icon: "pi pi-bookmark", link: "/bookmarks" },
      {
        label: "Reports",
        icon: "pi pi-chart-line",
        link: "/reports",
        items: [
          { label: "Revenue", icon: "pi pi-chart-line", link: "/reports/revenue", items: [{ label: "View", icon: "pi pi-table", link: "/reports/revenue/view" }, { label: "Search", icon: "pi pi-search", link: "/reports/revenue/search" }] },
          { label: "Expenses", icon: "pi pi-chart-line", link: "/reports/expenses" }
        ]
      },
      { label: "Team", icon: "pi pi-users", link: "/team" },
      { label: "Messages", icon: "pi pi-comments", badge: 3, link: "/messages" },
      { label: "Calendar", icon: "pi pi-calendar", link: "/calendar" },
      { label: "Settings", icon: "pi pi-cog", link: "/settings" }
    ]
  },
  {
    label: "APPLICATION",
    icon: "pi pi-chevron-down",
    items: [
      { label: "Tags", icon: "pi pi-folder", link: "/dashboard/tag" },
      { label: "Category", icon: "pi pi-chart-bar", link: "/dashboard/category" },
      { label: "Geo-Location", icon: "pi pi-map-marker", link: "/dashboard/geo/create" },
      {
        label: "Article",
        icon: "pi pi-file",
        link: "/dashboard/articles",
        items: [
          { label: " Create Articles", icon: "pi pi-plus", link: "/dashboard/articles/create" },
          {
        label: 'Search Files',
        icon: 'pi pi-search',
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
    ]
  }
];

// State to track which sections are expanded
const expandedSections = ref({});

// Function to toggle submenu visibility
const toggleSection = (sectionKey) => {
  expandedSections.value = {
    ...expandedSections.value,
    [sectionKey]: !expandedSections.value[sectionKey]
  };
};

// Function to toggle nested submenu
const toggleSubMenu = (event, sectionKey) => {
  event.stopPropagation();
  toggleSection(sectionKey);
};
</script>

<template>
  <div class="card flex justify-center">
    <Drawer v-model:visible="visible">
      <template #container="{ closeCallback }">
        <div class="flex flex-col h-full">
          <div class="flex items-center justify-between px-6 pt-4 shrink-0">
            <span class="inline-flex items-center gap-2">
              <svg width="35" height="40" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M25.87 18.05L23.16 17.45L25.27 20.46V29.78L32.49 23.76V13.53L29.18 14.73L25.87 18.04V18.05ZM25.27 35.49L29.18 31.58V27.67L25.27 30.98V35.49ZM20.16 17.14H20.03H20.17H20.16ZM30.1 5.19L34.89 4.81L33.08 12.33L24.1 15.67L30.08 5.2L30.1 5.19ZM5.72 14.74L2.41 13.54V23.77L9.63 29.79V20.47L11.74 17.46L9.03 18.06L5.72 14.75V14.74ZM9.63 30.98L5.72 27.67V31.58L9.63 35.49V30.98ZM4.8 5.2L10.78 15.67L1.81 12.33L0 4.81L4.79 5.19L4.8 5.2ZM24.37 21.05V34.59L22.56 37.29L20.46 39.4H14.44L12.34 37.29L10.53 34.59V21.05L12.42 18.23L17.45 26.8L22.48 18.23L24.37 21.05ZM22.85 0L22.57 0.69L17.45 13.08L12.33 0.69L12.05 0H22.85Z"
                  fill="var(--p-primary-color)"
                />
                <path
                  d="M30.69 4.21L24.37 4.81L22.57 0.69L22.86 0H26.48L30.69 4.21ZM23.75 5.67L22.66 3.08L18.05 14.24V17.14H19.7H20.03H20.16H20.2L24.1 15.7L30.11 5.19L23.75 5.67ZM4.21002 4.21L10.53 4.81L12.33 0.69L12.05 0H8.43002L4.22002 4.21H4.21002ZM21.9 17.4L20.6 18.2H14.3L13 17.4L12.4 18.2L12.42 18.23L17.45 26.8L22.48 18.23L22.5 18.2L21.9 17.4ZM4.79002 5.19L10.8 15.7L14.7 17.14H14.74H15.2H16.85V14.24L12.24 3.09L11.15 5.68L4.79002 5.2V5.19Z"
                  fill="var(--p-text-color)"
                />
              </svg>
              <span class="font-semibold text-2xl text-primary">Your Logo</span>
            </span>
            <span>
              <Button type="button" @click="closeCallback" icon="pi pi-times" rounded outlined></Button>
            </span>
          </div>
          <div class="overflow-y-auto">
            <ul class="list-none p-4 m-0">
              <li v-for="(menuItem, mIndex) in menuItems" :key="menuItem.label">
                <div
                  @click="toggleSection('menu_' + mIndex)"
                  class="p-4 flex items-center justify-between text-surface-500 dark:text-surface-400 cursor-pointer"
                >
                  <span class="font-medium">{{ menuItem.label }}</span>
                  <i :class="[
                    'pi',
                    expandedSections['menu_' + mIndex] ? 'pi-chevron-up' : 'pi-chevron-down'
                  ]"></i>
                </div>
                <ul 
                  v-if="menuItem.items" 
                  class="list-none p-0 m-0 overflow-hidden transition-all duration-300"
                  :class="[
                    expandedSections['menu_' + mIndex] ? 'max-h-screen' : 'max-h-0'
                  ]"
                >
                  <li v-for="(subItem, sIndex) in menuItem.items" :key="subItem.label">
                    <div class="flex items-center w-full">
                      <a :href="subItem.link" class="flex items-center flex-grow cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors">
                        <i :class="subItem.icon + ' mr-2'"></i>
                        <span class="font-medium">{{ subItem.label }}</span>
                        <span v-if="subItem.badge" class="inline-flex items-center justify-center ml-auto bg-primary text-primary-contrast rounded-full" style="min-width: 1.5rem; height: 1.5rem">{{ subItem.badge }}</span>
                      </a>
                      <button 
                        v-if="subItem.items" 
                        @click="toggleSubMenu($event, 'submenu_' + mIndex + '_' + sIndex)"
                        class="p-2 ml-2 rounded hover:bg-surface-100 dark:hover:bg-surface-800"
                      >
                        <i :class="[
                          'pi',
                          expandedSections['submenu_' + mIndex + '_' + sIndex] ? 'pi-chevron-up' : 'pi-chevron-down'
                        ]"></i>
                      </button>
                    </div>
                    <ul 
                      v-if="subItem.items" 
                      class="list-none py-0 pl-4 pr-0 m-0 transition-all duration-300"
                      :class="[
                        expandedSections['submenu_' + mIndex + '_' + sIndex] ? 'max-h-screen' : 'max-h-0 overflow-hidden'
                      ]"
                    >
                      <li v-for="nestedItem in subItem.items" :key="nestedItem.label">
                        <a :href="nestedItem.link" class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors">
                          <i :class="nestedItem.icon + ' mr-2'"></i>
                          <span class="font-medium">{{ nestedItem.label }}</span>
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div class="mt-auto">
            <hr class="mb-4 mx-4 border-t border-surface-200 dark:border-surface-700" />
            <a href="/dashboard/profile" class="m-4 flex items-center cursor-pointer p-4 gap-2 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors">
              <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
              <span class="font-bold">Amy Elsner</span>
            </a>
          </div>
        </div>
      </template>
    </Drawer>
    <Button icon="pi pi-bars" @click="visible = true" />
  </div>
</template>