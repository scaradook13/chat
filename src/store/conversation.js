import apiClient from "@/config/axiosClient";
import { reactive, ref, toRefs } from "vue";
import { useUser } from "./userStore";
const { id } = useUser();

const conversationStore = reactive({
    getFreindId: [],
    getConversation: [],
    setConversation: null,
    currentConversation: [],
    ReceiverConversationId:null
})

export function useConversation() {

    const fetchConversation = async () => {

        try {
            const response = await apiClient("/getConversation");
            conversationStore.getConversation = response.data[0]
        } catch (err) {
            console.log(err);
        }
    };

    const newConversation = async (ConversationId, senderId, receiverId) => {
        try {
            await fetchConversation();
            conversationStore.getFreindId = receiverId;
            
            const foundConversation = conversationStore.getConversation.conversations.find(conversation =>
                conversation.members.some(m => m === receiverId)
            );
            
            if (foundConversation) {
                conversationStore.currentConversation = foundConversation.members
                conversationStore.setConversation = foundConversation._id
                await getFriendConversation();
                await fetchConversation();
                return

            }
            const newConversation = await apiClient.post('/newConversation', { ConversationId, senderId, receiverId });
            console.log(newConversation);
            conversationStore.currentConversation = newConversation.data.members
            conversationStore.setConversation = newConversation.data._id
            await fetchConversation();
            await getFriendConversation();
            return

        } catch (err) {
            console.log(err);
        }
    }

    const getFriendConversation = async () => {
        try {
            const response = await apiClient('/getFriendConversation/'+ conversationStore.getFreindId);

            const conversation = response.data[0].conversations.find(conversation =>
                conversation.members.some(m => m === id.value)
            );       
            conversationStore.ReceiverConversationId = conversation._id
            
        } catch (err) {
            console.log(err);
        }
    }

    const logOut = async () => {
        conversationStore.setConversation = null;
        conversationStore.currentConversation = null;
        conversationStore.getFreindId = null;
    }
 
    return {
        ...toRefs(conversationStore),
        fetchConversation,
        newConversation,
        getFriendConversation,
        logOut
    };
}