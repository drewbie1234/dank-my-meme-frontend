import { toast } from 'react-toastify';

/**
 * Fetch a contest by its ID.
 * @param {string} contestId - The ID of the contest to fetch.
 * @returns {Promise<Object>} - The contest data associated with the given ID.
 * @throws {Error} - Throws an error if fetching the contest fails.
 */
const fetchContestById = async (contestId) => {
    try {
        console.log(`Fetching contest with ID: ${contestId}`);

        const response = await fetch(`https://app.dankmymeme.xyz/api/contests/${contestId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
            const errorData = await response.json();
            const errorMsg = errorData.message || 'Failed to fetch contest by ID';
            console.error(errorMsg);
            toast.error(errorMsg);
            throw new Error(errorMsg);
        }

        const data = await response.json();
        console.log('Fetched contest by ID:', data);
        return data;
    } catch (error) {
        console.error('Fetch contest by ID error:', error);
        toast.error('Network error or server issue fetching contest by ID.');
        throw error;
    }
};

export { fetchContestById };
