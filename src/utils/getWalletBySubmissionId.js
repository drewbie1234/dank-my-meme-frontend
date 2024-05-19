import { fetchSubmissions } from './fetchSubmissions'; // Assume fetchSubmissions is exported from submissionUtils.js

/**
 * Fetch the wallet address associated with a given submission ID.
 * @param {string} submissionId - The ID of the submission.
 * @returns {Promise<string|null>} - The wallet address or null if not found.
 * @throws {Error} - Throws an error if fetching the submission fails.
 */
const getWalletBySubmissionId = async (submissionId) => {
    try {
        // Fetch the submission details for the given submission ID
        const submissions = await fetchSubmissions([submissionId]);

        // Log the fetched submissions
        console.log(`Fetched submissions: ${JSON.stringify(submissions, null, 2)}`);

        if (submissions.length === 0) {
            console.error("No submissions found with the given ID.");
            return null; // Return null if no submissions are found
        }

        const wallet = submissions[0].wallet;
        console.log(`Wallet address for submission ID ${submissionId}: ${wallet}`);
        return wallet; // Return the wallet address of the first submission
    } catch (error) {
        console.error(`Error fetching wallet by submission ID: ${submissionId}`, error);
        throw error; // Rethrow the error for the caller to handle
    }
};

export { getWalletBySubmissionId };
