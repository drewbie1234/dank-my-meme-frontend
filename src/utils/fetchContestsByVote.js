import { toast } from 'react-toastify';

/**


 */
const fetchContestsByVote = async (walletAddress) => {
    try {
        console.log(`Fetching contests for wallet address: ${walletAddress}`);

        const response = await fetch(`https://app.dankmymeme.xyz/api/contests/votedContests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ walletAddress })
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
