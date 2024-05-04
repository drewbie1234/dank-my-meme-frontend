import React from 'react';
import styles from './Footer.module.css'; // Assuming you have a CSS module for styling
import xLogoSVG from "../../svgs/xLogoSVG.svg"
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.socialLinks}>
          <h4>Follow Us</h4>
          <ul>
            <img src={xLogoSVG} alt="Wallet" style={{ width: '15px', marginLeft: '8px', verticalAlign: 'middle' }} />
          </ul>
        </div>
      </div>

      <div className={styles.copyRight}>
        <p>© {new Date().getFullYear()} YourCrypto. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
