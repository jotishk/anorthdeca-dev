'use client'
import styles from '../css/contestspage.module.css'
import { useRef, useContext, useEffect, useState } from 'react';
import { X, Plus } from 'lucide-react';

export function ContestsPage({user}) {
  const [filter,setFilter] = useState('upcoming');
  const [createContestPanel,setCreateContestPanel] = useState(true);

  const handleCreateContest = () => {
    setCreateContestPanel(!createContestPanel);
  }
  const handleFilter = (curr) => {
    if (curr === 'upcoming') {
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
        <div className={styles.contestpagecontentheader}>
          <div className = {styles.contestpagefilterdiv}>
            <div onClick = {() => handleFilter('past')} style = {{backgroundColor: filter === 'upcoming'? "blue": "white", color: filter === 'upcoming' ? "white":"black"}} className = {styles.contestpagefilterupcoming}>
              <p className = {styles.contestpagefiltertxt}>Upcoming</p>
            </div>
            <div onClick = {() => handleFilter('upcoming')} style = {{backgroundColor: filter === 'past'? "blue": "white", color: filter === 'past' ? "white":"black"}} className = {styles.contestpagefilterpast}>
              <p className = {styles.contestpagefiltertxt}>Past</p>
            </div>
          </div>
          <button onClick={() => handleCreateContest()} className = {styles.addcontestbtn}>
            <Plus color='white'/>
          </button>
        </div>
        
        {/* {filter === 'upcoming' && 

        } */}
        <div className = {styles.contestlistdiv}>
          <div className = {styles.contestdisplaydiv}>
            <div className = {styles.contestdisplaydivleft}>
              <img className = {styles.contestdisplayoverlay} src="/images/deca2026NEW.jpg"/>
              <p className = {styles.contestdisplaytitle}>February Contest (Monthly)</p>
            </div>
            <div className = {styles.contestdisplaydivright}>
              <div className = {styles.contestdisplaydivrightcontent}>
                <div className = {styles.contestdisplaydivrightbtnrow}>
                  <BlueBtn className = {styles.contestdisplaybtn} txt = {'View'}/>
                  <BlueBtn className = {styles.contestdisplaybtn} txt = {'Start'}/>
                </div>
                
                <p className = {styles.contestdisplaydatetxt}>Saturday 8/21/2025</p>
                <p className = {styles.contestdisplaytimetxt}>6am-12pm</p>
              </div>

            </div>
          </div>
        </div>
        <CreateContest handleCreateContest = {handleCreateContest} active = {createContestPanel}/>

      </div>
    </div>
  )
}
function CreateContest({active,handleCreateContest}) {
  if (active) {
    return (
      <div className = {styles.createcontestpaneldiv}>
        <X className = {styles.createcontestexit} onClick={() => handleCreateContest()}/>
        <p className = {styles.createcontestpanelheader}>Create Contest</p>
        <input className = {styles.createcontestpaneltitle} placeholder="Event Name" type="text"/>
        <input className = {styles.createcontestpaneldate} type ="date"/>
        <div className = {styles.createcontestpaneltimerow}>
          <input className = {styles.createcontestpanelstart} type ="time"/>
          <input className = {styles.createcontestpanelend} type ="time"/>
        </div>
        <BlueBtn style = {{
          position: "absolute",
          bottom: "1rem"}} 
        className = {styles.createcontestpanelsubmit} txt={'Submit'}/>
      </div>
    )
  }
  
}
function BlueBtn({txt,onClick,style}) {
  return (
    <button style = {style} onClick = {onClick} className = {styles.bluebtn}>
      {txt}
    </button>
  )
}