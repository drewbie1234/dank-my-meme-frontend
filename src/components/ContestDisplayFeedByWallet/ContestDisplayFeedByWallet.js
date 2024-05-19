import React, { useEffect, useState } from "react";
import styles from "./ContestDisplayFeedByWallet.module.css";
import ContestCard from "../ContestCard/ContestCard";
import { fetchContestsByWallet } from '../../utils/fetchContestsByWallet '; // Adjust the path according to where your function is
import { useWallet } from '../../contexts/WalletContext';

const ContestDisplayFeedByWallet = () => {
  const { selectedAccount } = useWallet();
  const [contests, setContests] = useState([]);

  useEffect(() => {
    const loadContests = async () => {
      try {
        const fetchedContests = await fetchContestsByWallet(selectedAccount);
        setContests(fetchedContests);
      } catch (error) {
        console.error('Error loading contests:', error);
      }
    };

    if (selectedAccount) {
      loadContests();
    }
  }, [selectedAccount]);

  return (
    <>
      <h1 className={styles.feed}>Submisisons</h1>
      <p>This is where users can view and submit their contributions.</p>
      <div className={styles.contestDisplayFeedContainer}>
        <div className={styles.scrollableContests}>
          {contests.map((contest) => (
            <ContestCard key={contest._id} contest={contest} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ContestDisplayFeedByWallet;
