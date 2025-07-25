'use client'
import { useRef, useContext, useEffect, useState } from 'react';
import styles from '@/app/main/page.module.css';
import { fetchAttempts, createSession, retrieveSession, fetchQuestions, saveSelectedAnswers } from '@/lib/firebaseService';
import { Clock,Plus, MoveLeft, MoveRight } from 'lucide-react';

const tidToLabel = {
  100: "2013 ICDC Finance Exam"
}

export function TestPage({tid, user}) {
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState('Start');
  const [session, setSession] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [questionData, setQuestionData] = useState({});
  useEffect(()=> {
    if (user === null) return;
    async function fetchSession() {
      const sessionData = await retrieveSession(user.uid,tid);
      if (sessionData) {
        setStatus('Continue');
      } else {
        setStatus('Start');
      }
      setSession(sessionData);
    }
    
    fetchSession();
    
    
  },[user,tid])

  useEffect(() => {
    async function saveAnswers() {
      if (active && user && tid) {
        await saveSelectedAnswers(user.uid,session.id,selectedAnswers);
      }
    }
    const interval = setInterval(() => {
      saveAnswers();
    }, 10000);

    return () => clearInterval(interval); 
  },[active,user,tid,session,selectedAnswers])
  const handleActive = async () => {
    if (status === 'Start') {
      const newSession = await createSession(user.uid,tid);
      setSession(newSession);
      let emptyAnswers = {};
      for (let i = 1; i<= 100; i++) {
        emptyAnswers[`q${i}`] = "";
      } 
      setSelectedAnswers(emptyAnswers);
    } else {
      setSelectedAnswers(session.answers);
    }
    const retrievedTest = await fetchQuestions("" + tid);
    setQuestionData(retrievedTest);
    setActive(true); 
  }

  if (tid === '') {
    return <div className = {styles.testpagediv}></div>
  }
  if (!active) {
    return (
      <div className = {styles.testpagediv}>
        <div className = {styles.testpageNAmid}>
          <p className = {styles.testtitleNA}>{tidToLabel[tid]}</p>
          <p className = {styles.testdescription}>
            {`This is a 100 question multiple choice test from the `}
            <p className = {styles.testdescriptionhighlight}>{`${tidToLabel[tid].split(" ")[0]} ${tidToLabel[tid].split(" ")[1]}`}</p>
            {` administration of the exam from the 
            ${tidToLabel[tid].split(" ")[2]} cluster.`}
          </p>
          <AttemptsAccordion uid = {user.uid} tid = {tid}/>
          <button onClick = {handleActive} className = {styles.testbuttonNA}>{status}</button>
        </div>
        <div className = {styles.testpagetimediv}>
          <Clock size="30px"/>
          <p className = {styles.testpagetimetxt}>Recommended time limit is 60 min</p>
        </div>
      </div>
    );
  }
  return (
    <div className = {styles.testpagediv}>
      <p className = {styles.testpageinfo}>{questionData["category"] + " > " + tidToLabel[tid]}</p>
      <QuestionPanel questionData = {questionData} setSelectedAnswers = {setSelectedAnswers} selectedAnswers = {selectedAnswers}/>
      <QuestionMap selectedAnswers = {selectedAnswers}>
    </div>
  )
}
export function QuestionPanel({selectedAnswers, setSelectedAnswers, questionData}) {
  const [selected,setSelected] = useState([false,false,false,false]);
  const [qnum, setQnum] = useState(1);

  useEffect(() => {
    if (selectedAnswers[`q${qnum}`] === 'A') {
      setSelected([true,false,false,false]);
    } else if (selectedAnswers[`q${qnum}`] === 'B') {
      setSelected([false,true,false,false]);
    } else if (selectedAnswers[`q${qnum}`] === 'C') {
      setSelected([false,false,true,false]);
    } else if (selectedAnswers[`q${qnum}`] === 'D') {
      setSelected([false,false,false,true]);
    } else {
      setSelected([false,false,false,false]);
    }
  },[qnum])


  const handleQuestion = (curr,direction)=> {
    const newNum = curr + direction;
    setQnum(newNum);
  }
  const handleSelected = (ltr) => {
    let id = 0;
    if (ltr === 'A') {
      id = 0;
    } else if (ltr === 'B') {
      id = 1;
    } else if (ltr === 'C') {
      id = 2;
    } else {
      id = 3;
    }
    const update = selected.map((c,i) => {
      if (i === id) {
        return true;
      } else {
        return false;
      }
    }); 
    setSelected(update);
    setSelectedAnswers({ ...selectedAnswers, [`q${qnum}`]: ltr })
  }
  return (
    <div className = {styles.questionpanel}>
      <p className = {styles.questiontitle}>{'Question ' + qnum}</p>
      <p className = {styles.questioncontent}>{questionData["questions"][`q${qnum}`]}</p>
      <div className = {styles.questionchoicesdiv}>
        <QuestionChoices answerChoice = {questionData["choices"][`q${qnum}`]["A"]} handleSelected = {handleSelected} selected = {selected[0]} qnum = {qnum} altr = {'A'}/>
        <QuestionChoices answerChoice = {questionData["choices"][`q${qnum}`]["B"]} handleSelected = {handleSelected} selected = {selected[1]} qnum = {qnum} altr = {'B'}/>
        <QuestionChoices answerChoice = {questionData["choices"][`q${qnum}`]["C"]} handleSelected = {handleSelected} selected = {selected[2]} qnum = {qnum} altr = {'C'}/>
        <QuestionChoices answerChoice = {questionData["choices"][`q${qnum}`]["D"]} handleSelected = {handleSelected} selected = {selected[3]} qnum = {qnum} altr = {'D'}/>
      </div> 
      <QuestionPanelBtm qnum = {qnum} handleQuestion = {handleQuestion}/>
    </div>
  );
}
export function QuestionPanelBtm({qnum,handleQuestion}) {
  if (qnum === 1) {
    return (
      <div className = {styles.questionpanelbtmdiv}>
        <button className = {styles.questionpanelnextbtn}><MoveRight onClick = {() => handleQuestion(qnum,1)} size = "35px" color = "white"/></button>
      </div>
    );
  }
  if (qnum === 100) {
    return (
      <div className = {styles.questionpanelbtmdiv}>
        <button className = {styles.questionpanelnextbtn}><MoveLeft onClick = {() => handleQuestion(qnum,-1)} size = "35px" color = "white"/></button>
      </div>
    );
  }
  return (
    <div className = {styles.questionpanelbtmdiv}>
      <button className = {styles.questionpanelnextbtn}><MoveLeft onClick = {() => handleQuestion(qnum,-1)} size = "35px" color = "white" /></button>
      <button className = {styles.questionpanelnextbtn}><MoveRight onClick = {() => handleQuestion(qnum,1)} size = "35px" color = "white"/></button>
    </div>
  );
}
export function QuestionChoices({qnum,altr,selected,handleSelected,answerChoice}) {
  if (selected) {
    return (
    <div onClick = {() => handleSelected(altr)} className = {styles.questionchoicediv}>
      <div className = {styles.questionchoiceltractive}>{altr}</div>
      <p className = {styles.answerchoicetxt}>{answerChoice}</p>
    </div>
  );
  } 
  return (
    <div onClick = {() => handleSelected(altr)} className = {styles.questionchoicediv}>
      <div className = {styles.questionchoiceltr}>{altr}</div>
      <p className = {styles.answerchoicetxt}>{answerChoice}</p>
    </div>
  );
}
function AttemptsAccordion({uid,tid}) {
  const [active, setActive] = useState(false);
  const [attemptData, setAttemptData] = useState({});
  const handleActive = () => {
    setActive(!active);
  }
  useEffect(() => {
    async function fetchData() {
      let data = await fetchAttempts(uid,tid);
       console.log(data);
      setAttemptData(data);
    }
    fetchData();
   
  },[uid,tid])

  if (!active) {
    return (
      <div className = {styles.testattemptsdiv}>
        <div className = {styles.attemptsaccordion}>
          <p className = {styles.attemptsaccordiontxt}>{`Past Attempts (${attemptData.length})`}</p>
          <Plus onClick = {() => handleActive()} className = {styles.attemptsaccordionplus} color="#ffffff" />
        </div>
      </div>
    );
  }
  return (
    <div className = {styles.testattemptsdiv}>
      <div className = {styles.attemptsaccordion}>
        <p className = {styles.attemptsaccordiontxt}>View Attempts</p>
        <Plus onClick = {() => handleActive()} className = {styles.attemptsaccordionplus} color="#ffffff" />
        </div>
      {attemptData.map(data => (
        <AttemptsCell key = {data} info = {data}/>
      ))}
    </div>
  );
  
}
function AttemptsCell({info}) {
  return (
    <div className = {styles.testattemptscelldiv}>
      <p className = {styles.testattemptscellcount}>{"Attempt " + info.num}</p>
      <p className = {styles.testattemptscellscore}>60%</p>
    </div>
  );
}
function QuestionMap({selectedAnswers}) {
  return(
    <div className = {styles.questionmapdiv}>
      <div className = {styles.questionmapgrid}>
        {selectedAnswers.map((answer,qnum)=>(
          <QuestionBox key={qnum} qnum={qnum} answerState={answer}/>
        ))}
      </div>
    </div>
  );
}
function QuestionBox({qnum,answerState}) {
  return(
    <div className = {styles.questionboxdiv}>{qnum}</div>
  );
}