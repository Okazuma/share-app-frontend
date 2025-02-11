<template>
    <section class="post-list bg-indigo-950 text-white">
        <div class="bg-indigo-950 mx-auto p-4 h-auto md:auto">
            <h1 class="text-center text-white border-2 border-gray-300">コメント</h1>
            <div class="border-b-2 border-gray-30">

                <!------- 投稿内容 ------->
                <div v-if="post" class="p-4 bg-indigo-950 text-white">
                    <span class="text-sm font-bold">-----投稿内容-----</span>
                    <p class="mt-2">{{ post.content }}</p>
                    <small class="block mt-2 text-gray-400">投稿日時: {{ formatDate(post.created_at) }}</small>
                </div>
                <div v-else>
                    <p class="text-red-500">投稿が見つかりません。</p>
                </div>
            </div>
        </div>

        <!------- コメント入力フォーム ------->
        <form @submit.prevent="submitComment" class="p-4 relative mb-8">
            <input v-model="newComment" type="text" name="message" class="block border-2 border-gray-300 p-2 rounded text-white bg-gray-900 w-full outline-none">
            <button type="submit" class="absolute top-16 right-4 border-2 border-gray-700 rounded-2xl w-30 bg-purple-800 px-4 py-2 text-sm">コメント</button>
        </form>

        <!------- コメント一覧 ------->
        <div class="mx-auto px-4 py-4" v-for="comment in commentStore.comments" :key="comment.id">

            <p class="pl-4 text-white border-b-2 border-gray-300">{{ comment.message }}</p>
            <div class="flex items-center pl-4">
                <button v-if="comment.user_id === currentUserId" @click="deleteComment(comment.id)">
                    <img src="/images/cross.png" class="w-4 h-4 block ml-auto" alt="削除アイコン" />
                </button>
                <small class="ml-2 text-sm text-gray-400 my-auto">投稿日時: {{ formatDate(comment.created_at) }}</small>
            </div>
        </div>
    </section>
</template>



<script setup>
import { ref,computed } from 'vue';
import { useUserStore } from '~/store/user';
import { usePostStore } from '~/store/post';
import { useCommentStore} from './store/comment';
import { navigateTo } from '#app';
import { formatDate } from '~/utils/date';



const commentStore = useCommentStore();
const newComment = ref('');
const userStore = useUserStore();
const currentUserId = computed(() => userStore.user?.uid);
const postStore = usePostStore();
const post = computed(() => postStore.post);





// 新しいコメントを投稿する処理
const submitComment = async() => {
    if(!userStore.user){
        alert('ログインが必要です');
        navigateTo('/login-page');
        return;
    }
    if (newComment.value.trim()) {
        if (confirm('この内容でコメントしますか？')) {
            try {
                await commentStore.createComment( post.value.id,newComment.value );
                newComment.value = '';
            } catch (error) {
                alert('コメントの作成に失敗しました: ' + error.message);
            }
        }
    } else {
        alert('コメントを入力してください');
    }
};





// コメントを削除する処理
const deleteComment = async (commentId) => {
    await userStore.initializeUser();

    if (!userStore.user) {
        alert('ログインが必要です');
        navigateTo('/login-page');
        return;
    }

    if(confirm('削除しますか？')){
        commentStore.deleteComment(commentId);
    }
};
</script>


<style scoped>

</style>