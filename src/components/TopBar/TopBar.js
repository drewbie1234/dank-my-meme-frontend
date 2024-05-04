import React from "react";
import LoginSection from "../LoginSection/LoginSection";
import styles from "./TopBar.module.css";
import logoImage from "../../images/dank_my_meme.png";
import logoTitle from "../../images/dank_my_meme_title.png";
import { Link } from 'react-router-dom';

 const TopBar = () => {
  return (
    <div className={styles.topbar}>
      <Link to="/contestcreationpage">
      <img src={logoImage} alt="Dank My Meme Logo" className={styles.logo} />
      </Link>
      <Link to="/">
            <img src={logoTitle} alt="Dank My Meme Title" className={styles.title} />
        </Link>
      <LoginSection  />
    </div>
  );
};

export default TopBar;
