<template>
    <div class="user-menu items-center p-4 bg-indigo-950 text-white w-full md:w-80 h-auto md:h-screen ">
        <NuxtLink to="/"><img src="/images/logo.png" class="h-6"></NuxtLink>

        <div class="my-4">
            <p v-if="user !== null">Hello, {{ user?.displayName }} "{{ user?.email }}"</p>
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
import { useRouter } from "vue-router";
import { useUserStore } from "/store/user";
import { useNuxtApp } from "#app";


const postStore = usePostStore();
const postContent = ref('');
const userStore = useUserStore();
const router = useRouter();
const { $auth } = useNuxtApp(); // Firebase Authインスタンスを取得
const user = userStore.user;


// 投稿の送信をpostStoreに送信するメソッド
const submitPost = () => {
    if(!userStore.user){
        alert('ログインが必要です');
        router.push('/login-page');
        return;
    }
    if (postContent.value.trim()) {
        if(confirm('この内容で投稿しますか？')){
        const newPost = {
            id: Number(Date.now()),
            content: postContent.value,
            createdAt: new Date().toISOString(),
            };
        postStore.createPost(newPost);
        postContent.value = '';
        }
    } else {
        alert('投稿内容を入力してください');
    }
};

// ログアウト処理
const logout = async () => {
    try {
    await userStore.logout($auth); // $authを渡してログアウト
        alert("ログアウトしました");
        router.push("/login-page"); // ログインページへリダイレクト
    } catch (error) {
        console.error("Logout Error:", error);
        alert("ログアウトに失敗しました");
    }
};


</script>

<style scoped>

</style>