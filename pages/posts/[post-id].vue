<template>
    <div class="flex flex-col md:flex-row">
        <UserMenu class="w-80 bg-indigo-950 p-4"/>
        <PostComment :comments="filteredComments"
                    :post="post"
                    :post-id="Number(postId)"
                    class="flex-grow bg-indigo-950 p-4"/>
    </div>
</template>

<script setup>
import { ref,computed} from 'vue';
import { useRoute } from 'vue-router';
import { usePostStore } from '~/store/post';
import { useCommentStore } from '~/store/comment';
import { onBeforeMount } from 'vue';


const post = ref(null);
const route = useRoute();
const postId = computed(() => route.params['postid']);
const commentStore = useCommentStore();
const postStore = usePostStore();





const filteredComments = computed(() => {
    const comments = commentStore.comments.filter((comment) => comment.post_id === Number(postId.value));
    console.log('フィルタリング後のコメント:', comments);
    return comments;
});





// onBeforeMountでデータを初期化
onBeforeMount(async () => {
    try {
        // ストア経由でデータを初期化
        await commentStore.initializeComments(postId.value);
        await postStore.initializePost(postId.value);  // 特定の投稿を初期化

        // ストアから該当の投稿を取得してローカルに代入
        post.value = postStore.posts.find((p) => p.id === Number(postId.value));
        if (!post.value) {
            console.error('該当する投稿が見つかりません');
        }
    } catch (error) {
        console.error('投稿データの初期化に失敗しました:', error);
    }
});
</script>

<style scoped>


</style>