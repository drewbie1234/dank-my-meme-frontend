import { ethers, getAddress } from 'ethers';
import contractData from '../contracts/Contest.json';  // Ensure the path is correct

const { abi } = contractData[0];
const { bytecode } = contractData[0];


export const deployContract = async (formData) => {
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
    const wallet = new ethers.Wallet("f5e315df007ccb30d48e30b39fbd81beb7196a86954be0d006821cf1c2ae7a92", provider);
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

    const contractAddress = await contract.getAddress()
    
    console.log("Contract deployed at address:", contractAddress);

    // Return the address of the deployed contract
    return contractAddress;
};
