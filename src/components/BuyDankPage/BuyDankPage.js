import React, { useState } from 'react';
import styles from './BuyDankPage.module.css'; // Ensure the CSS module is correctly linked
import etherscanLogo from '../../svgs/etherscanSVG.svg'; // Check the path to the Etherscan logo
import copySVG from '../../svgs/copySVG.svg'; // Ensure the path to the copy icon is correct
import metaMaskLogo from '../../svgs/metamask.svg'; // Ensure the path to the MetaMask logo is correct
import swapGif from '../../gifs/MagmaSwapDemo.gif'; // Import the GIF

function DankTokenInfo() {
    const contractAddress = "0xe12154f598138d7B77179739DABEDf4AaD80f824";
    const tokenSymbol = 'DANK'; // Token symbol
    const tokenDecimals = 18; // Token decimals
    const tokenImage = metaMaskLogo; // Using the MetaMask logo for the token image
    const [showCopied, setShowCopied] = useState(false);
    const [hoverCopy, setHoverCopy] = useState(false);

    const handleAddToken = async () => {
        try {
            if (window.ethereum && window.ethereum.isMetaMask) {
                const wasAdded = await window.ethereum.request({
                    method: 'wallet_watchAsset',
                    params: {
                        type: 'ERC20',
                        options: {
                            address: contractAddress,
                            symbol: tokenSymbol,
                            decimals: tokenDecimals,
                            image: tokenImage,
                        },
                    },
                });
                if (wasAdded) {
                    console.log('Token was added to MetaMask!');
                } else {
                    console.log('Token was not added to MetaMask.');
                }
            } else {
                alert('MetaMask is not installed. Please install it to use this feature.');
            }
        } catch (error) {
            console.error('Failed to add token:', error);
        }
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(contractAddress)
            .then(() => {
                setShowCopied(true);
                setTimeout(() => setShowCopied(false), 1000); // Tooltip disappears after 2 seconds
            })
            .catch(err => {
                console.error('Failed to copy text:', err);
                setShowCopied(true);
            });
    };

    const getShortAddress = (address) => `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

    return (
        <div className={styles.buyDankPageContainer}>
            <div className={styles.contentWrapper}>
                <div className={styles.tokenContainer}>
                    <div className={styles.tokenContent}>
                        <h2 className={styles.instructionsTitle}>How to Swap Dank Tokens</h2>
                        <ol className={styles.instructionsList}>
                            <li>
                                Import DANK token to MetaMask App using the button below ⬇️
                                <button onClick={handleAddToken} className={styles.addButton}>
                                    <img src={metaMaskLogo} alt="Add to MetaMask" className={styles.metamaskSVG} />
                                </button>
                            </li>
                            <li>Copy the Dank Token Contract Address ⬇️</li>
                                <div className={styles.addressWrapper}>
                                    <strong>DANK Token Contract Address: </strong>
                                    <div className={styles.copyContainer}>
                                        <a href={`https://magmascan.org/address/${contractAddress}`} target="_blank" rel="noopener noreferrer">
                                            <img src={etherscanLogo} alt="Etherscan" className={styles.smallEtherscanLogo}/>
                                        </a>
                                        <div className={styles.copyButtonWrapper}>
                                            <span>{getShortAddress(contractAddress)}</span>
                                            <button 
                                                onMouseEnter={() => setHoverCopy(true)} 
                                                onMouseLeave={() => setHoverCopy(false)}
                                                onClick={handleCopyToClipboard} 
                                                className={styles.copyButton}
                                            >
                                                <img src={copySVG} alt="Copy" className={styles.copySVG} />
                                            </button>
                                            <span className={`${styles.tooltip} ${showCopied ? styles.visible : ''} ${hoverCopy ? styles.hover : ''}`}>
                                                {showCopied ? 'Copied CA' : 'Copy'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            <li>Paste the copied address into the Magma Swap "Select token" input as shown below. Click "GET DANK HERE" to access Magma Swap ⬇️</li>
                            <img src={swapGif} alt="Swap Animation" className={styles.gif}/>
                        </ol>
                    </div>
                </div>
                <a href="https://magma-ui-swap.vercel.app/#/" target="_blank" rel="noopener noreferrer" className={styles.swapButton}>
                    GET DANK HERE 🤝
                </a>
            </div>
        </div>
    );
}

export default DankTokenInfo;
