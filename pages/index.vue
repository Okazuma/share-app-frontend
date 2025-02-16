<template>
    <div class="flex flex-col md:flex-row">
        <UserMenu class="w-80 bg-indigo-950 p-4"/>
        <PostList class="flex-grow bg-indigo-950 p-4"/>
        <EditModal/>
    </div>
</template>

<script setup>
import { usePostStore } from '~/store/post';
import { useUserStore } from '~/store/user';
import { useLikeStore } from '~/store/like';
import { useCommentStore } from '~/store/comment';



const userStore = useUserStore();
const postStore = usePostStore();
const likeStore = useLikeStore();
const commentStore = useCommentStore();



onBeforeMount(async () => {
  try {
    console.time("⭕️ 全体のデータ取得");

    console.time("⏳ ユーザー情報取得");
    await userStore.initializeUser();
    console.timeEnd("⭕️ ユーザー情報取得");
    console.log("現在のユーザー情報:", userStore.user);

    console.time("⭕️ コメントデータ取得");
    const commentInit = commentStore.initializeComments();
    await commentInit;
    console.timeEnd("⭕️ コメントデータ取得");

    let likeInit = Promise.resolve();
    if (userStore.isAuthenticated && userStore.user) {
      console.time("⭕️ いいねデータ取得");
      likeInit = likeStore.initializeLikes();
      await likeInit;
      console.timeEnd("⭕️ いいねデータ取得");
    }

    console.time("⭕️ 投稿データ取得");
    const postInit = postStore.initializePost();
    await postInit;
    console.timeEnd("⭕️ 投稿データ取得");

    console.timeEnd("⭕️ 全体のデータ取得");

    console.log("現在のいいねデータ:", likeStore.likes);
    console.log("現在の投稿データ:", postStore.posts);
  } catch (error) {
    console.error("初期化中にエラーが発生しました:", error);
  }
});
</script>

<style scoped>


</style>
