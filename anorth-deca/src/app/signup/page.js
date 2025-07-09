'use client'

import { useState } from 'react';
import styles from './page.module.css';
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider, firebaseErrorMap } from '@/lib/firebase';

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
      
      // Redirect to main page
    } catch (err) {
      setErr(err.code);
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ErrStatusBar code = {err}/>
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
    </>
  );
}

function SignupGoogle() {
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  async function handleSignupGoogle() {
    setLoading(true);
    setErr('');
    try {
      signInWithPopup(auth,provider);
     
      // Redirect to main page
    } catch (err) {
      setErr(err.code);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <ErrStatusBar code = {err}/>
      <button onClick = {handleSignupGoogle} className={styles.signupgooglebtn} value="Sign in with Google">
        <img className={styles.signupgooglelogo} src="/header/googlelogo.png"  />
        <p className = {styles.signupgoogletxt}>Sign in with Google</p>
      </button>
    </>
  );
}

function ErrStatusBar({code}) {
  

  return (
    code !== '' 
    ? <div className={styles.signuperrbar}>{code}</div> 
    : null

  );
}

