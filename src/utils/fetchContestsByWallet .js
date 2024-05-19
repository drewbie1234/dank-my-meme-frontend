/**
 * Fetch contests that a user has participated in using their wallet address.
 * @param {string} walletAddress - The wallet address of the user.
 * @returns {Promise<Object[]>} - The contests the user has participated in.
 * @throws {Error} - Throws an error if fetching contests fails.
 */
export const fetchContestsByWallet = async (walletAddress) => {
    try {
        // Log the wallet address being used to fetch the contests
        console.log(`Fetching contests for wallet address: ${walletAddress}`);

        const response = await fetch(`https://app.dankmymeme.xyz/api/contests/submissionsByWallet`, {
            method: 'POST',  // Changed to POST to include walletAddress in body
            headers: {
                'Content-Type': 'application/json'
            },
            
        });

        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
            const errorData = await response.json();
            const errorMsg = errorData.message || 'Failed to fetch contests by wallet';
            console.error(errorMsg);
            throw new Error(errorMsg);
        }

        const data = await response.json();
        console.log("Fetched contests by wallet:", data);
        return data;
    } catch (error) {
        console.error("Fetch contests by wallet error:", error);
        throw error;
    }
};
