import { get, ref } from 'firebase/database';
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
  


