import apiClient from "@/config/axiosClient";
import { reactive, toRefs} from "vue";
import { useConversation } from "./conversation";
const { setConversation } = useConversation();
const messageStore = reactive({
  messages: []
})

 
export function useMessage() {

  const fetchMessage = async () => {
    try {
      const response = await apiClient("/getMessage/"+setConversation.value);
      messageStore.messages = response.data;
      
    } catch (err) {
      console.log(err);
    }
  };

  const newMessage = async (conversationId,sender,text) => {
    try {
      const response = await apiClient.post('/newMessage', { 
        conversationId,
        sender,
        text
       });
       console.log(response);
       
      await fetchMessage();   
    }catch (err) {
      console.log(err);
    }
  };



  return {
    ...toRefs(messageStore),
    fetchMessage,
    newMessage
  };
}