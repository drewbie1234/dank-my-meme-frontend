import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ContestCard from '../ContestCard/ContestCard';
import styles from './SubmissionPage.module.css';
import { fetchContestBySubmission } from '../../utils/fetchContestBySubmission ';

const SubmissionPage = () => {
  const { submissionId } = useParams();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContest = async () => {
      console.log("Fetching data for submission ID:", submissionId);
      try {
        const data = await fetchContestBySubmission(submissionId);
        console.log("Fetched data:", data);
        setContest(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [submissionId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.SubmissionPageCpntainer}>
      <div className={styles.contestBySubmissionPage}>
      <h1 className={styles.feed}>Submission #{submissionId}</h1>
      <p>This is where users can view their decentralised meme (deMe) submissions.</p>
      {contest ? (
        <ContestCard key={contest._id} contest={contest} />
      ) : (
        <div>Contest not found</div>
      )}
    </div>
    </div>
  );
};

export default SubmissionPage;
