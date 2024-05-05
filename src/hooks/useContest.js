import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ethers } from 'ethers';
import { useWallet } from '../contexts/WalletContext';
import contractData from '../contracts/Contest.json';
import tokenData from '../contracts/Token.json';

const { abi } = contractData[0];
const tokenAbi = tokenData;

const useContest = (contest) => {
    const [contract, setContract] = useState(null);
    const { selectedAccount, isWalletConnected } = useWallet();

    // Set up the contract
    useEffect(() => {
        const setupContract = async () => {
            console.log("Starting to set up the contract...");

            if (!window.ethereum) {
                toast.error("Ethereum wallet is not available. Install MetaMask.");
                console.error("Error: Ethereum wallet not found.");
                return;
            }

            if (!isWalletConnected || !selectedAccount) {
                console.error("Error: Wallet not connected or account not selected.");
                return;
            }

            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();

                console.log("Provider:", provider);
                console.log("Signer:", signer);

                if (contest.contractAddress && abi) {
                    const contestContract = new ethers.Contract(contest.contractAddress, abi, signer);
                    setContract(contestContract);
                    console.log("Contract set up successfully:", contestContract);
                } else {
                    toast.error("Contract address or ABI is missing.");
                    console.error("Error: Contract address or ABI is missing.");
                }
            } catch (error) {
                console.error("Error during contract setup:", error);
            }
        };

        setupContract();
    }, [contest, selectedAccount, isWalletConnected]);

    // Approve token for submission and voting
    const approveToken = useCallback(async () => {
        console.log("Starting token approval process...");

        if (!contest.tokenAddress || !tokenAbi) {
            toast.error("Token contract address or ABI is missing.");
            console.error("Error: Token contract address or ABI is missing.");
            return false;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            console.log("Provider:", provider);
            console.log("Signer:", signer);

            const tokenContract = new ethers.Contract(contest.tokenAddress, tokenAbi, signer);
            console.log("Token Contract:", tokenContract);

            const entryFee = ethers.parseUnits(contest.entryFee.toString(), 18);
            const votingFee = ethers.parseUnits(contest.votingFee.toString(), 18);
            const totalApprovalAmount = entryFee + votingFee ;

            console.log("Total approval amount:", totalApprovalAmount.toString());

            const approvalTx = await tokenContract.approve(contest.contractAddress, totalApprovalAmount);
            console.log("Approval transaction:", approvalTx);

            const approvalReceipt = await approvalTx.wait();
            console.log("Approval receipt:", approvalReceipt);

            toast.success("Token approval successful!");
            return true;
        } catch (error) {
            console.error("Token approval error:", error);
            toast.error(`Token approval failed: ${error.message}`);
            return false;
        }
    }, [contest]);

    // Submit entry to the contest
    const submitEntry = useCallback(async (imageData) => {
        console.log("Starting to submit entry...");

        if (!contract) {
            toast.error("Contract not initialized.");
            console.error("Error: Contract not initialized.");
            return;
        }

        const isApproved = await approveToken();
        if (!isApproved) {
            console.log("Token not approved. Submission aborted.");
            return;
        }

        try {
            const txResponse = await contract.submitEntry(imageData);
            console.log("Transaction response:", txResponse);

            const txReceipt = await txResponse.wait();
            console.log("Transaction receipt:", txReceipt);

            toast.success("Entry submitted successfully!");

            return txReceipt;
        } catch (error) {
            console.error("Error submitting entry:", error);
            toast.error("Failed to submit entry. Please try again.");
        }
    }, [contract, approveToken]);

    // Vote for a submission
    const voteForSubmission = useCallback(async (submissionIndex, contest) => {
        console.log(`Starting to vote for submission index: ${submissionIndex}`);
        console.log(`CONTEST ID CHECK: ${contest.id}`);

        if (!contract) {
            toast.error("Contract not initialized.");
            console.error("Error: Contract not initialized.");
            return;
        }

        console.log(`Voting contract: ${contract}`)

        const isApproved = await approveToken();
        if (!isApproved) {
            console.log("Token not approved. Voting aborted.");
            return;
        }

        try {
            const txResponse = await contract.voteForSubmission(submissionIndex);
            console.log("Transaction response:", txResponse);

            const txReceipt = await txResponse.wait();
            console.log("Transaction receipt:", txReceipt);

            toast.success("Vote cast successfully!");

            try {
                const response = await axios.post('http://194.124.43.95:3001/api/vote', {
                    contest: contest.id,
                    voter: selectedAccount,
                    submissionIndex,
                    txHash: await txReceipt.transactionHash
                });

                if (response.status === 200) {
                    console.log('Vote recorded successfully in the database:', response.data);
                } else {
                    console.error('Error recording vote in the database:', response.data);
                }
            } catch (apiError) {
                console.error('Error recording vote to the database:', apiError);
            }

            return txReceipt;
        } catch (error) {
            console.error("Error casting vote:", error);
            toast.error(`Failed to cast vote. Reason: ${error.message}`);
        }
    }, [contract, approveToken, contest, selectedAccount]);

    // Submit meme (IPFS + Blockchain + DB)
    const submitMeme = useCallback(async (file, selectedAccount) => {
        console.log("Starting to upload meme...");

        if (!file || !selectedAccount) {
            console.error('Invalid file or no wallet connected');
            return { success: false, message: 'Invalid file or wallet not connected' };
        }

        try {
            const formData = new FormData();
            formData.append('file', file);

            const ipfsResponse = await axios.post('http://194.124.43.95:3001/api/pinFile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const ipfsHash = ipfsResponse.data.IpfsHash;
            console.log('IPFS Hash:', ipfsHash);
            
            const txReceipt = await submitEntry(ipfsHash);
            
            console.log('Tx receipt:', txReceipt);


            const dbResponse = await axios.post('http://194.124.43.95:3001/api/submissions', {
                contest,
                userAddress: selectedAccount,
                ipfsHash
            });

            if (dbResponse.status === 200) {
                console.log('Submission recorded successfully in the database:', dbResponse.data);
                return { success: true, message: 'Submission successfully recorded in the database' };
            } else {
                console.error('Error recording submission in the database:', dbResponse.data);
                return { success: false, message: 'Error recording submission in the database' };
            }
        } catch (error) {
            console.error('Error submitting meme:', error);
            return { success: false, message: 'Error submitting meme to blockchain or database' };
        }
    }, [contest, submitEntry]);

    return {
        submitEntry,
        voteForSubmission,
        submitMeme
    };
};

export default useContest;
