import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from '~/store/user';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';


export const useCommentStore = defineStore('comment', () => {
    const comments = ref([]);

    const addComment = (postId, newComment) => {
        comments.value.unshift({
            id: uuidv4(), // UUID を生成
            postId: String(postId),
            content: newComment,
            createdAt: new Date().toISOString()
        });
    };





    const createComment = async (postId, newComment) => {
        if (!postId) {
            throw new Error('投稿IDがありません');
        }

        try {
            const userStore = useUserStore(); // userStoreを参照
            const user = userStore.user; // userStoreからユーザー情報を取得
            if (!user) {
                console.error("ユーザーがログインしていません");
                return;
            }

            const token = await user.getIdToken();
            const userId = user.uid;

            console.log('送信するデータ:', {
                user_id: userId,
                post_id: postId,
                message: newComment.message,
            });

            const response = await axios.post(
                'http://localhost/api/comments', {
                    user_id: userId,
                    post_id: postId,
                    message: newComment.message,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log({ userId, postId, message: newComment.message });
            console.log('コメントが作成されました:', response.data);

            comments.value.push(response.data);

            return response.data;
        } catch (error) {
            console.error('コメントの作成に失敗しました:', error);
            throw error;
        }
    };





    const deleteComment = async (commentId) => {
        try {
            const userStore = useUserStore(); // userStoreを参照
            const user = userStore.user; // userStoreからユーザー情報を取得
            if (!user) {
                console.error("ユーザーがログインしていません");
                return;
            }

            const token = await user.getIdToken();

            // リクエスト内容をログに出力
            console.log('送信するリクエスト:');
            console.log({
                url: `http://localhost/api/comments/${commentId}`,
                headers: { Authorization: `Bearer ${token}` },
            });

            await axios.delete(`http://localhost/api/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            comments.value = comments.value.filter(comment => comment.id !== commentId);
        } catch (error) {
            console.error('コメントの削除に失敗しました:', error);
            throw error;
        }
    };





    // コメントを初期化するメソッド（データベースから取得）
    const initializeComments = async (postId) => {
        try {
            const response = await axios.get(`http://localhost/api/comments/post/${postId}`);
            console.log('取得したコメント:', response.data);
            comments.value = response.data; // APIから取得したコメントデータを格納
        } catch (error) {
            console.error('コメントの取得に失敗しました:', error);
        }
    };





    return {
        comments,
        addComment,
        createComment,
        deleteComment,
        initializeComments,
    };
});

