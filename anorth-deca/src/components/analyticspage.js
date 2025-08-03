'use client'
import styles from '../css/analyticspage.module.css'
import { useRef, useContext, useEffect, useState } from 'react';

export function AnalyticsPage({user}) {
  return (
    <div className = {styles.analyticspagediv}>
      <SelectAnalytic />
    </div>
  );
}

function SelectAnalytic() {
  return(
    <div className = {styles.selectattemptdiv}> 
      <p className = {styles.selectattemptheader}>2013 ICDC Finance Exam</p>
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