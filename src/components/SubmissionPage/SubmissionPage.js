import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ContestCard from '../ContestCard/ContestCard';

const SubmissionPage = ({ contest }) => {
    const { submissionId } = useParams(); // Retrieve the submission ID from the URL
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/submission/${submissionId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                if (response.headers.get("content-type").includes("application/json")) {
                    return response.json();
                }
                throw new Error('Response not JSON');
            })
            .then(data => {
                setSubmission(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch submission:', error);
                setLoading(false);
            });
    }, [submissionId]);
     // Dependency array includes submissionId to refetch if URL changes

    if (loading) return <div>Loading...</div>; // Display a loading message while data is being fetched
    if (!submission) return <div>Submission not found.</div>; // Display a message if no submission is found

    return (
        <ContestCard contest={contest} submission={submission} />
    );
};

export default SubmissionPage;
