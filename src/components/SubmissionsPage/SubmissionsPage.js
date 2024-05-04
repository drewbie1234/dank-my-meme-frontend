import React from "react";
import ContestDisplayFeed from "../ContestDisplayFeed/ContestDisplayFeed"; // Adjust the path as necessary
import styles from "./SubmissionsPage.module.css"; // Using CSS Modules

// Assuming imports are correct and using CSS Modules
function SubmissionsPage() {
  return (
    <div className={styles.submissionsPageContainer}>
      <div className={styles.contentContainer}>
        <div className={styles.contestDisplayFeedContainer}>
        <h1>Submissions</h1>
        <p>This is where users can view and submit their contributions.</p>
        <div className={styles.contentContainer}>
            <div className={styles.feed} />
            <div className={styles.submissionsList}>
                <div className={styles.submission}>
                    <h2>Submission 1</h2>
                    <p>Description or other details of the first submission.</p>
                </div>
                <div className={styles.submission}>
                    <h2>Submission 2</h2>
                    <p>Description or other details of the second submission.</p>
                </div>
            </div>
      </div>
        </div>
      </div>
    </div>
  );
}

export default SubmissionsPage;


