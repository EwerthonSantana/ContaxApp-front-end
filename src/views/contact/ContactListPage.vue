<script setup lang="ts">
import { onMounted, ref } from "vue";

// PrimeVue components
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ProgressSpinner from "primevue/progressspinner";
import Message from "primevue/message";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Toolbar from "primevue/toolbar";
import { useContact } from "../../composables/contact/useContact";
import ContactFormModal from "../../components/contact/ContactFormModal.vue";
import { IContact } from "../../interfaces/IContact";
import { useConfirm } from "primevue/useconfirm"; // Serviço de Confirmação
import { useToast } from "primevue/usetoast";
import ConfirmDialog from "primevue/confirmdialog";

const {
  contacts,
  isLoading,
  error,
  loadContacts,
  reloadContacts,
  openModal,
  deleteContact,
} = useContact();

const confirm = useConfirm();
const toast = useToast();

const filters = ref({
  global: { value: null, matchMode: "contains" as const },
});
const globalFilter = ref("");

onMounted(() => {
  loadContacts();
});

const confirmDelete = (contact: IContact) => {
  confirm.require({
    message: `Tem certeza que deseja deletar o contato de ${contact.name}?`,
    header: "Confirmação de Exclusão",
    icon: "pi pi-exclamation-triangle",
    rejectLabel: "Cancelar",
    acceptLabel: "Deletar",
    rejectClass: "p-button-secondary p-button-outlined",
    acceptClass: "p-button-danger",

    accept: async () => {
      const success = await deleteContact(contact.id);
      if (success) {
        toast.add({
          severity: "success",
          summary: "Sucesso",
          detail: "Contato excluído com sucesso.",
          life: 3000,
        });
      } else {
        toast.add({
          severity: "error",
          summary: "Erro",
          detail: "Falha ao excluir contato.",
          life: 3000,
        });
      }
    },
  });
};

const onGlobalFilterChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  filters.value.global.value = target.value;
};
</script>

<template>
  <div class="p-4">
    <h2><i class="pi pi-users mr-2"></i> Gerenciamento de Contatos</h2>

    <Toolbar class="mb-4">
      <template #start>
        <Button
          label="Recarregar"
          icon="pi pi-refresh"
          class="p-button-secondary mr-2"
          :loading="isLoading"
          @click="reloadContacts"
        />
        <span class="p-input-icon-left">
          <i class="pi pi-search mr-2" />
          <InputText
            v-model="globalFilter"
            placeholder="Buscar em Contatos"
            @input="onGlobalFilterChange"
          />
        </span>
      </template>
      <template #end>
        <Button
          label="Adicionar Novo"
          icon="pi pi-plus"
          class="p-button-success"
          @click="openModal()"
        />
      </template>
    </Toolbar>
    <ConfirmDialog />
    <Toast />
    <ContactFormModal />

    <Message v-if="error" severity="error" :closable="false" class="mb-4">{{
      error
    }}</Message>

    <div v-if="isLoading" class="flex justify-content-center my-5">
      <ProgressSpinner />
    </div>

    <DataTable
      v-else-if="contacts.length > 0"
      :value="contacts"
      responsiveLayout="scroll"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[10, 25, 50]"
      dataKey="id"
      v-model:filters="filters"
      filterDisplay="menu"
      :globalFilterFields="['name', 'email', 'phone']"
      :loading="isLoading"
      stripedRows
      showGridlines
      class="shadow-2"
    >
      <Column
        field="id"
        header="ID"
        :sortable="true"
        style="width: 5rem"
      ></Column>
      <Column
        field="name"
        header="Nome"
        :sortable="true"
        style="min-width: 15rem"
      ></Column>
      <Column
        field="email"
        header="Email"
        :sortable="true"
        style="min-width: 15rem"
      ></Column>
      <Column field="phone" header="Telefone" style="min-width: 10rem"></Column>

      <Column header="Ações" style="width: 8rem" class="text-center">
        <template #body="{ data }">
          <Button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-text p-button-sm"
            v-tooltip.top="'Editar'"
            @click="() => openModal(data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-text p-button-danger p-button-sm ml-2"
            v-tooltip.top="'Excluir'"
            @click="confirmDelete(data)"
          />
        </template>
      </Column>

      <template #empty> Nenhum contato encontrado. </template>
    </DataTable>

    <Message v-else severity="info" :closable="false" class="mt-4">
      A lista de contatos está vazia. Adicione um novo contato!
    </Message>
  </div>
</template>
