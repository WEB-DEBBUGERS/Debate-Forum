import { get, ref, update } from "firebase/database";
import { db } from "../config/firebase-config";

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

export const likeOrDislikePost = async (postId, userId, type) => {
  const postRef = ref(db, `posts/${postId}`);
  const postSnap = await get(postRef);
  if (!postSnap.exists()) return;
  const post = postSnap.val();
  const likes = Array.isArray(post.likes) ? [...post.likes] : [];
  const dislikes = Array.isArray(post.dislikes) ? [...post.dislikes] : [];

  const newLikes = likes.filter((id) => id !== userId);
  const newDislikes = dislikes.filter((id) => id !== userId);

  if (type === "like") {
    newLikes.push(userId);
  } else if (type === "dislike") {
    newDislikes.push(userId);
  }
  await update(postRef, { likes: newLikes, dislikes: newDislikes });
};
