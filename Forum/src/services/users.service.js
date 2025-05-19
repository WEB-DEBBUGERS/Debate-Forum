import { get, set, ref, query, equalTo, orderByChild, update, remove } from "firebase/database";
import { db } from "../config/firebase-config";
import { getAllPosts } from "./posts.service";

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

export const updateUserProfile = async (uid, firstName, lastName, avatarBase64) => {
  const snapshot = await get(
    query(ref(db, "users"), orderByChild("uid"), equalTo(uid))
  );
  if (snapshot.exists()) {
    const users = snapshot.val();
    const handle = Object.keys(users)[0];
    const userRef = ref(db, `users/${handle}`);
    // Only update the changed fields, do not overwrite the whole user object
    await update(userRef, {
      firstName,
      lastName,
      avatarBase64: avatarBase64 || users[handle].avatarBase64 || null,
    });
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
  const userRef = ref(db, `users/${userKey}`);
  const favRef = ref(db, `users/${userKey}/favorites`);
  let favorites = [];
  const favSnap = await get(favRef);
  if (favSnap.exists() && Array.isArray(favSnap.val())) {
    favorites = favSnap.val();
  } else if (favSnap.exists() && typeof favSnap.val() === 'string') {
    // If favorites is a string (corrupted), ignore it
    favorites = [];
  } else {
    favorites = [];
  }
  if (favorites.includes(postId)) {
    favorites = favorites.filter((id) => id !== postId);
  } else {
    favorites.push(postId);
  }
  await update(userRef, { favorites });
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

export const deleteUserAndPosts = async (uid) => {
  // 1. Find the user's handle and user node
  const userSnapshot = await get(
    query(ref(db, "users"), orderByChild("uid"), equalTo(uid))
  );
  if (!userSnapshot.exists()) return;
  const userKey = Object.keys(userSnapshot.val())[0];
  const userRef = ref(db, `users/${userKey}`);

  // 2. Delete all posts by this user
  const posts = await getAllPosts();
  if (posts) {
    for (const [postId, post] of Object.entries(posts)) {
      if (post.authorUid === uid) {
        await remove(ref(db, `posts/${postId}`));
      }
    }
  }

  // 3. Delete all comments by this user
  const commentsSnap = await get(ref(db, 'comments'));
  if (commentsSnap.exists()) {
    const comments = commentsSnap.val();
    for (const [commentId, comment] of Object.entries(comments)) {
      if (comment.authorUid === uid) {
        await remove(ref(db, `comments/${commentId}`));
      }
    }
  }

  // 4. Delete all replies by this user
  const repliesSnap = await get(ref(db, 'replies'));
  if (repliesSnap.exists()) {
    const replies = repliesSnap.val();
    for (const [replyId, reply] of Object.entries(replies)) {
      if (reply.authorUid === uid) {
        await remove(ref(db, `replies/${replyId}`));
      }
    }
  }

  // 5. Delete the user profile
  await remove(userRef);
};
