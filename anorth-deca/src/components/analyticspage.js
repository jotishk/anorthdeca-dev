'use client'
import styles from '../css/analyticspage.module.css'
import { useRef, useContext, useEffect, useState } from 'react';
import { X, Check, Square } from 'lucide-react';
import { fetchAttempts, fetchQuestions } from '@/lib/firebaseService';

const tidToLabel = {
  100: "2013 ICDC Finance Exam"
}

export function AnalyticsPage({user,tidAnalytic}) {
  const [sessionData,setSessionData] = useState(null);
  const [testData, setTestData] = useState(null);
  const [selectedAttempt,setSelectedAttempt] = useState(1);

  useEffect(() => {
    async function retrieveData() {
      if (tidAnalytic) {
        const retrievedTestData = await fetchQuestions(tidAnalytic);
        const retrievedSessionData = await fetchAttempts(user.uid,tidAnalytic);
        
        setTestData(retrievedTestData);
        setSessionData(retrievedSessionData);
      }
    }
    retrieveData();
  },[tidAnalytic])

  if (tidAnalytic) {
    return (
      <div className = {styles.analyticspagediv}>
        <SelectAnalytic tidAnalytic={tidAnalytic}/>
        <div className = {styles.firstrowanalytics}>
          <ScoreSummary testData = {testData} sessionData={sessionData} selectedAttempt={selectedAttempt}/>
          <CategoriesSummary/>
        </div>
        <QuestionBreakdown/>
      </div>
    );
  }
  return (
    <div className = {styles.analyticspagediv}>
      <SelectAnalytic tidAnalytic={tidAnalytic}/>
    </div>
  );
}
function ScoreSummary({sessionData,selectedAttempt,testData}) {
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
      
        
      for (let i =1; i<101; i++) {
        console.log(testData);
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
      return {
        correct:correct,
        incorrect: incorrect,
        unanswered: unanswered
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
      <div className={styles.semidonut}>
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
function CategoriesSummary() {
  return (
    <div className = {styles.categoriesdiv}>
      <div className = {styles.cardheaderdiv} style={{ alignSelf: 'flex-start', width: '100%' }}>
        <p className={styles.analyticscardheader} style={{ textAlign: 'left', margin: 0 }}>
          Categories Summary
        </p>
      </div>
      <CategoriesGraph numCorrect = {22} numTotal={22} label = {'Financial-Information Management'}/>
      <CategoriesGraph numCorrect = {15} numTotal={18} label = {'Marketing'}/>

    </div>
  );
}
function SelectAnalytic({tidAnalytic}) {
  return(
    <div className = {styles.selectattemptdiv}> 
      <p className = {styles.selectattemptheader}>{tidToLabel[tidAnalytic]}</p>
      <SelectAttemptDropdown/>
    </div>
  );
} 

function SelectAttemptDropdown() {
  return(
    <div className = {styles.selectattemptdropdown}>
      <p className = {styles.selectattempttxt}>Attempt 1</p>
      <img className = {styles.dropdownicon} src = "/sidebar/dropdownicon.png"></img>
    </div>
  );
}
function CategoriesGraph({label, numCorrect, numTotal}) {
  return (
    <div className={styles.categoriesgraphrow}>
      <p className={styles.categoriesgraphlabel}>{label + ' (' + numCorrect + '/' + numTotal + ')'}</p>
      <div style={{ width: `${numCorrect*20/numTotal}rem` }} className={styles.categoriesgraphbox}></div>
    </div>
  );
}
function QuestionBreakdown() {
  const [qnum,setQnum] = useState(1);
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
            {/* {questionData["questions"][`q${qnum}`]} */}
            Lucy authorized her accountant, attorney, and life-insurance agent to care for her assets and make decisions regarding her money and property. Her accountant, attorney, and life-insurance agent are her
          </p>
          <div className = {styles.questionchoicesdiv}>
            <QuestionChoices qnum={qnum} altr = {'A'} selected={true} status = {'correct'} answerChoice={'This is an answer choice'}/>
            <QuestionChoices qnum={qnum} altr = {'B'} selected={true} status = {'incorrect'} answerChoice={'This is an answer choice'}/>
            <QuestionChoices qnum={qnum} altr = {'C'} selected={true} answerChoice={'This is an answer choice'}/>
            <QuestionChoices qnum={qnum} altr = {'D'} selected={true} answerChoice={'This is an answer choice'}/>
          </div>
          
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
          <p className = {styles.qpaneldescriptionsource}>Source: BL:002, Miller, R.L., & Jentz, G.A. (2005). Fundamentals of business law (6th ed.) [pp. 152-153].</p>
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
        <div className = {styles.questionchoiceltractive}>{altr}</div>
        <p className = {styles.answerchoicetxt}>{answerChoice}</p>
      </div>
    );
  } 
  if (status === 'incorrect') {
    return (
      <div className = {styles.questionchoicediv}>
        <div className = {styles.questionshaderred}></div>
        <X className = {styles.questionxmark} strokeWidth={3} />
        <div className = {styles.questionchoiceltractive}>{altr}</div>
        <p className = {styles.answerchoicetxt}>{answerChoice}</p>
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