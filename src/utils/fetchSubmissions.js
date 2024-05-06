const fetchSubmissions = async (submissionIds) => {
    // Validate submissionIds array to prevent unnecessary API calls
    if (!submissionIds || !submissionIds.length) {
        console.error("Invalid submission IDs provided.");
        return []; // Return an empty array or other default value
    }

    try {
        const response = await fetch(`https://194.124.43.95:443/api/submissions?submissionIds=${submissionIds.join(',')}`, {
            method: 'GET', // Use GET method to fetch data
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch submissions: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        // Handle fetch errors (e.g., network issues)
        console.error("Error fetching submissions:", error.message);
        return []; // Return an empty array or other default value on error
    }
};

export { fetchSubmissions };
