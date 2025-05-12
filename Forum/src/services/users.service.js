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
