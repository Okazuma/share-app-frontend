<template>
    <section class="w-screen h-screen bg-indigo-950">
        <TheHeader />
        <form @submit.prevent="submit" class="bg-white mx-auto mt-12 p-4 w-80">
            <h1 class="text-center">ログイン</h1>
            <input type="text" name="email" placeholder="メールアドレス" class="block my-4 mx-auto border-2 border-gray-300 p-1 rounded">

            <input type="text" name="password" placeholder="パスワード" class="block my-4 mx-auto border-2 border-gray-300 p-1 rounded">
            <button type="submit" class="block bg-indigo-950 text-white py-2 rounded-lg w-28 mx-auto">ログイン</button>
        </form>
    </section>
</template>

<script setup>

</script>

<style>

</style>


