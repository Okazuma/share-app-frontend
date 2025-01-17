<template>
    <section class="post-list bg-indigo-950 text-white">
        <div class="bg-indigo-950 mx-auto p-4 h-auto md:auto">
            <h1 class="text-center text-white border-2 border-gray-300">コメント</h1>
            <div class="border-2 border-gray-300 p-2">

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
        <div class="mx-auto px-4 py-2" v-for="comment in comments" :key="comment.id">
                <button @click="deleteComment(comment.id)">
                    <img src="/images/cross.png" class="w-6 h-6 inline-block ml-2" alt="詳細" />
                </button>
            <p class="p-2 text-white border-2 border-gray-300">{{ comment.message }}</p>
            <small class="block text-gray-400">投稿日時: {{ comment.createdAt }}</small>
        </div>
    </section>
</template>



<script setup>
import { ref} from 'vue';
import { useUserStore } from '~/store/user';
import { useCommentStore} from './store/comment';
import { useRouter } from 'vue-router'; // リダイレクト用にrouterをインポート

// 親コンポーネントからpostIdを受け取る
const props = defineProps({
    comments: {
    type: Array,
    required: true
    },
    postId: {
        type: Number,
        required: true
    },
    post: {
        type: Object,
        required: false, // 投稿が見つからない場合も想定
        default: null
    }
});

// const postStore = usePostStore(); // 投稿ストアを取得
const commentStore = useCommentStore(); // コメントストアを取得
const newComment = ref(''); // 新しいコメントの入力内容を保持
const userStore = useUserStore();
const router = useRouter(); // routerを使用してリダイレクト


// 新しいコメントを投稿する処理
const submitComment = async() => {
    if(!userStore.user){
        alert('ログインが必要です');
        router.push('/login-page');
        return;
    }
    if (newComment.value.trim()) {
        if (confirm('この内容でコメントしますか？')) {
            try {
                await commentStore.createComment(props.postId, { message: newComment.value });
                newComment.value = ''; // 入力フィールドをクリア
            } catch (error) {
                alert('コメントの作成に失敗しました: ' + error.message);
            }
        }
    } else {
        alert('コメントを入力してください');
    }
};

// コメントを削除する処理
const deleteComment = (commentId) => {
    if(confirm('削除しますか？')){
    commentStore.deleteComment(commentId);
        // console.log(`コメントが削除されました: ${commentId}`);
    }
};

</script>


<style scoped>

</style>