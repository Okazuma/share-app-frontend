import { defineStore } from "pinia";
import { ref } from "vue";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getAuth, onAuthStateChanged } from 'firebase/auth';




export const useUserStore = defineStore("user", () => {
    const user = ref(null); // ユーザー情報
    const isAuthenticated = ref(false); // 認証状態
    const isInitialized = ref(false) // 認証状態の初期化が完了したかどうかを管理
    const auth = getAuth();

    // ユーザーをセット
    const setUser = (userData) => {
        user.value = userData;
        isAuthenticated.value = true;
        isInitialized.value = true;
    };


    // ユーザーをクリア
    const clearUser = () => {
        user.value = null;
        isAuthenticated.value = false;
        isInitialized.value = true;
    };


    // 登録
    const register = async ($auth, email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword($auth, email, password);
            setUser(userCredential.user);
        } catch (error) {
            console.error("Registration Error:", error);
            throw error;
        }
    };

    // ログイン
    const login = async ($auth, email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword($auth, email, password);
            setUser(userCredential.user);
        } catch (error) {
            console.error("Login Error", error);
            throw error;
        }
    };

    // ログアウト
    const logout = async ($auth) => {
        try {
            await signOut($auth);
            clearUser();
        } catch (error) {
            console.error("Logout Error", error);
        }
    };



    // ユーザーの認証を確認する関数
    const initializeUser = () => {
        return new Promise((resolve) => {
            onAuthStateChanged(auth, (firebaseUser) => {
                if (firebaseUser) {
                    console.log("認証されたユーザー:", firebaseUser);
                    setUser(firebaseUser);
                } else {
                    console.log("認証されていないユーザー");
                    clearUser();
                }
                resolve(); // 初期化完了
            });
        });
    };




    return {
        user,
        // isAuthenticated,
        setUser,
        clearUser,
        register,
        login,
        logout,
        initializeUser,
        // isInitialized
    };
});