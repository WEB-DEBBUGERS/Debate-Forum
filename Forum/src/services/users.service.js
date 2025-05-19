import { get, set, ref, query, equalTo, orderByChild } from "firebase/database";
import { db } from "../config/firebase-config";

export const getUserByHandle = async (handle) => {
  const snapshot = await get(ref(db, `users/${handle}`));
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
};

export const createUserHandle = async (
  handle,
  uid,
  email,
  firstName,
  lastName
) => {
  const user = {
    handle,
    uid,
    email,
    firstName,
    lastName,
    createdOn: new Date().toString(),
  };

  await set(ref(db, `users/${handle}`), user);
};

export const getUserData = async (uid) => {
  const snapshot = await get(
    query(ref(db, "users"), orderByChild("uid"), equalTo(uid))
  );

  return snapshot.val();
};

export const updateUserProfile = async (uid, firstName, lastName) => {
  const snapshot = await get(
    query(ref(db, "users"), orderByChild("uid"), equalTo(uid))
  );
  if (snapshot.exists()) {
    const users = snapshot.val();
    const handle = Object.keys(users)[0];
    const userRef = ref(db, `users/${handle}`);
    await set(userRef, {
      ...users[handle],
      firstName,
      lastName,
    });
    // Also update the UID-indexed user if you have one (for consistency)
    // await set(ref(db, `usersByUid/${uid}`), {
    //   ...users[handle],
    //   firstName,
    //   lastName,
    // });
  }
};

export const getAllUsers = async () => {
  const snapshot = await get(ref(db, `users`));
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
};

export const addFavoritePost = async (uid, postId) => {
  const userSnapshot = await get(
    query(ref(db, "users"), orderByChild("uid"), equalTo(uid))
  );
  if (!userSnapshot.exists()) return;
  const userKey = Object.keys(userSnapshot.val())[0];
  const userRef = ref(db, `users/${userKey}/favorites`);
  let favorites = [];
  const favSnap = await get(userRef);
  if (favSnap.exists()) favorites = favSnap.val();
  if (!favorites.includes(postId)) {
    favorites.push(postId);
    await set(userRef, favorites);
  }
};

export const removeFavoritePost = async (uid, postId) => {
  const userSnapshot = await get(
    query(ref(db, "users"), orderByChild("uid"), equalTo(uid))
  );
  if (!userSnapshot.exists()) return;
  const userKey = Object.keys(userSnapshot.val())[0];
  const userRef = ref(db, `users/${userKey}/favorites`);
  let favorites = [];
  const favSnap = await get(userRef);
  if (favSnap.exists()) favorites = favSnap.val();
  favorites = favorites.filter((id) => id !== postId);
  await set(userRef, favorites);
};

export const toggleFavoritePost = async (uid, postId) => {
  const userSnapshot = await get(
    query(ref(db, "users"), orderByChild("uid"), equalTo(uid))
  );
  if (!userSnapshot.exists()) return;
  const userKey = Object.keys(userSnapshot.val())[0];
  const userRef = ref(db, `users/${userKey}/favorites`);
  let favorites = [];
  const favSnap = await get(userRef);
  if (favSnap.exists()) favorites = favSnap.val();
  if (favorites.includes(postId)) {
    favorites = favorites.filter((id) => id !== postId);
  } else {
    favorites.push(postId);
  }
  await set(userRef, favorites);
};

export const getUserFavorites = async (uid) => {
  const userSnapshot = await get(
    query(ref(db, "users"), orderByChild("uid"), equalTo(uid))
  );
  if (!userSnapshot.exists()) return [];
  const userKey = Object.keys(userSnapshot.val())[0];
  const userRef = ref(db, `users/${userKey}/favorites`);
  const favSnap = await get(userRef);
  return favSnap.exists() ? favSnap.val() : [];
};
