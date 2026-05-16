import { auth } from '../../firebase/firebaseConfig';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';


// ======================
// LOGIN
// ======================

export const loginUser = async (email, password) => {

  try {

    const userCredential =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      
    return userCredential.user;

  } catch (error) {

    console.log(error);
    throw error;
  }
};

// ======================
// REGISTER
// ======================

export const registerUser = async (email, password) => {

  try {
    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    return userCredential.user;

  } catch (error) {
    console.log(error);
    throw error;

  }

};


// ======================
// LOGOUT
// ======================

export const logoutUser = async () => {

  try {
    await signOut(auth);

  } catch (error) {
    console.log(error);
    throw error;

  }

};