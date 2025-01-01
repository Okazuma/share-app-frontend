<template>
    <div class="user-menu items-center p-4 bg-indigo-950 text-white w-full md:w-80 h-auto md:h-screen ">
        <NuxtLink to="/"><img src="/images/logo.png" class="h-6"></NuxtLink>
        <NuxtLink to="/" class="flex items-center space-x-4">
            <img src="/images/home.png" class="w-5 h-5">
            <span>ホーム</span>
        </NuxtLink>
        <button class="flex items-center space-x-4">
            <img src="/images/logout.png" class="w-5 h-5">
            <span>ログアウト</span>
        </button>
        <span class="block">シェア</span>
        <form @submit.prevent="submitPost">
            <textarea v-model="postContent" class="block mx-auto rounded w-72 h-32 text-white bg-indigo-950 border-2 border-gray-300 p-2"></textarea>
            <button type="submit" class="border-2 border-gray-700 rounded-2xl w-30 bg-purple-800 px-4 py-2 text-sm">シェアする</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { usePostStore } from './store/post';

const postStore = usePostStore();
const postContent = ref('');

const submitPost = () => {
    if (postContent.value.trim()) {
        const newPost = {
            id: Date.now(),
            content: postContent.value,
            createdAt: new Date().toISOString(),
            };
        postStore.addPost(newPost); // 投稿を追加
        postContent.value = ''; // 入力をクリア
    } else {
        alert('投稿内容を入力してください');
    }
};

</script>

<style scoped>

</style>