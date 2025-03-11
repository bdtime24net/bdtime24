// plugins/pinia.ts
import { createPinia } from 'pinia';

export default defineNuxtPlugin(nuxtApp => {
  const pinia = createPinia();
  nuxtApp.vueApp.use(pinia); // Add Pinia to the Vue app
});
