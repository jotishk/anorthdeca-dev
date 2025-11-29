'use client';
import styles from '../css/quickpracticepage.module.css'
import { useRef, useContext, useEffect, useState } from 'react';
import { ChevronUp, X, Check, Square } from 'lucide-react';


export function QuickPracticePage({user}) {
  const [questionData,setQuestionData] = useState({});
  return (
    <>
      <FilterBar user = {user}/>
      <div className = {styles.quickpracticepagediv}>

      </div>
    </>
  )
}

function FilterBar({user}) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
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
    'Marketing Information-Management',
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
export function QuestionPanel({selectedAnswers, setSelectedAnswers, questionData}) {
  const [selected,setSelected] = useState([false,false,false,false]);
                      
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
      <p className = {styles.questiontitle}>
        {'Category: ' + qnum}
      </p>
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