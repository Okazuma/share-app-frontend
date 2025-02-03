import { ref } from "vue"
import { defineStore } from 'pinia';
import { useUserStore } from '~/store/user';
import { usePostStore } from '~/store/post';
import axios from 'axios';


export const useLikeStore = defineStore('likes', () => {
    const likes = ref([]);
    const isProcessing = ref({});





    const initializeLikes = async () => {
        try {
            isProcessing.value = {};
            console.log(isProcessing.value);

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

            console.log(data);
            likes.value = data;
            console.log("isProcessing (初期化後):", isProcessing.value);


            // 取得したいいね情報に基づき、isProcessingを適切に設定
            data.forEach((like) => {
                if (like.post_id === undefined) {
                    console.error("post_id が存在しません", like);
                }

                isProcessing.value[like.post_id] = false;
            });


        } catch (error) {
            console.error('いいね一覧の取得に失敗しました:', error);
        }
    };





    // いいね追加
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

            // フロントエンドの状態を更新
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





    // いいね削除
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

            // フロントエンドの状態を更新
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