
import { initializeApp, FirebaseApp } from "firebase/app";
import { 
  getDatabase, 
  Database,
  ref, 
  push, 
  set, 
  get, 
  onValue, 
  remove,
  update,
  off
} from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCCWeH-KD2NqPd_B0w4MjJeofSiXCUEPNs",
  authDomain: "money-34ef6.firebaseapp.com",
  databaseURL: "https://money-34ef6-default-rtdb.firebaseio.com",
  projectId: "money-34ef6",
  storageBucket: "money-34ef6.appspot.com",
  messagingSenderId: "662368167193",
  appId: "1:662368167193:web:33a3aab68cca609dbe9188",
  measurementId: "G-0TGQXLG81P"
};

let app: FirebaseApp;
let database: Database;

try {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { 
  database, 
  ref, 
  push, 
  set, 
  get, 
  onValue, 
  remove, 
  update,
  off
};
