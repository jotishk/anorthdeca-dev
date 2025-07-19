import { db } from '@/lib/firebase';
import { doc, setDoc } from "firebase/firestore"; 
import { v4 as uuidv4 } from 'uuid';


async function checkUsernameExists() {

}
async function createSession(UID,TID) {
  let emptyAnswers = {};
  const sessionID = uuidv4();
  for (let i = 1; i<= 100; i++) {
    emptyAnswers[`q${i}`] = "";
  } 
  const sessionData = {
    tid: TID,
    answers: emptyAnswers
  }
  try {
    await setDoc(doc(db,"users",UID,"sessions",sessionID),sessionData);
  } catch(err) {
    throw err;
  }
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

async function createTest(text) {
  // Procedure for uploading test
  // Clean up weird spacing
  // Delete any of the headers in the pdf in questions and answer key (FINANCE CLUSTER EXAM)
  // Find questions with multiple answers and move them
  // Add 5 slashes to the end of questions and before answer key on a new line.
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
    // const test = {
    //   label: "2013 ICDC Finance Exam",
    //   category: "finance",
    //   questions: questions,
    //   choices: choices,
    //   anskey: answers,
    //   scode: sourceCodes,
    //   source: sourceRefs
    // };
    // await setDoc(doc(db, "tests", "100"), test);
    // console.log("uploaded successfully");
  } catch (err) {
    console.log(err.message);
  }
}



export { createUser, createTest, createSession };