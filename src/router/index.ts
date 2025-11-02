// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "../composables/auth/useAuth";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/auth/LoginPage.vue"),
    meta: { public: true }, // Marca a rota como pública
  },
  {
    path: "/",
    name: "contacts",
    component: () => import("../views/contact/ContactListPage.vue"),
    meta: { requiresAuth: true }, // Marca a rota como protegida
  },
  // ... outras rotas
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth(); // Reutiliza o composable

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: "login" });
  } else if (to.name === "login" && isAuthenticated.value) {
    next({ name: "contacts" });
  } else {
    next();
  }
});

export default router;
