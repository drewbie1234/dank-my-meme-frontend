import React from "react";
import { Link } from 'react-router-dom';
import LoginSection from "../LoginSection/LoginSection";
import styles from "./TopBar.module.css";
import logoImage from "../../images/dank_my_meme.png";
import logoTitle from "../../images/dank_my_meme_title.png";

const TopBar = () => {
  return (
    <div className={styles.topbar}>
      <div className={styles.topbarContainer}>
        <div className={styles.logoContainer}>
          <Link to="/contestcreationpage">
            <img src={logoImage} alt="Dank My Meme Logo" className={styles.logo} />
          </Link>
          <Link to="/contestcreationpage" className={styles.deployLink}>
            DEPLOY
          </Link>
        </div>
        <div className={styles.titleContainer}>
          <Link to="/">
            <img src={logoTitle} alt="Dank My Meme Title" className={styles.title} />
          </Link>
        </div>
        <div className={styles.loginContainer}>
          <LoginSection />
        </div>
      </div>

      <div className={styles.navlinksContainer}>
        <div className={styles.navButtonContainer}>
          <Link to="/submissions" className={styles.navButton}>Submits</Link>
          <Link to="/" className={styles.navButton}>Contests</Link>
          <Link to="/votes" className={styles.navButton}>Votes</Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
