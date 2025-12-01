import { addDoc, collection, getDocs,setDoc, doc } from 'firebase/firestore';
import { db } from './config';

export const saveStudentInfo = async (student) => {
  try {
    // console.log("Saving student to Firestore:", student);
    const docRef = await addDoc(collection(db, "Register-students-data"), student);
    // console.log("Student saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving student info:", error);
    throw error;
  }
};

export const saveStudentInfoForList = async (student) => {
  try {
    const studentsRef = collection(db, "studentslist");
    const snapshot = await getDocs(studentsRef);

    // Count existing students to generate next ID
    const totalStudents = snapshot.size + 1;

    // Format ID like stud-0001, stud-0002, ...
    const customId = `stud-${String(totalStudents).padStart(5, '0')}`;

    console.log("Generated custom ID:", customId);

    // Use setDoc to create a document with your custom ID
    await setDoc(doc(studentsRef, customId), {
      ...student,
      studentId: customId, // store custom ID inside document
      createdAt: new Date().toISOString(),
    });

    return customId;

  } catch (error) {
    console.error("Error saving student info:", error);
    throw error;
  }
};


export const getAllStudents = async () => {
  try {
    const docRef = await addDoc(collection(db, 'Register-students-data'), student);
    console.log('Student saved with ID: ', docRef.id);
  } catch (error) {
    console.error('Error saving student info:', error);
    throw error; // rethrow so the caller knows
  }

 const snapshot = await getDocs(collection(db, 'Register-students-data'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


