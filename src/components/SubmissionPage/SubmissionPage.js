// src/components/ContestBySubmissionPage/ContestBySubmissionPage.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ContestCard from '../ContestCard/ContestCard';
import styles from './SubmissionPage.module.css';

const SubmissionPage = () => {
  const { submissionId } = useParams();
  const [contest, setContest] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContestBySubmission = async () => {
      try {
        const response = await fetch(`https://app.dankmymeme.xyz:443/api/submission/${submissionId}`);
        const data = await response.json();
        if (response.ok) {
          setContest(data.contest);
          setSubmission(data.submission);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContestBySubmission();
  }, [submissionId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.contestBySubmissionPage}>
      {contest ? (
        <ContestCard contest={contest} />
      ) : (
        <div>Contest not found</div>
      )}
      {submission ? (
        <div className={styles.submissionContainer}>
          <img src={submission.image} alt="Submission" className={styles.submissionImage} />
          {/* Add other submission details as needed */}
        </div>
      ) : (
        <div>Submission not found</div>
      )}
    </div>
  );
};

export default SubmissionPage;
