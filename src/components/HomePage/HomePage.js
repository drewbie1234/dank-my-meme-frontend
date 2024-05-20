import React from "react";
import ContestDisplayFeed from "../ContestDisplayFeed/ContestDisplayFeed"; // Adjust the path as necessary
import { fetchContests } from '../../utils/fetchContests'; // Adjust the path as necessary
import styles from "./HomePage.module.css"; // Using shared CSS Modules
import { Helmet } from 'react-helmet';

function HomePage() {
  const homeImageUrl = "https://app.dankmymeme.xyz/public/images/dank_my_meme.PNG"; // Replace with your actual image URL

  return (
    <div className={styles.pageContainer}>
      <Helmet>
        <title>Home - Dank My Meme</title>
        <meta name="description" content="Explore the dankest memes on the web!" />
        <meta property="og:title" content="Home - Dank My Meme 👌" />
        <meta property="og:description" content="Explore the dankest memes on the web!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://app.dankmymeme.xyz/" />
        <meta property="og:image" content={homeImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Home - Dank My Meme" />
        <meta name="twitter:description" content="Explore the dankest memes on the web!" />
        <meta name="twitter:image" content={homeImageUrl} />
      </Helmet>
      <div className={styles.contentContainer}>
      <h1 className={styles.feed}>DeMe Feed</h1>
      <p>This is where users can view the decentralised meme (DeMe) contest feed.</p>
        <div className={styles.contestDisplayFeedContainer}>
          <ContestDisplayFeed fetchContests={fetchContests} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
