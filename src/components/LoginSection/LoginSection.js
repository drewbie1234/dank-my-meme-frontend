import React from 'react';
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

  return (
    <>
      <button className={styles.buttonStyle} onClick={toggleWalletDropdown}>
        <span style={{ margin: '0 2px' }}>Wallet </span>
        <img src={walletSVG} alt="Wallet" style={{ width: '15px', verticalAlign: 'middle' }} />
      </button>
      <div className={`${styles.dropdownContent} ${showDropdown ? styles.show : ''}`}>
        <ul className={styles.accountsList}>
          {accounts.map((account, index) => (
            <li
              key={index}
              className={`${styles.accountItem} ${selectedAccount === account ? styles.selectedAccount : ''}`}
              onClick={() => selectAccount(account)}
            >
              Wallet: {ens[account] ? ens[account] : `${account.substring(0, 6)}...${account.substring(account.length - 5)}`}
              <br />
              Balance: {balances[account] ? parseFloat(balances[account]).toPrecision(6) : 'Fetching...'} ETH
            </li>
          ))}
        </ul>
        {/* The button specifically connects or disconnects the wallet */}
        {isWalletConnected ? (
          <button className={styles.buttonStyle} onClick={disconnectWallet}>
            Disconnect
          </button>
        ) : (
          <button className={styles.buttonStyle} onClick={connectWallet}>
            Connect
          </button>
        )}
      </div>
    </>
  );
}

export default LoginSection;
