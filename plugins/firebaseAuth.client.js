import { defineNuxtPlugin } from '#app';
import { useUserStore } from '~/store/user';
import { onAuthStateChanged } from 'firebase/auth';


export default defineNuxtPlugin((nuxtApp) => {
    const auth = nuxtApp.$auth; // Firebase Auth インスタンスを取得
    const userStore = useUserStore(); // Pinia のユーザーストアを利用（例）

    if (!auth) {
        console.error('Authのインスタンスが見つかりません');
        return;
    }


    // 認証状態の初期化をPromiseで待機する
    const authReady = new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                userStore.setUser(user);
            } else {
                userStore.clearUser();
            }
            resolve();
        }, (error) => {
            console.error("Auth state change error: ", error);
            reject(error);
        });
    });


    // プラグインとしてauthReadyを提供
    nuxtApp.provide('authReady', authReady);
});