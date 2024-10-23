// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCDtpgBojY1ZPr0wGpWtd7qQZwkyalGN8M",
  authDomain: "formama-fba11.firebaseapp.com",
  projectId: "formama-fba11",
  storageBucket: "formama-fba11.appspot.com",
  messagingSenderId: "81733048422",
  appId: "1:81733048422:web:2a3ab149c383d2ae8835a7",
};

export const app = initializeApp(firebaseConfig);
// firebase의 firestore 인스턴스를 변수에 저장
export const db = getFirestore(app);
