'use client'
import { useState } from 'react';
import styles from './page.module.css';
import { Settings, ClipboardPen, ChartGantt, Zap, School, Dot, MoveLeft, MoveRight } from 'lucide-react';
export default function Main() {
  const [page,setPage] = useState('tests');
  const [tid, setTid] = useState('');

  const handleTestChange = (tid) => {
    setTid(tid);
  }
  if (page === 'tests') {
    return (
      <div className = {styles.main}>
        <Header/>
        <TestSidebar handleTestChange = {handleTestChange} page = {page}/>
        <TestPage tid = {tid}/>
      </div>
      
    );
  }
  
  
}
function TestPage({tid}) {
  const [active, setActive] = useState(false);
  const [qnum, setQnum] = useState(1);
  const handleActive = () => {
    setActive(!active); 
  }
  if (tid === '') {
    return <div className = {styles.testpagediv}></div>
  }
  if (!active) {
    return (
      <div className = {styles.testpagediv}>
        <div className = {styles.testpageNAmid}>
          <p className = {styles.testtitleNA}>2018 ICDC Finance</p>
          <button onClick = {handleActive} className = {styles.testbuttonNA}>Continue</button>
        </div>
      </div>
    );
  }
  return (
    <div className = {styles.testpagediv}>
      <QuestionPanel qnum = {qnum}/>
    </div>
  )
}
function QuestionPanel({qnum}) {
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
  }
  return (
    <div className = {styles.questionpanel}>
      <p className = {styles.questiontitle}>{'Question ' + qnum}</p>
      <p className = {styles.questioncontent}>"The hum to all employees stating that they will need to park on the street on Tuesday because the maintenance department will be repairing the company's parking lot. This is an example of a(n)"</p>
      <div className = {styles.questionchoicesdiv}>
        <QuestionChoices handleSelected = {handleSelected} selected = {selected[0]} qnum = {qnum} altr = {'A'}/>
        <QuestionChoices handleSelected = {handleSelected} selected = {selected[1]} qnum = {qnum} altr = {'B'}/>
        <QuestionChoices handleSelected = {handleSelected} selected = {selected[2]} qnum = {qnum} altr = {'C'}/>
        <QuestionChoices handleSelected = {handleSelected} selected = {selected[3]} qnum = {qnum} altr = {'D'}/>
      </div> 
      <QuestionPanelBtm qnum = {qnum}/>
    </div>
  );
}
function QuestionPanelBtm({qnum}) {
  if (qnum === 1) {
    return (
      <div className = {styles.questionpanelbtmdiv}>
        <button className = {styles.questionpanelnextbtn}><MoveRight size = "35px" color = "white"/></button>
      </div>
    );
  }
  if (qnum === 100) {
    return (
      <div className = {styles.questionpanelbtmdiv}>
        <button className = {styles.questionpanelnextbtn}><MoveLeft size = "35px" color = "white"/></button>
      </div>
    );
  }
  return (
    <div className = {styles.questionpanelbtmdiv}>
      <button className = {styles.questionpanelnextbtn}><MoveLeft size = "35px" color = "white" /></button>
      <button className = {styles.questionpanelnextbtn}><MoveRight size = "35px" color = "white"/></button>
    </div>
  );
}
function QuestionChoices({qnum,altr,selected,handleSelected}) {
  if (selected) {
    return (
    <div onClick = {() => handleSelected(altr)} className = {styles.questionchoicediv}>
      <div className = {styles.questionchoiceltractive}>{altr}</div>
      <p className = {styles.answerchoicetxt}>Insert Answer Choice Here</p>
    </div>
  );
  } 
  return (
    <div onClick = {() => handleSelected(altr)} className = {styles.questionchoicediv}>
      <div className = {styles.questionchoiceltr}>{altr}</div>
      <p className = {styles.answerchoicetxt}>Insert Answer Choice Here</p>
    </div>
  );
}
function Header() {
  return (
    <div className = {[styles.header]}>
      <img className = {styles.headerlogo} src="/header/HeaderLogo.png" />
      <p className = {styles.headerlogotext}>Appleton North Deca</p>
      <div className = {[styles.headerrightsection]}>
        <HeaderNav className = {styles.headernav} txt = {'Tests'}/>
        <HeaderNav className = {styles.headernav} txt = {'Analytics'}/>
        <HeaderNav className = {styles.headernav} txt = {'Quick Practice'}/>
        <HeaderNav className = {styles.headernav} txt = {'Chapters'}/>
        <HeaderNav className = {styles.headernav} txt = {'Settings'}/>
      </div>
    </div>
  );
}
function HeaderNav({txt}) {
  if (txt === 'Settings') {
    return <Settings className = {styles.settingsicon} size={30}/>;
  }
  if (txt === 'Analytics') {
    return (
      <div className={styles.headernav}>
        <ChartGantt />
        <p className = {styles.headernavtxt}>{txt}</p>
      </div>
    );
  }
  if (txt === 'Quick Practice') {
    return (
      <div className={styles.headernav}>
        <Zap /> 
        <p className = {styles.headernavtxt}>{txt}</p>
      </div>
    );
  }
  if (txt === 'Tests') {
    return (
      <div className={styles.headernav}>
        <ClipboardPen />
        <p className = {styles.headernavtxt}>{txt}</p>
      </div>
    );
  }
  if (txt === 'Chapters') {
    return (
      <div className={styles.headernav}>
        <School />
        <p className = {styles.headernavtxt}>{txt}</p>
      </div>
    );
  }
}
function TestSidebar({page,handleTestChange}) {
  const [category,setCategory] = useState('Finance');
  const [dropVisible, setDrop] = useState(false);
  const [accordion, setAccordion] = useState([false,false,false]);
  const handleDrop = () => {
    setDrop(!dropVisible);
  }
  const handleChange = (n) => {
    setCategory(n);
    setDrop(!dropVisible);
  }
  const handleAccordion = (id) => {
    const newAccordion = accordion.map((c,i) => {
      if (i === id) {
        return !c;
      } else {
        return c;
      }
    })
    setAccordion(newAccordion);
  }
  if (page === 'tests') {
    if (category === 'Finance') {
      return (
        <div className = {styles.testsidebardiv}>
          <div className = {styles.testselectcatdiv}>
            <button onClick = {handleDrop} className = {styles.selectcatdropdown}>
              {category}
              <img className = {styles.dropdownicon} src = "/sidebar/dropdownicon.png"></img>
            </button>
            <DropDown visible = {dropVisible} handleChange = {handleChange}/>
          </div>
          <SideBarAccordion id = {0} handleAccordion = {handleAccordion} active = {accordion[0]} txt = {'Sample'}>
            <SideBarTestCell handleTestChange={handleTestChange} txt = {'2018 Sample Finance'}/>
          </SideBarAccordion>
          <SideBarAccordion id = {1} handleAccordion = {handleAccordion} active = {accordion[1]} txt = {'State'}>
            <SideBarTestCell handleTestChange={handleTestChange} txt = {'2018 State Finance'}/>
          </SideBarAccordion>
        </div>
      );
    } else {
      return (
        <div className = {styles.testsidebardiv}>
          <div className = {styles.testselectcatdiv}>
            <button onClick = {handleDrop} className = {styles.selectcatdropdown}>
              {category}
              <img className = {styles.dropdownicon} src = "/sidebar/dropdownicon.png"></img>
            </button>
            <DropDown visible = {dropVisible} handleChange = {handleChange}/>
          </div>
          
        </div>
      );
    }
    
  } 
  
  return null;
}

function DropDown({visible, handleChange}) {
  if (visible) {
    return (
      <div className = {styles.dropdownoptions}>
        <div onClick = {() => handleChange('Principles')} className = {styles.catOption}>Principles</div>
        <div onClick = {() => handleChange('Finance')} className = {styles.catOption}>Finance</div>
        <div onClick = {() => handleChange('Marketing')} className = {styles.catOption}>Marketing</div>
        <div onClick = {() => handleChange('Business Administration')} className = {styles.catOption}>Business Administration</div>
        <div onClick = {() => handleChange('Hospitality and Tourism')} className = {styles.catOption}>Hospitality and Tourism</div>
        <div onClick = {() => handleChange('Entrepreneurship')} className = {styles.catOption}>Entrepreneurship</div>
      </div>
    );
  }
  return null;
}

function SideBarAccordion({id,children, active,txt,handleAccordion}) {
  if (!active) {
    return (
      <div className = {styles.accordiondiv}>
        <div className = {styles.sidebaraccordion}>
            <p className = {styles.accordiontxt}>{txt}</p>
            <img onClick = {()=>handleAccordion(id)} className = {styles.accordiondropicon} src = "/sidebar/dropdownicon.png"></img>
        </div>
      </div> 
    );
  }
  return (
    <div className = {styles.accordiondiv}>
        <div className = {styles.sidebaraccordion}>
          <p className = {styles.accordiontxt}>{txt}</p>
          <img onClick = {()=>handleAccordion(id)} className = {styles.accordiondropiconactive} src = "/sidebar/dropdownicon.png"></img>
        </div>
        {children}
    </div>
  );
}

function SideBarTestCell({txt, id, handleTestChange}) {
  return (
    <div onClick = {() => handleTestChange(id)} className = {styles.testcelldiv}>
      <Dot className = {styles.testcelldot} color="#878282" />
      <p className = {styles.testcelltxt}>{txt}</p>
    </div>
  );
}

