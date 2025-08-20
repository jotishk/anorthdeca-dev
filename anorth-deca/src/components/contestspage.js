'use client'
import styles from '../css/contestspage.module.css'
import { useRef, useContext, useEffect, useState } from 'react';

export function ContestsPage({user}) {
  const [filter,setFilter] = useState('upcoming');
  const handleFilter = () => {
    if (filter === 'upcoming') {
      setFilter('past');
    } else {
      setFilter('upcoming');
    }
  }
  return(
    <div className = {styles.contestpagediv}>
      <div className = {styles.contestpagescrollable}>
        <div className = {styles.contestpageheaderdiv}>
          <p className = {styles.contestpageheadertxt}>Virtual Contests</p>
        </div>
        <div className = {styles.contestpagefilterdiv}>
          <div onClick = {() => handleFilter()} style = {{backgroundColor: filter === 'upcoming'? "blue": "white", color: filter === 'upcoming' ? "white":"black"}} className = {styles.contestpagefilterupcoming}>
            <p className = {styles.contestpagefiltertxt}>Upcoming</p>
          </div>
          <div onClick = {() => handleFilter()} style = {{backgroundColor: filter === 'past'? "blue": "white", color: filter === 'past' ? "white":"black"}} className = {styles.contestpagefilterpast}>
            <p className = {styles.contestpagefiltertxt}>Past</p>
          </div>
        </div>
        {/* {filter === 'upcoming' && 

        } */}
      </div>
    </div>
  )
}