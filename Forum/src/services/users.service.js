import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getUserByHandle = async (handle) => {

    const snapshot = await get(ref(db, `users/${handle}`));
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        return null;
    }
};

export const createUserHandle = async (handle, uid, email) => {

    const user = {
        handle,
        uid,
        email,
        createdOn: new Date().toString(),
    };

    await set(ref(db, `users/${handle}`), user);
};

export const getUserData = async (uid) => {

    const snapshot = await get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));

    return snapshot.val();
};