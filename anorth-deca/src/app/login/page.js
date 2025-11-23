'use client'

import styles from './page.module.css'

import { X,ChevronUp,Clock,Plus, MoveLeft, MoveRight } from 'lucide-react';
import { useEffect,useState } from 'react';
import { sendPasswordResetEmail,signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider, translateErr } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [loading, setLoading] = useState(false);
  return (
    <>
      {loading && <div className = {styles.loadingoverlay}></div>}
      <Header/>
      <div className = {styles.signupcontainer}>
        <LoginDiv setLoading = {setLoading}/>
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

function LoginDiv({setLoading}) {
  return (
    <div className = {styles.signupformdiv}>
      <p className = {styles.signupformtitle}>Login to your account</p>
      <p className = {styles.signupformsubtitle}>Please enter your details</p>
      <LoginForm setLoading = {setLoading} />
      
    </div>
  );
}

function LoginForm({setLoading}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  
  const router = useRouter();

  async function handleForgotPassword() {
      console.log(err);

    if (!email) {
      setErr("Please enter your email first.");
      console.log(err);

      return;
    }
    setErr('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setErr("Password reset email sent! Check your inbox.");
    } catch (err) {
      console.log(err);
      setErr(translateErr(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    
    setErr('');
    
    if (email === '' || password === '') {
      setErr('Email or Password is invalid.')
      return;
    }
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth,email,password);
      router.push('/main');
    } catch (err) {
      setErr(err.code);
    }  finally {
      setLoading(false);
    }
  }
  return (
    <>
      <ErrStatusBar code = {err}/>
      <form onSubmit = {(e) => {e.preventDefault(); handleLogin()}}>
        <input value = {email} type = "email" className = {`${styles.signupforminput} ${styles.signupforminputtop}`} placeholder='Email address' onChange={e=>setEmail(e.target.value)}></input>
        <input value = {password} type = "password" className = {styles.signupforminput} placeholder='Password' onChange={e=>setPassword(e.target.value)}></input>
        {/* <button onClick = {handleForgotPassword} className = {styles.signupformforgot} href ="">Forgot password</button> */}
        <input className = {styles.signupformsubmit} value = "Log in" type = "submit"></input>
        <LoginGoogle setLoading = {setLoading}/>
        <p className = {styles.signupformswitch}>
          {"Don't have an account?"}
          <a  href = "/signup" className = {styles.signupformloginlnk}>Sign up</a>
        </p>
      </form>
    </>
    
  );
}

function LoginGoogle({setLoading}) {
  const [err, setErr] = useState('');
  const router = useRouter();
  async function handleSigninGoogle() {
    setLoading(true);
    setErr('');
    try {
      await signInWithPopup(auth,provider);
      router.push('/main');
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
  const [closed,setClosed] = useState(false);
  
  useEffect(() => {
    if (code) {
      setClosed(false);
    }
  }, [code]);

  function closeBar() {
    setClosed(true);
  }
  return (
    code !== '' && !closed
    ? <div className={styles.signuperrbar}>
      <button onClick = {closeBar} className = {styles.closeerrbtn}><X className = {styles.closeerrx} color='white'/></button>
      {translateErr(code)}
    </div> 
    : null

  );
}

