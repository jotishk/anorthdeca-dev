import styles from './page.module.css'

export default function Login() {
  return (
    <>
      <Header/>
      <div className = {styles.signupcontainer}>
        <LoginForm/>
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

function LoginForm() {
  return (
    <div className = {styles.signupformdiv}>
      <p className = {styles.signupformtitle}>Login to your account</p>
      <p className = {styles.signupformsubtitle}>Please enter your details</p>

      <form>
        <input className = {`${styles.signupforminput} ${styles.signupforminputtop}`} placeholder='Email address'></input>
        <input className = {styles.signupforminput} placeholder='Password'></input>
        <a className = {styles.signupformforgot} href ="">Forgot password</a>
        <input className = {styles.signupformsubmit} value = "Sign Up" type = "submit"></input>
        <LoginGoogle/>
        <p className = {styles.signupformswitch}>
          Have an account?
          <a href = "/signup" className = {styles.signupformloginlnk}>Sign up</a>
        </p>
      </form>
    </div>
  );
}

function LoginGoogle() {
  return (
    <>
      <button className={styles.signupgooglebtn} value="Sign in with Google">
        <img className={styles.signupgooglelogo} src="/header/googlelogo.png"  />
        <p className = {styles.signupgoogletxt}>Sign in with Google</p>
      </button>
    </>
  );
}