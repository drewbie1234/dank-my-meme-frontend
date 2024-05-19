import React, { useEffect, useState } from "react";
import styles from "./ContestDisplayFeed.module.css";
import ContestCard from "../ContestCard/ContestCard";

const ContestDisplayFeed = ({fetchContests}) => {
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
