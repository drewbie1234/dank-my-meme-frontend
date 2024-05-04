import { useState, useEffect } from 'react';

export const useWallet = () => {
    const [accounts, setAccounts] = useState([]);
    const [balances, setBalances] = useState({});
    const [ens, setEns] = useState({});
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        isWalletConnected ? connectWallet() : disconnectWallet();
    }, [isWalletConnected]);

    const toggleWalletDropdown = () => setShowDropdown(!showDropdown);
    const toggleWalletConnection = () => setIsWalletConnected(!isWalletConnected);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const newAccounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setAccounts(newAccounts);
                updateWalletDetails(newAccounts);
                setIsWalletConnected(true);
                console.log()
            } catch (error) {
                console.error("Error connecting to MetaMask", error);
                alert("Failed to connect wallet. Check console for more details.");
            }
        } else {
            alert("Please install MetaMask to use this feature!");
        }
    };

    const disconnectWallet = () => {
        setAccounts([]);
        setBalances({});
        setEns({});
        setIsWalletConnected(false);
        console.log("Wallet disconnected successfully.");
    };

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
            return response.ok ? data.balance : "Error";
        } catch (error) {
            console.error("Error fetching balance", account, error);
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
            return response.ok ? data.ensName : "Error";
        } catch (error) {
            console.error("Error fetching ENS name", account, error);
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
        toggleWalletConnection,
        selectAccount,
        selectedAccount
    };
};
