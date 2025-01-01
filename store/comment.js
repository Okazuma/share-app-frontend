import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid';

export const useCommentStore = defineStore('comment', () => {
    const comments = ref([]);

    const addComment = (postId, newComment) => {
        comments.value.unshift({
            id: uuidv4(), // UUID を生成
            postId: Number(postId),
            content: newComment,
            createdAt: new Date().toISOString()
        });
    };

    const deleteComment = (commentId) => {
        comments.value = comments.value.filter(comment => comment.id !== commentId);
    };

    return {
        comments,
        addComment,
        deleteComment,
    };

});

