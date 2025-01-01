<template>
    <div class="flex flex-col md:flex-row">
        <UserMenu class="w-80 bg-indigo-950 p-4"/>
        <PostComment :post-id="postId" class="flex-grow bg-indigo-950 p-4"/>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
console.log(route.params);
// const postId = route.params['post-id']; // URL から投稿IDを取得
const postId = computed(() => route.params['postid']);

</script>

<style>

</style>