import { useReducer } from 'react';
import { ethers } from 'ethers'; // Ensure ethers is imported
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import tokenData from '../contracts/Token.json';

const dankTokenAbi = tokenData;

const initialState = {
    accounts: [],
    balances: {},
    ens: {},
    isWalletConnected: false,
    selectedAccount: null,
    showDropdown: false,
};

function walletReducer(state, action) {
    switch (action.type) {
        case 'TOGGLE_DROPDOWN':
            return { ...state, showDropdown: !state.showDropdown };
        case 'CONNECT_WALLET':
            return { ...state, accounts: action.payload.accounts, isWalletConnected: true };
        case 'DISCONNECT_WALLET':
            return { ...initialState, showDropdown: state.showDropdown };
        case 'UPDATE_BALANCES':
            return { ...state, balances: action.payload };
        case 'UPDATE_ENS':
            return { ...state, ens: action.payload };
        case 'SELECT_ACCOUNT':
            return { ...state, selectedAccount: action.payload };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export const useWallet = () => {
    const [state, dispatch] = useReducer(walletReducer, initialState);

    const toggleWalletDropdown = () => {
        dispatch({ type: 'TOGGLE_DROPDOWN' });
    };

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const newAccounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                dispatch({ type: 'CONNECT_WALLET', payload: { accounts: newAccounts } });
                updateWalletDetails(newAccounts);
                toast.success('MetaMask wallet connected!');
            } catch (error) {
                console.error("Error connecting to MetaMask", error);
                toast.error('Failed to connect wallet. Check console for more details.');
            }
        } else {
            toast.warning('Please install MetaMask to use this feature!');
        }
    };

    const disconnectWallet = () => {
        dispatch({ type: 'DISCONNECT_WALLET' });
        toast.info('Wallet disconnected successfully.');
    };

    const selectAccount = (account) => {
        dispatch({ type: 'SELECT_ACCOUNT', payload: account });
    };

    // Update wallet balances and ENS names
    const updateWalletDetails = async (accounts) => {
        if (!accounts.length) {
            console.warn("No accounts to update details for.");
            return;
        }
        fetchBalances(accounts);
        fetchEnsNames(accounts);
    };

    const dankTokenAddress = "0xe12154f598138d7B77179739DABEDf4AaD80f824"; // Replace with actual DANK token contract address

const fetchTokenBalance = async (account, provider, tokenAddress) => {
    const tokenContract = new ethers.Contract(tokenAddress, dankTokenAbi, provider);
    try {
        const balanceBigInt = await tokenContract.balanceOf(account);
        return ethers.formatEther(balanceBigInt); // Convert Wei to Ether
    } catch (error) {
        console.error("Error fetching token balance for account", account, error);
        return "Error";
    }
};

const fetchBalances = async (accounts) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    try {
        const balancePromises = accounts.map(async account => {
            const lavaBalance = await provider.getBalance(account); // Fetch native balance
            const dankBalance = await fetchTokenBalance(account, provider, dankTokenAddress);
            return {
                account,
                lava: ethers.formatEther(lavaBalance), // Convert Wei to Ether for native balance
                dank: dankBalance
            };
        });
        const results = await Promise.all(balancePromises);
        const balances = results.reduce((acc, {account, lava, dank}) => ({
            ...acc,
            [account]: { lava, dank }
        }), {});
        dispatch({ type: 'UPDATE_BALANCES', payload: balances });
    } catch (error) {
        console.error("Error fetching balances", error);
        toast.error("Failed to fetch balances.");
    }
};

    const fetchEnsNames = async (accounts) => {
        try {
            const ensPromises = accounts.map(account => fetchEnsName(account));
            const results = await Promise.all(ensPromises);
            const ens = results.reduce((acc, ensName, idx) => ({
                ...acc,
                [accounts[idx]]: ensName
            }), {});
            dispatch({ type: 'UPDATE_ENS', payload: ens });
        } catch (error) {
            console.error("Error fetching ENS names", error);
            toast.error("Failed to fetch ENS names.");
        }
    };

    const fetchEnsName = async (account) => {
        try {
            const response = await fetch(`https://app.dankmymeme.xyz:443/api/getEns?account=${account}`);
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

    return {
        ...state,
        toggleWalletDropdown,
        connectWallet,
        disconnectWallet,
        selectAccount
    };
};
