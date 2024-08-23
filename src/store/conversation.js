import apiClient from "@/config/axiosClient";
import { reactive, ref, toRefs } from "vue";
import { useUser } from '@/store/userStore';
const { id } = useUser();

const conversationStore = reactive({
    getFreindId: [],
    getConversation: [],
    setConversation: null,
    currentConversation:[],
})

export function useConversation() {

    const fetchConversation = async () => {

        try {
            const response = await apiClient("/getConversation/" + id.value);
            conversationStore.getConversation = response.data

        } catch (err) {
            console.log(err);
        }
    };

    const newConversation = async (senderId, receiverId) => {
        try {
            await fetchConversation();
            conversationStore.getFreindId = receiverId;
            const foundConversation = conversationStore.getConversation.find(conversation =>
                conversation.members.some(m => m === receiverId)
            );
            if(foundConversation){
                conversationStore.currentConversation = foundConversation.members
               return conversationStore.setConversation = foundConversation._id
            }
            const newConversation = await apiClient.post('/newConversation', {senderId,receiverId});
            conversationStore.currentConversation = newConversation.data.members
            return conversationStore.setConversation = newConversation.data._id
            
        } catch (err) {
            console.log(err);
        }
    }


    return {
        ...toRefs(conversationStore),
        fetchConversation,
        newConversation
    };
}