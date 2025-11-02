<script setup lang="ts">
import "primeflex/primeflex.css";
import { useAuth } from "./composables/auth/useAuth";
import AppLayout from "./components/common/AppLayout.vue";

const { isAuthenticated } = useAuth();
</script>

<template>
  <div id="app-container" class="min-h-screen">
    <router-view v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <AppLayout v-if="isAuthenticated" :key="$route.path">
          <component :is="Component" />
        </AppLayout>

        <component :is="Component" v-else key="unauthenticated-page" />
      </Transition>
    </router-view>
  </div>
</template>

<style>
#app-container {
  font-family: var(--font-family);
  background-color: var(--surface-ground);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
