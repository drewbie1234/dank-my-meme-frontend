import React, { useState, useEffect } from "react";
import styles from "./ContestCard.module.css";
import MemeContestGallery from "../MemeContestGallery/MemeContestGallery";
import MemeUploadForm from "../MemeUploadForm/MemeUploadForm";
import submitIcon from "../../svgs/submit.svg";
import voteIcon from "../../svgs/vote.svg";
import { toast } from 'react-toastify';
import { useWallet } from '../../contexts/WalletContext';
import useContest from '../../hooks/useContest';

const ContestCard = ({ contest }) => {
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { selectedAccount } = useWallet();
    const { voteForSubmission } = useContest(contest);
    
    const handleUploadClick = () => {
        setShowUploadForm(!showUploadForm);
    };

    const handleVoteClick = async () => {
        if (!selectedSubmission) {
            toast.error('Please select a submission to vote for.');
            return;
        }

        setIsLoading(true);
        try {
            console.log(selectedSubmission)
            const receipt = await voteForSubmission(selectedSubmission, contest);

            if (receipt) {
                toast.success('Vote successfully recorded!');
                console.log('Vote recorded:', receipt);
            } else {
                throw new Error('Failed to record vote.');
            }
        } catch (error) {
            toast.error('Failed to record vote. Please try again later.');
            console.error('Failed to record vote:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.contestCard}>
            <h3 className={styles.contestId}>
                <span style={{ color: "purple" }}>{contest.index}{contest.name}</span>
            </h3>
            <MemeContestGallery contest={contest} onSelectedSubmissionChange={setSelectedSubmission} />

            <div className={styles.gridLayout}>
                {/* ... other items ... */}
                <div className={styles.button} onClick={handleUploadClick}>
                    <img src={submitIcon} alt="Submit" />
                    SUBMIT - {contest.entryFee}
                </div>
                <div className={styles.button} onClick={handleVoteClick}>
                    <img src={voteIcon} alt="Vote" />
                    VOTE -  {contest.votingFee} 
                </div>
            </div>
            {showUploadForm && <MemeUploadForm contest={contest} />}
            {isLoading && <div>Loading...</div>}
        </div>
    );
};

export default ContestCard;
