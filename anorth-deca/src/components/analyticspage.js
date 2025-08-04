'use client'
import styles from '../css/analyticspage.module.css'
import { useRef, useContext, useEffect, useState } from 'react';

export function AnalyticsPage({user}) {
  return (
    <div className = {styles.analyticspagediv}>
      <SelectAnalytic />
      <div className = {styles.firstrowanalytics}>
        <ScoreSummary />
        <CategoriesSummary/>
      </div>
    </div>
  );
}
function ScoreSummary() {
  return (
    <div className = {styles.scoresummarydiv}>
      <div className = {styles.semidonut}>
        72
      </div>
    </div>
  );
}
function CategoriesSummary() {
  return (
    <div className = {styles.categoriesdiv}>
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