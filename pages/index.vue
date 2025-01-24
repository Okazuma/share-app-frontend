<template>
    <div class="flex flex-col md:flex-row">
        <UserMenu class="w-80 bg-indigo-950 p-4"/>
        <PostList class="flex-grow bg-indigo-950 p-4"/>
    </div>
</template>

<script setup>
import { usePostStore } from '~/store/post';
import { useUserStore } from '~/store/user';
import { useLikeStore } from '~/store/like';


const userStore = useUserStore();
const postStore = usePostStore();
const likeStore = useLikeStore();


onBeforeMount(async () => {
  try {
    // ユーザー情報の初期化
    await userStore.initializeUser();

    // 認証されたユーザーのみ、いいね情報を初期化
    if (userStore.isAuthenticated && userStore.user) {
      await likeStore.initializeLikes();
    }

    // 投稿データの初期化
    await postStore.initializePost();
  } catch (error) {
    console.error('初期化中にエラーが発生しました:', error);
  }
});
</script>

<style scoped>


</style>
