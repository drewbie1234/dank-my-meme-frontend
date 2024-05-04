import React from "react";
import styles from "./SubmissionsPage.module.css"; // Adjust path if needed

const SubmissionsPage = () => {
  return (
    <div className={styles.submissionsPageContainer}>
        <h1>Submissions Page</h1>
        <p>This is where users can view and submit their contributions.</p>
        <div className={styles.contentContainer}>
            <div className={styles.contestDisplayFeedContainer} />
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
  );
};

export default SubmissionsPage;
