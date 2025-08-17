'use client'
import { useRef, useContext, useEffect, useState } from 'react';
import styles from '@/app/main/page.module.css';
import { submitTest, fetchAttempts, createSession, retrieveSession, fetchQuestions, saveSelectedAnswers } from '@/lib/firebaseService';
import { X,ChevronUp,Clock,Plus, MoveLeft, MoveRight } from 'lucide-react';
import { tidToLabel, cidToLabel } from '@/constants/constants';


export function TestPage({tid,user,active, setActive}) {
  
  const [status, setStatus] = useState('Start');
  const [session, setSession] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [questionData, setQuestionData] = useState({});
  const [questionMap,setQuestionMap] = useState(false);
  const [qnum, setQnum] = useState(1);

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
    
    
  },[user,tid,active])

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
    if (user && status === 'Start') {
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

  const handleQuestionMap = () => {
    setQuestionMap(!questionMap)
  }

  const submitSession = async () => {
    await submitTest(user.uid, session.id, tid, selectedAnswers);
    setActive(false);
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
            <span className = {styles.testdescriptionhighlight}>{`${tidToLabel[tid].split(" ")[0]} ${tidToLabel[tid].split(" ")[1]}`}</span>
            {` administration of the exam from the 
            ${tidToLabel[tid].split(" ")[2]} cluster.`}
          </p>
          <AttemptsAccordion user = {user} tid = {tid}/>
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
      {/* <p className = {styles.testpageinfo}>{questionData["category"] + " > " + tidToLabel[tid]}</p> */}
      <QuestionPanel qnum = {qnum} setQnum = {setQnum} handleQuestionMap = {handleQuestionMap} questionData = {questionData} setSelectedAnswers = {setSelectedAnswers} selectedAnswers = {selectedAnswers}/>
      {questionMap ? <QuestionMap submitSession = {submitSession} setQnum = {setQnum} handleQuestionMap = {handleQuestionMap} selectedAnswers = {selectedAnswers}/> : null }
      {questionMap ? <div className = {styles.coverup}></div>: null }
    </div>
  )
}
export function QuestionPanel({qnum, setQnum, handleQuestionMap, selectedAnswers, setSelectedAnswers, questionData}) {
  const [selected,setSelected] = useState([false,false,false,false]);
  
                        
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
      <QuestionPanelBtm handleQuestionMap = {handleQuestionMap} qnum = {qnum} handleQuestion = {handleQuestion}/>
    </div>
  );
}
export function QuestionPanelBtm({qnum,handleQuestion, handleQuestionMap}) {
  if (qnum === 1) {
    return (
      <div className = {styles.questionpanelbtmdiv}>
        <BlackDropBox onClick = {handleQuestionMap} txt = {`Question ${qnum} of 100`}/>
        <BlueBtn txt = {'Next'} onClick = {() => handleQuestion(qnum,1)}/>
      </div>
    );
  }
  if (qnum === 100) {
    return (
      <div className = {styles.questionpanelbtmdiv}>
        <BlueBtn txt = {'Back'} onClick = {() => handleQuestion(qnum,-1)}/>
        <BlackDropBox onClick = {handleQuestionMap} txt = {`Question ${qnum} of 100`}/>
      </div>
    );
  }
  return (
    <div className = {styles.questionpanelbtmdiv}>
      <BlueBtn txt = {'Back'} onClick = {() => handleQuestion(qnum,-1)}/>
      <BlackDropBox onClick = {handleQuestionMap} txt = {`Question ${qnum} of 100`}/>
      <BlueBtn txt = {'Next'} onClick = {() => handleQuestion(qnum,1)}/>
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
function AttemptsAccordion({user,tid}) {
  const [active, setActive] = useState(false);
  const [attemptData, setAttemptData] = useState({});
  const handleActive = () => {
    setActive(!active);
  }
  useEffect(() => {
    async function fetchData() {
      console.log(user);
      let data = await fetchAttempts(user.uid,tid);
      setAttemptData(data);
    }
    if (user) {
      fetchData();
    }
  },[user,tid])

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
        <p className = {styles.attemptsaccordiontxt}>{`Past Attempts (${attemptData.length})`}</p>
        <Plus onClick = {() => handleActive()} className = {styles.attemptsaccordionplus} color="#ffffff" />
        </div>
      {attemptData.map(data => (
        <AttemptsCell key = {data.num} info = {data}/>
      ))}
    </div>
  );
  
}
function AttemptsCell({info}) {
  return (
    <div className = {styles.testattemptscelldiv}>
      <p className = {styles.testattemptscellcount}>{"Attempt " + info.num}</p>
      <p className = {styles.testattemptscellscore}>{`${info.score}%`}</p>
    </div>
  );
}
function QuestionMap({submitSession, selectedAnswers,handleQuestionMap,setQnum}) {
  const [mapPage, setMapPage] = useState(1);
  const handleMapPage = () => {
    if (mapPage == 1) {
      setMapPage(2);
    } else {
      setMapPage(1);
    }
  }
  
  return(
    <div className = {styles.questionmapdiv}>
      <p className = {styles.questionmapheader}>
        Review your answers
        <X onClick = {handleQuestionMap} className = {styles.questionmapexit}/>
      </p>
      <div className = {styles.questionmapgrid}>
        {Object.entries(selectedAnswers).map((answer, qnum) =>
          (mapPage && 50 * (mapPage-1) <= qnum  && qnum < 50 * mapPage) ? (
            <QuestionBox handleQuestionMap = {handleQuestionMap} setQnum = {setQnum} key={qnum} qnum={qnum + 1} answerState={selectedAnswers[`q${qnum+1}`]}/>
          ) : null
        )}
      </div>
      <div className = {styles.questionmapbtm}>
        <BlackDropBox onClick = {() => handleMapPage()} txt = {(mapPage == 1) ? 'Questions 1 - 50' : 'Questions 50 - 100'}/>
        <BlueBtn onClick = {submitSession} txt = {'Submit'}/>
      </div>
    </div>
  );
}
function QuestionBox({qnum,answerState,setQnum, handleQuestionMap}) {
  const switchQuestion = () => {
    handleQuestionMap();
    setQnum(qnum);
  }
  if (answerState == "") {
    return(
      <div onClick = {switchQuestion} className = {styles.questionboxdivempty}>{qnum}</div>
    );
  } else {
    return(
      <div onClick = {switchQuestion}className = {styles.questionboxdivfull}>{qnum}</div>
    );
  }
}
function BlackDropBox({txt,children, onClick}) {
  return (
    <button className = {styles.blackdropbox} onClick={onClick}>
      {txt}
      <ChevronUp className = {styles.blackdropboxchevron} size={'20px'}/>
    </button>
  );
}
function BlueBtn({txt,onClick}) {
  return (
    <button onClick = {onClick} className = {styles.bluebtn}>
      {txt}
    </button>
  )
}