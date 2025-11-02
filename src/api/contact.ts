import { IContact } from "../interfaces/IContact";
import apiClient from "./index";

const CONTACTS_ENDPOINT = "/contacts";

/**
 * Busca a lista completa de contatos na API.
 * Como o token é injetado pelo interceptor, não precisamos passá-lo aqui.
 * @returns Promise<Contact[]>
 */
export async function fetchContacts(): Promise<IContact[]> {
  const response = await apiClient.get<IContact[]>(CONTACTS_ENDPOINT);

  return response.data;
}

/**
 * Envia um novo contato para a API.
 * @param contactData Dados do novo contato (sem o ID, que será gerado pelo backend).
 * @returns O contato criado com o ID gerado pelo servidor.
 */
export async function createContact(
  contactData: Omit<IContact, "id">
): Promise<IContact> {
  const response = await apiClient.post<IContact>(
    CONTACTS_ENDPOINT,
    contactData
  );

  return response.data;
}

/**
 * Atualiza um contato existente na API.
 * @param contactData O objeto Contact completo (incluindo o ID).
 * @returns O contato atualizado.
 */
export async function updateContact(contactData: IContact): Promise<IContact> {
  // PUT/PATCH para a URL do recurso específico (ex: /contacts/123)
  const response = await apiClient.put<IContact>(
    `${CONTACTS_ENDPOINT}/${contactData.id}`,
    contactData
  );

  return response.data;
}

/**
 * Deleta um contato existente na API.
 * @param contactId O respectivo ID do contato que quer deletar.
 */
export async function deleteContactApi(contactId: string): Promise<void> {
  await apiClient.delete<void>(`${CONTACTS_ENDPOINT}/${contactId}`);
}
