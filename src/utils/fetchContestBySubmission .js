// utils/fetchContestBySubmission.js
export const fetchContestBySubmission = async (submissionId) => {
    try {
      const response = await fetch(`https://app.dankmymeme.xyz/api/submission/${submissionId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch contest by submission');
      }
      const data = await response.json();
      console.log("Fetched contest by submission:", data);
      return data;
    } catch (error) {
      console.error("Fetch contest by submission error:", error);
      throw error;
    }
  };
  