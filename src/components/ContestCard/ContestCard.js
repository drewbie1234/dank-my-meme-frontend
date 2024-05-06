import React, { useState } from "react";
import styles from "./ContestCard.module.css";
import MemeContestGallery from "../MemeContestGallery/MemeContestGallery";
import MemeUploadForm from "../MemeUploadForm/MemeUploadForm";
import submitIcon from "../../svgs/submit.svg";
import voteIcon from "../../svgs/vote.svg";
import endIcon from "../../svgs/vote.svg";
import withdrawIcon from "../../svgs/vote.svg";
import { toast } from 'react-toastify';
import { useWallet } from '../../contexts/WalletContext';
import useContest from '../../hooks/useContest';

const ContestCard = ({ contest }) => {
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [selectedSubmissionIndex, setSelectedSubmissionIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { selectedAccount } = useWallet();
    const {
        voteForSubmission,
        endContest,
        withdrawUnclaimedPrize
    } = useContest(contest);

    const handleUploadClick = () => {
        setShowUploadForm(!showUploadForm);
    };

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
            toast.error("Error ending the contest. Please try again.");
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

    return (
        <div className={styles.contestCard}>
            <h3 className={styles.contestId}>
                <span style={{ color: "purple" }}>{contest.index} - {contest.name}</span>
            </h3>

            <MemeContestGallery contest={contest} onSelectedSubmissionChange={setSelectedSubmissionIndex} />

            <div className={styles.gridLayout}>
                <div className={styles.button} onClick={handleUploadClick}>
                    <img src={submitIcon} alt="Submit" />
                    SUBMIT - {contest.entryFee}
                </div>
                <div className={styles.button} onClick={handleVoteClick}>
                    <img src={voteIcon} alt="Vote" />
                    VOTE - {contest.votingFee}
                </div>
                <div className={styles.button} onClick={handleEndContest}>
                    <img src={endIcon} alt="End Contest" />
                    END CONTEST
                </div>
                <div className={styles.button} onClick={handleWithdrawUnclaimedPrize}>
                    <img src={withdrawIcon} alt="Withdraw Prize" />
                    WITHDRAW PRIZE
                </div>
            </div>
            
            {showUploadForm && <MemeUploadForm contest={contest} />}
            {isLoading && <div>Loading...</div>}
        </div>
    );
};

export default ContestCard;
