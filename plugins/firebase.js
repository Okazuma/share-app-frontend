// Import the functions you need from the SDKs you need
import { defineNuxtPlugin } from '#app';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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

    // Firebase初期化
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    nuxtApp.provide('firebase', app);
    nuxtApp.provide('auth', auth); // Auth を提供
});