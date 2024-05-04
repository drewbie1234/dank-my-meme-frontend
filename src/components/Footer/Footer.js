import React from 'react';
import styles from './Footer.module.css';
import xLogoSVG from "../../svgs/xLogoSVG.svg";

// SVG imports for the social media icons
import twitterLogo from "../../svgs/twitterLogo.svg";
import coinMarketCapLogo from "../../svgs/coinMarketCapLogo.svg";
import coinGeckoLogo from "../../svgs/coinGeckoLogo.svg";
import dexToolsLogo from "../../svgs/dexToolsLogo.svg";
import etherscanLogo from "../../svgs/etherscanLogo.svg";
import duneAnalyticsLogo from "../../svgs/duneAnalyticsLogo.svg";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.socialLinks}>
          <h4>Follow Us</h4>
          <ul>
            <li>
              <a href="https://twitter.com/pond0x" target="_blank" rel="noopener noreferrer">
                <img src={twitterLogo} alt="Twitter" className={styles.icon} />
              </a>
            </li>
            <li>
              <a href="https://coinmarketcap.com/currencies/pond0x/" target="_blank" rel="noopener noreferrer">
                <img src={coinMarketCapLogo} alt="CoinMarketCap" className={styles.icon} />
              </a>
            </li>
            <li>
              <a href="https://www.coingecko.com/en/coins/pondcoin" target="_blank" rel="noopener noreferrer">
                <img src={coinGeckoLogo} alt="CoinGecko" className={styles.icon} />
              </a>
            </li>
            <li>
              <a href="https://www.dextools.io/app/en/ether/pair-explorer/0xc64350c0eab6faed8f17cc2cdff0761c53fb4152" target="_blank" rel="noopener noreferrer">
                <img src={dexToolsLogo} alt="DEXTools" className={styles.icon} />
              </a>
            </li>
            <li>
              <a href="https://www.etherscan.io/token/0x423f4e6138E475D85CF7Ea071AC92097Ed631eea" target="_blank" rel="noopener noreferrer">
                <img src={etherscanLogo} alt="Etherscan" className={styles.icon} />
              </a>
            </li>
            <li>
              <a href="https://dune.com/mogie/pond-dex" target="_blank" rel="noopener noreferrer">
                <img src={duneAnalyticsLogo} alt="Dune Analytics" className={styles.icon} />
              </a>
            </li>
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
