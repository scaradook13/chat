<template>
  <div class="h-screen flex max-sm:flex-col max-sm:h-auto max-sm:relative">
    <div class="w-1/4 pt-3 max-sm:order-2 max-sm:w-full max-sm:pt-0 max-sm:bg-gray-100">
      <conversation v-for="item in allUser" :name="item.username" :id="item._id" :key="item._id" />
    </div>
    <div class="w-1/2 pt-3 max-sm:w-full max-sm:p-0 max-sm:order-3">
      <div ref="scrollView" class="h-4/6 p-3 overflow-y-scroll scroll-smooth max-sm:h-full max-sm:overflow-y-auto max-sm:fixed max-sm:w-full max-sm:pb-80">
        <div v-if="setConversation === null">
          <h1 class="text-4xl text-center pt-20 ">Start a conversation</h1>
        </div>
        <div v-if="setConversation !== null">
          <message v-for="item in messages" :text="item.text" :time="item.createdAt" :sender="item.sender"
            :key="item._id" />
        </div>
      </div>
      <div v-if="setConversation !== null" class="flex items-center justify-between max-sm:w-full max-sm:bg-gray-100 max-sm:px-2 max-sm:py-1 max-sm:fixed max-sm:bottom-0">
        <textarea v-model="inputMessage.text" required class="w-10/12 h-20 p-3 border-gray border-2 mr-2" name="" id=""
          placeholder="Send a message ..."></textarea>
        <button @click="addNewMessage"
          class="mr-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Send</button>
      </div>
    </div>
    <div class="w-1/4 pt-3 max-sm:flex max-sm:w-full max-sm:overflow-y-auto max-sm:pt-0 max-sm:bg-gray-200 max-sm:order-1">
      <allUsers v-for="item in allUser" :id="item._id" :name="item.username" :key="item._id"></allUsers>
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
import { io } from 'socket.io-client';
const { id, allUser } = useUser();
const {  setConversation, getFreindId,ReceiverConversationId } = useConversation();
const { messages, newMessage, fetchMessage } = useMessage()

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
  })
})

const scrollToBottom = () => {
  const container = scrollView.value;
  container.scrollTop = container.scrollHeight;
};

onMounted(scrollToBottom);

const inputMessage = reactive({
  ReceiverConversationId,
  SenderConversationId: setConversation,
  sender: id.value,
  receiverId: getFreindId,
  text: "",
})

const addNewMessage = async () => {
  try {
    if (inputMessage.text === "") {
      return alert("Input is blank");
    }

    await socket.value.emit("sendMessage", {
      senderId: userId.value,
      receiverId: getFreindId.value,
      text: inputMessage.text
    });  

    await newMessage(inputMessage.SenderConversationId,inputMessage.ReceiverConversationId,inputMessage.sender,
    inputMessage.receiverId, inputMessage.text);
    inputMessage.text = "";
    scrollToBottom();
  } catch (err) {
    console.log(err);
  }
};

watch(arrivalMessage, async (m) => {
  setTimeout(async() => {
    fetchMessage();
  }, 500);

  setTimeout(async() => {
    scrollToBottom();
  }, 800);
});
watch(setConversation, async () => {
  await fetchMessage();
  scrollToBottom();
})
</script>
