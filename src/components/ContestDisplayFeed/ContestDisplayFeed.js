import React, { useEffect, useState } from "react";
import styles from "./ContestDisplayFeed.module.css";
import ContestCard from "../ContestCard/ContestCard";

const ContestDisplayFeed = ({ fetchContests }) => {
  const [contests, setContests] = useState([]);

  useEffect(() => {
    const loadContests = async () => {
      try {
        const fetchedContests = await fetchContests();
        setContests(fetchedContests);
      } catch (error) {
        console.error("Failed to load contests", error);
      }
    };

    loadContests();
  }, [fetchContests]); // Add fetchContests to dependency array to re-run effect when it changes

  return (
    <div className={styles.contestDisplayFeedContainer}>
      <div className={styles.scrollableContests}>
        {contests.map((contest) => (
          <ContestCard key={contest._id} contest={contest} />
        ))}
      </div>
    </div>
  );
};

export default ContestDisplayFeed;
