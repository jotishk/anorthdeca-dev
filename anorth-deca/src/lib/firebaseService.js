import { db } from '@/lib/firebase';
import { doc, setDoc } from "firebase/firestore"; 

async function checkUsernameExists() {

}

async function createUser(UID, Email, Username, ChapterID, Role) {
  const userData = {
    email: Email,
    username: Username,
    chapterid: ChapterID,
    role: Role
  };
  try {
    await setDoc(doc(db, "users", UID), userData);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function createTest() {
  
}


export { createUser };