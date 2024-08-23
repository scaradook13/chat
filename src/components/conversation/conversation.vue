<template>
    <div v-if="props.id === currentConversation[1]"  class="flex items-center p-3 hover:bg-gray-100 pl-10 cursor-pointer" >
        <img class="w-9 h-9 object-fill mr-2 rounded-full" src="/public/favicon.ico" alt="">
        <span class="font-medium text-xl">{{ props.name }}</span>
    </div>
</template>

<script setup>
const props = defineProps(['name','id'])
import { useConversation } from '@/store/conversation';
const { currentConversation } = useConversation();
</script> 