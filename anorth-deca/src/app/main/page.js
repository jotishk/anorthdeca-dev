'use client'
import { useContext, useEffect, useState } from 'react';
import styles from './page.module.css';
import { Settings, ClipboardPen, ChartGantt, Zap, School, Dot, MoveLeft, MoveRight } from 'lucide-react';
import { createSession, retrieveSession } from '@/lib/firebaseService';
import { useAuth } from '@/context/AuthContext';

export default function Main() {
  const [page,setPage] = useState('tests');
  const [tid, setTid] = useState('finance');
  const {user, loading} = useAuth();

  const handleTestChange = (tid) => {
    setTid(tid);
  }
  if (page === 'tests') {
    return (
      <div className = {styles.main}>
        <Header/>
        <TestSidebar handleTestChange = {handleTestChange} page = {page}/>
        <TestPage user = {user} key = {tid} tid = {tid}/>
      </div>
      
    );
  }
  
  
}
function TestPage({tid, user}) {
  const [active, setActive] = useState(false);
  const [qnum, setQnum] = useState(1);
  const [status, setStatus] = useState('Start');
  const [session, setSession] = useState(null);
  useEffect(()=> {
    if (user.id===null) return;
    async function fetchSession() {
      const sessionData = await retrieveSession(user.id,tid);
      if (sessionData) {
        setStatus('Continue');
      } else {
        setStatus('Start');
      }
      setSession(sessionData);
    }
    fetchSession();
  },[user.id,tid])

  const handleActive = async () => {
    if (status === 'Start') {
      const newSession = await createSession(user.id,tid);
      setSession(newSession);
    } 
    setActive(true); 
  }

  if (tid === '') {
    return <div className = {styles.testpagediv}></div>
  }
  if (!active) {
    return (
      <div className = {styles.testpagediv}>
        <div className = {styles.testpageNAmid}>
          <p className = {styles.testtitleNA}>{tid}</p>
          <button onClick = {handleActive} className = {styles.testbuttonNA}>{status}</button>
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
      <p className = {styles.questioncontent}>"Justine's rich uncle wants to give her $5,000 towards the purchase of a car. But since Justine doesn't plan to buy the car for at least another year, her uncle told her that she can have the money now, or he can wait and give her the money when she actually buys the car. Justine chooses to take the money now and deposit it in her savings account. After all, her deposit will yield 6% interest compounded annually. A year from now, her $5,000 will be worth $5,300. What financial concept does this scenario illustrate?"</p>
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
            <SideBarTestCell id = {100} handleTestChange={handleTestChange} txt = {'2018 Sample Finance'}/>
          </SideBarAccordion>
          <SideBarAccordion id = {1} handleAccordion = {handleAccordion} active = {accordion[1]} txt = {'State'}>
            <SideBarTestCell id = {101} handleTestChange={handleTestChange} txt = {'2018 State Finance'}/>
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

