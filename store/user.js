import { ref } from "vue";
import { defineStore } from "pinia";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { getUserFromDB, saveUserToDB } from "~/db/db";


export const useUserStore = defineStore("user", () => {
    const user = ref(null);
    const isAuthenticated = ref(false);
    const isInitialized = ref(false);



    const setUser = (firebaseUser) => {
        if (firebaseUser) {
            user.value = firebaseUser;
            isAuthenticated.value = true;
        } else {
            clearUser();
        }
        isInitialized.value = true;
    };





    const clearUser = () => {
        user.value = null;
        isAuthenticated.value = false;
        isInitialized.value = true;
    };





    const register = async (email, password, displayName) => {
        try {
            console.log('Register Request:', { email, password,displayName });
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password,);
            const user = userCredential.user;

            await updateProfile(user, { displayName });

            setUser({ ...user, displayName });
            console.log("登録成功:", user);

        } catch (error) {
            console.error('Registration Error:', error);
            throw error;
        }
    };





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
        console.log("ユーザー情報の初期化開始");

        const auth = getAuth();
        const cachedUser = await getUserFromDB();

        if (cachedUser) {
            console.log("IndexedDB からユーザー情報を取得:", cachedUser);

            user.value = {
                ...cachedUser,
                getIdToken: async () => {
                    const currentUser = auth.currentUser;
                    return currentUser ? currentUser.getIdToken() : null;
                },
            };

            isAuthenticated.value = true;
            isInitialized.value = true;
            return;
        }

        console.log("Firebase からユーザー情報を取得中...");

        return new Promise((resolve, reject) => {
            onAuthStateChanged(
                auth,
                async (firebaseUser) => {
                    if (firebaseUser) {
                        user.value = firebaseUser;
                        isAuthenticated.value = true;
                        console.log("Firebase からユーザー情報を取得:", user.value);

                        await saveUserToDB({
                            uid: firebaseUser.uid,
                            displayName: firebaseUser.displayName,
                            email: firebaseUser.email,
                            photoURL: firebaseUser.photoURL,
                        });
                    } else {
                        console.log("⚠️ ログインしていません");
                        user.value = null;
                        isAuthenticated.value = false;
                    }
                    isInitialized.value = true;
                    resolve(user.value);
                },
                (error) => {
                    console.error("Firebase 認証エラー:", error);
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