'use client'
import styles from '../css/analyticspage.module.css'
import { useRef, useContext, useEffect, useState } from 'react';
import { ChevronUp, X, Check, Square } from 'lucide-react';
import { fetchAttempts, fetchQuestions } from '@/lib/firebaseService';
import { tidToLabel, cidToLabel } from '@/constants/constants';



export function AnalyticsPage({user,tidAnalytic}) {
  const [sessionData,setSessionData] = useState(null);
  const [testData, setTestData] = useState(null);
  const [selectedAttempt,setSelectedAttempt] = useState(0);

  const changeAttempt = (num) => {
    setSelectedAttempt(num);
  }
  useEffect(() => {
    
    async function retrieveData() {
      if (user && tidAnalytic) {
        const retrievedSessionData = await fetchAttempts(user.uid,tidAnalytic);
        const retrievedTestData = await fetchQuestions(tidAnalytic);
        console.log(retrievedSessionData);
        console.log(retrievedTestData);
        
        setSelectedAttempt(0);
        setTestData(retrievedTestData);
        setSessionData(retrievedSessionData);
      }
    }
    retrieveData();
  },[tidAnalytic])

  if (tidAnalytic && selectedAttempt>0) {
    return (
      <div className = {styles.analyticspagediv}>
        <SelectAnalytic sessionData = {sessionData} changeAttempt = {changeAttempt} selectedAttempt = {selectedAttempt} tidAnalytic={tidAnalytic}/>
        <div className = {styles.firstrowanalytics}>
          <ScoreSummary testData = {testData} sessionData={sessionData} selectedAttempt={selectedAttempt}/>
          <CategoriesSummary selectedAttempt = {selectedAttempt} testData={testData} sessionData={sessionData}/>
        </div>
        <QuestionBreakdown selectedAttempt = {selectedAttempt} testData = {testData} sessionData={sessionData}/>
      </div>
    );
  }
  return (
    <div className = {styles.analyticspagediv}>
      <SelectAnalytic  sessionData = {sessionData} changeAttempt = {changeAttempt} selectedAttempt = {selectedAttempt} tidAnalytic={tidAnalytic}/>
    </div>
  );
}
function ScoreSummary({sessionData,selectedAttempt,testData}) {
  const halfCircle = useRef(null);
  function getSession() {
    for (const data of sessionData) {
      if (data['num'] == selectedAttempt) {
        return data;
      }
    }
    return null;
  }
  function getScoreSummary() {
    
    if (sessionData) {
      let correct = 0;
      let incorrect = 0;
      let unanswered = 0;

      const data = getSession();
      
      if (data) {
        for (let i =1; i<101; i++) {
        
          let selectedAnswer = data["answers"][`q${i}`];
          let trueAnswer = testData["anskey"][`q${i}`];
        
          if (selectedAnswer == trueAnswer) {
            correct++;
          } else if (selectedAnswer == "") {
            unanswered++;
          } else {
            incorrect++;
          }
        }
        if (halfCircle.current) {
          halfCircle.current.style.setProperty("--percentage",correct);
        }
        return {
          correct:correct,
          incorrect: incorrect,
          unanswered: unanswered
        }
      }
      
    }
    return {
      correct:0,
      incorrect: 0,
      unanswered: 0
    }
  }
  return (
    <div className={styles.scoresummarydiv}>
      <div className = {styles.cardheaderdiv} style={{ alignSelf: 'flex-start', width: '100%' }}>
        <p className={styles.analyticscardheader} style={{ textAlign: 'left', margin: 0 }}>
          Score Summary
        </p>
      </div>
      <div ref = {halfCircle} className={styles.semidonut}>
        {getScoreSummary()['correct']}
      </div>
      <div className={styles.scoresummarybtm}>
        <div className={styles.scoresummaryinfo}>
          <Square strokeWidth={20} color="#04cb2c" />
          <p className={styles.scoresummaryinfotxt}>{getScoreSummary()['correct']} correct</p>
        </div>
        <div className={styles.scoresummaryinfo}>
          <Square strokeWidth={20} color="rgb(224, 37, 37)" />
          <p className={styles.scoresummaryinfotxt}>{getScoreSummary()['incorrect']} incorrect</p>
        </div>
        <div className={styles.scoresummaryinfo}>
          <Square strokeWidth={20} color="#333333" />
          <p className={styles.scoresummaryinfotxt}>{getScoreSummary()['unanswered']} unanswered</p>
        </div>
      </div>
    </div>
  );
}
function CategoriesSummary({testData, sessionData,selectedAttempt}) {
  const [categoryData, setCategoryData] = useState([]);

  function getSession() {
    if (sessionData) {
      for (const data of sessionData) {
        if (data['num'] == selectedAttempt) {
          return data;
        }
      } 
    }
    return null;
  }
  useEffect(() => {
    const currSession = getSession();
    let categoryData = {};
    if (currSession) {
      for (let i = 1; i<101; i++) {
        let skey = testData["scode"][`q${i}`].substring(0,2);
        
        if (!(skey in categoryData)) {
          categoryData[skey] = {
            correct:0,
            total:0
          }
        }
        categoryData[skey]['total'] = categoryData[skey]['total'] + 1;
        let selectedAnswer = currSession["answers"][`q${i}`];
        let trueAnswer = testData["anskey"][`q${i}`];
        if (selectedAnswer == trueAnswer) {
          categoryData[skey]['correct'] = categoryData[skey]['correct'] + 1;
        }
      }
      const sorted = Object.entries(categoryData)
        .sort((a, b) => b[1].total - a[1].total);
      setCategoryData(sorted);
    }
    
  },[sessionData])
    
    
  
  return (
    <div className = {styles.categoriesdiv}>
      <div className = {styles.cardheaderdiv} style={{ alignSelf: 'flex-start', width: '100%' }}>
        <p className={styles.analyticscardheader} style={{ textAlign: 'left', margin: 0 }}>
          Categories Summary
        </p>
      </div>
      <div className = {styles.categoriesdivcontent}>
        {categoryData.map((category,idx) =>
          <CategoriesGraph key = {idx} numCorrect = {category[1].correct} numTotal={category[1].total} label = {cidToLabel[category[0]]}/>
        )}
      </div>
      
      
    </div>
  );
}
function SelectAnalytic({changeAttempt, tidAnalytic,selectedAttempt,sessionData}) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const handleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  }
  const handleChangeAndDropdown = (num) => {
    changeAttempt(num);
    handleDropdown();
  };

  return(
    <div className = {styles.selectattemptdiv}> 
      <p className = {styles.selectattemptheader}>{tidToLabel[tidAnalytic]}</p>
      <div className = {styles.totalDropdown}>
        <SelectAttemptDropdown selectedAttempt = {selectedAttempt} onClick={handleDropdown} />
        <DropDown handleChange = {handleChangeAndDropdown} sessionData = {sessionData} visible = {dropdownVisible} />
      </div>
    </div>
  );
} 

function SelectAttemptDropdown({ onClick, selectedAttempt }) {
  if (selectedAttempt ==0) {
    return(
      <div className={styles.selectattemptdropdown} onClick={onClick}>
        <p className={styles.selectattempttxt}>{'Select'}</p>
        <img className={styles.dropdownicon} src="/sidebar/dropdownicon.png" />
      </div>
    )

  }
  return(
    <div className={styles.selectattemptdropdown} onClick={onClick}>
      <p className={styles.selectattempttxt}>{'Attempt ' + selectedAttempt}</p>
      <img className={styles.dropdownicon} src="/sidebar/dropdownicon.png" />
    </div>
  );
}
function CategoriesGraph({label, numCorrect, numTotal}) {
  return (
    <div className={styles.categoriesgraphrow}>
      <p className={styles.categoriesgraphlabel}>{label + ' (' + numCorrect + '/' + numTotal + ')'}</p>
      <div className = {styles.categoriesgraphoutline}>
        <div style={{ width: `${numCorrect*20/numTotal}rem` }} className={styles.categoriesgraphbox}></div>
      </div>
    </div>
  );
}
function QuestionBreakdown({selectedAttempt, sessionData,testData}) {
  const [qnum,setQnum] = useState(1);
  const [questionContent,setQuestionContent] = useState('');
  const [answerChoiceText, setAnswerChoiceText] = useState({});
  const [selected, setSelected] = useState({});
  const [status,setStatus] = useState({});
  const [categoryText, setCategoryText] = useState('');
  const [questionMap,setQuestionMap] = useState(false);
  const [answerStates, setAnswerStates] = useState({});

  const handleQuestionMap = () => {
    setQuestionMap(!questionMap)
  }
  const handleQuestion = (curr,direction)=> {
    const newNum = curr + direction;
    setQnum(newNum);
  }
  function getSession() {
    for (const data of sessionData) {
      if (data['num'] == selectedAttempt) {
        return data;
      }
    }
    return null;
  }

  useEffect(() => {
    if (sessionData) {
      const data = getSession();
      if (data) {
        let answerStatesObject = {};
        for (let i = 1; i<101; i++) {
          const currSelected = data["answers"][`q${i}`];

          if (currSelected == testData['anskey'][`q${i}`]) {
            answerStatesObject[`q${i}`] = 'correct';
          } else if (currSelected == '') {
            answerStatesObject[`q${i}`] = 'unanswered';
          } else {
            answerStatesObject[`q${i}`] = 'incorrect';
          }
        }
        setAnswerStates(answerStatesObject);
      }
      
    }
  },[sessionData])
  useEffect(() => {
    if (sessionData) {
      let choices = {};
      let statusObject = {
        'A': 'ns',
        'B': 'ns',
        'C': 'ns',
        'D': 'ns'
      };
      let selectedObject = {
        'A':false,
        'B':false,
        'C':false,
        'D':false
      };
      const data = getSession();
      if (data) {
        choices['A'] = testData['choices'][`q${qnum}`]['A'];
        choices['B'] = testData['choices'][`q${qnum}`]['B'];
        choices['C'] = testData['choices'][`q${qnum}`]['C'];
        choices['D'] = testData['choices'][`q${qnum}`]['D'];

        const currSelected = data["answers"][`q${qnum}`];
        if (currSelected) {
          selectedObject[currSelected] = true;
        }

        if (currSelected == testData['anskey'][`q${qnum}`]) {
          statusObject[currSelected] = 'correct';
        } else if (selected == '') {
          statusObject[testData['anskey'][`q${qnum}`]] = 'correct';
        } else {
          statusObject[currSelected] = 'incorrect';
          statusObject[testData['anskey'][`q${qnum}`]] = 'correct';
        }
        setQuestionContent(testData['questions'][`q${qnum}`]);
        setAnswerChoiceText(choices);
        setSelected(selectedObject);
        setStatus(statusObject);
      }
      
    }
  }, [qnum,sessionData])
  return(
    <div className = {styles.questionbreakdowndiv}>
      <div className = {styles.cardheaderdiv} style={{ alignSelf: 'flex-start', width: '100%' }}>
        <p className={styles.analyticscardheader} style={{ textAlign: 'left', margin: 0 }}>
          Question Breakdown
        </p>
      </div>
      <div className = {styles.questionbreakdowncontent}>
        <div className = {styles.questionpanel}>
          <p className = {styles.questiontitle}>{'Question ' + qnum}</p>
          <p className = {styles.questioncontent}>
            {questionContent}
          </p>
          <div className = {styles.questionchoicesdiv}>
            <QuestionChoices qnum={qnum} altr = {'A'} selected={selected['A']} status = {status['A']} answerChoice={answerChoiceText['A']}/>
            <QuestionChoices qnum={qnum} altr = {'B'} selected={selected['B']} status = {status['B']} answerChoice={answerChoiceText['B']}/>
            <QuestionChoices qnum={qnum} altr = {'C'} selected={selected['C']} status = {status['C']} answerChoice={answerChoiceText['C']}/>
            <QuestionChoices qnum={qnum} altr = {'D'} selected={selected['D']} status = {status['D']} answerChoice={answerChoiceText['D']}/>
          </div>
          <QuestionPanelBtm handleQuestionMap = {handleQuestionMap} qnum = {qnum} handleQuestion = {handleQuestion}/>
          {questionMap ? <QuestionMap answerStates = {answerStates} setQnum = {setQnum} handleQuestionMap = {handleQuestionMap}/> : null }
          
        </div>
        <div className = {styles.questionpaneldescription}>
          <p className = {styles.qpaneldescriptionheader}>Explanation:</p>
          <p className = {styles.qpaneldescriptiontxt}> 
            In a private enterprise system, an unequal distribution of income exists because 
            workers with high levels of education, training, skills, and efficiency generally receive higher salaries than 
            less qualified workers. Some people own a great deal of property while others own little or none because 
            they do not have the money to buy it. Skilled workers may also pay higher taxes, belong to a union, or 
            work longer hours, but those factors do not affect the distribution of property and income
          </p>
          <p className = {styles.qpaneldescriptionsource}>Category: {categoryText}</p>
        </div>
      </div>
      
    </div>
  );
}
function QuestionChoices({qnum,altr,status, selected,answerChoice}) {
  if (status === 'correct') {
    return (
      <div className = {styles.questionchoicediv}>
        <div className = {styles.questionshadergreen}></div>
        <Check className = {styles.questioncheckmark} strokeWidth={3} />
        {selected && <div className = {styles.questionchoiceltractive}>{altr}</div>}
        {!selected && <div className = {styles.questionchoiceltr}>{altr}</div>}
        <p className = {styles.answerchoicetxt}>{answerChoice}</p>
      </div>
    );
  } 
  if (status === 'incorrect') {
    return (
      <div className = {styles.questionchoicediv}>
        <div className = {styles.questionshaderred}></div>
        <X className = {styles.questionxmark} strokeWidth={3} />
        {selected && <div className = {styles.questionchoiceltractive}>{altr}</div>}
        {!selected && <div className = {styles.questionchoiceltr}>{altr}</div>}        <p className = {styles.answerchoicetxt}>{answerChoice}</p>
      </div>
    );
  } 
  return (
    <div className = {styles.questionchoicediv}>
      <div className = {styles.questionchoiceltr}>{altr}</div>
      <p className = {styles.answerchoicetxt}>{answerChoice}</p>
    </div>
  );
}
function QuestionPanelBtm({qnum,handleQuestion, handleQuestionMap}) {
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
function QuestionMap({handleQuestionMap,setQnum,answerStates}) {
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
        Question Map
        <X onClick = {handleQuestionMap} className = {styles.questionmapexit}/>
      </p>
      <div className = {styles.questionmapgrid}>
        {Object.entries(answerStates).map((answer, qnum) =>
          (mapPage && 50 * (mapPage-1) <= qnum  && qnum < 50 * mapPage) ? (
            <QuestionBox handleQuestionMap = {handleQuestionMap} setQnum = {setQnum} key={qnum} qnum={qnum + 1} answerState={answerStates[`q${qnum+1}`]}/>
          ) : null
        )}
      </div>
      <div className = {styles.questionmapbtm}>
        <BlackDropBox onClick = {() => handleMapPage()} txt = {(mapPage == 1) ? 'Questions 1 - 50' : 'Questions 50 - 100'}/>
      </div>
    </div>
  );
}
function QuestionBox({qnum,answerState,setQnum, handleQuestionMap}) {
  const switchQuestion = () => {
    handleQuestionMap();
    setQnum(qnum);
  }
  if (answerState == "correct") {
    return(
      <div onClick = {switchQuestion} className = {styles.questionboxdivcorrect}>{qnum}</div>
    );
  } 
  if (answerState == "incorrect") {
    return(
      <div onClick = {switchQuestion}className = {styles.questionboxdivincorrect}>{qnum}</div>
    );
  }
  return(
    <div onClick = {switchQuestion}className = {styles.questionboxdivunanswered}>{qnum}</div>
  );
}
function DropDown({visible, handleChange, sessionData}) {
  const [attempts,setAttempts] = useState([]);

  useEffect(() => {
    if (sessionData) {
      let attemptsList = [];
      for (let i = 0; i<sessionData.length; i++) {
        attemptsList.push(`Attempt ${i+1}`);
      }
      setAttempts(attemptsList);
    }
  },[sessionData])
  if (visible) {
    return (
      <div className = {styles.dropdownoptions}>
        {attempts.map((txt,idx) => 
          <div key = {idx+1} onClick = {() => handleChange(idx+1)} className = {styles.catOption}>{txt}</div>
        )}
      </div>
    );
  }
  return null;
}