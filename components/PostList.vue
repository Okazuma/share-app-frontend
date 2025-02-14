<template>
    <section class="post-list bg-indigo-950">
        <form @submit.prevent="submit" class="mx-auto p-4 h-auto md:h-screen">
            <h1 class="text-center text-white border-2 border-gray-300">ホーム</h1>
            <div class="border-b-2 border-gray-300 p-2 my-2 " v-for="post in postStore.posts" :key="post.id">

                <div class="buttons mb-2 flex items-center gap-4">
                    <!----- いいね ----->
                    <button @click="toggleLike(post.id)" :style="{color: post.isLiked ? 'red' : 'white'}" class="w-6 h-6  align-middle">
                        <svg id="svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500" height="500" viewBox="0, 0, 500,500" class="w-full h-full object-contain" alt="ハートアイコン">
                        <g id="svgg">
                            <path id="path0" d="M112.500 34.735 C 45.768 46.482,4.999 109.643,19.192 179.291 C 31.718 240.755,101.233 329.478,231.250 449.942 C 249.239 466.609,251.745 466.122,278.916 440.678 C 401.446 325.939,468.656 238.923,480.808 179.291 C 507.568 47.980,348.160 -21.398,267.083 86.274 C 261.965 93.072,252.152 108.825,251.233 111.720 C 250.524 113.955,249.615 113.737,248.406 111.042 C 224.824 58.470,165.831 25.348,112.500 34.735" stroke="none" fill="currentColor" fill-rule="evenodd"></path>
                        </g>
                        </svg>
                    </button>
                    <span class="text-white ">{{ post.likes }}</span>
                    <!----- コメント ----->
                    <NuxtLink :to="`/posts/${post.id}`" class="w-6 h-6  inline-block align-middle">
                        <img src="/images/detail.png" class="w-full h-full object-contain" alt="詳細" />
                    </NuxtLink>
                    <span class="text-white">
                        {{ commentStore.comments.filter(comment => comment.post_id === post.id).length }}
                    </span>
                    <!----- 編集 ----->
                        <button v-if="post.user_id === currentUserId" @click="postStore.openModal(post.id,post.content)" class="w-6 h-6 ml-6 flex items-center justify-center">
                            <i class="fa-solid fa-pen-to-square text-white text-xl"></i>
                        </button>
                    <!----- 削除 ----->
                        <button v-if="post.user_id === currentUserId" @click="deletePost(post.id)" class="w-6 h-6 ml-2 flex items-center justify-center">
                            <img src="/images/cross.png" class="w-full h-full object-contain" alt="詳細" />
                        </button>

                </div>
            <span class="block text-white mb-2" >[{{ post.userName }}]</span>
            <span class="block text-white"><p>{{ post.content }}</p></span>
            <small class="text-white">{{ formatDate(post.created_at) }}</small>
            </div>
        </form>

    </section>
</template>

<script setup>
import { computed } from 'vue';
import { usePostStore } from './store/post';
import { useUserStore } from './store/user';
import { useLikeStore } from '~/store/like';
import { useCommentStore } from '~/store/comment';

import { navigateTo } from '#app';
import { formatDate } from '~/utils/date';


const postStore = usePostStore();
const userStore = useUserStore();
const likeStore = useLikeStore();
const commentStore = useCommentStore();

const currentUserId = computed(() => userStore.user?.uid);





const deletePost = async (postId) => {
    await userStore.initializeUser();

    if (!userStore.user) {
        alert('ログインが必要です');
        navigateTo('/login-page');
        return;
    }

    if(confirm('この投稿を削除しますか？')){
    console.log('削除した投稿のID:', postId);
    postStore.deletePost(postId);
    }
};





const toggleLike = async (postId) => {
    const user = userStore.user;
    if (!user) {
        alert('ログインが必要です');
        navigateTo('/login-page');
        return;
    }

    try {
        const post = postStore.posts.find(p => p.id === postId);
        if (!post) return;

        if (post.isLiked) {
            await likeStore.removeLike(postId);
        } else {
            await likeStore.addLike(postId);
        }
    } catch (error) {
        console.error('いいねの処理中にエラーが発生:', error);
    }
};
</script>

<style scoped>


</style>