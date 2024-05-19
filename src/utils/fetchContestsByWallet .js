/**
 * Fetch contests by wallet address.
 * @param {string} walletAddress - The wallet address of the user.
 * @returns {Promise<Object[]>} - The contests associated with the wallet address.
 * @throws {Error} - Throws an error if fetching contests fails.
 */
const fetchContestsByWallet = async (walletAddress) => {
    try {
        console.log(`Fetching contests for wallet address: ${walletAddress}`);

        const response = await fetch('https://app.dankmymeme.xyz/api/contests/submissionsByWallet', {
            method: 'POST', // Use POST to send the wallet address in the body
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ walletAddress }) // Send wallet address in the body
        });

        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
            const errorData = await response.json();
            const errorMsg = errorData.message || 'Failed to fetch contests by wallet';
            console.error(errorMsg);
            throw new Error(errorMsg);
        }

        const data = await response.json();
        console.log('Fetched contests by wallet:', data);
        return data;
    } catch (error) {
        console.error('Fetch contests by wallet error:', error);
        throw error;
    }
};

export { fetchContestsByWallet };
