<template>
    <div v-if="props.id !== id" class="flex items-center p-3 hover:bg-gray-100 pl-10 cursor-pointer max-sm:flex-col max-sm:p-2 max-sm:max-w-15
    max-sm:mx-1 max-sm:text-center" @click="newConvo()">
        <div class="relative">
            <img class="w-10 h-10 rounded-full max-sm:max-w-10 max-sm:max-h-10" src="/public/favicon.ico"
                alt="profile image">
            <span v-if="props.id === UsersActive.activeUsers"
                class="top-0 start-7 absolute w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
        </div>
        <div class="font-medium pl-3 break-words text-lg max-sm:text-sm max-sm:max-w-15 max-sm:max-h-13 max-sm:p-0 max-sm:w-14"><p>{{ props.name }}</p></div>
    </div>
</template>

<script setup>
const props = defineProps(['id', 'name'])
import { useUser } from '@/store/userStore';
import { useConversation } from '@/store/conversation';
import { io } from 'socket.io-client';
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
const socket = ref();
const UsersActive = reactive({
    activeUsers: []
})
const { id } = useUser();
const { newConversation, getConversation } = useConversation();
const convo = getConversation.value

const newConvo = async () => {
    try {
        await newConversation(convo._id, id.value, props.id);
    } catch (err) {
        console.log(err);
    }

}

onMounted(() => {
    socket.value = (io('ws://localhost:8900'))
    socket.value.on("getUsers", (users) => {
        try {
            const activeUser = users.find(user =>
                user.userId._value === props.id
            );
            if (activeUser) {
                UsersActive.activeUsers = activeUser.userId._value
            }
            if (!activeUser) {
                UsersActive.activeUsers = null
            }

        }
        catch (err) {
        }
    })
})
onUnmounted(() => {

})
</script>