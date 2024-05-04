import React from "react";
import ContestDisplayFeed from "../ContestDisplayFeed/ContestDisplayFeed"; // Adjust the path as necessary
import styles from "./HomePage.module.css"; // Using CSS Modules

// Assuming imports are correct and using CSS Modules
function HomePage() {
  return (
    <div className={styles.homePageContainer}>
      <div className={styles.contentContainer}>
        <div className={styles.contestDisplayFeedContainer}>
          <ContestDisplayFeed />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
