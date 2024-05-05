import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const useWallet = () => {
    const [accounts, setAccounts] = useState([]);
    const [balances, setBalances] = useState({});
    const [ens, setEns] = useState({});
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleWalletDropdown = () => setShowDropdown(!showDropdown);

    // Connect Wallet explicitly via button
    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const newAccounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setAccounts(newAccounts);
                updateWalletDetails(newAccounts);
                setIsWalletConnected(true);
                toast.success('Wallet connected successfully!');
            } catch (error) {
                console.error("Error connecting to MetaMask", error);
                toast.error('Failed to connect wallet. Check console for more details.');
            }
        } else {
            toast.warning('Please install MetaMask to use this feature!');
        }
    };

    const disconnectWallet = () => {
        setAccounts([]);
        setBalances({});
        setEns({});
        setIsWalletConnected(false);
        toast.info('Wallet disconnected successfully.');
    };

    // Update wallet balances and ENS names
    const updateWalletDetails = async (accounts) => {
        if (!accounts.length) {
            console.warn("No accounts to update details for.");
            return;
        }
        await Promise.all([fetchBalances(accounts), fetchEnsNames(accounts)]);
    };

    const fetchBalances = async (accounts) => {
        const balancePromises = accounts.map(account => fetchBalance(account));
        const results = await Promise.all(balancePromises);
        setBalances(results.reduce((acc, curr, idx) => ({
            ...acc,
            [accounts[idx]]: curr
        }), {}));
    };

    const fetchBalance = async (account) => {
        try {
            const response = await fetch(`http://194.124.43.95:3001/api/getBalance?account=${account}`);
            const data = await response.json();
            if (response.ok) {
                return data.balance;
            } else {
                toast.error(`Error fetching balance for account ${account}.`);
                return "Error";
            }
        } catch (error) {
            console.error("Error fetching balance", account, error);
            toast.error(`Network error fetching balance for account ${account}.`);
            return "Error";
        }
    };

    const fetchEnsNames = async (accounts) => {
        const ensPromises = accounts.map(account => fetchEnsName(account));
        const results = await Promise.all(ensPromises);
        setEns(results.reduce((acc, curr, idx) => ({
            ...acc,
            [accounts[idx]]: curr
        }), {}));
    };

    const fetchEnsName = async (account) => {
        try {
            const response = await fetch(`http://194.124.43.95:3001/api/getEns?account=${account}`);
            const data = await response.json();
            if (response.ok) {
                return data.ensName;
            } else {
                toast.error(`Error fetching ENS name for account ${account}.`);
                return "Error";
            }
        } catch (error) {
            console.error("Error fetching ENS name", account, error);
            toast.error(`Network error fetching ENS name for account ${account}.`);
            return "Error";
        }
    };

    const selectAccount = (account) => setSelectedAccount(account);

    return {
        accounts,
        balances,
        ens,
        isWalletConnected,
        showDropdown,
        toggleWalletDropdown,
        connectWallet,
        disconnectWallet,
        selectAccount,
        selectedAccount,
        ToastContainer
    };
};
