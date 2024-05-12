import React, { useState } from 'react';
import { toast } from 'react-toastify';  // Import toast for better notifications
import { useWallet } from '../../contexts/WalletContext';
import useContest from '../../hooks/useContest';

function MemeUploadForm({ contest }) {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { selectedAccount } = useWallet();
    const { submitMeme } = useContest(contest);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            toast.error('Please select a file to upload.');  // Using toast for error message
            return;
        }

        setIsLoading(true);
        const result = await submitMeme(file, selectedAccount);
        setIsLoading(false);

        if (result.success) {
            console.log(result.message);  // Success toast
        } else {
            toast.error(result.message);  // Error toast if the upload fails
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
            {/* Removed the uploadStatus paragraph to handle all user feedback via toasts */}
        </div>
    );
}

export default MemeUploadForm;
