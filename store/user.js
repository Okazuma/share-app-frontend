import { ref } from "vue";
import { defineStore } from "pinia";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';


export const useUserStore = defineStore("user", () => {
    const user = ref(null);
    const isAuthenticated = ref(false);
    const isInitialized = ref(false)



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