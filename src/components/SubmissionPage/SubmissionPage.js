import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ContestCard from '../ContestCard/ContestCard';

const SubmissionPage = () => {
    const { submissionId } = useParams(); // Retrieve the submission ID from the URL
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contest, setContest] = useState (null)
    
    useEffect(() => {
        fetch(`https://app.dankmymeme.xyz:443/api/submission/${submissionId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setContest(data.contest);  // Assuming you now set the whole contest data
                setSubmission(data.contest.submissions[0]);  // The first item should be your specific submission
                setLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch submission:', error);
                setLoading(false);
            });
    }, [submissionId]);
    

    if (loading) return <div>Loading...</div>; // Display a loading message while data is being fetched
    if (!submission) return <div>Submission not found.</div>; // Display a message if no submission is found

    return (
        <ContestCard contest={contest} submission={submission} />
    );
};

export default SubmissionPage;
