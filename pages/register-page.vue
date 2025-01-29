<template>
    <section class="w-screen h-screen bg-indigo-950">
        <TheHeader />
        <form @submit.prevent="register" class="bg-white mx-auto mt-12 p-4 w-80">
        <h1 class="text-center">新規登録</h1>
        <input v-model="name" type="text" name="name" placeholder="ユーザーネーム" class="block my-4 mx-auto border-2 border-gray-300 p-1 rounded">
        <input v-model="email" type="email" name="email" placeholder="メールアドレス" class="block my-4 mx-auto border-2 border-gray-300 p-1 rounded">
        <input v-model="password" type="password" name="password" placeholder="パスワード" class="block my-4 mx-auto border-2 border-gray-300 p-1 rounded">
        <button type="submit" class="block bg-indigo-950 text-white py-2 rounded-lg w-28 mx-auto">登録</button>
        </form>
    </section>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "/store/user";
import { navigateTo } from '#app';


const name = ref("");
const email = ref("");
const password = ref("");
const userStore = useUserStore();


const register = async () => {
    if (!email.value || !password.value || !name.value) {
        alert("すべての項目を入力してください");
        return;
    }

    try {
        await userStore.register( email.value, password.value);
        alert("登録成功！");
        navigateTo("/login-page");
    } catch (error) {
        console.error("登録エラー:", error);
        alert("登録失敗: " + (error.message || "不明なエラー"));
    }
};

</script>

<style scoped>


</style>