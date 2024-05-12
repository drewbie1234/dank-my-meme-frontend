import React from 'react';
import { Link } from 'react-router-dom';  // Import the Link component from react-router-dom
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
        <span style={{ margin: '0 2px' }}>WALLET</span>
        <img src={walletSVG} alt="Wallet" style={{ width: '15px', verticalAlign: 'middle' }} />
      </button>
      <div className={`${styles.dropdownContent} ${showDropdown ? styles.show : ''}`}>
        <Link to="/buydank" className={styles.buttonStyleDank}>GET DANK HERE 🤝</Link> {/* New Link for BuyDankPage */}
        <ul className={styles.accountsList}>
          {accounts.map((account, index) => (
            <li
              key={index}
              className={`${styles.accountItem} ${selectedAccount === account ? styles.selectedAccount : ''}`}
              onClick={() => selectAccount(account)}
            >
              Wallet: {ens[account] ? ens[account] : `${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
              <br />
              Balance: {balances[account] ? parseFloat(balances[account]).toPrecision(6) : 'Fetching...'} ETH
            </li>
          ))}
        </ul>
        {isWalletConnected ? (
          <button className={styles.buttonStyle} onClick={disconnectWallet}>
            <p>DISCONNECT</p>
          </button>
        ) : (
          <button className={styles.buttonStyle} onClick={connectWallet}>
            <p>CONNECT</p>
          </button>
        )}
      </div>
    </>
  );
}

export default LoginSection;
