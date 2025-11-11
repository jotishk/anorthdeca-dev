'use client'
import { useContext, useEffect, useState } from 'react';
import styles from './page.module.css';
import {LogOut, Settings, ClipboardPen, ChartGantt, Zap, School, Dot, MoveLeft, MoveRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { TestPage, QuestionPanel, QuestionPanelBtm,QuestionChoices} from '@/components/testpage';
import { AnalyticsPage } from '@/components/analyticspage';
import { getAuth,signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';


export default function Main() {
  const [page,setPage] = useState('tests');
  const {user, loading} = useAuth();
  const [active, setActive] = useState(false);
  const [tid, setTid] = useState('100');
  const [tidAnalytic, setTidAnalytic] = useState('0');

  const handlePageChange = (page) => {
    setPage(page);
  }
  const handleTestChange = (tid) => {
    if (page == 'tests') {
      setTid(tid);
      setActive(false);
    } 
    if (page == 'analytics') {
      setTidAnalytic(tid);
    }
    
  }
  // const handleAnalyticTestChange = (tid) => {
  //   setTidAnalytic(tid);
  // }
  // if (page === 'tests') {
  //   return (
  //     <div className = {styles.main}>
  //       <Header handlePageChange = {handlePageChange}/>
  //       <TestSidebar handleTestChange = {handleTestChange} key = {page} page = {page}/>
  //       <TestPage  tid = {tid} active = {active} setActive = {setActive} user = {user}/>
  //     </div>
      
  //   );
  // }
  // if (page === 'analytics') {
  //   return (
  //     <div className = {styles.main}>
  //       <Header handlePageChange = {handlePageChange}/>
  //       <TestSidebar handleTestChange = {handleAnalyticTestChange} key = {page} page = {page}/>
  //       <AnalyticsPage tidAnalytic = {tidAnalytic} user = {user}/>
  //     </div>
  //   );
  // }
  return (
    <div className = {styles.main}>
      <Header handlePageChange = {handlePageChange}/>
      <TestSidebar handleTestChange = {handleTestChange}  key = {page} page = {page}/>
      <div className = {styles.pageblock} style={{ display: page === 'tests' ? 'flex' : 'none' }}>
        <TestPage tid={tid} active={active} setActive={setActive} user={user} />
      </div>

      <div className = {styles.pageblock} style={{ display: page === 'analytics' ? 'block' : 'none' }}>
        <AnalyticsPage tidAnalytic={tidAnalytic} user={user} />
      </div>
    </div>
    
  );
}

function Header({handlePageChange}) {
  const [logoutDropdown,setLogoutDropdown] = useState(false);
  const router = useRouter();
  
  const handleLogoutDropdown = () => {
    setLogoutDropdown(!logoutDropdown);
  }
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        router.push('/login')
      })
  }
  return (
    <div className = {[styles.header]}>
      <img className = {styles.headerlogo} src="/header/HeaderLogo.png" />
      <p className = {styles.headerlogotext}>Appleton North Deca</p>
      <div className = {[styles.headerrightsection]}>
        <HeaderNav onClick = {() => {handlePageChange('tests')}} className = {styles.headernav} txt = {'Tests'}/>
        <HeaderNav onClick = {() => {handlePageChange('analytics')}} className = {styles.headernav} txt = {'Analytics'}/>
        <HeaderNav onClick = {() => {handleLogoutDropdown()}} className = {styles.headernav} txt = {'Settings'}/>
      </div>
      {logoutDropdown &&
        <div onClick = {() => {handleLogout()}} className = {styles.logoutdropdown}>
          <LogOut strokeWidth={1.5} width={20}/>
          <p className = {styles.logoutdropdowntxt}>Sign Out</p>
        </div>
      }
      
    </div>
  );
}
function HeaderNav({txt, onClick, className}) {
  if (txt === 'Settings') {
    return <Settings strokeWidth={1.5} color='rgb(62, 62, 62)'className = {styles.settingsicon}  onClick={onClick}/>;
  }
  if (txt === 'Analytics') {
    return (
      <div className={className} onClick={onClick} style={{cursor: 'pointer'}}>
        <ChartGantt strokeWidth={1.5} color='rgb(62, 62, 62)'/>
        <p className = {styles.headernavtxt}>{txt}</p>
      </div>
    );
  }
  if (txt === 'Quick Practice') {
    return (
      <div className={className} onClick={onClick} style={{cursor: 'pointer'}}>
        <Zap color='rgb(62, 62, 62)'/> 
        <p className = {styles.headernavtxt}>{txt}</p>
      </div>
    );
  }
  if (txt === 'Tests') {
    return (
      <div className={className} onClick={onClick} style={{cursor: 'pointer'}}>
        <ClipboardPen strokeWidth={1.5} color='rgb(62, 62, 62)'/>
        <p className = {styles.headernavtxt}>{txt}</p>
      </div>
    );
  }
  if (txt === 'Contests') {
    return (
      <div className={className} onClick={onClick} style={{cursor: 'pointer'}}>
        <School color='rgb(62, 62, 62)'/>
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
  if (page === 'tests' || page === 'analytics') {
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
            <SideBarTestCell id = {'102'} handleTestChange={handleTestChange} txt = {'2018 Sample Finance'}/>
          </SideBarAccordion>
          <SideBarAccordion id = {1} handleAccordion = {handleAccordion} active = {accordion[1]} txt = {'State'}>
            <SideBarTestCell id = {'101'} handleTestChange={handleTestChange} txt = {'2018 State Finance'}/>
          </SideBarAccordion>
          <SideBarAccordion id = {2} handleAccordion = {handleAccordion} active = {accordion[2]} txt = {'ICDC'}>
            <SideBarTestCell id = {'101'} handleTestChange={handleTestChange} txt = {'2012 ICDC Finance'}/>
            <SideBarTestCell id = {'100'} handleTestChange={handleTestChange} txt = {'2013 ICDC Finance'}/>
            <SideBarTestCell id = {'102'} handleTestChange={handleTestChange} txt = {'2020 ICDC Finance'}/>
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

