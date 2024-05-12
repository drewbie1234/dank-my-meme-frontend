import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ContestCard from '../ContestCard/ContestCard';

const SubmissionPage = ( { contest , submissionObject }) => {
    const { submissionId } = useParams();
    const [submission, setSubmission] = useState(submissionObject);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/submission/${submissionId}`)
            .then(res => res.json())
            .then(data => {
                setSubmission(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch submission:', error);
                setLoading(false);
            });
    }, [submissionId]);

    if (loading) return <div>Loading...</div>;
    if (!submission) return <div>Submission not found.</div>;

    return (
        <ContestCard contest={contest}  />
    );
};

export default SubmissionPage;
