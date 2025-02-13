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
    // ユーザー情報の初期化
    console.time("🔥 ユーザー情報取得");
    await userStore.initializeUser();
    console.timeEnd("🔥 ユーザー情報取得");
    console.log("現在のユーザー情報:", userStore.user);

    // 認証されたユーザーのみ、いいねを初期化
    if (userStore.isAuthenticated && userStore.user) {
      console.time("🔥 いいねデータ取得");
      await likeStore.initializeLikes();
      console.timeEnd("🔥 いいねデータ取得");
    }

    // コメントデータの初期化
    console.time("🔥 コメントデータ取得");
    await commentStore.initializeComments();
    console.timeEnd("🔥 コメントデータ取得");
    console.log(commentStore.comments);

    // 投稿データの初期化
    console.time("🔥 投稿データ取得");
    await postStore.initializePost();
    console.timeEnd("🔥 投稿データ取得");
    console.log(postStore.posts);
  } catch (error) {
    console.error('初期化中にエラーが発生しました:', error);
  }
});
</script>

<style scoped>


</style>
