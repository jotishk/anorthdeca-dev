'use client'
import { useState } from 'react';
import styles from './page.module.css';

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
    </div>
  );
}
function TestSidebar({page}) {
  const [category,setCategory] = useState('finance');
  const [dropVisible, setDrop] = useState(false);
  function handleCatChange() {

  }
  if (page === 'tests') {
    return (
      <div className = {styles.testsidebardiv}>
        <div className = {styles.testselectcatdiv}>
          <button onclick = {handleCatChange} className = {styles.selectcatdropdown}></button>
          <DropDown/>
        </div>
      </div>
    );
  } 
  
  return null;
}

function DropDown({visible, handleChange}) {
  return (
    <div className = {styles.dropdownoptions}>
      <div>Principles</div>
      <div>Finance</div>
      <div>Marketing</div>
      <div>Business Administration</div>
      <div>Hospitality and Tourism</div>
      <div>Entrepreneurship</div>
    </div>
  );
}

