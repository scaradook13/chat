import apiClient from "@/config/axiosClient";
import { reactive, toRefs} from "vue";

const userStore = reactive({
  username: [],
  id:[]
})

 
export function useUser() {

  const fetchUser = async () => {
    try {
      const response = await apiClient("/user");
      userStore.username = response.data.content.username;
      userStore.id = response.data.content._id;
      
    } catch (err) {
      console.log(err);
    }
  };



  return {
    ...toRefs(userStore),
    fetchUser
  };
}