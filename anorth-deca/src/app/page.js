import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  <Header></Header>
}

function Header() {
  return (
    <div class = "header">
      <img class = "header-logo" src="../../../public/header/HeaderLogo.png" />;
      <p class = "header-logo-text">Appleton North Deca</p>
      <img class = "header-notification-icon"></img>
      <button class = "header-profile-button">
        <img class = "header-profile-pic"></img>
      </button>
    </div>
  );
}
