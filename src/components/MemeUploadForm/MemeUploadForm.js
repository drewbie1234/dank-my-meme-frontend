import React, { useState } from 'react';
import axios from 'axios';
import { useWallet } from '../../contexts/WalletContext';
import useContest from '../../hooks/useContest';

function MemeUploadForm({ contest }) {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const { selectedAccount } = useWallet();
  const { submitEntry } = useContest(contest);
  const [ipfsHash, setIpfsHash] = useState('');

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
      const response = await axios.post('http://194.124.43.95:3001/api/pinFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setIpfsHash(response.data.IpfsHash);
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

    if (!selectedAccount) {
      console.error('No wallet connected');
      setUploadStatus('Please connect your wallet first.');
      return;
    }

    try {
      // Call submitEntry to write data to the blockchain
      await submitEntry(ipfsHash, contest);
      console.log('Submission sent to blockchain:', ipfsHash);

      // Call the backend API to record the submission
      const response = await axios.post('/api/submissions', {
        contest,
        userAddress: selectedAccount,
        ipfsHash
      });

      if (response.status === 200) {
        console.log('Submission recorded successfully in the database:', response.data);
        setUploadStatus('Submission successfully recorded in the database');
      } else {
        console.error('Error recording submission in the database:', response.data);
        setUploadStatus('Error recording submission in the database');
      }
    } catch (error) {
      console.error('Error submitting entry to blockchain or database:', error);
      setUploadStatus('Error submitting entry to blockchain or database');
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
