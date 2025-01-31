import { ref } from "vue"
import { defineStore } from 'pinia';
import { useUserStore } from '~/store/user';
import { useLikeStore } from '~/store/like';
import axios from 'axios';




export const usePostStore = defineStore('posts', () => {
    const posts = ref([]);
    const post = ref(null);

    const initializePost = async () => {
        try {
            const userStore = useUserStore();
            const likeStore = useLikeStore();
            const { data } = await axios.get('http://localhost/api/posts', {
                headers: userStore.isAuthenticated && userStore.user ? {
                    Authorization: `Bearer ${await userStore.user.getIdToken()}`
                } : {},
            });

            // 投稿データにいいね情報を付加
            posts.value = data.map((post) => {
                if (userStore.isAuthenticated && userStore.user) {
                    const isLiked = likeStore.likes.some((like) => like.post_id === post.id);
                    return {
                        ...post,
                        likes: post.likes_count,
                        isLiked,
                    };
                } else {
                    return {
                        ...post,
                        likes: post.likes_count,
                        isLiked: false,
                    };
                }
            });
        } catch (error) {
            console.error('投稿データの取得に失敗しました:', error);
        }
    };





    const fetchPost = async (postId) => {
        try {
            const userStore = useUserStore();
            const likeStore = useLikeStore();

            const { data } = await axios.get(`http://localhost/api/posts/${postId}`, {
                headers: userStore.isAuthenticated && userStore.user
                    ? { Authorization: `Bearer ${await userStore.user.getIdToken()}` }
                    : {},
            });

            const isLiked = userStore.isAuthenticated && userStore.user
                ? likeStore.likes.some((like) => like.post_id === data.id)
                : false;

            post.value = {
                ...data,
                likes: data.likes_count,
                isLiked,
                comments: data.comments || []
            };

        } catch (error) {
            console.error('投稿データの取得に失敗しました', error);
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
            const userStore = useUserStore();
            const user = userStore.user;
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
            posts.value.unshift({
                ...savedPost,
                isLiked: false,
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
            const userStore = useUserStore();
            const user = userStore.user;
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
            posts.value = originalPosts;
        }
    };



    return {
        posts,
        post,
        initializePost,
        fetchPost,
        // addPost,
        createPost,
        deletePost,
    };
});