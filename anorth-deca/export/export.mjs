// Node + ES module
import fs from "fs";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAYiNXgIh-C8jwL5hijC6JGqWBn4TQwsts",
  authDomain: "anorthdeca-291fd.firebaseapp.com",
  projectId: "anorthdeca-291fd",
  storageBucket: "anorthdeca-291fd.firebasestorage.app",
  messagingSenderId: "670460601436",
  appId: "1:670460601436:web:f4f9394b2007c521737299",
  measurementId: "G-JHMTG8YBMN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  console.log("Fetching questions...");
  const snapshot = await getDocs(collection(db, "questions"));

  const bigObject = {};
  snapshot.forEach(doc => {
    bigObject[doc.id] = doc.data();
  });

  fs.writeFileSync("questions.json", JSON.stringify(bigObject, null, 2));
  console.log("✅ Export complete: questions.json created");
}

run();