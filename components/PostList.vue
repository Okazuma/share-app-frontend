<template>
    <section class="post-list bg-indigo-950">


        <form @submit.prevent="submit" class="bg-indigo-950 mx-auto p-4 h-auto md:h-screen">
            <h1 class="text-center text-white border-2 border-gray-300">ホーム</h1>
            <div class="border-2 border-gray-300 p-2" v-for="post in postStore.posts" :key="post.id">
                <button>
                    <img src="/images/heart.png" class="w-6 h-6 inline-block ml-2" alt="詳細" />
                </button>
                <button @click="deletePost(post.id)">
                    <img src="/images/cross.png" class="w-6 h-6 inline-block ml-2" alt="詳細" />
                </button>
                <NuxtLink :to="`/posts/${post.id}`">
                    <img src="/images/detail.png" class="w-6 h-6 inline-block ml-8" alt="詳細" />
                </NuxtLink>
            <span class="block text-white"><p>{{ post.content }}</p></span>
            <small>{{ post.createdAt }}</small>
            </div>
        </form>

    </section>
</template>

<script setup>
import { usePostStore } from './store/post';

const postStore = usePostStore();

const deletePost = (postId) => {
    if(confirm('この投稿を削除しますか？')){
    console.log('削除した投稿のID:', postId);
    postStore.deletePost(postId);
    }
};

</script>

<style scoped>

</style>