'use client';
import styles from '../css/quickpracticepage.module.css'
import { useRef, useContext, useEffect, useState } from 'react';
import { ChevronUp, X, Check, Square } from 'lucide-react';
import { retrieveQuestionBank, printCategories, retrieveSession,retrieveAllSessions, saveSelectedAnswers } from '@/lib/firebaseService';
import { tidToLabel, cidToLabel } from '@/constants/constants';


export function QuickPracticePage({user}) {
  const [ready, setReady] = useState(false);
  const [questionData,setQuestionData] = useState({});
  const [selected, setSelected] = useState([]);
  const [notSelected, setNotSelected] = useState([
    'Business Law',
    'Channel Management',
    'Communications',
    'Customer Relations',
    'Economics',
    'Emotional Intelligence',
    'Entrepreneurship',
    'Financial Analysis',
    'Financial-Info Management',
    'Human Resources Management',
    'Information Management',
    'Knowledge Management',
    'Marketing',
    'Marketing Info-Management',
    'Marketing Planning',
    'Operations',
    'Pricing',
    'Product/Service Management',
    'Professional Development',
    'Project Management',
    'Promotion',
    'Quality Management',
    'Risk Management',
    'Selling',
    'Strategic Management'
  ]);
  const [inprogress, setInprogress] = useState(true);
  const [questionMap, setQuestionMap] = useState(false);                 

  const handleQuestionMap = () => {
    setQuestionMap(!questionMap)
  }
  useEffect(() => {
    fetch("/questions.json")
      .then(res => res.json())
      .then(data => {
        // Store globally for fast access
        window.ALL_QUESTIONS = Object.values(data);
        setReady(true);
      });
  }, []);
  useEffect(() => {
    if (ready) {
      generateQuestion(notSelected);
    }
  },[ready])
  // function generateQuestion(bank) {
    
  //   if (bank && Object.keys(bank).length > 0) {
  //     let filtered = {}
  //     for (const qid in bank) {
  //       if (selected.includes(cidToLabel[bank[qid]["scode"].substring(0,2)])) {
  //         filtered[qid] = bank[qid];
  //       }
  //     }
  //     const keys = Object.keys(filtered);     
  //     const randomKey = keys[Math.floor(Math.random() * keys.length)];
  //     const randomQuestion = filtered[randomKey];
  //     setQuestionData(randomQuestion);
  //   }
  // } 
  function generateQuestion(selected) {
    
    if (!window.ALL_QUESTIONS || window.ALL_QUESTIONS.length === 0) return;

    // filtered pool based on selected filters
    let filtered = [];
    if (selected.length === 0) {
      filtered = window.ALL_QUESTIONS;
    } else {
      filtered = window.ALL_QUESTIONS.filter(q => {
        if ("scode" in q) {
          const category = cidToLabel[q.scode.substring(0, 2)];
          return selected.includes(category);
        }
        return false;
      });
    }
    
    if (filtered.length === 0) return;

    // pick a random question
    const randomQuestion = filtered[Math.floor(Math.random() * filtered.length)];
    setQuestionData(randomQuestion);
  }
  
  
  return (
    <>
      <FilterBar selected={selected} notSelected={notSelected} setNotSelected={setNotSelected} setSelected={setSelected} user={user} />
      <div className={styles.quickpracticepagediv}>
        {questionData && Object.keys(questionData).length > 0 && (
          <QuestionPanel selectedFilters = {selected} handleQuestionMap = {handleQuestionMap} generateQuestion = {generateQuestion} inprogress = {inprogress} setInprogress = {setInprogress} questionData={questionData} />
        )}
        {questionMap ? <QuestionMap  handleQuestionMap = {handleQuestionMap} questionData={questionData}/> : null }
        {questionMap ? <div className = {styles.coverup}></div>: null }

      </div>
    </>
  )
}

function FilterBar({selected, notSelected, setSelected, setNotSelected, user}) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  

  const handleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  }
  const sortAlpha = (arr) =>
    arr.slice().sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

  const addFilter = (filter) => {
    setSelected((prev) => sortAlpha([...prev, filter]));
    setNotSelected((prev) => sortAlpha(prev.filter((item) => item !== filter)));
  };

  const removeFilter = (filter) => {
    setNotSelected((prev) => sortAlpha([...prev, filter]));
    setSelected((prev) => sortAlpha(prev.filter((item) => item !== filter)));
  };
  const handleChangeAndDropdown = (filter) => {
    addFilter(filter);
    handleDropdown();   
  };
  return (
    <div className = {styles.filterbardiv}>
      <div className = {styles.filterbarheaderdiv}>
        <p className = {styles.filterbarheadertxt}>Select Filters</p>
      </div>
      <div className = {styles.filtersection}>
        <div className = {styles.totalDropdown}>
          <SelectFiltersDropdown onClick={handleDropdown} selected = {selected} notSelected = {notSelected} setSelected={setSelected} setNotSelected={setNotSelected} />
          <DropDown handleChange = {handleChangeAndDropdown} visible = {dropdownVisible} selected = {selected} notSelected = {notSelected} setSelected={setSelected} setNotSelected={setNotSelected} />
        </div>
      </div>
      <div className={styles.chosenfiltersdiv}>
        {selected.map((item, index) => (
          <FilterCard
            key={index}
            label={item}
            onClick={removeFilter}
          />
        ))}
      </div>
    </div>
  )
}
function SelectFiltersDropdown({ onClick, selected, notSelected, setSelected, setNotSelected }) {
  return(
    <div className={styles.selectfilterdropdown} onClick={onClick}>
      <p className={styles.selectfiltertxt}>{'Categories'}</p>
      <img className={styles.dropdownicon} src="/sidebar/dropdownicon.png" />
    </div>
  )
}
function DropDown({visible, handleChange, selected, notSelected, setSelected, setNotSelected }) {
  

  if (visible) {
    return (
      <div className = {styles.dropdownoptions}>
        {notSelected.map((txt,idx) => 
          <div key = {idx+1} onClick = {() => handleChange(txt)} className = {styles.catOption}>{txt}</div>
        )}
      </div>
    );
  }
  return null;
}
function FilterCard({label, onClick}) {
  return (
    <div className = {styles.filtercard} >
      <X size={20} onClick={() => onClick(label)}/>
      <p className = {styles.filtercardtxt}>{label}</p>
    </div>
  )
}
export function QuestionPanel({selectedFilters,handleQuestionMap, generateQuestion,inprogress, setInprogress,questionData}) {
  const [selected,setSelected] = useState([false,false,false,false]);
  const [status,setStatus] = useState({});

  const moveQuestion = () => {
    setSelected([false,false,false,false]);
    setInprogress(true);
    generateQuestion(selectedFilters);
  }
  const checkAnswer = () => {
    let statusObject = {
      'A': 'ns',
      'B': 'ns',
      'C': 'ns',
      'D': 'ns'
    };
    let currSelected = null;
    if (selected[0]) {
      currSelected = 'A';
    } else if (selected[1]) {
      currSelected = 'B';
    } else if (selected[2]) {
      currSelected = 'C';
    } else if (selected[3]) {
      currSelected = 'D';
    } else {
      currSelected = '';
    }
    if (currSelected == questionData["answer"]) {
      statusObject[currSelected] = 'correct';
    } else if (selected == '') {
      statusObject[questionData["answer"]] = 'correct';
    } else {
      statusObject[currSelected] = 'incorrect';
      statusObject[questionData["answer"]] = 'correct';
    }
    setStatus(statusObject);
    setInprogress(false);
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
  }
  
  
  return (
    <div className = {styles.questionpanel}>
      <p className = {styles.questiontitle}>
        {cidToLabel[questionData["scode"].substring(0,2)]}
      </p>
      <p className = {styles.questioncontent}>{questionData["questionText"]}</p>
      <div className = {styles.questionchoicesdiv}>
        <QuestionChoices status = {status['A']} questionData = {questionData} inprogress = {inprogress} answerChoice = {questionData["choices"]["A"]} handleSelected = {handleSelected} selected = {selected[0]} altr = {'A'}/>
        <QuestionChoices status = {status['B']} questionData = {questionData} inprogress = {inprogress} answerChoice = {questionData["choices"]["B"]} handleSelected = {handleSelected} selected = {selected[1]} altr = {'B'}/>
        <QuestionChoices status = {status['C']} questionData = {questionData} inprogress = {inprogress} answerChoice = {questionData["choices"]["C"]} handleSelected = {handleSelected} selected = {selected[2]} altr = {'C'}/>
        <QuestionChoices status = {status['D']} questionData = {questionData} inprogress = {inprogress} answerChoice = {questionData["choices"]["D"]} handleSelected = {handleSelected} selected = {selected[3]} altr = {'D'}/>
      </div> 
      <QuestionPanelBtm checkAnswer = {checkAnswer} moveQuestion = {moveQuestion} inprogress = {inprogress} handleQuestionMap = {handleQuestionMap} />

    </div>
  );
}
export function QuestionPanelBtm({checkAnswer, moveQuestion, inprogress, handleQuestionMap}) {
  if (inprogress) {
    return (
      <div className = {styles.questionpanelbtmdiv}>
        <BlackDropBox onClick = {checkAnswer} txt = {`Check Answer`}/>
      </div>
    );
  }
  return (
    <div className = {styles.questionpanelbtmdiv}>
      <BlackDropBox onClick = {handleQuestionMap} txt = {"View Explanation"}/>
      <BlueBtn txt = {'Continue'} onClick = {() => moveQuestion()}/>
    </div>
  );
}
export function QuestionChoices({status,questionData,inprogress, altr,selected,handleSelected,answerChoice}) {
  if (!inprogress) {
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
          {!selected && <div className = {styles.questionchoiceltr}>{altr}</div>}        
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

function BlackDropBox({txt,children, onClick}) {
  return (
    <button className = {styles.blackdropbox} onClick={onClick}>
      {txt}
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

function QuestionMap({handleQuestionMap,questionData}) {
  return(
    <div className = {styles.questionmapdiv}>
      <p className = {styles.questionmapheader}>
        Explanation
        <X onClick = {handleQuestionMap} className = {styles.questionmapexit}/>
      </p>
      <div className = {styles.questionmapgrid}>
        <p className = {styles.questionexplanationtxt}>{questionData["explanations"]}</p>
      </div>
    </div>
  );
}