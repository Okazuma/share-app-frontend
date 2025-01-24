import { ref } from "vue"
import { defineStore } from 'pinia';
import { useUserStore } from '~/store/user';
import { useLikeStore } from '~/store/like';
import axios from 'axios';




export const usePostStore = defineStore('posts', () => {
    const posts = ref([]);





    // const initializePost = async () => {
    //     try {
    //         const userStore = useUserStore(); // userStoreを参照
    //         const likeStore = useLikeStore();

    //         // ユーザーが認証されているか確認
    //         if (userStore.isAuthenticated && userStore.user) {
    //             const user = userStore.user;
    //             const token = await user.getIdToken(); // トークンを取得

    //             // サーバーから投稿データを取得
    //             const { data } = await axios.get('http://localhost/api/posts', {
    //                 headers: token ? { Authorization: `Bearer ${token}` } : {},
    //             });

    //             console.log('サーバーからの投稿データ:', data);

    //             // 投稿データにいいね情報を付加
    //             posts.value = data.map((post) => {
    //                 const isLiked = likeStore.likes.some((like) => like.post_id === post.id);
    //                 return {
    //                     ...post,
    //                     likes: post.likes_count,
    //                     isLiked,
    //                 };
    //             });

    //             console.log('初期化された投稿一覧:', posts.value);
    //         } else {
    //             console.error('認証されていません。投稿データの取得を中止します。');
    //         }
    //     } catch (error) {
    //         console.error('投稿データの取得に失敗しました:', error);
    //     }
    // };


    const initializePost = async () => {
        try {
            const userStore = useUserStore(); // userStoreを参照
            const likeStore = useLikeStore(); // likeStoreを参照

            // サーバーから投稿データを取得
            const { data } = await axios.get('http://localhost/api/posts', {
                headers: userStore.isAuthenticated && userStore.user ? {
                    Authorization: `Bearer ${await userStore.user.getIdToken()}`
                } : {},
            });

            console.log('サーバーからの投稿データ:', data);

            // 投稿データにいいね情報を付加
            posts.value = data.map((post) => {
                if (userStore.isAuthenticated && userStore.user) {
                    // ユーザーが認証されている場合は、いいね情報を設定
                    const isLiked = likeStore.likes.some((like) => like.post_id === post.id);
                    return {
                        ...post,
                        likes: post.likes_count,
                        isLiked, // 認証されている場合のみisLikedを設定
                    };
                } else {
                    // 認証されていない場合はisLikedは設定せず、likes_countのみ
                    return {
                        ...post,
                        likes: post.likes_count,
                        isLiked: false, // 認証されていない場合、いいね情報を反映しない
                    };
                }
            });

            console.log('初期化された投稿一覧:', posts.value);
        } catch (error) {
            console.error('投稿データの取得に失敗しました:', error);
        }
    };






    // 投稿を追加
    // const addPost = (newPost) => {
    //     newPost.isLiked = false;
    //     newPost.likes = 0;
    //     posts.value.unshift(newPost);
    // };





    const createPost = async (newPost) => {
        try {
            const userStore = useUserStore(); // userStoreを参照
            const user = userStore.user; // userStoreからユーザー情報を取得
            if (!user) {
                console.error("ユーザーがログインしていません");
                return;
            }

            const token = await user.getIdToken();
            if (!token) {
                console.error("トークンが取得できません");
                return;
            }
            const response = await axios.post(
                "http://localhost/api/posts",
                {
                    content: newPost.content,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const savedPost = response.data;
            // 新規投稿に初期値を設定
            posts.value.unshift({
                ...savedPost,
                isLiked: false, // 初期状態ではユーザーはいいねしていない
            });
            console.log("投稿が作成されました:", savedPost);
            console.log("投稿内容:", newPost.content);
        } catch (error) {
            console.log("投稿の作成に失敗しました:", error);
        }
    };





    const deletePost = async (postId) => {
        // UIに即時反映: ローカルデータを先に更新
        const originalPosts = [...posts.value];
        posts.value = posts.value.filter(post => post.id !== postId);

        try {
            const userStore = useUserStore(); // userStoreを参照
            const user = userStore.user; // userStoreからユーザー情報を取得
            const token = await user ?.getIdToken();

            if (!token) {
                throw new Error('トークンが取得できません');
            }

            await axios.delete(`http://localhost/api/posts/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('投稿が削除されました:', postId);
        } catch (error) {
            console.error('投稿の削除に失敗しました:', error);
            // 削除が失敗した場合はローカルデータを元に戻す
            posts.value = originalPosts;
        }
    };





    return {
        createPost,
        initializePost,
        posts,
        // addPost,
        deletePost,
    };
});