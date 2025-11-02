<script setup lang="ts">
import Button from "primevue/button";
import Menubar from "primevue/menubar";
import { ref } from "vue";
import { useAuth } from "../../composables/auth/useAuth";

const { logout } = useAuth();

// Menu com o item de logout
const items = ref([
  {
    label: "Contatos",
    icon: "pi pi-address-book",
    to: "/", // Rota para a lista de contatos
  },
  // Adicionar outros itens de menu aqui, se necessário
]);

const userMenuItems = ref([
  {
    label: "Sair",
    icon: "pi pi-sign-out",
    command: () => {
      logout(); // Chama o logout do composable
    },
  },
]);
</script>

<template>
  <Menubar :model="items" class="shadow-2">
    <template #start>
      <div class="font-bold text-xl mr-5">
        <i class="pi pi-calendar mr-2"></i> Contax Agenda
      </div>
    </template>
    <template #end>
      <Button
        label="Sair"
        icon="pi pi-sign-out"
        class="p-button-danger p-button-sm"
        @click="logout"
      />
    </template>
  </Menubar>
</template>
