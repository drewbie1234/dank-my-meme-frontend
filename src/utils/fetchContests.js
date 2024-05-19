import { toast } from 'react-toastify';

/**
 * Fetch all contests from the server.
 * @returns {Promise<Object[]>} - A promise that resolves to the list of contests.
 * @throws {Error} - Throws an error if fetching contests fails.
 */
const fetchContests = async () => {
    try {
        // Log the start of the fetch operation
        console.log('Fetching all contests from the server...');

        const response = await fetch('https://app.dankmymeme.xyz:443/api/contests', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
            const errorMsg = `Failed to fetch contests: ${response.status} ${response.statusText}`;
            console.error(errorMsg);
            toast.error(errorMsg);
            throw new Error(errorMsg);
        }

        const data = await response.json();
        console.log('Fetched contests:', data);
        return data;
    } catch (error) {
        console.error('Error fetching contests:', error);
        toast.error('Network error or server issue fetching contests.');
        throw error;
    }
};

export { fetchContests };
