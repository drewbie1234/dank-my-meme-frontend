import React, { useState, useEffect } from "react";
import styles from "./ContestCard.module.css";
import MemeContestGallery from "../MemeContestGallery/MemeContestGallery";
import MemeUploadForm from "../MemeUploadForm/MemeUploadForm";
import submitIcon from "../../svgs/submit.svg";
import voteIcon from "../../svgs/vote.svg";
import { toast } from 'react-toastify';

const ContestCard = ({ contest }) => {
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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
            const response = await fetch('http://localhost:3001/api/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    submissionId: selectedSubmission,
                    voter: '0xYourVoterAddress'
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to record vote');
            }

            const result = await response.json();
            toast.success('Vote successfully recorded!');
            console.log('Vote recorded:', result);
        } catch (error) {
            toast.error('Failed to record vote. Please try again later.');
            console.error('Failed to record vote', error);
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
                    VOTE -  {contest.votingFee} ETH
                </div>
            </div>
            {showUploadForm && <MemeUploadForm contest={contest} />}
            {isLoading && <div>Loading...</div>}
        </div>
    );
};

export default ContestCard;
