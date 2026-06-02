import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Quick verification that at least the API Key and Database URL are set
const hasConfig = !!(firebaseConfig.apiKey && firebaseConfig.databaseURL);

let app = null;
let db = null;
let dbRef = null;

if (hasConfig) {
  try {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    dbRef = ref(db, 'site_content');
    console.log("Firebase Realtime Database initialized successfully.");
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.warn("Firebase configuration keys are missing. Falling back to LocalStorage mode.");
}

export { db, dbRef, hasConfig };
