import React from "react";
import { Link } from 'react-router-dom';
import LoginSection from "../LoginSection/LoginSection";
import styles from "./TopBar.module.css";
import logoImage from "../../images/dank_my_meme.png";
import logoTitle from "../../images/dank_my_meme_title.png";

const TopBar = () => {
  return (
    <div className={styles.topbar}>
      <Link to="/contestcreationpage">
        <img src={logoImage} alt="Dank My Meme Logo" className={styles.logo} />
      </Link>
      <Link to="/">
        <img src={logoTitle} alt="Dank My Meme Title" className={styles.title} />
      </Link>
      <LoginSection />

      <div className={styles.bottomLinks}>
        <Link to="/submissions" className={styles.navButton}>Submissions</Link>
        <Link to="/contests" className={styles.navButton}>Contests</Link>
        <Link to="/votes" className={styles.navButton}>Votes</Link>
      </div>
    </div>
  );
};

export default TopBar;
