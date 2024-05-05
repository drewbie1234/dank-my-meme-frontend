import { toast } from 'react-toastify';

const fetchContests = async () => {
    try {
        const response = await fetch('http://194.124.43.95:3001/api/contests', {
            method: 'GET', // Use GET method to fetch data
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorMsg = `Failed to fetch contests: ${response.status} ${response.statusText}`;
            toast.error(errorMsg);
            throw new Error(errorMsg);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching contests:', error);
        toast.error('Network error or server issue fetching contests.');
        throw error;
    }
};

export { fetchContests };
