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
                toast.error("Wallet not connected. Please connect your wallet.");
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
    

    const submitEntry = useCallback(async (imageData, contest) => {
        if (!contract) {
            toast.error("Contract not initialized.");
            return;
        }

        const isApproved = await approveToken(contest);
        if (!isApproved) {
            console.log("token not approved")
            return;
        }

        try {
            const txResponse = await contract.submitEntry(imageData);
            const txReceipt = await txResponse.wait();
            toast.success("Entry submitted successfully!");
            return txReceipt;
        } catch (error) {
            console.error("Error submitting entry:", error);
            toast.error("Failed to submit entry. Please try again.");
        }
    }, [contract, approveToken]);

    const voteForSubmission = useCallback(async (submissionId, contest) => {
        if (!contract) {
            toast.error("Contract not initialized.");
            return;
        }

        const isApproved = await approveToken(contest);
        if (!isApproved) {
            return;
        }

        try {
            const txResponse = await contract.voteForSubmission(submissionId);
            const txReceipt = await txResponse.wait();
            toast.success("Vote cast successfully!");
            return txReceipt;
        } catch (error) {
            console.error("Error casting vote:", error);
            toast.error("Failed to cast vote. Please try again.");
        }
    }, [contract, approveToken]);

    return {
        submitEntry,
        voteForSubmission
    };
};

export default useContest;
