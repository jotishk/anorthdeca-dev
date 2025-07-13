'use client'
import { useState } from 'react';
import styles from './page.module.css';
import { Settings, ClipboardPen, ChartGantt, Zap, School } from 'lucide-react';
export default function Main() {
  const [page,setPage] = useState('tests');
  return (
    <>
      <Header/>
      <TestSidebar page = {page}/>
    </>
    
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
function TestSidebar({page}) {
  const [category,setCategory] = useState('Finance');
  const [dropVisible, setDrop] = useState(false);
  const handleDrop = () => {
    setDrop(!dropVisible);
  }
  const handleChange = (n) => {
    setCategory(n);
    setDrop(!dropVisible);
  }
  if (page === 'tests') {
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


