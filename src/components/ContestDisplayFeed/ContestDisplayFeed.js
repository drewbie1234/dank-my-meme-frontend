import React, { useEffect, useState } from "react";
import styles from "./ContestDisplayFeed.module.css";
import ContestCard from "../ContestCard/ContestCard";
// Import the function to fetch competitions
import { fetchContests } from '../../utils/fetchContests'; // Adjust the path according to where your function is

const ContestDisplayFeed = () => {
  const [contests, setContests] = useState([]);

  useEffect(() => {
    const loadContests = async () => {
      const fetchedContests = await fetchContests();
      setContests(fetchedContests);
    };

    loadContests();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <>
      <h2 className={styles.feed}>Contests</h2>
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

export default ContestDisplayFeed;
