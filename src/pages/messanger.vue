<template>
    <div class="h-screen flex">
        <div class="w-1/4 pt-3">
            <conversation v-for="item in allUser" :name="item.username" :id="item._id" :key="item._id"/>
        </div>
        <div class="w-1/2 pt-3">
            <div ref="scrollView" class="h-4/6 p-3 overflow-y-scroll scroll-smooth	">
              <div v-if="setConversation === null">
                <h1 class="text-4xl text-center pt-20">Start a conversation</h1>
              </div>
                  <message  v-for="item in messages" 
                  :text="item.text" 
                  :time="item.createdAt"
                  :sender="item.sender" 
                  :key="item._id"
                />
            </div>
            <div v-if="setConversation !== null" class="flex items-center justify-between">
                <textarea
                v-model="inputMessage.text"
                required class="w-10/12 h-20 p-3 border-gray border-2" name="" id="" placeholder="Send a message ..."></textarea>
                <button
                @click="addNewMessage" 
                class="mr-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                 >Send</button>
            </div>
        </div>
        <div class="w-1/4 pt-3">
          <allUsers v-for="item in allUser"
          :id="item._id"
          :name="item.username"
          :key="item._id"></allUsers>
        </div>
    </div>
</template>

<script setup>
import conversation from '@/components/conversation/conversation.vue';
import message from '@/components/message/message.vue';
import allUsers from '@/components/allUser/allUser.vue';
import { useConversation } from '@/store/conversation';
import { useMessage } from '@/store/message';
import { ref, reactive, onMounted, watch } from 'vue';
import { useUser } from '@/store/userStore';
import {io} from 'socket.io-client';
const { id,allUser,fetchAllUser } = useUser();
const { getConversation, setConversation,getFreindId } = useConversation();
const { messages,newMessage,fetchMessage } = useMessage()

onMounted(fetchAllUser)

const scrollView = ref()
const socket = ref();
const userId = ref(id.value);
const arrivalMessage = reactive({})

onMounted(() => {
  socket.value = (io('ws://localhost:8900'))
  socket.value.on('getMessage', (data) => {
    arrivalMessage.value = {
      sender: data.senderId,
      text: data.text,
      createdAt: Date.now()
    };
  });
});

onMounted(() => {
  socket.value.emit("addUser", userId);
    socket.value.on("getUsers", (users) => {
      console.log(users)
    })
})

const scrollToBottom = () => {
  const container = scrollView.value;
    container.scrollTop = container.scrollHeight;
};

onMounted(scrollToBottom);

const inputMessage = reactive({
    conversationId: setConversation,
    sender: id.value,
    text:"",
})

const addNewMessage = async () => {
  try {
    if (inputMessage.text === "") {
      return alert("Input is blank");
    }
    socket.value.emit("sendMessage", {
      senderId: userId.value,
      receiverId: getFreindId.value,
      text: inputMessage.text
    });
    
    await newMessage(inputMessage.conversationId,inputMessage.sender,inputMessage.text);
    inputMessage.text = "";
    scrollToBottom();
  } catch (err) {
    console.log(err);
  }
};

watch(arrivalMessage, async (newarrivalMessage) => {
  await fetchMessage();
  scrollToBottom();
})
watch(setConversation, async (newSetConnversation) => {
  await fetchMessage();
  scrollToBottom();
})
</script>
