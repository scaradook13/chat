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
      const response = await apiClient("/getMessage/" + setConversation.value);
      messageStore.messages = response.data;
    } catch (err) {
      console.log(err);
    }
  };

  const newMessage = async (SenderConversationId,ReceiverConversationId,sender,receiverId,text) => {
    try {
      const response = await apiClient.post('/newMessage', {
        SenderConversationId,
        ReceiverConversationId, 
        sender,
        receiverId,
        text
       });
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