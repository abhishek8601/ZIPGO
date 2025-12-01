import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';



const firebaseConfig = {
    apiKey: "AIzaSyAaqK52GcxHpuCoGPdZQRNshFGVrMWi7Ys",
    authDomain: "zipgo-backend.firebaseapp.com",
    projectId: "zipgo-backend",
    storageBucket: "zipgo-backend.appspot.com",
    messagingSenderId: "99995241871",
    appId: "1:99995241871:web:412b2a738f7d24d481cffa",
    measurementId: "G-T1Q0CQ1X61"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

