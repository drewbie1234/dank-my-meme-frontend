const fetchContests = async () => {
    const response = await fetch('http://194.124.43.95:3001/api/contests', {
        method: 'GET', // Use GET method to fetch data
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch contests: ${response.status} ${response.statusText}`);
    }

    return await response.json();
};

export {fetchContests}