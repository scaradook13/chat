<template>
    <div v-if="props.id === getFreindId"  class="flex items-center p-3 hover:bg-gray-100 pl-10 cursor-pointer max-sm:p-0 max-sm:pl-4 max-sm:py-2" >
        <img class="w-9 h-9 object-fill mr-2 rounded-full" src="/public/favicon.ico" alt="">
        <span class="font-medium text-xl">{{ props.name }}</span>
    </div>
</template>

<script setup>
const props = defineProps(['name','id'])
import { useConversation } from '@/store/conversation';
const { getFreindId } = useConversation();
</script> 