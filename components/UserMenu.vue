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
import { useUserStore } from "/store/user";
import { navigateTo } from '#app';
import { useNuxtApp } from "#app";
import { computed } from 'vue';




const postStore = usePostStore();
const postContent = ref('');
const userStore = useUserStore();
const { $auth } = useNuxtApp();
const user = computed(() => userStore.user); // リアクティブに監視

// 投稿の送信をpostStoreに送信するメソッド
// const submitPost = async() => {
//     if(!userStore.user){
//         alert('ログインが必要です');
//         router.push('/login-page');
//         return;
//     }
//     // ユーザー情報が正しく設定されているか確認
//     await userStore.initializeUser();  // 初期化処理を待機


//     if (postContent.value.trim()) {
//         if(confirm('この内容で投稿しますか？')){
//         const newPost = {
//             id: Number(Date.now()),
//             content: postContent.value,
//             createdAt: new Date().toISOString(),
//             };
//         postStore.createPost(newPost);
//         postContent.value = '';
//         }
//     } else {
//         alert('投稿内容を入力してください');
//     }
// };

const submitPost = async () => {
    try {
        // ユーザーの初期化を確実に待機
        await userStore.initializeUser();

        // ユーザーが存在しているか確認
        if (!userStore.user) {
            alert('ログインが必要です');
            navigateTo('/login-page');
            return;
        }

        // 投稿内容の確認
        if (postContent.value.trim()) {
            if (confirm('この内容で投稿しますか？')) {
                const newPost = {
                    id: Number(Date.now()),
                    content: postContent.value,
                    createdAt: new Date().toISOString(),
                };

                // 投稿作成
                await postStore.createPost(newPost);
                postContent.value = ''; // 投稿後にテキストをクリア
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
    await userStore.logout($auth); // $authを渡してログアウト
        alert("ログアウトしました");
        navigateTo("/login-page"); // ログインページへリダイレクト
    } catch (error) {
        console.error("Logout Error:", error);
        alert("ログアウトに失敗しました");
    }
};


</script>

<style scoped>

</style>