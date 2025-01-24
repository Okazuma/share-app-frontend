import { ref } from "vue"
import { defineStore } from 'pinia';
import { useUserStore } from '~/store/user';
import axios from 'axios';




export const useLikeStore = defineStore('likes', () => {
    const posts = ref([]);
    const likes = ref([]);





    const initializeLikes = async () => {
        try {
            const userStore =useUserStore(); // userStoreを参照
            const user = userStore.user; // 現在のユーザーを取得

            if (!user) {
                console.log("認証されていないユーザー: いいねデータは取得されません");
                likes.value = []; // ログインしていない場合、空の配列を設定
                return;
            }

            const token = await user.getIdToken();

            // サーバーからいいねデータを取得
            const { data } = await axios.get('http://localhost/api/likes', {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('サーバーからのいいねデータ:', data);

            likes.value = data;
            console.log('初期化されたいいね一覧:', likes.value);
        } catch (error) {
            console.error('いいね一覧の取得に失敗しました:', error);
        }
    };





    const addLike = async (postId) => {
        try {
            const userStore = useUserStore(); // userStoreを参照
            const user = userStore.user; // userStoreからユーザー情報を取得

            const token = await user.getIdToken(); // Firebaseトークンを取得

            const response = await axios.post('http://localhost/api/likes', {
                post_id: postId,
                user_id: user.uid
            },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const post = posts.value.find((p) => p.id === postId);

            // 投稿がない場合何もしない
            if (!post) return;

            // すでにいいねされている場合は何もしない
            if (post.isLiked) {
                return;
            }

            // 投稿があればカウントを１増やしてisLikedをtrueに変える
            if (post) {
                post.likes += 1;
                post.isLiked = true;
            }
            console.log('いいね追加成功:', response.data);
        } catch (error) {
            console.error('いいねの追加中にエラーが発生しました:', error);
        }
    };





    const removeLike = async (postId) => {
        try {
            const userStore = useUserStore(); // userStoreを参照
            const user = userStore.user; // userStoreからユーザー情報を取得
            const token = await user.getIdToken(); // Firebaseトークンを取得

            const response = await axios.delete(`http://localhost/api/likes/${postId}`,
                {
                    data: {
                        post_id: postId,
                        user_id: user.uid // Firebase UID
                    },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const post = posts.value.find((p) => p.id === postId);

            // 投稿がない場合何もしない
            if (!post) return;

            // まだいいねがされていない場合は何もしない
            if (!post.isLiked) {
                return;
            }

            if (post) {
                post.likes -= 1;
                post.isLiked = false;
            }
            console.log('いいね削除成功:', response.data);
        } catch (error) {
            console.error('いいねの削除中にエラーが起こりました:', error);
        }
    };





    return {
        likes,
        initializeLikes,
        addLike,
        removeLike,
    };
});