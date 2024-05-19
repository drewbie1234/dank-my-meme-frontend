import React from "react";
import ContestDisplayFeed from "../ContestDisplayFeed/ContestDisplayFeed";
import { fetchContestsByVote } from '../../utils/fetchContestsByVote';
import { useWallet } from '../../contexts/WalletContext';
import styles from "./VotesPage.module.css"; // Using shared CSS Modules
import { Helmet } from 'react-helmet';

function VotesPage() {
  const { selectedAccount } = useWallet();

  const fetchVotedContestsForWallet = async () => {
    if (selectedAccount) {
      return await fetchContestsByVote(selectedAccount);
    } else {
      return [];
    }
  };

  const votesImageUrl = "https://app.dankmymeme.xyz/public/images/dank_my_meme.PNG";

  return (
    <div className={styles.pageContainer}>
      <Helmet>
        <title>Votes - Dank My Meme</title>
        <meta name="description" content="Check out the contests you've voted on!" />
        <meta property="og:title" content="Votes - Dank My Meme 👌" />
        <meta property="og:description" content="Check out the contests you've voted on!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://app.dankmymeme.xyz/votes" />
        <meta property="og:image" content={votesImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Votes - Dank My Meme" />
        <meta name="twitter:description" content="Check out the contests you've voted on!" />
        <meta name="twitter:image" content={votesImageUrl} />
      </Helmet>
      <div className={styles.contentContainer}>
        <h1>Votes</h1>
        <p>This is where users can view the contests and submissions they've voted on.</p>
        <div className={styles.contestDisplayFeedContainer}>
          <ContestDisplayFeed fetchContests={fetchVotedContestsForWallet} />
        </div>
      </div>
    </div>
  );
}

export default VotesPage;
