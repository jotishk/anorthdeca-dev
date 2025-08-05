'use client'
import styles from '../css/analyticspage.module.css'
import { useRef, useContext, useEffect, useState } from 'react';
import { Square } from 'lucide-react';

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
    <div className={styles.scoresummarydiv}>
      <div className = {styles.cardheaderdiv} style={{ alignSelf: 'flex-start', width: '100%' }}>
        <p className={styles.analyticscardheader} style={{ textAlign: 'left', margin: 0 }}>
          Score Summary
        </p>
      </div>
      <div className={styles.semidonut}>
        72
      </div>
      <div className={styles.scoresummarybtm}>
        <div className={styles.scoresummaryinfo}>
          <Square strokeWidth={20} color="#04cb2c" />
          <p className={styles.scoresummaryinfotxt}>72 correct</p>
        </div>
        <div className={styles.scoresummaryinfo}>
          <Square strokeWidth={20} color="rgb(224, 37, 37)" />
          <p className={styles.scoresummaryinfotxt}>27 incorrect</p>
        </div>
        <div className={styles.scoresummaryinfo}>
          <Square strokeWidth={20} color="#333333" />
          <p className={styles.scoresummaryinfotxt}>1 unanswered</p>
        </div>
      </div>
    </div>
  );
}
function CategoriesSummary() {
  return (
    <div className = {styles.categoriesdiv}>
      <div className = {styles.cardheaderdiv} style={{ alignSelf: 'flex-start', width: '100%' }}>
        <p className={styles.analyticscardheader} style={{ textAlign: 'left', margin: 0 }}>
          Categories Summary
        </p>
      </div>
      <CategoriesGraph label = {'Business Law'}/>
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
function CategoriesGraph({label, numCorrect, numTotal}) {
  return (
    <div className={styles.categoriesgraphrow}>
      <p className={styles.categoriesgraphlabel}>{label}</p>
      <div className={styles.categoriesgraphbox}></div>
    </div>
  );
}