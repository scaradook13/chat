<template>
    <div class="flex flex-col pt-5" :class="{ 'items-end': props.sender == id}">
        <div class="flex">
            <img :class="{ 'hidden': props.sender == id}" class="w-8 h-8 rounded-full object-cover mr-3" src="/public/favicon.ico" alt="">
            <p class="p-3 rounded-3xl max-w-80 break-words"
                :class="{ 'bg-gray-200 text-black': props.sender == id ,'text-white bg-blue-500': props.sender !== id   }">
                {{ props.text }}</p>
        </div>
        <div class="text-sm pt-2">{{ format(props.time) }}</div>
    </div>
</template>

<script setup>
import { format } from 'timeago.js';    
import { useUser } from '@/store/userStore';
const {id} = useUser();
const props = defineProps(['text','time','sender'])
</script>