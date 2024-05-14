import React, { useState, useRef, useEffect } from "react";
import styles from "./ContestCard.module.css";
import MemeContestGallery from "../MemeContestGallery/MemeContestGallery";
import MemeUploadForm from "../MemeUploadForm/MemeUploadForm";
import submitIcon from "../../svgs/submit.svg";
import voteIcon from "../../svgs/vote.svg";
import endIcon from "../../svgs/vote.svg";
import withdrawIcon from "../../svgs/vote.svg";
import etherscanLogo from "../../svgs/etherscanSVG.svg";
import { toast } from 'react-toastify';
import { useWallet } from '../../contexts/WalletContext';
import useContest from '../../hooks/useContest';
import { shortenAddress } from "../../utils/shortenAddress";

const ContestCard = ({ contest }) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedSubmissionIndex, setSelectedSubmissionIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { selectedAccount, isConnected, connectWallet, disconnectWallet } = useWallet();
  const { voteForSubmission, endContest, withdrawUnclaimedPrize } = useContest(contest);

  const [isEtherscanLogoVisible, setIsEtherscanLogoVisible] = useState(false);
  const etherscanLogoRef = useRef(null);
  const smallEtherscanLogoRefs = useRef([]);
  const moneyBagEmojiRef = useRef(null); // Reference for the money bag emoji

  const totalPrizePot = (contest.submissions.length * contest.entryFee) + (contest.voters.length * contest.votingFee);

  const handleUploadClick = () => {
    setShowUploadForm(!showUploadForm);
  };

  const toggleDetails = () => setShowDetails(!showDetails);

  const handleVoteClick = async () => {
    if (selectedSubmissionIndex === null) {
      toast.error('Please select a submission to vote for.');
      return;
    }

    setIsLoading(true);
    try {
      const receipt = await voteForSubmission(selectedSubmissionIndex);

      if (receipt) {
        toast.success('Vote successfully recorded!');
      } else {
        throw new Error('Failed to record vote.');
      }
    } catch (error) {
      toast.error('Failed to record vote. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndContest = async () => {
    setIsLoading(true);
    try {
      const receipt = await endContest();
      if (receipt) {
        toast.success("Contest ended successfully!");
      } else {
        throw new Error("Failed to end the contest.");
      }
    } catch (error) {
      toast.error("Error ending the contest. Ensure you are the contest owner and the correct accounts are selected.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawUnclaimedPrize = async () => {
    setIsLoading(true);
    try {
      const receipt = await withdrawUnclaimedPrize();
      if (receipt) {
        toast.success("Unclaimed prize withdrawn successfully!");
      } else {
        throw new Error("Failed to withdraw unclaimed prize.");
      }
    } catch (error) {
      toast.error("Error withdrawing unclaimed prize. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5 // When 50% of the element is visible
    };

    const handleIntersection = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === etherscanLogoRef.current) {
            setIsEtherscanLogoVisible(true);
            entry.target.classList.add(styles.animate); // Add animate class when visible
          } else {
            smallEtherscanLogoRefs.current.forEach(ref => {
              if (entry.target === ref) {
                ref.classList.add(styles.animate); // Add animate class to small logos when visible
              }
            });
          }
          if (entry.target === moneyBagEmojiRef.current) {
            entry.target.classList.add(styles.animate); // Add animate class to money bag emoji when visible
          }
        } else {
          if (entry.target === etherscanLogoRef.current) {
            entry.target.classList.remove(styles.animate); // Remove animate class when not visible
          } else {
            smallEtherscanLogoRefs.current.forEach(ref => {
              if (entry.target === ref) {
                ref.classList.remove(styles.animate); // Remove animate class from small logos when not visible
              }
            });
          }
          if (entry.target === moneyBagEmojiRef.current) {
            entry.target.classList.remove(styles.animate); // Remove animate class from money bag emoji when not visible
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);
    observer.observe(etherscanLogoRef.current);
    smallEtherscanLogoRefs.current.forEach(ref => observer.observe(ref));
    observer.observe(moneyBagEmojiRef.current); // Observe the money bag emoji

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className={styles.contestCard}>
      <div className={styles.h3WithEtherscan}>
        <h3 className={styles.contestId}>
          {contest.name}
        </h3>
        <a href={`https://magmascan.org/address/${contest.contractAddress}`} target="_blank" rel="noopener noreferrer" className={styles.etherScanLink}>
          <img src={etherscanLogo} alt="Etherscan" className={styles.etherscanLogo} ref={etherscanLogoRef} />
        </a>
      </div>

      <MemeContestGallery contest={contest} onSelectedSubmissionChange={setSelectedSubmissionIndex} />

      <p className={styles.prize}>
        <strong>Total Prize Pot </strong>
        <a href={`https://magmascan.org/address/${contest.contractAddress}?tab=tokens`} target="_blank" rel="noopener noreferrer" className={styles.prizeEmojiLink}>
          <span className={styles.prizeEmoji} ref={moneyBagEmojiRef}>💰</span>
        </a>
        : {totalPrizePot} DANK
      </p>
      <div className={styles.buttonBar}>
        <button className={styles.button} onClick={handleUploadClick}>SUBMIT</button>
        <button className={styles.button} onClick={handleVoteClick}>VOTE</button>
        <button className={styles.button} onClick={handleEndContest}>END CONTEST</button>
        <button className={styles.button} onClick={handleWithdrawUnclaimedPrize}>WITHDRAW PRIZE</button>
      </div>
      <span onClick={toggleDetails} className={styles.detailsToggle}>
        {showDetails ? 'Hide Contest Details ▲' : 'Show Contest Details ▼'}
      </span>
      <div className={`${styles.infoPanel} ${showDetails ? styles.show : ''}`}>
        <p><strong>Start:</strong> {new Date(contest.startDateTime).toLocaleString()}</p>
        <p><strong>End:</strong> {new Date(contest.endDateTime).toLocaleString()}</p>
        <p><strong>Entry Fee:</strong> {contest.entryFee} DANK</p>
        <p><strong>Voting Fee:</strong> {contest.votingFee} DANK</p>
        <p><strong>Prize Distribution:</strong> Winner gets {contest.winnerPercentage}% of the total pot</p>
        <p><strong>Number of Lucky Voter6s:</strong> {contest.numberOfLuckyVoters}</p>
        <p><strong>Total Submissions:</strong> {contest.submissions.length}</p>
        <p><strong>Highest Votes:</strong> {contest.highestVotes || 'NA'}</p>
        <p><strong>Prizes Distributed:</strong> {contest.contestEnded ? 'Yes' : 'No'}</p>
        <p><strong>Distribution Tx:</strong> {contest.distributionTX || 'TBC'}</p>
        <p><strong>Winning Submission ID:</strong> {contest.winningSubmission}</p>
        <p>
          <strong>Owner Address: </strong>
          <a href={`https://magmascan.org/address/${contest.contestOwner}`} target="_blank" rel="noopener noreferrer">
            {shortenAddress(contest.contestOwner)} <img src={etherscanLogo} alt="Etherscan" className={styles.smallEtherscanLogo} ref={el => smallEtherscanLogoRefs.current[0] = el} />
          </a>
        </p>
        <p>
          <strong>Contract Address: </strong>
          <a href={`https://magmascan.org/address/${contest.contractAddress}`} target="_blank" rel="noopener noreferrer">
            {shortenAddress(contest.contractAddress)} <img src={etherscanLogo} alt="Etherscan" className={styles.smallEtherscanLogo} ref={el => smallEtherscanLogoRefs.current[1] = el} />
          </a>
        </p>
        <p>
          <strong>Token Address: </strong>
          <a href={`https://magmascan.org/address/${contest.tokenAddress}`} target="_blank" rel="noopener noreferrer">
            {shortenAddress(contest.tokenAddress)} <img src={etherscanLogo} alt="Etherscan" className={styles.smallEtherscanLogo} ref={el => smallEtherscanLogoRefs.current[2] = el} />
          </a>
        </p>
      </div>

      {showUploadForm && <MemeUploadForm contest={contest} />}
      {isLoading && <div>Loading...</div>}
    </div>
  );
};

export default ContestCard;
