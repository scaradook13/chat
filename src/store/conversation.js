import apiClient from "@/config/axiosClient";
import { reactive, toRefs } from "vue";
import { useUser } from '@/store/userStore';
const { id } = useUser();

const conversationStore = reactive({
    getFreindId: null,
    getConversation: null,
    setConversation:'66bf19d220850d15d7e1b7a7'
})

export function useConversation() {

    const fetchConversation = async () => {
        
        try {
            const response = await apiClient("/getConversation/"+id.value);
            conversationStore.getConversation = response.data;
            const freindId = response.data[0].members.find((m) => m !== id.value)
            conversationStore.getFreindId = freindId;
            
        } catch (err) {
            console.log(err);
        }
    };



    return {
        ...toRefs(conversationStore),
        fetchConversation
    };
}