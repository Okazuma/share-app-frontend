import { defineStore } from 'pinia';
import { ref } from "vue"

export const usePostStore = defineStore('posts', () => {
    const posts = ref([]);

    const addPost = (newPost) => {
        posts.value.unshift(newPost);
    };
    return {
        posts,    // 状態
        addPost,  // アクション
    };
});