import { ref } from "vue"
import { defineStore } from 'pinia';
import { useUserStore } from '~/store/user';
import { useLikeStore } from '~/store/like';
import axios from 'axios';
import { getAuth } from 'firebase/auth';


export const usePostStore = defineStore('posts', () => {
    const posts = ref([]);
    const post = ref(null);
    const isOpen = ref(false);
    const editingPostId = ref(null);
    const editingContent = ref("");
    const isProcessing = ref(false);



    const initializePost = async () => {
        const likeStore = useLikeStore();
        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            const { data } = await axios.get('http://localhost/api/posts', {
                headers: currentUser ? { Authorization: `Bearer ${await currentUser.getIdToken()}` } : {},
            });

            posts.value = data.map((post) => {
                const isLiked = currentUser ? likeStore.likes.some((like) => like.post_id === post.id) : false;

                return {
                    ...post,
                    likes: post.likes_count,
                    isLiked,
                    userName: post.user_name,
                };
            });
        } catch (error) {
            console.error('投稿データの取得に失敗しました:', error);
        }
    };





    const fetchPost = async (postId) => {
        const userStore = useUserStore();
        const likeStore = useLikeStore();
        try {
            let token = "";
            if (userStore.isAuthenticated && userStore.user) {
                if (typeof userStore.user.getIdToken === "function") {
                    token = await userStore.user.getIdToken();
                } else {
                    console.warn("userStore.user に getIdToken() がありません", userStore.user);
                }
            }

            console.time("🔥 投稿データ取得");

            const { data } = await axios.get(`http://localhost/api/posts/${postId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            console.timeEnd("🔥 投稿データ取得");

            const isLiked = userStore.isAuthenticated && userStore.user
                ? likeStore.likes.some((like) => like.post_id === data.id)
                : false;

            post.value = {
                ...data,
                likes: data.likes_count,
                isLiked,
                userName: data.user_name,
                comments: data.comments || []
            };

        } catch (error) {
            console.error("投稿データの取得に失敗しました", error);
        }
    };






    const openModal = (postId, content) => {
        console.log("Received Post ID:", postId);
        console.log("Received Content:", content);
        editingPostId.value = postId;
        editingContent.value = content;
        isOpen.value = true;
        console.log("Updated editingPostId:", editingPostId.value);
        console.log("Updated editingContent:", editingContent.value);
    };





    const closeModal = () => {
        editingPostId.value = null;
        editingContent.value = "";
        isOpen.value = false;
    };





    const updateContent = async () => {
        if (!editingPostId.value) return;

        if (!editingContent.value.trim()) {
            alert("投稿内容を入力してください。");
            return;
        }

        // 連打防止
        if (isProcessing.value) return;
        isProcessing.value = true;

        // 編集確認
        const isConfirmed = confirm("この内容で投稿を更新しますか？");
        if (!isConfirmed) return;

        try {
            const userStore = useUserStore();
            console.log("Editing Post ID:", editingPostId.value);
            console.log("All Posts:", posts.value);

            const post = posts.value.find(p => p.id === editingPostId.value);
            if (!post) {
                console.log("Post not found!");
                return;
            }
            console.log("Updated Post Content:", post.content);

            const response = await fetch(`http://localhost/api/posts/${editingPostId.value}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${await userStore.user.getIdToken() }`
                },
                body: JSON.stringify({ content: editingContent.value })
            });

            const data = await response.json();
            if (!response.ok) {
                console.error("Failed to update post:", data.error);
                return;
            }

            post.content = editingContent.value;
            console.log("Post successfully updated:", data);
            closeModal();
        } catch (error) {
            console.error("Error updating post:", error);
        } finally {
            isProcessing.value = false;
        }
    };





    const createPost = async (newPost) => {

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
            if (!token) {
                console.error("トークンが取得できません");
                return;
            }
            const response = await axios.post(
                "http://localhost/api/posts",
                {
                    content: newPost.content,
                    user_name: user.displayName || "Unknown",
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
                user_name: savedPost.user_name,
            });
            console.log("投稿が作成されました:", savedPost);
            console.log("投稿内容:", newPost.content);
        } catch (error) {
            console.log("投稿の作成に失敗しました:", error);
        } finally {
            isProcessing.value = false;
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
        isOpen,
        editingPostId,
        editingContent,
        openModal,
        closeModal,
        updateContent,
        createPost,
        deletePost,
    };
});