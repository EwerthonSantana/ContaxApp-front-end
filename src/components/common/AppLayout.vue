<script setup lang="ts">
import AppHeader from "./AppHeader.vue";
</script>

<template>
  <div class="layout-wrapper">
    <AppHeader />
    <div class="layout-main p-4">
      <slot />
    </div>
  </div>
</template>
