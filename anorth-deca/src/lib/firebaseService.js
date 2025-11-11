import { db } from '@/lib/firebase';
import { doc, setDoc, collection, query, where, getDocs, getDoc, updateDoc } from "firebase/firestore"; 
import { v4 as uuidv4 } from 'uuid';


async function checkUsernameExists() {

}

async function submitTest(UID,SID,TID,selectedAnswers) {
  const sessionRef = doc(db,"users",UID,"sessions",SID);
  await updateDoc(sessionRef, {
    answers:selectedAnswers 
  })

  const answers = await getDoc(doc(db,'tests',TID));
  const answerData = answers.data();
  let correct = 0;
  
  
  for (let i = 1; i<= 100; i++) {
    if (answerData['anskey'][`q${i}`] == selectedAnswers[`q${i}`]) {
      correct++;
    }
  }
  
  const testRef = doc(db,"users",UID,"sessions",SID);
  await updateDoc(testRef, {
    status: 'inactive',
    score: correct
  });
}
async function fetchAttempts(UID,TID) {
  const sessionsQuery = query(collection(db,"users",UID,"sessions"),where("tid", "==", TID));
  const sessions = await getDocs(sessionsQuery);
  let data = [];
  
  for (const doc of sessions.docs) {
    
    const sessionData = doc.data();
    if (sessionData.status !== 'active') {
      data.push({
        num:sessionData["attempt"],
        answers: sessionData["answers"],
        score: sessionData["score"]
      });
    }
  }
  return data;
}
async function saveSelectedAnswers(UID, SID, answers) {
  const sessionRef = doc(db,"users",UID,"sessions", SID);
  await updateDoc(sessionRef, {
    answers: answers
  }, { merge:true });
}
async function fetchQuestions(TID) {
  const docRef = doc(db, "tests", TID);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
} 
async function retrieveSession(UID,TID) {
  const sessionsQuery = query(collection(db,"users",UID,"sessions"),where("tid", "==", TID));
  const sessions = await getDocs(sessionsQuery);
  for (const doc of sessions.docs) {
    
    const sessionData = doc.data();
    if (sessionData.status === 'active') {
      
      return {id:doc.id,...sessionData};
    }
  }
  return null;
}
async function createSession(UID,TID) {
  let emptyAnswers = {};
  const sessionID = uuidv4();
  const sessionsQuery = query(collection(db,"users",UID,"sessions"),where("tid", "==", TID));
  const sessions = await getDocs(sessionsQuery);
  for (let i = 1; i<= 100; i++) {
    emptyAnswers[`q${i}`] = "";
  } 
  const sessionData = {
    tid: TID,
    status: 'active',
    answers: emptyAnswers,
    attempt: sessions.docs.length + 1
  }
  try {
    await setDoc(doc(db,"users",UID,"sessions",sessionID),sessionData);
  } catch(err) {
    throw err;
  }
  return {id: sessionID, ...sessionData};
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
    throw err;
  }
}

async function createTest(text) {
  // Procedure for uploading test
  // Clean up weird spacing
  // Delete any of the headers in the pdf in questions and answer key (FINANCE CLUSTER EXAM)
  // Find questions with multiple answers and move them
  // Add 5 slashes to the end of questions and before answer key on a new line.
  // Update constants.js
  // at the end of this function chnage id number of test
  try {
    
    const [questionBlock, answerKeyBlock] = text.split('/////');
    const parts = questionBlock.split(/^\s*\d+\.\s+/gm).slice(1);
    const questions = {};
    const choices = {};
    const answers = {};
    const explanations = {};
    const sourceCodes = {};
    const sourceRefs = {};
    
    parts.forEach((block, index) => {
      const id = `q${index + 1}`;
      const choiceRegex = /([ABCD])\.\s*([\s\S]*?)(?=(?:[ABCD]\.|$))/g;
      const lines = block.trim().split('\n');
      const questionText = lines.shift().trim() + ' ' + lines.join(' ').split(/[ABCD]\./)[0].trim();

      questions[id] = questionText.replace(/\s+/g, ' ').trim();
      choices[id] = {};

      let match;
      while ((match = choiceRegex.exec(block)) !== null) {
        choices[id][match[1]] = match[2].replace(/\s+/g, ' ').trim();
      }
    });

    // Parse answer keys
    const keyParts = answerKeyBlock.split(/^\s*\d+\.\s+/gm).slice(1);
    keyParts.forEach((block, index) => {
      const id = `q${index + 1}`;
      const [answerLine, ...rest] = block.trim().split('\n');
      const answerLetter = answerLine.trim().charAt(0);
      const body = rest.join(' ').trim();

      // Get explanation (everything before first SOURCE)
      const explanation = body.split('SOURCE:')[0]?.trim() || '';

      // Match both SOURCE lines
      const allSources = [...body.matchAll(/SOURCE:\s*(.*)/g)];

      answers[id] = answerLetter;
      explanations[id] = explanation.replace(/\s+/g, ' ').trim();
      sourceCodes[id] = allSources[0]?.[1].trim() || '';
      sourceRefs[id] = allSources[1]?.[1].trim() || '';
    });

    window.testData = { questions, choices, answers, explanations, sourceCodes, sourceRefs };
    console.log("✅ Parsed 100 questions and answers into window.testData");
    const test = {
      label: "2013 ICDC Finance Exam",
      category: "finance",
      questions: questions,
      choices: choices,
      explanations: explanations,
      anskey: answers,
      scode: sourceCodes,
      source: sourceRefs
    };
    await setDoc(doc(db, "tests", "102"), test);
    console.log("uploaded successfully");
  } catch (err) {
    console.log(err.message);
  }
}



export { submitTest, fetchAttempts, createUser, createTest, createSession, retrieveSession, fetchQuestions, saveSelectedAnswers};