import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDOvaJWff5qKqkXGdDdqg2A8dyxAIrsQ7M",
    authDomain: "debate-forum.firebaseapp.com",
    projectId: "debate-forum-57967",
    storageBucket: "debate-forum-57967.appspot.com", // FIXED URL
    messagingSenderId: "349269702152",
    appId: "1:349269702152:web:ccf89e66bb9cee27ddc3bd",
    databaseURL: "https://debate-forum-57967-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// the Firebase authentication handler
export const auth = getAuth(app);
// the Realtime Database handler
export const db = getDatabase(app);
// the Firebase Storage handler
export const storage = getStorage(app);