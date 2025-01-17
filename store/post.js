import { defineStore } from 'pinia';
import { useUserStore } from '~/store/user';
import { ref } from "vue"
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';




export const usePostStore = defineStore('posts', () => {
    const posts = ref([]);
    const userStore = useUserStore();

    // 投稿を追加
    const addPost = (newPost) => {
        newPost.isLiked = false;
        newPost.likes = 0;
        posts.value.unshift(newPost);
    };

    const createPost = async (newPost) =>{
        try {
            console.log('投稿内容:', newPost.content);

            const user = userStore.user;
            if (!user) {
                console.error('ユーザーがログインしていません');
                return;
            }

            const token = await user.getIdToken();

            if (!token) {
                console.error('トークンが取得できません');
                return;
            }

            const userId = user.uid;

            const response = await axios.post('http://localhost/api/posts', {
                user_id: userId,
                content: newPost.content,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const savedPost = response.data;

            savedPost.isLiked = false;
            savedPost.likes = 0;
            posts.value.unshift(savedPost);
            console.log('投稿が作成されました:' ,savedPost);
        } catch (error) {
            console.log('Failed to create post:', error);
        }
    };



    const initializePost = async () => {
        const auth = getAuth();
        await userStore.initializeUser();

        const user = await new Promise((resolve) => {
            onAuthStateChanged(auth, (firebaseUser) => {
                if (firebaseUser) {
                    console.log("認証されたユーザー:", firebaseUser);
                    resolve(firebaseUser);
                } else {
                    console.log("認証されていないユーザー");
                    resolve(null);
                }
            });
        });

        if (!user) {
            console.error('ユーザーが認証されていません');
            return;
        }

        try {
            const { data } = await axios.get('http://localhost/api/posts');
            posts.value = data;
            console.log('投稿一覧:', posts.value);
        } catch (error) {
            console.error('投稿一覧の取得に失敗しました:', error);
        }
    };



    const deletePost = async (postId) => {
        // UIに即時反映: ローカルデータを先に更新
        const originalPosts = [...posts.value];
        posts.value = posts.value.filter(post => post.id !== postId);

        try {
            const auth = getAuth();
            const token = await auth.currentUser?.getIdToken();

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


    // いいね状態の切り替えメソッド
    const toggleLike = (postId) => {
        const post = posts.value.find((p) => p.id === postId);
        if (post) {
            if (post.isLiked) {
                post.likes -= 1;
            } else {
                post.likes += 1;
            }
            post.isLiked = !post.isLiked;
            console.log(`投稿ID: ${postId}, いいね数: ${post.likes}`);

        }
    };


    return {
        createPost,
        initializePost,
        // getUserId,
        posts,
        addPost,
        deletePost,
        toggleLike,
    };
});