<template>
    <div class="flex flex-col md:flex-row">
        <UserMenu class="w-80 bg-indigo-950 p-4"/>
        <PostComment class="flex-grow bg-indigo-950 p-4" v-if="!loading"/>
    </div>
</template>

<script setup>
import { ref,computed,onBeforeMount} from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '~/store/user';
import { usePostStore } from '~/store/post';
import { useCommentStore } from '~/store/comment';


const post = ref(null);
const route = useRoute();
const postId = computed(() => Number(route.params['post_id']));
const userStore = useUserStore();
const postStore = usePostStore();
const commentStore = useCommentStore();
const loading = ref(true);



onBeforeMount(async () => {
  console.time("⭕️ 全体のデータ取得");
  try {
    console.time("⭕️ ユーザー情報取得");
    await userStore.initializeUser();
    console.timeEnd("🔥 ユーザー情報取得");

    console.time("⭕️ 投稿情報取得");
    post.value = await postStore.fetchPost(postId.value);
    console.timeEnd("⭕️ 投稿情報取得");

    console.time("⭕️ コメント情報取得");
    await commentStore.fetchComments(postId.value);
    console.timeEnd("⭕️ コメント情報取得");
    console.timeEnd("⭕️ 全体のデータ取得");
  } catch (error) {
    console.error('投稿データの初期化に失敗しました:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>


</style>