import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-IZ5VVROxppLSvgGHuJipJrJtj8fFfHs",
  authDomain: "leaflog-4ef30.firebaseapp.com",
  projectId: "leaflog-4ef30",
  storageBucket: "leaflog-4ef30.firebasestorage.app",
  messagingSenderId: "184539560046",
  appId: "1:184539560046:web:1235afff406711062f0e7f",
  measurementId: "G-2WH9R8NPQT"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);