<template>
    <div class="flex flex-col md:flex-row">
        <UserMenu class="w-80 bg-indigo-950 p-4"/>
        <PostList class="flex-grow bg-indigo-950 p-4"/>
    </div>
</template>

<script setup>
import { usePostStore } from '~/store/post';
import { useUserStore } from '~/store/user';
import { onMounted } from 'vue';

const userStore = useUserStore();
const postStore = usePostStore();

onMounted(() => {
  userStore.initializeUser();
  postStore.initializePost();
});
</script>

<style scoped>
</style>
