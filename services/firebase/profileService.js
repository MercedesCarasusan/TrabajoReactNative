import { db } from '../../firebase/firebaseConfig';

import {
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';


// ======================
// OBTENER PERFIL
// ======================

export const getProfile = async (userId) => {

  try {

    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return docSnap.data();

  } catch (error) {
    console.log(error);
    throw error;

  }

};


// ======================
// GUARDAR PERFIL
// ======================

export const saveProfile = async (userId, profileData) => {

  try {
    await setDoc(
      doc(db, 'users', userId),
      profileData
    );

  } catch (error) {
    console.log(error);
    throw error;

  }

};