<script setup lang="ts">
import { reactive, ref } from "vue";

// PrimeVue components
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Card from "primevue/card";
import Message from "primevue/message";
import { ILoginCredentials } from "../../interfaces/IAuth";
import { useAuth } from "../../composables/auth/useAuth";

const { login, isLoading } = useAuth();

const form = reactive<ILoginCredentials>({
  username: "",
  password: "",
});

const loginError = ref<string | null>(null);

const handleLogin = async () => {
  loginError.value = null;

  if (!form.username || !form.password) {
    loginError.value = "Por favor, preencha todos os campos.";
    return;
  }

  const success = await login(form);

  if (!success) {
    loginError.value = "Credenciais inválidas. Verifique seu e-mail e senha.";
  }
};
</script>

<template>
  <div
    class="flex justify-content-center align-items-center min-h-screen surface-ground"
  >
    <Card style="width: 25rem" class="shadow-2">
      <template #title>
        <div class="text-center">
          <i
            class="pi pi-lock text-3xl mr-2"
            style="color: var(--primary-color)"
          ></i>
          Login do Sistema
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleLogin" class="p-fluid">
          <Message
            v-if="loginError"
            severity="error"
            :closable="false"
            class="mb-4"
            >{{ loginError }}</Message
          >

          <div class="field mt-4">
            <span class="p-float-label">
              <InputText
                id="username"
                type="email"
                v-model="form.username"
                required
                autofocus
                :disabled="isLoading"
              />
              <label for="email">E-mail</label>
            </span>
          </div>

          <div class="field mt-5">
            <span class="p-float-label">
              <InputText
                id="password"
                type="password"
                v-model="form.password"
                required
                :disabled="isLoading"
                @keyup.enter="handleLogin"
              />
              <label for="password">Senha</label>
            </span>
          </div>

          <Button
            type="submit"
            label="Entrar"
            icon="pi pi-sign-in"
            class="mt-5"
            :loading="isLoading"
            :disabled="isLoading"
          />
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped>
/* Estilos básicos para garantir o layout full screen, aproveitando classes PrimeFlex */
.min-h-screen {
  min-height: 100vh;
}
.surface-ground {
  background-color: var(--surface-ground);
}
.p-fluid .field {
  /* Ajusta espaçamento vertical para inputs flutuantes */
  margin-bottom: 2rem;
}
</style>
