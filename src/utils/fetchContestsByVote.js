import { toast } from 'react-toastify';

/**
 * Fetch contests that the user has voted on.
 * @param {string} walletAddress - The wallet address of the user.
 * @returns {Promise<Object[]>} - The contests the user has voted on.
 * @throws {Error} - Throws an error if fetching contests fails.
 */

const fetchContestsByVote = async (walletAddress) => {
    try {
        // Log the wallet address being used to fetch the contests
        console.log(`Fetching contests for wallet address: ${walletAddress}`);

        const response = await fetch(`https://app.dankmymeme.xyz/api/contests/votedContests`, {
            method: 'POST',  // Changed to POST to include walletAddress in body
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ walletAddress }) // Include walletAddress in the request body
        });

        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
            const errorData = await response.json();
            const errorMsg = errorData.message || 'Failed to fetch contests by vote';
            console.error(errorMsg);
            toast.error(errorMsg);
            throw new Error(errorMsg);
        }

        const data = await response.json();
        console.log('Fetched contests by vote:', data);
        return data;
    } catch (error) {
        console.error("Fetch contests by vote error:", error);
        toast.error('Network error or server issue fetching contests by vote.');
        throw error;
    }
};

export { fetchContestsByVote };
