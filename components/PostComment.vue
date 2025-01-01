<template>
    <section class="post-list bg-indigo-950 text-white">
        <div class="bg-indigo-950 mx-auto p-4 h-auto md:auto">
            <h1 class="text-center text-white border-2 border-gray-300">コメント</h1>
            <div class="border-2 border-gray-300 p-2">
                <button>
                    <img src="/images/heart.png" class="w-6 h-6 inline-block ml-2" alt="詳細" />
                </button>
                <button>
                    <img src="/images/cross.png" class="w-6 h-6 inline-block ml-2" alt="詳細" />
                </button>

                <!------- 投稿内容 ------->
                <div v-if="post" class="p-4 bg-indigo-950 text-white">
                    <span class="text-sm font-bold">-----投稿内容-----</span>
                    <p class="mt-2">{{ post.content }}</p>
                    <small class="block mt-2 text-gray-400">投稿日時: {{ post.createdAt }}</small>
                </div>
                <div v-else>
                    <p class="text-red-500">投稿が見つかりません。</p>
                </div>
            </div>
        </div>

        <!------- コメント入力フォーム ------->
        <form @submit.prevent="submitComment" class="p-4 relative mb-8">
            <input v-model="newComment" type="text" name="message" class="block border-2 border-gray-300 p-2 rounded text-white bg-indigo-950 w-full">
            <button type="submit" class="absolute top-16 right-4 border-2 border-gray-700 rounded-2xl w-30 bg-purple-800 px-4 py-2 text-sm">コメント</button>
        </form>

        <!------- コメント一覧 ------->
        <div class="mx-auto p-4" v-for="comment in filteredComments" :key="comment.createdAt">
            <p class="p-2 text-white border-2 border-gray-300">{{ comment.content }}</p>
            <small class="block text-gray-400">投稿日時: {{ comment.createdAt }}</small>
        </div>

    </section>
</template>



<script setup>
import { ref, computed} from 'vue';
import { usePostStore } from './store/post';
import { useCommentStore} from './store/comment';

// 親コンポーネントからpostIdを受け取る
const props = defineProps({
    postId: {
        type: [String, Number],
        required: true,
    },
});

const postStore = usePostStore(); // 投稿ストアを取得
const commentStore = useCommentStore(); // コメントストアを取得
const newComment = ref(''); // 新しいコメントの入力内容を保持

const post = computed(() => {
    console.log('props.postId:', props.postId);
    console.log('postStore.posts:', postStore.posts); 
  return postStore.posts.find((p) => p.id === Number(props.postId)); // props.postId を数値に変換
});


// 新しいコメントを投稿する処理
const submitComment = () => {
    if (newComment.value.trim()) {
    commentStore.addComment(props.postId, newComment.value); // コメントをストアに追加
    console.log('コメントが追加されました:', commentStore.comments);
    newComment.value = ''; // 入力フィールドをクリア
    } else {
    alert('コメントを入力してください');
    }
};

// 特定の投稿に対するコメントをフィルタリング
const filteredComments = computed(() => {
    return commentStore.comments.filter((c) => c.postId === post.value?.id);
});
</script>



<style scoped>

</style>