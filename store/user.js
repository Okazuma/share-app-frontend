import { ref } from "vue";
import { defineStore } from "pinia";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getAuth, onAuthStateChanged } from 'firebase/auth';




export const useUserStore = defineStore("user", () => {
    const user = ref(null); // ユーザー情報
    const isAuthenticated = ref(false); // 認証状態
    const isInitialized = ref(false)





    // ユーザー情報をセット
    const setUser = (firebaseUser) => {
        if (firebaseUser) {
            user.value = firebaseUser;
            isAuthenticated.value = true;
        } else {
            clearUser();
        }
        isInitialized.value = true;
    };





    // ユーザー情報をクリア
    const clearUser = () => {
        user.value = null;
        isAuthenticated.value = false;
        isInitialized.value = true;
    };





    // 登録処理
    const register = async (email, password) => {
        try {
            console.log('Register Request:', { email, password });
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
        } catch (error) {
            console.error('Registration Error:', error);
            throw error;
        }
    };





    // ログイン処理
    const login = async (email, password) => {
        try {
            console.log('Login Request:', { email, password });
            const auth = getAuth();
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
        } catch (error) {
            console.error('Login Error:', error);
            throw error;
        }
    };





    // ログアウト処理
    const logout = async () => {
        try {
            const auth = getAuth();
            await signOut(auth);
            clearUser();
        } catch (error) {
            console.error('Logout Error:', error);
            throw error;
        }
    };





    const initializeUser = async () => {
        const auth = getAuth();
        const firebaseUser = auth.currentUser;

        if (firebaseUser) {
            setUser(firebaseUser);
        }

        return new Promise((resolve, reject) => {
            onAuthStateChanged(
                auth,
                (firebaseUser) => {
                    if (firebaseUser) {
                        setUser(firebaseUser);
                        isAuthenticated.value = true;
                    } else {
                        clearUser();
                        isAuthenticated.value = false;
                    }
                    isInitialized.value = true;
                    resolve(firebaseUser);
                },
                (error) => {
                    console.error("Auth state change error:", error);
                    reject(error);
                }
            );
        });
    };



    return {
        user,
        isAuthenticated,
        isInitialized,
        setUser,
        clearUser,
        register,
        login,
        logout,
        initializeUser,
    };
});