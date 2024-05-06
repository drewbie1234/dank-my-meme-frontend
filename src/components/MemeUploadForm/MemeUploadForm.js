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
        const selectedFile = event.target.files[0];

        // Check if a file is selected
        if (!selectedFile) {
            setFile(null);
            return;
        }

        // Check image size and ratio
        const maxWidth = 1000; // Maximum width allowed
        const maxHeight = 1000; // Maximum height allowed
        const maxAspectRatio = maxWidth / maxHeight;

        const image = new Image();
        image.onload = () => {
            if (image.width <= maxWidth && image.height <= maxHeight && image.width / image.height === maxAspectRatio) {
                // Image meets size and aspect ratio requirements
                setFile(selectedFile);
            } else {
                // Image does not meet size and/or aspect ratio requirements
                setFile(null);
                alert('Please select an image within the specified size and aspect ratio limits.');
            }
        };
        image.src = URL.createObjectURL(selectedFile);
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
                <button type="submit" disabled={isLoading || !file}>
                    {isLoading ? 'Uploading...' : 'Upload to IPFS'}
                </button>
            </form>
            {uploadStatus && <p>{uploadStatus}</p>}
        </div>
    );
}

export default MemeUploadForm;
