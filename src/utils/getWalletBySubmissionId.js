import { fetchSubmissions } from './fetchSubmissions'; // Assume fetchSubmissions is exported from submissionUtils.js

const getWalletBySubmissionId = async (submissionId) => {
    const submissions = await fetchSubmissions([submissionId]);
    if (submissions.length === 0) {
        console.error("No submissions found with the given ID.");
        return null; // Return null or other suitable default if no submissions are found
    }

    const wallet = submissions[0].wallet;
    console.log(`winning wallet ${wallet}`)
    return wallet // Return the wallet address of the first submission
};

export { getWalletBySubmissionId };
