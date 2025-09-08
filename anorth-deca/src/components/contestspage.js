'use client'
import styles from '../css/contestspage.module.css'
import { useRef, useContext, useEffect, useState } from 'react';
import { X, Plus } from 'lucide-react';

export function ContestsPage({user}) {
  const [filter,setFilter] = useState('upcoming');
  const [createContestPanel,setCreateContestPanel] = useState(false);
  const [status, setStatus] = useState('Start');
  const [session, setSession] = useState(null);
  const handleCreateContest = () => {
    setCreateContestPanel(!createContestPanel);
  }
  const handleFilter = (curr) => {
    if (curr === 'upcoming') {
      setFilter('past');
    } else {
      setFilter('upcoming');
    }
  }
  const handleContestStatus = (cid) => {
    
    setStatus(cid);
  }
  if (status !== 'Start') {
    return(
      <div className = {styles.contestpagediv}>
        <ActiveContest cid = {status}/>
      </div>
    )
  }
  return(
    <div className = {styles.contestpagediv}>
      <div className = {styles.contestpagescrollable}>
        <div className = {styles.contestpageheaderdiv}>
          <p className = {styles.contestpageheadertxt}>Virtual Contests</p>
        </div>
        <div className={styles.contestpagecontentheader}>
          <div className = {styles.contestpagefilterdiv}>
            <div onClick = {() => handleFilter('past')} style = {{backgroundColor: filter === 'upcoming'? "blue": "white", color: filter === 'upcoming' ? "white":"black"}} className = {styles.contestpagefilterupcoming}>
              <p className = {styles.contestpagefiltertxt}>Upcoming</p>
            </div>
            <div onClick = {() => handleFilter('upcoming')} style = {{backgroundColor: filter === 'past'? "blue": "white", color: filter === 'past' ? "white":"black"}} className = {styles.contestpagefilterpast}>
              <p className = {styles.contestpagefiltertxt}>Past</p>
            </div>
          </div>
          <button onClick={() => handleCreateContest()} className = {styles.addcontestbtn}>
            <Plus color='white'/>
          </button>
        </div>
        
        {/* {filter === 'upcoming' && 

        } */}
        <div className = {styles.contestlistdiv}>
          <div className = {styles.contestdisplaydiv}>
            <div className = {styles.contestdisplaydivleft}>
              <img className = {styles.contestdisplayoverlay} src="/images/deca2026NEW.jpg"/>
              <p className = {styles.contestdisplaytitle}>February Contest (Monthly)</p>
            </div>
            <div className = {styles.contestdisplaydivright}>
              <div className = {styles.contestdisplaydivrightcontent}>
                <div className = {styles.contestdisplaydivrightbtnrow}>
                  <BlueBtn className = {styles.contestdisplaybtn} txt = {'View'}/>
                  <BlueBtn onClick = {() => handleContestStatus('500')} className = {styles.contestdisplaybtn} txt = {'Start'}/>
                </div>
                
                <p className = {styles.contestdisplaydatetxt}>Saturday 8/21/2025</p>
                <p className = {styles.contestdisplaytimetxt}>6am-12pm</p>
              </div>

            </div>
          </div>
        </div>
        <CreateContest handleCreateContest = {handleCreateContest} active = {createContestPanel}/>

      </div>
    </div>
  )
}
function ActiveContest({cid}) {
  return (
    <QuestionPanel qnum = {1} 
    selectedAnswers={{
      q1: 'A'
    }}
    questionData={{
      choices: {
        q1: {
          'A': 'A',
          'B': 'A',
          'C': 'A',
          'D': 'A',
        }
      },
      questions: {
        q1:'This is a question'
      }
    }}/>
  )
}
function QuestionPanel({qnum, setQnum, handleQuestionMap, selectedAnswers, setSelectedAnswers, questionData}) {
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
  if (questionData) {
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
        {/* <QuestionPanelBtm handleQuestionMap = {handleQuestionMap} qnum = {qnum} handleQuestion = {handleQuestion}/> */}
      </div>
    );
  }
  
}
function QuestionChoices({qnum,altr,selected,handleSelected,answerChoice}) {
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
function CreateContest({active,handleCreateContest}) {
  if (active) {
    return (
      <div className = {styles.createcontestpaneldiv}>
        <X className = {styles.createcontestexit} onClick={() => handleCreateContest()}/>
        <p className = {styles.createcontestpanelheader}>Create Contest</p>
        <input className = {styles.createcontestpaneltitle} placeholder="Event Name" type="text"/>
        <input className = {styles.createcontestpaneldate} type ="date"/>
        <div className = {styles.createcontestpaneltimerow}>
          <input className = {styles.createcontestpanelstart} type ="time"/>
          <input className = {styles.createcontestpanelend} type ="time"/>
        </div>
        <BlueBtn style = {{
          position: "absolute",
          bottom: "1rem"}} 
        className = {styles.createcontestpanelsubmit} txt={'Submit'}/>
      </div>
    )
  }
  
}
function BlueBtn({txt,onClick,style}) {
  return (
    <button style = {style} onClick = {onClick} className = {styles.bluebtn}>
      {txt}
    </button>
  )
}