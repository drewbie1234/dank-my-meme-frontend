// src/utils/createContest.js

const createContest = async (contestData) => {
    
    const response = await fetch('http://localhost:3001/api/contests', {  // Update the port to 3001
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
