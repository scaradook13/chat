<template>
    <div v-if="props.id !== id" class="flex items-center p-3 hover:bg-gray-100 pl-10 cursor-pointer"
    @click="newConvo()"
    >
        <img class="w-9 h-9 object-fill mr-2 rounded-full" src="/public/favicon.ico" alt="">
        <span class="font-medium text-lg">{{ props.name }}</span>
    </div>
</template>

<script setup>
const props = defineProps(['id','name'])
import { useUser } from '@/store/userStore';
import { useConversation } from '@/store/conversation';
const { id } = useUser();
const { newConversation, getConversation } = useConversation();
const convo = getConversation.value

const newConvo = async () => {
try {
    await newConversation(convo._id,id.value,props.id);
} catch (err) {
    console.log(err);
}

}
</script>