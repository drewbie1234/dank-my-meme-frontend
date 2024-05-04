import React, { useState } from 'react';
import { ethers } from 'ethers';
import styles from './ContestCreationForm.module.css';
import { useWallet } from '../../contexts/WalletContext'; // Update path if necessary
import { deployContract } from '../../utils/deployContest'; // Make sure this path is correct

const ContestCreationForm = ({ onCreate }) => {
    const { selectedAccount, isWalletConnected } = useWallet();
    const [formData, setFormData] = useState({
        name: 'testcon',
        startDateTime: new Date().toISOString().slice(0, -1),
        endDateTime: new Date(Date.now() + 86400000).toISOString().slice(0, -1),
        entryFee: '0.01',
        votingFee: '0.1',
        winnerPercentage: '75',
        numberOfLuckyVoters: '1',
        tokenAddress: '0xe12154f598138d7B77179739DABEDf4AaD80f824' // Assuming DANK is the default token
    });
    const [error, setError] = useState('');
    const tokenAddresses = [
        { address: '0xe12154f598138d7B77179739DABEDf4AaD80f824', name: 'DANK' },
    ];

    console.log('selected acc:', selectedAccount);
    console.log('isWalletConnected:', isWalletConnected);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isWalletConnected || !selectedAccount) {
            setError('No wallet connected. Please connect your wallet first.');
            return;
        }

        if (!formData.name || !formData.startDateTime || !formData.endDateTime || !formData.tokenAddress) {
            setError('Please fill all the fields properly, including selecting a token address.');
            return;
        }

        try {
            setError('');
            const deployedContractAddress = await deployContract(formData, selectedAccount);
            console.log('Contract deployed at:', deployedContractAddress);
            onCreate({...formData, contractAddress: deployedContractAddress});
        } catch (deploymentError) {
            console.error("Deployment Error:", deploymentError);
            setError(`Failed to deploy contract: ${deploymentError.message}`);
        }
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.contestCreationForm}>
                <h2>Create a New Contest</h2>
                {error && <p className={styles.error}>{error}</p>}
                <label>
                    Contest Name:
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                </label>
                <label>
                    Start Date:
                    <input type="datetime-local" name="startDateTime" value={formData.startDateTime} onChange={handleChange} />
                </label>
                <label>
                    End Date:
                    <input type="datetime-local" name="endDateTime" value={formData.endDateTime} onChange={handleChange} />
                </label>
                <label>
                    Entry Fee (ETH):
                    <input type="number" step="0.01" name="entryFee" value={formData.entryFee} onChange={handleChange} />
                </label>
                <label>
                    Voting Fee (ETH):
                    <input type="number" step="0.01" name="votingFee" value={formData.votingFee} onChange={handleChange} />
                </label>
                <label>
                    Winner Percentage:
                    <input type="number" step="1" min="0" max="100" name="winnerPercentage" value={formData.winnerPercentage} onChange={handleChange} />
                </label>
                <label>
                    Number of Lucky Voters:
                    <input type="number" min="1" name="numberOfLuckyVoters" value={formData.numberOfLuckyVoters} onChange={handleChange} />
                </label>
                <label>
                    Token Address:
                    <select name="tokenAddress" value={formData.tokenAddress} onChange={handleChange}>
                        <option value="">Select a Token</option>
                        {tokenAddresses.map(token => (
                            <option key={token.address} value={token.address}>{token.name}</option>
                        ))}
                    </select>
                </label>
                <button type="submit">Create Contest</button>
            </form>
        </div>
    );
};

export default ContestCreationForm;
