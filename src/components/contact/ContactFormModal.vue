<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue";

// PrimeVue components
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel"; // 🛑 NOVO IMPORT AQUI!
import { useContact } from "../../composables/contact/useContact";
import { IContact } from "../../interfaces/IContact";

const STRICT_EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
const PHONE_REGEX = /^\+?\d{10,15}$/;

const { saveContact, isModalVisible, closeModal, editingContact } =
  useContact(); // Importe editingContact
// Estado do formulário local (inicializado para criação)
// 🛑 AQUI ESTÁ A CORREÇÃO PRINCIPAL

interface FormContact extends Omit<IContact, "id"> {
  id: string | null; // Torna o ID opcional/nullable
}
const contactForm = reactive<FormContact>({
  id: null, // Inicializado como null para indicar "Criação"
  name: "",
  email: "",
  phone: "",
});

const isEditing = computed(
  () => !!editingContact.value && !!editingContact.value.id
);
const modalTitle = computed(() =>
  isEditing.value ? "Editar Contato" : "Adicionar Novo Contato"
);

// 🛑 WATCHER: Sincroniza o formulário quando editingContact muda
watch(
  editingContact,
  (newContact) => {
    if (newContact) {
      // Modo Edição: Copia os dados
      contactForm.id = newContact.id;
      contactForm.name = newContact.name;
      contactForm.email = newContact.email;
      contactForm.phone = newContact.phone;
    } else {
      // Modo Criação: Limpa o formulário
      contactForm.id = "";
      contactForm.name = "";
      contactForm.email = "";
      contactForm.phone = "";
    }
  },
  { immediate: true }
); // Executa imediatamente ao montar para inicializar

const isSaving = ref(false);

// **********************************************
// ********* LÓGICA DE VALIDAÇÃO ESPELHADA ********
// **********************************************

const validateName = computed(() => {
  if (!contactForm.name) return "O nome é obrigatório.";
  if (contactForm.name.length < 3)
    return "O nome deve ter pelo menos 3 caracteres.";
  return null;
});

const validateEmail = computed(() => {
  if (!contactForm.email) return "O email é obrigatório.";
  if (!STRICT_EMAIL_REGEX.test(contactForm.email)) {
    return "O email deve ser um endereço válido (ex: usuario@dominio.com).";
  }
  return null;
});

const validatePhone = computed(() => {
  if (!contactForm.phone) return "O telefone é obrigatório.";
  if (!PHONE_REGEX.test(contactForm.phone)) {
    return "O telefone deve conter apenas dígitos, opcionalmente com '+' no início, e ter entre 10 e 15 dígitos.";
  }
  return null;
});

// CORRIGIDO: Agora verifica o telefone também!
const isFormValid = computed(() => {
  return !validateName.value && !validateEmail.value && !validatePhone.value;
});

const handleSubmit = async () => {
  if (!isFormValid.value) return;

  isSaving.value = true;

  const success = await saveContact(contactForm);

  isSaving.value = false;

  if (success) {
    contactForm.name = "";
    contactForm.email = "";
    contactForm.phone = "";
  }
};
</script>

<template>
  <Dialog
    :header="isEditing ? 'Editar Contato' : 'Adicionar Novo Contato'"
    v-model:visible="isModalVisible"
    :modal="true"
    :style="{ width: '30vw' }"
    @update:visible="closeModal"
  >
    <form @submit.prevent="handleSubmit" class="p-fluid grid formgrid">
      <div class="field col-12">
        <FloatLabel>
          <InputText
            id="name"
            name="name"
            type="text"
            v-model="contactForm.name"
            :class="{ 'p-invalid': validateName }"
            required
            autofocus
            :disabled="isSaving"
          />
          <label for="name">Nome Completo</label>
        </FloatLabel>
        <small v-if="validateName" class="p-error">{{ validateName }}</small>
      </div>

      <div class="field col-12">
        <FloatLabel>
          <InputText
            id="email"
            name="email"
            type="email"
            v-model="contactForm.email"
            :class="{ 'p-invalid': validateEmail }"
            required
            :disabled="isSaving"
          />
          <label for="email">E-mail</label>
        </FloatLabel>
        <small v-if="validateEmail" class="p-error">{{ validateEmail }}</small>
      </div>

      <div class="field col-12">
        <FloatLabel>
          <InputText
            id="phone"
            name="phone"
            type="text"
            v-model="contactForm.phone"
            :class="{ 'p-invalid': validatePhone }"
            required
            :disabled="isSaving"
          />
          <label for="phone">Telefone</label>
        </FloatLabel>
        <small v-if="validatePhone" class="p-error">{{ validatePhone }}</small>
      </div>
    </form>

    <template #footer>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        class="p-button-text"
        @click="closeModal"
        :disabled="isSaving"
      />
      <Button
        :label="isEditing ? 'Salvar Edições' : 'Adicionar'"
        icon="pi pi-check"
        :disabled="!isFormValid || isSaving"
        :loading="isSaving"
        @click="handleSubmit"
      />
    </template>
  </Dialog>
</template>

<style scoped>
/* Garante que a mensagem de erro p-error apareça corretamente */
.p-error {
  display: block;
  margin-top: 0.25rem;
  color: var(--red-500);
}

/* Reduz o espaçamento vertical entre os campos de formulário */
.p-fluid .field {
  margin-bottom: 2rem;
}
</style>
