import React, { useState } from 'react';
import { ethers } from 'ethers';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import contestABI from '../../contracts/Contest.json';

const EndContestForm = () => {
    const [contestAddress, setContestAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAddressChange = (event) => {
        setContestAddress(event.target.value);
    };

    const handleEndContest = async () => {
        if (!window.ethereum) {
            toast.error("Ethereum wallet not available. Please install MetaMask.");
            return;
        }

        if (!ethers.isAddress(contestAddress)) {
            toast.error("Invalid Ethereum address.");
            return;
        }

        setIsLoading(true);
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const contestContract = new ethers.Contract(contestAddress, contestABI[0].abi, signer);
            const txResponse = await contestContract.endContest();
            await txResponse.wait();

            toast.success("Contest ended successfully!");
        } catch (error) {
            toast.error(`Failed to end contest: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <div>
                <label>
                    Contest Address:
                    <input
                        type="text"
                        value={contestAddress}
                        onChange={handleAddressChange}
                        placeholder="Enter contest contract address"
                    />
                </label>
                <button onClick={handleEndContest} disabled={isLoading || !contestAddress}>
                    {isLoading ? "Ending Contest..." : "End Contest"}
                </button>
            </div>
        </>
    );
};

export default EndContestForm;
