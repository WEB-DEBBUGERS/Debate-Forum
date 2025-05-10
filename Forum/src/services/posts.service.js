import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config';
export const getUserPosts = async (uid) => {
    const snapshot = await get(query(ref(db, 'posts'), orderByChild('authorUid'), equalTo(uid)));
    return snapshot.exists() ? snapshot.val() : {};
}