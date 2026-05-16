import { db } from '../../firebase/firebaseConfig';

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';


// ======================
// GUARDAR ENTRENAMIENTO
// ======================

export const saveTraining = async (userId, trainingData) => {

  try {
    await addDoc(
      collection(db, 'entrenamientos', userId, 'sesiones'),
      trainingData
    );

  } catch (error) {
    console.log(error);
    throw error;

  }

};


// ======================
// OBTENER ENTRENAMIENTOS
// ======================

export const getTrainings = async (userId) => {

  try {
    const q = query(
      collection(db, 'entrenamientos', userId, 'sesiones'),
      orderBy('fecha', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const data = [];

    querySnapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data()
      });

    });

    return data;

  } catch (error) {

    console.log(error);
    throw error;

  }

};