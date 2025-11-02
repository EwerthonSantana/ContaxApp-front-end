// src/composables/auth/useAuth.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { ref } from "vue";

// 🛑 Mock do Vue Router e da API
const mockRouter = {
  push: vi.fn(),
};
vi.mock("vue-router", () => ({
  useRouter: () => mockRouter,
}));
vi.mock("@/api/auth", () => ({
  loginApi: vi.fn(),
}));

const localStorageMock = (() => {
  const storage: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => storage[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      storage[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete storage[key];
    }),
    clear: vi.fn(() =>
      Object.keys(storage).forEach((key) => delete storage[key])
    ),
  };
})();

// Aplica os espiões no objeto global window.localStorage ANTES DOS TESTES
vi.stubGlobal("localStorage", localStorageMock);

// Importa o Composable a ser testado
import { useAuth, isAuthenticated } from "./useAuth";
import { loginApi } from "../../api/auth";

describe("useAuth", () => {
  // // Simula o localStorage antes de cada teste
  // const localStorageMock = (token: string | null) => {
  //   vi.spyOn(localStorage, "getItem").mockReturnValue(token);
  //   vi.spyOn(localStorage, "setItem").mockImplementation(() => {});
  //   vi.spyOn(localStorage, "removeItem").mockImplementation(() => {});
  // };

  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    vi.clearAllMocks();
  });

  it("should initialize isAuthenticated based on localStorage token", () => {
    // Testa o estado inicial sem token
    // localStorageMock(null);
    const { isAuthenticated } = useAuth();
    expect(isAuthenticated.value).toBe(false);

    // Testa o estado inicial com token
    // localStorageMock("test-token");
    const authWithToken = useAuth();
    expect(isAuthenticated.value).toBe(true);
  });

  it("should successfully call loginApi, save token, and redirect", async () => {
    // Configura o mock da API para retornar um token
    (loginApi as any).mockResolvedValue({ token: "new-valid-token" });

    // 🛑 IMPORTANTE: Resetar o estado inicial antes de chamar useAuth
    // Use a função de limpeza do seu mock, se disponível (ou o mock de setItem/removeItem)
    localStorageMock.clear();

    // Agora isAuthenticated será false no início do login
    const { login } = useAuth();

    const credentials = { username: "test", password: "123" };
    const success = await login(credentials);

    expect(success).toBe(true);

    // 🛑 CORREÇÃO AQUI: Verifique o spy que você configurou (localStorageMock.setItem)
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "token",
      "new-valid-token"
    );

    expect(mockRouter.push).toHaveBeenCalledWith({ name: "contacts" });
    expect(isAuthenticated.value).toBe(true);
  });

  it("should clear token and redirect to login on logout", () => {
    localStorageMock.setItem("token", "active-token");

    const { logout } = useAuth();

    logout();

    expect(localStorageMock.removeItem).toHaveBeenCalledWith("token");
    expect(mockRouter.push).toHaveBeenCalledWith({ name: "login" });

    expect(isAuthenticated.value).toBe(false);
  });
});
