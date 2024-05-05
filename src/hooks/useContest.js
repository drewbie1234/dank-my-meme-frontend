import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import contractData from '../contracts/Contest.json'; // Validate the path
import tokenData from '../contracts/Token.json'; // Validate the path
import { useWallet } from '../contexts/WalletContext'; // Ensure the import path is correct
import { ethers } from 'ethers'; // Import ethers

const { abi } = contractData[0];
const  tokenAbi  = tokenData;
console.log("abi: ", abi)
console.log(tokenAbi)


const useContest = (contest) => {
    const [contract, setContract] = useState(null);
    const { selectedAccount, isWalletConnected } = useWallet();
    

    useEffect(() => {
        const setupContract = async () => {
            console.log("Setting up contract")
            if (!window.ethereum) {
                toast.error("Ethereum wallet is not available. Install MetaMask.");
                return;
            }

            if (!isWalletConnected || !selectedAccount) {
                
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            console.log("provider: ", provider)
            console.log("signer: ", signer)
            console.log("abi: ", abi)
            console.log("contractAddress: ", contest.contractAddress)

            if (contest.contractAddress && abi) {
                const contestContract = new ethers.Contract(contest.contractAddress, abi, signer);
                setContract(contestContract);
                console.log("Contract Setup")
            } else {
                toast.error("Contract address or ABI is missing.");
            }
        };

        setupContract();
    }, [contest, selectedAccount, isWalletConnected]);

    const approveToken = useCallback(async () => {
        console.log(tokenAbi)
        console.log("Approving Token...");
        if (!contest.tokenAddress || !tokenAbi) {
            toast.error("Token contract address or ABI is missing.");
            return false;
        }
    
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const tokenContract = new ethers.Contract(contest.tokenAddress, tokenAbi, signer);
    
        try {
            const approval = await tokenContract.approve(contest.contractAddress, ethers.parseUnits(contest.entryFee.toString() + ethers.parseUnits(contest.votingFee.toString()), 18));
            await approval.wait();
            console.log("Token approved")
            return true;
        } catch (error) {
            console.error("Token approval error:", error);
            toast.error("Token approval failed.");
            return false;
        }
    }, [contest]);
    

    const submitEntry = useCallback(async (imageData) => {
        if (!contract) {
            toast.error("Contract not initialized.");
            return;
        }
    
        const isApproved = await approveToken();
        if (!isApproved) {
            console.log("Token not approved");
            return;
        }
    
        try {
            // Submit the entry and log the response object directly
            const txResponse = await contract.submitEntry(imageData);
            console.log("Transaction response:", txResponse);
    
            // Wait for transaction confirmation and log detailed receipt information
            const txReceipt = await txResponse.wait();
            toast.success("Entry submitted successfully!");
    
            // Detailed transaction receipt logs
            console.log(`Transaction Receipt:`);
            console.log(`  Transaction Hash: ${txReceipt.transactionHash}`);
            console.log(`  Block Number: ${txReceipt.blockNumber}`);
            console.log(`  Gas Used: ${txReceipt.gasUsed.toString()}`);
            console.log(`  Status: ${txReceipt.status === 1 ? "Success" : "Failure"}`);
            console.log(`  Logs: ${JSON.stringify(txReceipt.logs, null, 2)}`);
            console.log(`  Events: ${JSON.stringify(txReceipt.events, null, 2)}`);
    
            // Optionally, return the entire receipt for further analysis
            return txReceipt;
        } catch (error) {
            // Log detailed error information to aid debugging
            console.error("Error submitting entry:", error);
            toast.error("Failed to submit entry. Please try again.");
        }
    }, [contract, approveToken]);
    

    const voteForSubmission = useCallback(async (submissionIndex) => {
        if (!contract) {
            toast.error("Contract not initialized.");
            return;
        }
    
        // Ensure token approval before casting the vote
        const isApproved = await approveToken();
        if (!isApproved) {
            console.log("Token not approved");
            return;
        }
    
        try {
            // Debug log indicating voting operation start
            console.log(`Voting for submission index: ${submissionIndex}`);
    
            // Submit the vote and capture transaction response
            const txResponse = await contract.voteForSubmission(submissionIndex);
            console.log("Transaction response:", txResponse);
    
            // Wait for transaction confirmation and log detailed receipt information
            const txReceipt = await txResponse.wait();
            toast.success("Vote cast successfully!");
    
            // Detailed transaction receipt logs
            console.log(`Transaction Receipt:`);
            console.log(`  Transaction Hash: ${txReceipt.transactionHash}`);
            console.log(`  Block Number: ${txReceipt.blockNumber}`);
            console.log(`  Gas Used: ${txReceipt.gasUsed.toString()}`);
            console.log(`  Status: ${txReceipt.status === 1 ? "Success" : "Failure"}`);
            console.log(`  Logs: ${JSON.stringify(txReceipt.logs, null, 2)}`);
            console.log(`  Events: ${JSON.stringify(txReceipt.events, null, 2)}`);
    
            // Optionally, return the entire receipt for further analysis
            return txReceipt;
        } catch (error) {
            // Log detailed error information to aid debugging
            console.error("Error casting vote:", error);
            toast.error(`Failed to cast vote. Reason: ${error.message}`);
        }
    }, [contract, approveToken]);
    
    

    return {
        submitEntry,
        voteForSubmission
    };
};

export default useContest;
