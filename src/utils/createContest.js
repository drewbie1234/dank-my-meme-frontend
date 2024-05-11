// src/utils/createContest.js

const createContest = async (contestData) => {
    
    const response = await fetch('https://app.dankmymeme.xyz:443/api/contests', {  // Update the port to 3001
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
};



export { createContest };
