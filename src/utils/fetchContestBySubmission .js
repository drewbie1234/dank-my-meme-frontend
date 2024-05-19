import { toast } from 'react-toastify';

/**
 * Fetch the contest associated with a given submission ID.
 * @param {string} submissionId - The ID of the submission.
 * @returns {Promise<Object>} - The contest data associated with the submission.
 * @throws {Error} - Throws an error if fetching the contest fails.
 */
export const fetchContestBySubmission = async (submissionId) => {
    try {
        console.log(`Fetching contest for submission ID: ${submissionId}`);

        const response = await fetch(`https://app.dankmymeme.xyz/api/submission`, {
            method: 'POST',  // Changed to POST to include submissionId in body
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ submissionId })  // Send submissionId in the request body
        });

        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
            const errorData = await response.json();
            const errorMsg = errorData.message || 'Failed to fetch contest by submission';
            console.error(errorMsg);
            toast.error(errorMsg);
            throw new Error(errorMsg);
        }

        const data = await response.json();
        console.log("Fetched contest by submission:", data);
        return data;
    } catch (error) {
        console.error("Fetch contest by submission error:", error);
        toast.error('Network error or server issue fetching contest by submission.');
        throw error;
    }
};
