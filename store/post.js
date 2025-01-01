import { defineStore } from 'pinia';
import { ref } from "vue"

export const usePostStore = defineStore('posts', () => {
    const posts = ref([]);

    const addPost = (newPost) => {
        posts.value.unshift(newPost);
    };

    const deletePost = (postId) => {
        posts.value = posts.value.filter(post => post.id !== postId)
    }
    
    return {
        posts,    // 状態
        addPost,  // アクション
        deletePost,
    };
});