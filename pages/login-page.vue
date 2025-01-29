<template>
    <section class="w-screen h-screen bg-indigo-950">
        <TheHeader />
        <form @submit.prevent="login" class="bg-white mx-auto mt-12 p-4 w-80">
            <h1 class="text-center">ログイン</h1>
            <input v-model="email" type="email" name="email" placeholder="メールアドレス" class="block my-4 mx-auto border-2 border-gray-300 p-1 rounded">

            <input v-model="password" type="password" name="password" placeholder="パスワード" class="block my-4 mx-auto border-2 border-gray-300 p-1 rounded">
            <button type="submit" class="block bg-indigo-950 text-white py-2 rounded-lg w-28 mx-auto">ログイン</button>
        </form>
    </section>
</template>



<script setup>
import { ref } from "vue";
import { useUserStore } from "/store/user";
import { navigateTo } from '#app';



const email = ref("");
const password = ref("");
const userStore = useUserStore();

const login = async () => {
    if (!email.value || !password.value) {
        alert("メールアドレスとパスワードを入力してください");
        return;
    }

    try {
        await userStore.login(email.value, password.value);
        alert("ログイン成功！");
        navigateTo("/");
    } catch (error) {
        console.error("ログインエラー:", error);
        alert("ログイン失敗: " + (error.message || "不明なエラー"));
    }
};
</script>

<style scoped>


</style>