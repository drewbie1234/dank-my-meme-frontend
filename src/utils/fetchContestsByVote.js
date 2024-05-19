export const fetchContestsByVote = async (walletAddress) => {
    try {
        const response = await fetch(`https://app.dankmymeme.xyz/api/contests/contestsByVote/${walletAddress}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch voted contests');
        }
        const data = await response.json();
        console.log("Fetched voted contests:", data);
        return data;
    } catch (error) {
        console.error("Fetch voted contests error:", error);
        throw error;
    }
};
