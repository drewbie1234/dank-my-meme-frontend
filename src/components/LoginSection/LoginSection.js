import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './LoginSection.module.css';
import walletSVG from '../../svgs/wallet.svg';
import { useWallet } from '../../contexts/WalletContext';

function LoginSection() {
  const {
    accounts,
    balances,
    ens,
    isWalletConnected,
    showDropdown,
    toggleWalletDropdown,
    connectWallet,
    disconnectWallet,
    selectAccount,
    selectedAccount
  } = useWallet();

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null); // Reference for the toggle button

  // Toggle account selection logic integrated into useWallet
  const handleSelectAccount = (account) => {
    selectAccount(account === selectedAccount ? null : account);
  };

  // Disconnect and ensure selected account is cleared via the hook
  const handleDisconnect = () => {
    disconnectWallet();
  };

  // Close dropdown when clicking outside, avoiding toggle when button is clicked
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          !buttonRef.current.contains(event.target)) {
        if (showDropdown) {
          toggleWalletDropdown();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown, toggleWalletDropdown]);

  // Dynamic header text based on whether an account is selected
  const headerText = selectedAccount ? "Account Selected" : "Select Account";

  return (
    <>
      <button ref={buttonRef} className={styles.buttonStyle} onClick={toggleWalletDropdown}>
        <span style={{ margin: '0 2px' }}>WALLET</span>
        <img src={walletSVG} alt="Wallet" style={{ width: '15px', verticalAlign: 'middle' }} />
      </button>
      <div ref={dropdownRef} className={`${styles.dropdownContent} ${showDropdown ? styles.show : ''}`}>
        <Link to="/buydank" className={styles.buttonStyleDank}>GET DANK HERE 🤝</Link>
        <h3>{headerText}</h3>
        {isWalletConnected && (
          <>
            <p className={styles.connectedAccountsTitle}>---------------------connected accounts----------------------</p>
            <ul className={styles.accountsList}>
              {accounts.map((account, index) => (
                <li
                  key={index}
                  className={`${styles.accountItem} ${selectedAccount === account ? styles.selectedAccount : ''}`}
                  onClick={() => handleSelectAccount(account)}
                >
                  Wallet: {ens[account] ? ens[account] : `${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                  <br />
                  LAVA Balance: {balances[account] && balances[account].lava ? parseFloat(balances[account].lava).toPrecision(5) : 'Fetching...'}
                  <br />
                  DANK Balance: {balances[account] && balances[account].dank ? parseFloat(balances[account].dank).toPrecision(5) : 'Fetching...'}
                </li>
              ))}
            </ul>
          </>
        )}
        {isWalletConnected ? (
          <button className={styles.buttonStyleDisconnect} onClick={handleDisconnect}>
            <p>DISCONNECT</p>
          </button>
        ) : (
          <button className={styles.buttonStyleConnect} onClick={connectWallet}>
            <p>CONNECT</p>
          </button>
        )}
      </div>
    </>
  );
}

export default LoginSection;
