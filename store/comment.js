import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCommentStore = defineStore('comment', () => {
    const comments = ref([]);

    const addComment = (postId, newComment) => {
        comments.value.unshift({
            postId: Number(postId),
            content: newComment,
            createdAt: new Date().toISOString()
        });
    };

    return {
        comments,
        addComment,
    };
});