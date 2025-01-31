<template>
    <div class="flex flex-col md:flex-row">
        <UserMenu class="w-80 bg-indigo-950 p-4"/>
        <PostComment :comments="post?.comments || []"
                    :post="post"
                    :post-id="Number(postId)"
                    class="flex-grow bg-indigo-950 p-4"
                    v-if="!loading"/>
    </div>
</template>

<script setup>
import { ref,computed} from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '~/store/user';
import { usePostStore } from '~/store/post';
import { useLikeStore } from '~/store/like';
import { useCommentStore } from '~/store/comment';
import { onBeforeMount } from 'vue';


const post = ref(null);
const route = useRoute();
const postId = computed(() => route.params['post_id']);
const userStore = useUserStore();
const postStore = usePostStore();
const likeStore = useLikeStore();
const commentStore = useCommentStore();
const loading = ref(true);





onBeforeMount(async () => {
  try {
    await userStore.initializeUser();

    if (userStore.isAuthenticated && userStore.user) {
      await likeStore.initializeLikes();
    }

    const postId = Number(route.params.post_id);
    await postStore.fetchPost(postId);
    post.value = postStore.post;
    await commentStore.initializeComments();
  } catch (error) {
    console.error('投稿データの初期化に失敗しました:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>


</style>