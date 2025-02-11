import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from '~/store/user';
// import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';


export const useCommentStore = defineStore('comment', () => {
    const comments = ref([]);





    // const addComment = (postId, newComment) => {
    //     comments.value.unshift({
    //         id: uuidv4(),
    //         postId: String(postId),
    //         content: newComment,
    //         createdAt: new Date().toISOString()
    //     });
    // };





    const createComment = async (postId, newComment) => {
        if (!postId) {
            throw new Error('投稿IDがありません');
        }

        try {
            const userStore = useUserStore();
            const user = userStore.user;
            if (!user) {
                console.error("ユーザーがログインしていません");
                return;
            }

            const token = await user.getIdToken();
            const userId = user.uid;

            console.log('送信するデータ:', {
                user_id: userId,
                post_id: postId,
                message: newComment,
            });

            const response = await axios.post(
                'http://localhost/api/comments', {
                    user_id: userId,
                    post_id: postId,
                    message: newComment,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log({ userId, postId, message: newComment.message });
            console.log('コメントが作成されました:', response.data);

            comments.value.unshift(response.data);

            return response.data;
        } catch (error) {
            console.error('コメントの作成に失敗しました:', error);
            throw error;
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
            comments.value = response.data;
        } catch (error) {
            console.error("コメントの取得に失敗しました:", error);
        }
    };



    return {
        comments,
        // addComment,
        createComment,
        deleteComment,
        initializeComments,
        fetchComments
    };
});

