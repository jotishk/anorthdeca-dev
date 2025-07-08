'use client'

import { useState } from 'react';
import styles from './page.module.css';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '@/lib/firebase';

export default function Signup() {
  return (
    <>
      <Header/>
      <div className = {styles.signupcontainer}>
        <SignupDiv/>
      </div>
      
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

function SignupDiv() {
  

  return (
    <div className = {styles.signupformdiv}>
      <p className = {styles.signupformtitle}>Create New Account</p>
      <SignupForm/>
    </div>
  );
}


function SignupForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setLoading(true);
    setErr('');
    try {
      const credential = await createUserWithEmailAndPassword(auth,email,password);
      console.log(credential.user + ' successfully created');
      // Redirect to main page
    } catch (err) {
      setErr(err);
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
 
  return (
    <form onSubmit = {(e) => {e.preventDefault(); handleSignup()}}>
        <input value = {email} type = "email" className = {`${styles.signupforminput} ${styles.signupforminputtop}`} placeholder='Email address' onChange={e=>setEmail(e.target.value)}></input>
        <input value = {username} type = "text" className = {styles.signupforminput} placeholder='Username' onChange={e=>setUsername(e.target.value)}></input>
        <input value = {password} type = "password" className = {styles.signupforminput} placeholder='Password' onChange={e=>setPassword(e.target.value)}></input>
        <input className = {styles.signupformsubmit} value = "Sign Up" type = "submit"></input>
        <SignupGoogle/>
        <p className = {styles.signupformswitch}>
          Have an account?
          <a href = "/login"className = {styles.signupformloginlnk}>Log in</a>
        </p>
      </form>
  );
}

function SignupGoogle() {
  return (
    <>
      <button className={styles.signupgooglebtn} value="Sign in with Google">
        <img className={styles.signupgooglelogo} src="/header/googlelogo.png"  />
        <p className = {styles.signupgoogletxt}>Sign in with Google</p>
      </button>
    </>
  );
}