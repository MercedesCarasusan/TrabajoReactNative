import { db } from '../../firebase/firebaseConfig';

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  deleteDoc
} from 'firebase/firestore';


// ======================
// GUARDAR ENTRENAMIENTO
// ======================

export const saveTraining = async (userId, trainingData) => {

  try {
    const docRef = await addDoc(
      collection(db, 'entrenamientos', userId, 'sesiones'),
      trainingData
    );

    return docRef.id;

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


// ======================
// BORRAR ENTRENAMIENTO
// ======================

export const deleteTraining = async (userId, trainingId) => {

  try {
    await deleteDoc(
      doc(db, 'entrenamientos', userId, 'sesiones', trainingId)
    );

  } catch (error) {

    console.log(error);
    throw error;

  }

};
