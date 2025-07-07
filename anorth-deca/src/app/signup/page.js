import styles from './page.module.css'

export default function Signup() {
  return (
    <>
      <Header/>
      <div class = {styles.signupcontainer}>
        <SignupForm/>
      </div>
      
    </>
    
  );
}

function Header() {
  return (
    <div className = {[styles.header]}>
      <img className = {styles.headerlogo} src="header/HeaderLogo.png" />
      <p className = {styles.headerlogotext}>Appleton North Deca</p>
    </div>
  );
}

function SignupForm() {
  return (
    <div className = {styles.signupformdiv}>
      <p className = {styles.signupformtitle}>Create New Account</p>
      <form>
        <input className = {`${styles.signupforminput} ${styles.signupforminputtop}`} placeholder='Email address'></input>
        <input className = {styles.signupforminput} placeholder='Username'></input>
        <input className = {styles.signupforminput} placeholder='Password'></input>
        <input className = {styles.signupformsubmit} value = "Sign Up" type = "submit"></input>
        <SignupGoogle/>
      </form>
    </div>
  );
}

function SignupGoogle() {
  return (
    <>
      <button className = {styles.signupgooglebtn} value = "Sign in with Google">
        <img className = {styles.signupgooglelogo} src = "header/googlelogo.svg"></img>
      </button>
      
    </>
    
  );
}