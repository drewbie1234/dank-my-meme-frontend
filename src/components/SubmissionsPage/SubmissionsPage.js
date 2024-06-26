import React from "react";
import ContestDisplayFeed from "../ContestDisplayFeed/ContestDisplayFeed";
import { fetchContestsByWallet } from '../../utils/fetchContestsByWallet ';
import { useWallet } from '../../contexts/WalletContext';
import styles from "./SubmissionsPage.module.css"; // Using shared CSS Modules
import { Helmet } from 'react-helmet';

function SubmissionsPage() {
  const { selectedAccount } = useWallet();

  const fetchContestsForWallet = async () => {
    if (selectedAccount) {
      return await fetchContestsByWallet(selectedAccount);
    } else {
      return [];
    }
  };

  const submissionsImageUrl = "https://app.dankmymeme.xyz/public/images/dank_my_meme.PNG";

  return (
    <div className={styles.pageContainer}>
      <Helmet>
        <title>Submissions - Dank My Meme</title>
        <meta name="description" content="Check out the dank submissions from our users!" />
        <meta property="og:title" content="Submissions - Dank My Meme 👌" />
        <meta property="og:description" content="Check out the dank submissions from our users!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://app.dankmymeme.xyz/submissions" />
        <meta property="og:image" content={submissionsImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Submissions - Dank My Meme" />
        <meta name="twitter:description" content="Check out the dank submissions from our users!" />
        <meta name="twitter:image" content={submissionsImageUrl} />
      </Helmet>
      <div className={styles.contentContainer}>
        <h1>Submissions</h1>
        <p>This is where users can view their decentralised meme (DeMe) submisisons.</p>
        <div className={styles.contestDisplayFeedContainer}>
          <ContestDisplayFeed fetchContests={fetchContestsForWallet} />
        </div>
      </div>
    </div>
  );
}

export default SubmissionsPage;
