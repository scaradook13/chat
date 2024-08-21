import { ref } from "vue";
const isAuthenticated = ref(false);

export function useAuth() {
  const checkAuth = async () => {
    if (!!localStorage.getItem("jwt")) {
      isAuthenticated.value = true;
    } else {
      isAuthenticated.value = false;
    }
  };

  return {
    checkAuth,
    isAuthenticated,
  };
}

