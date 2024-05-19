// utils/fetchContestsByWallet.js
export const fetchContestsByWallet = async (walletAddress) => {
    try {
        const response = await fetch(`https://app.dankmymeme.xyz/api/contests/submissionsByWallet/${walletAddress}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch contests by wallet');
        }
        const data = await response.json();
        console.log("Fetched contests by wallet:", data);
        return data;
    } catch (error) {
        console.error("Fetch contests by wallet error:", error);
        throw error;
    }
};


