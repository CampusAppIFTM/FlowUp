import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
 
// Cole aqui o objeto que o console mostrou na etapa 1
const firebaseConfig = {
    apiKey: "AIzaSyBeEshGv9MpI3RaZTkdg4z-is_mEYEjJv0",
    authDomain: "flowup-d44fb.firebaseapp.com",
    projectId: "flowup-d44fb",
    storageBucket: "flowup-d44fb.firebasestorage.app",
    messagingSenderId: "1089486351804",
    appId: "1:1089486351804:web:66f6547b33fcc40bda8fb9",
    measurementId: "G-SY2CZKYHNN"
  };
  
 
const app = initializeApp(firebaseConfig);
 
// A "porta de entrada" do banco.
// Todo acesso ao Firestore passa por ela.
export const db = getFirestore(app);
