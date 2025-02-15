import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from '~/store/user';
import axios from 'axios';


export const useCommentStore = defineStore('comment', () => {
    const comments = ref([]);
    const isProcessing = ref(false);



    const createComment = async (postId, newComment) => {
        if (!postId) {
            throw new Error('投稿IDがありません');
        }

        if (isProcessing.value) return;
        isProcessing.value = true;

        try {
            const userStore = useUserStore();
            const user = userStore.user;
            if (!user) {
                console.error("ユーザーがログインしていません");
                return;
            }

            const token = await user.getIdToken();
            const userId = user.uid;
            const userName = user.displayName || "Unknown";

            console.log('送信するデータ:', {
                user_id: userId,
                post_id: postId,
                message: newComment,
                user_name: userName,
            });

            const response = await axios.post(
                'http://localhost/api/comments', {
                    user_id: userId,
                    post_id: postId,
                    message: newComment,
                    user_name: userName,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log({ userId, postId, message: newComment.message });
            console.log('コメントが作成されました:', response.data);

            comments.value.unshift({
                ...response.data,
                user_name: userName,
            });
            return response.data;
        } catch (error) {
            console.error('コメントの作成に失敗しました:', error);
            throw error;
        } finally {
            isProcessing.value = false;
        }
    };





    const deleteComment = async (commentId) => {
        // UIに即時反映: ローカルデータを先に更新
        const originalComments = [...comments.value];
        comments.value = comments.value.filter(comment => comment.id !== commentId);

        try {
            const userStore = useUserStore();
            const user = userStore.user;
            if (!user) {
                console.error("ユーザーがログインしていません");
                return;
            }

            const token = await user.getIdToken();

            await axios.delete(`http://localhost/api/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            comments.value = comments.value.filter(comment => comment.id !== commentId);
        } catch (error) {
            console.error('コメントの削除に失敗しました:', error);
            comments.value = originalComments;
        }
    };





    const initializeComments = async () => {
        try {
            const response = await axios.get("http://localhost/api/comments");
            comments.value = response.data;
        } catch (error) {
            console.error('コメントの取得に失敗しました:', error);
        }
    };





    const fetchComments = async (postId) => {
        try {
            const response = await axios.get(`http://localhost/api/comments/post/${postId}`);
            comments.value = response.data.map(comment => ({
                ...comment,
                userName: comment.user_name,
            }));
        } catch (error) {
            console.error("コメントの取得に失敗しました:", error);
        }
    };



    return {
        comments,
        createComment,
        deleteComment,
        initializeComments,
        fetchComments
    };
});

