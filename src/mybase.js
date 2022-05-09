import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCGH8ORGBCZ5ft7LzEiPath8uTGPX2yfA4",
    authDomain: "yawitter.firebaseapp.com",
    projectId: "yawitter",
    storageBucket: "yawitter.appspot.com",
    messagingSenderId: "518373226032",
    appId: "1:518373226032:web:b35f2b1123d40020f0dff5"
};

const app = initializeApp(firebaseConfig);

export const authService = getAuth();
export const dbService = getFirestore();
export const storageService = getStorage();