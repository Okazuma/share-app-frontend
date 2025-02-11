<template>
    <div class="user-menu items-center p-4 bg-indigo-950 text-white w-full md:w-80 h-auto md:h-screen ">
        <NuxtLink to="/"><img src="/images/logo.png" class="h-6"></NuxtLink>

        <div class="my-4">
            <p v-if="user !== null"> {{ user?.displayName }} さん こんにちは！</p>
            <p v-else>You are not logged in.</p>
        </div>

        <NuxtLink to="/" class="flex items-center space-x-4">
            <img src="/images/home.png" class="w-5 h-5">
            <span>ホーム</span>
        </NuxtLink>
        <NuxtLink to="/login-page" class="flex items-center space-x-4"><i class="fas fa-right-to-bracket w-5 h-5 text-white"></i>
        <span>ログイン</span></NuxtLink>
        <button @click="logout" class="flex items-center space-x-4">
            <i class="fas fa-right-from-bracket w-5 h-5 text-white"></i>
            <span>ログアウト</span>
        </button>

        <span class="block text-center md:text-left">- - シェア - -</span>
        <form @submit.prevent="submitPost">
            <textarea v-model="postContent" class="block mx-auto rounded w-72 h-32 text-white bg-gray-900 border-2 border-gray-300 my-2 p-2 outline-none"></textarea>
            <button type="submit" class="block border-2 border-gray-700 rounded-2xl w-30 bg-purple-800 px-4 py-2 text-sm mx-auto md:mx-0">シェアする</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { usePostStore } from './store/post';
import { useUserStore } from "/store/user";
import { navigateTo } from '#app';
import { useNuxtApp } from "#app";
import { computed } from 'vue';




const postStore = usePostStore();
const postContent = ref('');
const userStore = useUserStore();
const { $auth } = useNuxtApp();
const user = computed(() => userStore.user);





const submitPost = async () => {
    try {
        await userStore.initializeUser();

        if (!userStore.user) {
            alert('ログインが必要です');
            navigateTo('/login-page');
            return;
        }

        if (postContent.value.trim()) {
            if (confirm('この内容で投稿しますか？')) {
                const newPost = {
                    id: Number(Date.now()),
                    content: postContent.value,
                    createdAt: new Date().toISOString(),
            };

                await postStore.createPost(newPost);
                postContent.value = '';
                alert('投稿が完了しました');
            }
        } else {
            alert('投稿内容を入力してください');
        }
    } catch (error) {
        console.error('投稿エラー:', error);
        alert('投稿中にエラーが発生しました');
    }
};






// ログアウト処理
const logout = async () => {
    try {
    await userStore.logout($auth);
        alert("ログアウトしました");
        navigateTo("/login-page");
    } catch (error) {
        console.error("Logout Error:", error);
        alert("ログアウトに失敗しました");
    }
};
</script>

<style scoped>


</style>