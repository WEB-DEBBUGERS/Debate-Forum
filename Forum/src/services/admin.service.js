import {ref, remove, get, update} from 'firebase/database';
import {db } from '../config/firebase-config.js';

export const getAllPosts = async () => {

    const snapshot = await get(ref(db, 'posts'));
    return snapshot.exists() ? snapshot.val() : {};
};


export const deletePost = async (postId) => {
  const postRef = ref(db, `posts/${postId}`);
  return remove(postRef);
}


export const getAllUsers = async () => {
    const snapshot = await get(ref(db, 'users'));
    return snapshot.exists() ? snapshot.val() : {};
}


export const blockUser = async (uid) => {
    await update(ref(db, `users/${uid}`), {isBlocked: true});
}

export const  unblockUser = async (uid) => {
    await update(ref(db, `users/${uid}`), {isBlocked: false});
}


