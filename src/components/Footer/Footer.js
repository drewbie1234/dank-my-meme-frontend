import React from 'react';
import styles from './Footer.module.css';


// SVG imports for the social media icons
import twitterLogo from "../../svgs/twitterSVG.svg";
import coinMarketCapLogo from "../../svgs/coinMarketCapSVG.svg";
import coinGeckoLogo from "../../svgs/coinGeckoSVG.svg";
import dexToolsLogo from "../../svgs/dexToolsSVG.svg";
import etherscanLogo from "../../svgs/etherscanSVG.svg";
import duneAnalyticsLogo from "../../svgs/duneSVG.svg";
import metaMaskLogo from '../../svgs/metamaskSVG.svg'; // Ensure the path to the MetaMask logo is correct


const Footer = () => {

  const contractAddress = "0xe12154f598138d7B77179739DABEDf4AaD80f824"; // Your token contract address
  const tokenSymbol = 'DANK'; // Token symbol
  const tokenDecimals = 18; // Token decimals
  const tokenImage = metaMaskLogo; // Token image, using the MetaMask logo for now


  const handleAddTokenToMetaMask = async () => {
    try {
        // Check if MetaMask is installed
        if (window.ethereum && window.ethereum.isMetaMask) {
            // Try to add token
            const wasAdded = await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: contractAddress, // The contract address for the token
                        symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                        decimals: tokenDecimals, // The number of decimals the token uses.
                        image: tokenImage, // A string URL of the token logo.
                    },
                },
            });

            if (wasAdded) {
                console.log('Thanks for your interest! The token was successfully added to MetaMask!');
            } else {
                console.log('Something went wrong.');
            }
        } else {
            alert('MetaMask is not installed. Please install MetaMask and try again.');
        }
    } catch (error) {
        console.error('Failed to add token to MetaMask:', error);
    }
};

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.socialLinks}>
          <h4>Follow the Memes 🐇</h4>
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
            <li>
                <button onClick={handleAddTokenToMetaMask} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <img src={metaMaskLogo} alt="Add to MetaMask" className={styles.icon} />
                </button>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.copyRight}>
        <p>© {new Date().getFullYear()} DankMyMeme All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
