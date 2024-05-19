/**
 * Create a new contest.
 * @param {Object} contestData - The data for the contest to be created.
 * @returns {Promise<Object>} - The created contest data.
 * @throws {Error} - Throws an error if the contest creation fails.
 */
const createContest = async (contestData) => {
    try {
        const response = await fetch('https://app.dankmymeme.xyz:443/api/contests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contestData)
        });

        if (!response.ok) {
            throw new Error(`Failed to create contest: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating contest:", error);
        throw error;
    }
};

export { createContest };
