'use client'

import styles from './page.module.css'

import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from '@/lib/firebase';

export default function Login() {
  return (
    <>
      <Header/>
      <div className = {styles.signupcontainer}>
        <LoginDiv/>
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

function LoginDiv() {
  return (
    <div className = {styles.signupformdiv}>
      <p className = {styles.signupformtitle}>Login to your account</p>
      <p className = {styles.signupformsubtitle}>Please enter your details</p>
      <LoginForm/>
      
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setErr('');
    try {
      const credential = await signInWithEmailAndPassword(auth,email,password);
      console.log('successfully created');
      // Redirect to main page
    } catch (err) {
      setErr(err);
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit = {(e) => {e.preventDefault(); handleLogin()}}>
      <input value = {email} type = "email" className = {`${styles.signupforminput} ${styles.signupforminputtop}`} placeholder='Email address' onChange={e=>setEmail(e.target.value)}></input>
      <input value = {password} type = "password" className = {styles.signupforminput} placeholder='Password' onChange={e=>setPassword(e.target.value)}></input>
      <a className = {styles.signupformforgot} href ="">Forgot password</a>
      <input className = {styles.signupformsubmit} value = "Log in" type = "submit"></input>
      <LoginGoogle/>
      <p className = {styles.signupformswitch}>
        Have an account?
        <a href = "/signup" className = {styles.signupformloginlnk}>Sign up</a>
      </p>
    </form>
  );
}

function LoginGoogle() {
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  async function handleSigninGoogle() {
    setLoading(true);
    setErr('');
    try {
      signInWithPopup(auth,provider);
      
      // Redirect to main page
    } catch (err) {
      setErr(err);
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick = {handleSigninGoogle} className={styles.signupgooglebtn} value="Sign in with Google">
        <img className={styles.signupgooglelogo} src="/header/googlelogo.png"  />
        <p className = {styles.signupgoogletxt}>Sign in with Google</p>
      </button>
    </>
  );
}

