import { get, ref } from "firebase/database";
import { db } from "../config/firebase-config";
// export const getUserPosts = async (uid) => {
//     const snapshot = await get(query(ref(db, 'posts'), orderByChild('authorUid'), equalTo(uid)));
//     return snapshot.exists() ? snapshot.val() : {};
// }

export const getAllPosts = async () => {
  try {
    const snapshot = await get(ref(db, "posts"));
    return snapshot.exists() ? snapshot.val() : {};
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {};
  }
};

export const getAllComments = async () => {
  try {
    const snapshot = await get(ref(db, "comments"));
    return snapshot.exists() ? snapshot.val() : {};
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {};
  }
};

export const getAllReplies = async () => {
  try {
    const snapshot = await get(ref(db, "replies"));
    return snapshot.exists() ? snapshot.val() : {};
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {};
  }
};