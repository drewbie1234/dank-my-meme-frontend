import React from 'react';
import styles from './Footer.module.css'; // Assuming you have a CSS module for styling

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <section className={styles.socialLinks}>
          <h4>Follow Us</h4>
          <ul>
            <li><a href="https://twitter.com/yourcrypto" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            <li><a href="https://facebook.com/yourcrypto" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://instagram.com/yourcrypto" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://linkedin.com/company/yourcrypto" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            <li><a href="https://reddit.com/r/yourcrypto" target="_blank" rel="noopener noreferrer">Reddit</a></li>
          </ul>
        </section>

        <section className={styles.footerLinks}>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </section>
      </div>

      <div className={styles.copyRight}>
        <p>© {new Date().getFullYear()} YourCrypto. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
