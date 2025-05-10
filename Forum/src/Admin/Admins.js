import { get, ref, query, orderByChild, equalTo,getDatabase,set } from 'firebase/database';
import { db } from '../config/firebase-config.js';

export const getAdminData = async (uid) => {
    const snapshot = await get(ref(db, 'admins/' + uid));
  
    if (snapshot.exists()) {
      const adminData = snapshot.val();
      return adminData;
    } else {
      console.log("No admin data found");
      return null;
    }
  };
  



 export const addAdminToDatabase = (uid, email) => {
  const db = getDatabase();
  const userRef = ref(db, 'admins/' + uid);
  return set(userRef, {
    email: email,
    isAdmin: true,
    uid: uid,
  });
};

