import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ContestCard from '../ContestCard/ContestCard';
import styles from './ContestPage.module.css';
import { fetchContestById } from '../../utils/fetchContestsById';

const ContestPage = () => {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContest = async () => {
      console.log("Fetching data for contest ID:", contestId);
      try {
        const data = await fetchContestById(contestId);
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
  }, [contestId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.ContestPageContainer}>
      <div className={styles.contestByIdPage}>
      <h1 className={styles.feed}>Contest #{contestId}</h1>
      <p>This is the {contest.name} decantrised meme (DeMe) contest card, the contract was deployed by {contest.contestOwner} </p>
      {contest ? (
        <ContestCard key={contest._id} contest={contest} />
      ) : (
        <div>Contest not found</div>
      )}
    </div>
    </div>
  );
};

export default ContestPage;
