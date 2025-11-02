// src/components/ContactFormModal.test.ts
import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import ContactFormModal from "./ContactFormModal.vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";

// 🛑 Mock do Composable useContact
const mockUseContact = {
  saveContact: vi.fn().mockResolvedValue(true),
  isModalVisible: ref(true), // Garante que o modal está aberto para ser testado
  closeModal: vi.fn(),
  editingContact: ref(null), // Começa em modo de criação
};
vi.mock("@/composables/contact/useContact", () => ({
  useContact: () => mockUseContact,
}));

// Mock do PrimeVue Toast/Confirm para evitar erros
vi.mock("primevue/useconfirm");
vi.mock("primevue/usetoast");

describe("ContactFormModal.vue", () => {
  // Função utilitária para montar o componente
  const mountComponent = () =>
    mount(ContactFormModal, {
      global: {
        components: {
          Dialog,
          InputText,
          // ... (outros componentes PrimeVue usados no modal: FloatLabel, Button, etc.)
        },
        // Mock dos componentes PrimeVue que o Vitest não resolve sozinho
        stubs: {
          //   Dialog: true,
          Button: false, // Não stubbar botões se queremos testar cliques
          InputText: false,
          FloatLabel: false,
        },
      },
    });

  it("should disable Save button when form is invalid (name missing)", async () => {
    const wrapper = mountComponent();
    await wrapper.vm.$nextTick();
    await wrapper.get("#email").find("input").setValue("teste@email.com");
    await wrapper.get("#phone").find("input").setValue("1234567890");

    // O Save button deve estar desabilitado devido à validação
    // (Não é necessário simular o input se estamos apenas checando o estado)

    // O botão deve estar desabilitado
    const saveButton = wrapper
      .findAllComponents(Button)
      .find((b) => b.text() === "Salvar");
    expect(saveButton?.attributes("disabled")).toBeDefined();
    wrapper.unmount();
  });

  it("should call saveContact and clear form on successful submission", async () => {
    const wrapper = mountComponent();

    // Simular input de dados válidos
    wrapper.find("#name").setValue("Novo Contato");
    wrapper.find("#email").setValue("valid@email.com");
    wrapper.find("#phone").setValue("+551199998888");

    // Disparar o envio do formulário
    await wrapper.find("form").trigger("submit.prevent");

    // Espera-se que o saveContact do composable seja chamado
    expect(mockUseContact.saveContact).toHaveBeenCalledTimes(1);

    // Verifica se o formulário foi limpo após o sucesso
    const nameInput = wrapper.find("#name").element as HTMLInputElement;
    expect(nameInput.value).toBe("");
  });

  it('should display "Editar Contato" title in edit mode', async () => {
    // Simular o modo de edição no mock
    mockUseContact.editingContact.value = {
      id: 1,
      name: "Edicao Teste",
      email: "edit@test.com",
      phone: "123",
    };

    const wrapper = mountComponent();

    // Verifica o título do Dialog (que foi stubbado como div)
    const header = wrapper.findComponent({ name: "Dialog" }).props().header;
    expect(header).toBe("Editar Contato");

    // Verifica se os inputs foram preenchidos (watcher)
    const nameInput = wrapper.find("#name").element as HTMLInputElement;
    expect(nameInput.value).toBe("Edicao Teste");
  });
});
