// Import the functions you need from the SDKs you need
import { defineNuxtPlugin } from '#app';
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export default defineNuxtPlugin(nuxtApp => {
    const firebaseConfig = {
        apiKey: "AIzaSyA5ZtjuT0Wgt_UmUZoHvD9qy9EEwvYVjeo",
        authDomain: "share-app-dca94.firebaseapp.com",
        projectId: "share-app-dca94",
        storageBucket: "share-app-dca94.firebasestorage.app",
        messagingSenderId: "483120510998",
        appId: "1:483120510998:web:d9594ab517fe1f587edd37",
        measurementId: "G-GB1Y6TDYTJ"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    // クライアントサイドのみで Analytics 初期化
    if (typeof window !== 'undefined') {
        const analytics = getAnalytics(app);

        // イベントログを送信（例: 'page_view' イベント）
        logEvent(analytics, 'page_view');

        // Firebase インスタンスをアプリケーション全体で利用できるように提供
        nuxtApp.provide('firebase', app);
        nuxtApp.provide('analytics', analytics);
    }
});