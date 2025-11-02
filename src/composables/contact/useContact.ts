import { ref, type Ref } from "vue";
import {
  createContact,
  fetchContacts,
  updateContact,
  deleteContactApi,
} from "../../api/contact";
import { IContact } from "../../interfaces/IContact";

const contacts: Ref<IContact[]> = ref([]);
const isLoading: Ref<boolean> = ref(false);
const error: Ref<string | null> = ref(null);
const isModalVisible: Ref<boolean> = ref(false);
const editingContact: Ref<IContact | null> = ref(null);

export function useContact() {
  const loadContacts = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await fetchContacts();
      contacts.value = data;
    } catch (e) {
      console.error("Erro ao carregar contatos:", e);
      error.value =
        "Falha ao carregar a lista de contatos. Verifique a API e o console.";
      contacts.value = []; // Limpa dados em caso de falha
    } finally {
      isLoading.value = false;
    }
  };

  const saveContact = async (
    contactData: IContact | Omit<IContact, "id">
  ): Promise<boolean> => {
    try {
      let resultContact: IContact;

      if ("id" in contactData && contactData.id) {
        // Se tiver ID, é EDIÇÃO (PUT)
        resultContact = await updateContact(contactData as IContact);
      } else {
        // Se não tiver ID, é CRIAÇÃO (POST)
        resultContact = await createContact(
          contactData as Omit<IContact, "id">
        );
      }

      isModalVisible.value = false;
      await loadContacts();

      return true;
    } catch (e) {
      // ... (tratamento de erro)
      return false;
    }
  };

  const deleteContact = async (id: string): Promise<boolean> => {
    try {
      isLoading.value = true;

      await deleteContactApi(id);

      contacts.value = contacts.value.filter((c) => c.id !== id);

      isLoading.value = false;
      await loadContacts();

      return true;
    } catch (e) {
      // ... (Tratamento de erro, como toast)
      console.error("Erro ao deletar contato:", e);
      isLoading.value = false;
      return false;
    }
  };

  const openModal = (contact: IContact | null = null) => {
    editingContact.value = contact;
    isModalVisible.value = true;
  };

  const closeModal = () => {
    isModalVisible.value = false;
  };

  const reloadContacts = () => loadContacts();

  return {
    contacts,
    isLoading,
    error,
    isModalVisible,
    editingContact,
    openModal,
    saveContact,
    closeModal,
    loadContacts,
    reloadContacts,
    deleteContact,
  };
}
