import { toast } from 'react-toastify';


export const fetchContestBySubmission = async (submissionId) => {
    try {
        console.log(`Fetching contest for submission ID: ${submissionId}`);

        const response = await fetch(`https://app.dankmymeme.xyz/api/submissions/${submissionId}`, {
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
