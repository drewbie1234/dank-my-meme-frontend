import React, { useState } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import useContest from '../../hooks/useContest';

function MemeUploadForm({ contest }) {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const { selectedAccount } = useWallet();
    const { submitMeme } = useContest(contest);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }

        setIsLoading(true);
        const result = await submitMeme(file, selectedAccount);
        setIsLoading(false);

        setUploadStatus(result.message);
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
