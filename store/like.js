import { ref } from "vue"
import { defineStore } from 'pinia';
import { useUserStore } from '~/store/user';
import axios from 'axios';




export const useLikeStore = defineStore('likes', () => {
    const posts = ref([]);
    const likes = ref([]);





    const initializeLikes = async () => {
        try {
            const userStore =useUserStore();
            const user = userStore.user;

            if (!user) {
                console.log("認証されていないユーザー: いいねデータは取得されません");
                likes.value = [];
                return;
            }

            const token = await user.getIdToken();

            const { data } = await axios.get('http://localhost/api/likes', {
                headers: { Authorization: `Bearer ${token}` },
            });
            likes.value = data;
        } catch (error) {
            console.error('いいね一覧の取得に失敗しました:', error);
        }
    };





    const addLike = async (postId) => {
        try {
            const userStore = useUserStore();
            const user = userStore.user;

            const token = await user.getIdToken();
            const response = await axios.post('http://localhost/api/likes', {
                post_id: postId,
                user_id: user.uid
            },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const post = posts.value.find((p) => p.id === postId);

            // 投稿がない場合何もしない
            if (!post) return;

            // いいねをしてる場合
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
            const userStore = useUserStore();
            const user = userStore.user;
            const token = await user.getIdToken();

            const response = await axios.delete(`http://localhost/api/likes/${postId}`,
                {
                    data: {
                        post_id: postId,
                        user_id: user.uid,
                    },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const post = posts.value.find((p) => p.id === postId);

            // 投稿がない場合何もしない
            if (!post) return;

            // いいねをしていない場合
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