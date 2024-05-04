import React, { useState } from 'react';
import axios from 'axios';
import { useWallet } from '../../contexts/WalletContext'; // Import useWallet to access wallet-related state
import useContest from '../../hooks/useContest';

function MemeUploadForm({ contest }) {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const { selectedAccount } = useWallet();  // Access the selected account
    const { submitEntry } = useContest(contest);  // Assuming you need contest ID to instantiate the contest interactions
    const [ipfsHash, setIpfsHash] = useState('');  // Declaration of ipfsHash state
    

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setIsLoading(true);
            const response = await axios.post('http://localhost:3001/api/pinFile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setIpfsHash(response.data.IpfsHash);  // Set the IPFS hash after successful upload
            console.log('IPFS Hash:', response.data.IpfsHash);
            setIsLoading(false);
            onUploadSuccess(response.data.IpfsHash, selectedAccount);
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploadStatus('Error uploading file.');
            setIsLoading(false);
        }
    };

    const onUploadSuccess = async (ipfsHash, selectedAccount) => {
        console.log('File uploaded successfully. IPFS Hash:', ipfsHash);
        setUploadStatus('File uploaded successfully');
        console.log("selectedAccount:", selectedAccount)

        if (!selectedAccount) {
            console.error('No wallet connected');
            setUploadStatus('Please connect your wallet first.');
            return;
        }

        try {   
        
            await submitEntry(ipfsHash, contest);  // Call submitEntry from useContest
            console.log(contest)
            console.log('Submission sent to blockchain:', ipfsHash);
        } catch (error) {
            console.error('Error submitting entry to blockchain:', error);
            setUploadStatus('Error submitting entry to blockchain');
        }
    };


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Uploading...' : 'Upload to IPFS'}
                </button>
            </form>
            {uploadStatus && <p>{uploadStatus}</p>}
        </div>
    );
}

export default MemeUploadForm;
