import { ref } from "vue"
import { defineStore } from 'pinia';
import { useUserStore } from '~/store/user';
import { usePostStore } from '~/store/post';
import axios from 'axios';
import { getAuth } from 'firebase/auth';


export const useLikeStore = defineStore('likes', () => {
    const likes = ref([]);
    const isProcessing = ref({});



    const initializeLikes = async () => {
        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            isProcessing.value = {};

            if (!currentUser) {
                console.log("認証されていないユーザー: いいねデータは取得されません");
                return;
            }

            let token;
            try {
                token = await currentUser.getIdToken();
            } catch (error) {
                console.error("IDトークンの取得に失敗:", error);
                return;
            }

            const { data } = await axios.get("http://localhost/api/likes", {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("取得データ:", data);
            likes.value = data;

            data.forEach((like) => {
                if (!like.post_id) {
                    console.error("post_id が存在しません", like);
                }
                isProcessing.value[like.post_id] = false;
            });

            console.log("isProcessing (初期化後):", isProcessing.value);
        } catch (error) {
            console.error("いいね一覧の取得に失敗しました:", error);
        }
    };






    const addLike = async (postId) => {
        if (isProcessing.value[postId]) return;
        isProcessing.value[postId] = true;

        try {
            const userStore = useUserStore();
            const user = userStore.user;
            const postStore = usePostStore();
            const post = postStore.posts.find(p => p.id === postId);

            if (!post || likes.value.some(like => like.post_id === postId)) {
                return;
            }

            const token = await user.getIdToken();
            await axios.post('http://localhost/api/likes', {
                post_id: postId,
                user_id: user.uid
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            post.isLiked = true;
            post.likes += 1;
            likes.value.push({ post_id: postId, user_id: user.uid });

            console.log('いいね追加成功');
        } catch (error) {
            console.error('いいねの追加中にエラーが発生しました:', error);
        } finally {
            isProcessing.value[postId] = false;
        }
    };





    const removeLike = async (postId) => {
        if (isProcessing.value[postId]) return;
        isProcessing.value[postId] = true;

        try {
            const userStore = useUserStore();
            const user = userStore.user;
            const postStore = usePostStore();
            const post = postStore.posts.find(p => p.id === postId);

            if (!post || !likes.value.some(like => like.post_id === postId)) {
                return;
            }

            const token = await user.getIdToken();
            await axios.delete(`http://localhost/api/likes/${postId}`, {
                data: { post_id: postId, user_id: user.uid },
                headers: { Authorization: `Bearer ${token}` }
            });

            post.isLiked = false;
            post.likes -= 1;
            likes.value = likes.value.filter(like => like.post_id !== postId);

            console.log('いいね削除成功');
        } catch (error) {
            console.error('いいねの削除中にエラーが起こりました:', error);
        } finally {
            isProcessing.value[postId] = false;
        }
    };



    return {
        likes,
        initializeLikes,
        addLike,
        removeLike,
    };
});