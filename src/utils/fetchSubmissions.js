// utils/fetchSubmissions.js

/**

 */
const fetchSubmissions = async (submissionIds) => {
    // Validate submissionIds array to prevent unnecessary API calls
    if (!submissionIds || !submissionIds.length) {
        console.error("Invalid submission IDs provided.");
        return []; // Return an empty array or other default value
    }

    try {
        // Log the submission IDs being fetched
        console.log(`Fetching submissions for IDs: ${submissionIds.join(',')}`);

        const response = await fetch(`https://app.dankmymeme.xyz:443/api/submissions?submissionIds=${submissionIds.join(',')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Log the response status
        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch submissions: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched submissions:', data);
        return data;
    } catch (error) {
        console.error("Error fetching submissions:", error.message);
        return []; // Return an empty array or other default value on error
    }
};

export { fetchSubmissions };
