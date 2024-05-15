import React, { useState, useRef, useEffect } from "react";
import styles from "./ContestCard.module.css";
import MemeContestGallery from "../MemeContestGallery/MemeContestGallery";
import MemeUploadForm from "../MemeUploadForm/MemeUploadForm";
import etherscanLogo from "../../svgs/etherscanSVG.svg";
import { toast } from 'react-toastify';
import { useWallet } from '../../contexts/WalletContext';
import useContest from '../../hooks/useContest';
import { shortenAddress } from "../../utils/shortenAddress";

const ContestCard = ({ contest }) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedSubmissionIndex, setSelectedSubmissionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { selectedAccount, isConnected, connectWallet, disconnectWallet } = useWallet();
  const { voteForSubmission, endContest, withdrawUnclaimedPrize } = useContest(contest);

  const [isEtherscanLogoVisible, setIsEtherscanLogoVisible] = useState(false);
  const etherscanLogoRef = useRef(null);
  const smallEtherscanLogoRefs = useRef([]);
  const moneyBagEmojiRef = useRef(null);

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
      threshold: 0.5
    };

    const handleIntersection = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === etherscanLogoRef.current) {
            setIsEtherscanLogoVisible(true);
            entry.target.classList.add(styles.animate);
          } else {
            smallEtherscanLogoRefs.current.forEach(ref => {
              if (entry.target === ref) {
                ref.classList.add(styles.animate);
              }
            });
          }
          if (entry.target === moneyBagEmojiRef.current) {
            entry.target.classList.add(styles.animate);
          }
        } else {
          if (entry.target === etherscanLogoRef.current) {
            entry.target.classList.remove(styles.animate);
          } else {
            smallEtherscanLogoRefs.current.forEach(ref => {
              if (entry.target === ref) {
                ref.classList.remove(styles.animate);
              }
            });
          }
          if (entry.target === moneyBagEmojiRef.current) {
            entry.target.classList.remove(styles.animate);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);
    observer.observe(etherscanLogoRef.current);
    smallEtherscanLogoRefs.current.forEach(ref => observer.observe(ref));
    observer.observe(moneyBagEmojiRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className={styles.contestCard}>
      <div className={styles.h3WithEtherscan}>
        <h3 className={styles.contestId}>{contest.name}</h3>
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
      
      {showUploadForm && <MemeUploadForm contest={contest} />}

      <span onClick={toggleDetails} className={styles.detailsToggle}>
        {showDetails ? 'Hide Contest Details ▲' : 'Show Contest Details ▼'}
      </span>

      <div className={`${styles.infoPanel} ${showDetails ? styles.show : ''}`}>
        <div className={styles.infoItem}>
          <strong>Start:</strong>
          <span>{new Date(contest.startDateTime).toLocaleString()}</span>
        </div>
        <div className={styles.infoItem}>
          <strong>End:</strong>
          <span>{new Date(contest.endDateTime).toLocaleString()}</span>
        </div>
        <div className={styles.infoItem}>
          <strong>Entry Fee:</strong>
          <span>{contest.entryFee} DANK</span>
        </div>
        <div className={styles.infoItem}>
          <strong>Voting Fee:</strong>
          <span>{contest.votingFee} DANK</span>
        </div>
        <div className={styles.infoItem}>
          <strong>Winners Prize:</strong>
          <span>{contest.winnerPercentage}% ({totalPrizePot * (contest.winnerPercentage/100)} DANK)</span>
        </div>
        <div className={styles.infoItem}>
          <strong>Number of Lucky Voters:</strong>
          <span>{contest.numberOfLuckyVoters}</span>
        </div>
        <div className={styles.infoItem}>
          <strong>Total Submissions:</strong>
          <span>{contest.submissions.length}</span>
        </div>
        <div className={styles.infoItem}>
          <strong>Highest Votes:</strong>
          <span>{contest.highestVotes || 'NA'}</span>
        </div>
        <div className={styles.infoItem}>
          <strong>Prizes Distributed:</strong>
          <span>{contest.contestEnded ? 'Yes' : 'No'}</span>
        </div>
        <div className={styles.infoItem}>
          <strong>Distribution Tx:</strong>
          <span>{contest.distributionTX || 'TBC'}</span>
        </div>
        <div className={styles.addressItem}>
          <div className={styles.infoItem}>
            <strong>Owner Address: </strong>
            <a href={`https://magmascan.org/address/${contest.contestOwner}`} target="_blank" rel="noopener noreferrer">
              {shortenAddress(contest.contestOwner)} <img src={etherscanLogo} alt="Etherscan" className={styles.smallEtherscanLogo} ref={el => smallEtherscanLogoRefs.current[0] = el} />
            </a>
          </div>
          <div className={styles.infoItem}>
            <strong>Contract Address: </strong>
            <a href={`https://magmascan.org/address/${contest.contractAddress}`} target="_blank" rel="noopener noreferrer">
              {shortenAddress(contest.contractAddress)} <img src={etherscanLogo} alt="Etherscan" className={styles.smallEtherscanLogo} ref={el => smallEtherscanLogoRefs.current[1] = el} />
            </a>
          </div>
          <div className={styles.infoItem}>
            <strong>Token Address: </strong>
            <a href={`https://magmascan.org/address/${contest.tokenAddress}`} target="_blank" rel="noopener noreferrer">
              {shortenAddress(contest.tokenAddress)} <img src={etherscanLogo} alt="Etherscan" className={styles.smallEtherscanLogo} ref={el => smallEtherscanLogoRefs.current[2] = el} />
            </a>
          </div>
        </div>
      </div>

      
      
    </div>
  );
};

export default ContestCard;
