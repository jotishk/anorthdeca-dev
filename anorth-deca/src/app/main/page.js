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
        <div onClick = {() => handleChange('BMA')} className = {styles.catOption}>Business Administration</div>
        <div onClick = {() => handleChange('HospitalityTourism')} className = {styles.catOption}>Hospitality and Tourism</div>
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
            <SideBarTestCell id = {'104'} handleTestChange={handleTestChange} txt = {'2017 Sample Finance'}/>
            <SideBarTestCell id = {'105'} handleTestChange={handleTestChange} txt = {'2018 Sample Finance'}/>
            <SideBarTestCell id = {'106'} handleTestChange={handleTestChange} txt = {'2019 Sample Finance'}/>
            <SideBarTestCell id = {'107'} handleTestChange={handleTestChange} txt = {'2020 Sample Finance'}/>
            <SideBarTestCell id = {'108'} handleTestChange={handleTestChange} txt = {'2021 Sample Finance'}/>
            <SideBarTestCell id = {'109'} handleTestChange={handleTestChange} txt = {'2022 Sample Finance'}/>
            <SideBarTestCell id = {'110'} handleTestChange={handleTestChange} txt = {'2023 Sample Finance'}/>
            <SideBarTestCell id = {'111'} handleTestChange={handleTestChange} txt = {'2024 Sample Finance'}/>


          </SideBarAccordion>
          <SideBarAccordion id = {1} handleAccordion = {handleAccordion} active = {accordion[1]} txt = {'State'}>
            <SideBarTestCell id = {'112'} handleTestChange={handleTestChange} txt = {'2021 State Finance'}/>
            <SideBarTestCell id = {'113'} handleTestChange={handleTestChange} txt = {'2022 State Finance'}/>
            <SideBarTestCell id = {'114'} handleTestChange={handleTestChange} txt = {'2023 State Finance'}/>

          </SideBarAccordion>
          <SideBarAccordion id = {2} handleAccordion = {handleAccordion} active = {accordion[2]} txt = {'ICDC'}>
            <SideBarTestCell id = {'100'} handleTestChange={handleTestChange} txt = {'2013 ICDC Finance'}/>
            <SideBarTestCell id = {'101'} handleTestChange={handleTestChange} txt = {'2020 ICDC Finance'}/>
            <SideBarTestCell id = {'102'} handleTestChange={handleTestChange} txt = {'2023 ICDC Finance'}/>
            <SideBarTestCell id = {'103'} handleTestChange={handleTestChange} txt = {'2024 ICDC Finance'}/>


          </SideBarAccordion>
        </div>
      );
      
    } else if (category === 'Principles') {
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
            <SideBarTestCell id = {'200'} handleTestChange={handleTestChange} txt = {'2017 District Principles'}/>
            <SideBarTestCell id = {'201'} handleTestChange={handleTestChange} txt = {'2018 District Principles'}/>
            <SideBarTestCell id = {'202'} handleTestChange={handleTestChange} txt = {'2019 Sample Principles'}/>
            <SideBarTestCell id = {'203'} handleTestChange={handleTestChange} txt = {'2020 Sample Principles'}/>
            <SideBarTestCell id = {'204'} handleTestChange={handleTestChange} txt = {'2021 Sample Principles'}/>
            <SideBarTestCell id = {'205'} handleTestChange={handleTestChange} txt = {'2022 Sample Principles'}/>
            <SideBarTestCell id = {'206'} handleTestChange={handleTestChange} txt = {'2023 Sample Principles'}/>


          </SideBarAccordion>
          <SideBarAccordion id = {1} handleAccordion = {handleAccordion} active = {accordion[1]} txt = {'State'}>
            <SideBarTestCell id = {'207'} handleTestChange={handleTestChange} txt = {'2021 State Principles'}/>
            <SideBarTestCell id = {'208'} handleTestChange={handleTestChange} txt = {'2022 State Principles'}/>
            <SideBarTestCell id = {'209'} handleTestChange={handleTestChange} txt = {'2023 State Principles'}/>
            <SideBarTestCell id = {'210'} handleTestChange={handleTestChange} txt = {'2024 State Principles'}/>


          </SideBarAccordion>
          <SideBarAccordion id = {2} handleAccordion = {handleAccordion} active = {accordion[2]} txt = {'ICDC'}>
            <SideBarTestCell id = {'211'} handleTestChange={handleTestChange} txt = {'2020 ICDC Principles'}/>
            <SideBarTestCell id = {'212'} handleTestChange={handleTestChange} txt = {'2022 ICDC Principles'}/>
            <SideBarTestCell id = {'213'} handleTestChange={handleTestChange} txt = {'2023 ICDC Principles'}/>
            <SideBarTestCell id = {'214'} handleTestChange={handleTestChange} txt = {'2024 ICDC Principles'}/>


          </SideBarAccordion>
        </div>
      );
      
    } else if (category === 'Entrepreneurship') {
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
            <SideBarTestCell id = {'301'} handleTestChange={handleTestChange} txt = {'2018 Sample Entrepreneurship'}/>
            <SideBarTestCell id = {'302'} handleTestChange={handleTestChange} txt = {'2019 Sample Entrepreneurship'}/>
            <SideBarTestCell id = {'303'} handleTestChange={handleTestChange} txt = {'2020 Sample Entrepreneurship'}/>
            <SideBarTestCell id = {'304'} handleTestChange={handleTestChange} txt = {'2021 Sample Entrepreneurship'}/>
            <SideBarTestCell id = {'305'} handleTestChange={handleTestChange} txt = {'2022 Sample Entrepreneurship'}/>
            <SideBarTestCell id = {'306'} handleTestChange={handleTestChange} txt = {'2023 Sample Entrepreneurship'}/>
            <SideBarTestCell id = {'307'} handleTestChange={handleTestChange} txt = {'2024 Sample Entrepreneurship'}/>
          </SideBarAccordion>
          <SideBarAccordion id = {1} handleAccordion = {handleAccordion} active = {accordion[1]} txt = {'State'}>
          </SideBarAccordion>
          <SideBarAccordion id = {2} handleAccordion = {handleAccordion} active = {accordion[2]} txt = {'ICDC'}>

          </SideBarAccordion>
        </div>
      );
      
    } else if (category === 'HospitalityTourism') {
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
            <SideBarTestCell id = {'400'} handleTestChange={handleTestChange} txt = {'2017 Sample HospitalityTourism'}/>
            <SideBarTestCell id = {'401'} handleTestChange={handleTestChange} txt = {'2018 Sample HospitalityTourism'}/>
            <SideBarTestCell id = {'402'} handleTestChange={handleTestChange} txt = {'2019 Sample HospitalityTourism'}/>
            <SideBarTestCell id = {'403'} handleTestChange={handleTestChange} txt = {'2020 Sample HospitalityTourism'}/>
            <SideBarTestCell id = {'404'} handleTestChange={handleTestChange} txt = {'2021 Sample HospitalityTourism'}/>
            <SideBarTestCell id = {'405'} handleTestChange={handleTestChange} txt = {'2022 Sample HospitalityTourism'}/>
            <SideBarTestCell id = {'406'} handleTestChange={handleTestChange} txt = {'2023 Sample HospitalityTourism'}/>
            <SideBarTestCell id = {'407'} handleTestChange={handleTestChange} txt = {'2024 Sample HospitalityTourism'}/>
          </SideBarAccordion>
          <SideBarAccordion id = {1} handleAccordion = {handleAccordion} active = {accordion[1]} txt = {'State'}>
          </SideBarAccordion>
          <SideBarAccordion id = {2} handleAccordion = {handleAccordion} active = {accordion[2]} txt = {'ICDC'}>

          </SideBarAccordion>
        </div>
      );
      
    } else if (category === 'Marketing') {
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
            <SideBarTestCell id = {'500'} handleTestChange={handleTestChange} txt = {'2017 Sample Marketing'}/>
            <SideBarTestCell id = {'501'} handleTestChange={handleTestChange} txt = {'2018 Sample Marketing'}/>
            <SideBarTestCell id = {'502'} handleTestChange={handleTestChange} txt = {'2019 Sample Marketing'}/>
            <SideBarTestCell id = {'503'} handleTestChange={handleTestChange} txt = {'2020 Sample Marketing'}/>
            <SideBarTestCell id = {'504'} handleTestChange={handleTestChange} txt = {'2021 Sample Marketing'}/>
            <SideBarTestCell id = {'505'} handleTestChange={handleTestChange} txt = {'2022 Sample Marketing'}/>
            <SideBarTestCell id = {'506'} handleTestChange={handleTestChange} txt = {'2023 Sample Marketing'}/>
            <SideBarTestCell id = {'507'} handleTestChange={handleTestChange} txt = {'2024 Sample Marketing'}/>
          </SideBarAccordion>
          <SideBarAccordion id = {1} handleAccordion = {handleAccordion} active = {accordion[1]} txt = {'State'}>
          </SideBarAccordion>
          <SideBarAccordion id = {2} handleAccordion = {handleAccordion} active = {accordion[2]} txt = {'ICDC'}>

          </SideBarAccordion>
        </div>
      );
      
    } else if (category === 'Marketing') {
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
            <SideBarTestCell id = {'600'} handleTestChange={handleTestChange} txt = {'2017 Sample BMA'}/>
            <SideBarTestCell id = {'601'} handleTestChange={handleTestChange} txt = {'2018 Sample BMA'}/>
            <SideBarTestCell id = {'602'} handleTestChange={handleTestChange} txt = {'2019 Sample BMA'}/>
            <SideBarTestCell id = {'603'} handleTestChange={handleTestChange} txt = {'2020 Sample BMA'}/>
            <SideBarTestCell id = {'604'} handleTestChange={handleTestChange} txt = {'2021 Sample BMA'}/>
            <SideBarTestCell id = {'605'} handleTestChange={handleTestChange} txt = {'2022 Sample BMA'}/>
            <SideBarTestCell id = {'606'} handleTestChange={handleTestChange} txt = {'2023 Sample BMA'}/>
            <SideBarTestCell id = {'607'} handleTestChange={handleTestChange} txt = {'2024 Sample BMA'}/>
          </SideBarAccordion>
          <SideBarAccordion id = {1} handleAccordion = {handleAccordion} active = {accordion[1]} txt = {'State'}>
          </SideBarAccordion>
          <SideBarAccordion id = {2} handleAccordion = {handleAccordion} active = {accordion[2]} txt = {'ICDC'}>

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

