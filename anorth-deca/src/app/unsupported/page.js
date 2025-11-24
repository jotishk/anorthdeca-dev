import styles from './page.module.css'

export default function Unsupported() {
    return (
        <div className = {styles.wholepage}>
            <div className={styles.unsupportedtxt}>This app is only available on desktop</div>
            
        </div>
    );
}