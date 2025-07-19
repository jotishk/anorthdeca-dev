'use client'

import styles from './page.module.css'

import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider, translateErr } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

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
  
  const router = useRouter();
  async function handleLogin() {

    setErr('');
    console.log('trying login')
    if (email === '' || password === '') {
      setErr('Email or Password is invalid.')
      return;
    }
    try {
      const credential = await signInWithEmailAndPassword(auth,email,password);
      console.log('successful login');
      
    } catch (err) {
      console.log(err)
      setErr(err.code);
    } 
  }
  return (
    <>
      <ErrStatusBar code = {err}/>
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
    </>
    
  );
}

function LoginGoogle() {
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function handleSigninGoogle() {
    setLoading(true);
    setErr('');
    try {
      await signInWithPopup(auth,provider);
      router.push('/main')
    } catch (err) {
      setErr(err.code);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ErrStatusBar code = {err}/>
      <button onClick = {handleSigninGoogle} className={styles.signupgooglebtn} value="Sign in with Google">
        <img className={styles.signupgooglelogo} src="/header/googlelogo.png"  />
        <p className = {styles.signupgoogletxt}>Sign in with Google</p>
      </button>
    </>
  );
}

function ErrStatusBar({code}) {
  
  return (
    
    code !== '' 
    ? <div className={styles.signuperrbar}>{translateErr(code)}</div> 
    : null

  );
}

