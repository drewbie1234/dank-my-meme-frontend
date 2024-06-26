import { ethers } from 'ethers';
import axios from 'axios';  // Ensure axios is imported
import contractData from '../contracts/Contest.json';  // Ensure the path is correct

const { abi, bytecode } = contractData[0];

/**
 * Deploy a new contract to the Ethereum network.
 * @param {Object} formData - The data for the contest.
 * @param {string} selectedAccount - The account to deploy the contract from.
 * @returns {Promise<string>} - The address of the deployed contract.
 * @throws {Error} - Throws an error if deployment fails.
 */
export const deployContract = async (formData, selectedAccount) => {
    const {
        tokenAddress,
        name,
        startDateTime,
        endDateTime,
        entryFee,
        votingFee,
        winnerPercentage,
        numberOfLuckyVoters
    } = formData;

    // Log formData to ensure all values are as expected
    console.log("Deploying contract with the following parameters:", formData);

    const url = process.env.ETH_PROVIDER_URL || 'https://turbo.magma-rpc.com';
    const provider = new ethers.JsonRpcProvider(url);
    console.log("Using Ethereum provider at:", url);

    // Initialize wallet with the private key and provider
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
        throw new Error("Private key is not set in environment variables");
    }
    const wallet = new ethers.Wallet(privateKey, provider);
    console.log("Wallet initialized with the provided private key and connected to provider.");

    // Create ContractFactory with ABI, bytecode, and signer
    const contractFactory = new ethers.ContractFactory(abi, bytecode, wallet);
    console.log("Contract factory created successfully.");

    // Convert date strings to Unix timestamps and log them
    const startTimestamp = Math.floor(new Date(startDateTime).getTime() / 1000);
    const endTimestamp = Math.floor(new Date(endDateTime).getTime() / 1000);
    console.log("Converted Start DateTime to Unix timestamp:", startTimestamp);
    console.log("Converted End DateTime to Unix timestamp:", endTimestamp);

    // Log other deployment parameters
    console.log("Token Address:", tokenAddress);
    console.log("Name:", name);
    console.log("Entry Fee:", entryFee);
    console.log("Voting Fee:", votingFee);
    console.log("Winner Percentage:", winnerPercentage);
    console.log("Number of Lucky Voters:", numberOfLuckyVoters);

    // // Update contest owner in the database
    // try {
    //     const response = await axios.patch(`http://localhost:3000/api/contests/${contestId}/owner`, {
    //         contestOwner: contractAddress
    //     });
    //     console.log('Database updated successfully:', response.data);
    // } catch (error) {
    //     console.error('Failed to update contest owner in database:', error);
    //     throw new Error('Failed to update contest owner in database');
    // }

    // Return the address of the deployed contract

    try {
        // Deploy the contract
        console.log("Initiating contract deployment...");
        const contract = await contractFactory.deploy(
            tokenAddress,
            name,
            startTimestamp,
            endTimestamp,
            ethers.parseUnits(entryFee, 18),
            ethers.parseUnits(votingFee, 18),
            winnerPercentage,
            numberOfLuckyVoters
        );

        // Wait for the contract to be deployed
        console.log("Waiting for contract to be deployed...");
        await contract.deployed();

        const contractAddress = await contract.getAddress();
        console.log("Contract deployed at address:", contractAddress);

        return contractAddress;
    } catch (error) {
        console.error("Error deploying contract:", error);
        throw new Error('Failed to deploy contract');
    }
};
