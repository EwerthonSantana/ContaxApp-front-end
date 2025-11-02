import apiClient from ".";
import { IAuthResponse, ILoginCredentials } from "../interfaces/IAuth";

/**
 * Envia as credenciais para o endpoint de login.
 * @param credentials - email e password do usuário.
 * @returns Uma Promise que resolve para o objeto AuthResponse (contendo o token).
 * @throws AxiosError se a requisição falhar (ex: 401 - Unauthorized).
 */
export async function loginApi(
  credentials: ILoginCredentials
): Promise<IAuthResponse> {
  const LOGIN_ENDPOINT = "/auth/login";

  const response = await apiClient.post<IAuthResponse>(
    LOGIN_ENDPOINT,
    credentials
  );

  return response.data;
}
