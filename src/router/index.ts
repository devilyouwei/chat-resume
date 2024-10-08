import { createRouter, createWebHistory } from "vue-router";
import IndexView from "@/views/IndexView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: IndexView,
    },
  ],
});

export default router;
