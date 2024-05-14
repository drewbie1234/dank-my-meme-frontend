import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useWallet } from '../../contexts/WalletContext';
import useContest from '../../hooks/useContest';
import styles from './MemeUploadForm.module.css';

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
            toast.error('Please select a file to upload.');
            return;
        }

        setIsLoading(true);
        const result = await submitMeme(file, selectedAccount);
        setIsLoading(false);

        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} >
                <input type="file" onChange={handleFileChange} className={styles.fileButton}/>
                <button type="submit" disabled={isLoading} className={styles.uploadButton}>
                    {isLoading ? 'Uploading...' : 'Upload to IPFS'}
                </button>
                {isLoading && <div className={styles.loading}>Uploading, please wait...</div>}
            </form>
        </div>
    );
}

export default MemeUploadForm;
