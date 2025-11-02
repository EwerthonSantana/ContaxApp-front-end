import { ref, type Ref } from "vue";
import { useRouter } from "vue-router";
import { ILoginCredentials } from "../../interfaces/IAuth";
import { loginApi } from "../../api/auth";

export const isAuthenticated: Ref<boolean> = ref(
  !!localStorage.getItem("token")
);
const isLoading: Ref<boolean> = ref(false);

export function useAuth() {
  const router = useRouter();

  const login = async (credentials: ILoginCredentials): Promise<boolean> => {
    isLoading.value = true;
    try {
      const response = await loginApi(credentials);

      if (response && response.token) {
        localStorage.setItem("token", response.token);
        isAuthenticated.value = true;

        await router.push({ name: "contacts" });

        return true;
      }
      return false;
    } catch (error) {
      // ... tratamento de erro
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    isAuthenticated.value = false;
    router.push({ name: "login" });
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
