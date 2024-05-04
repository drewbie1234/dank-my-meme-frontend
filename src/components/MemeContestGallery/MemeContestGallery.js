import React, { useRef, useEffect, useState } from "react";
import styles from "./MemeContestGallery.module.css";
import leftSlider from "../../svgs/leftSlider.svg";
import rightSlider from "../../svgs/rightSlider.svg";
import { fetchSubmissions } from "../../utils/fetchSubmissions";
const GWK = 'AMVTo16ddMxP42u7zyVkDn1ckRGXeKEAZ0N8_5qp3YEzcQl3yiATgfUpDD5tSdZj'


const MemeContestGallery = ({ contest, onSelectedSubmissionChange }) => {
    const galleryRef = useRef(null);
    const imageRefs = useRef([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [walletAddresses, setWalletAddresses] = useState({});
    const [currentSubmissionId, setCurrentSubmissionId] = useState(null);

    useEffect(() => {
        const fetchAndSetSubmissions = async () => {
            if (contest && contest.submissions) {
                const submissionIds = contest.submissions;
                console.log('Submission IDs:', submissionIds);
                setLoading(true);

                try {
                    const data = await fetchSubmissions(submissionIds);
                    setSubmissions(data);
                } catch (error) {
                    console.error("Error fetching submissions:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchAndSetSubmissions();
    }, [contest]);
    
    

    useEffect(() => {
        const fetchENSNames = async () => {
            let addresses = {};

            if (submissions && submissions.length > 0) {
                try {
                    const responses = await Promise.all(submissions.map(async (submission) => {
                        const wallet = submission.wallet;
                        if (wallet.includes('.eth')) {
                            return { wallet, ensName: wallet }; // If already an ENS name, use it directly
                        } else {
                            const response = await fetch(`http://localhost:3001/api/getEns?account=${wallet}`);
                            const data = await response.json();
                            return { wallet, ensName: data.ensName || wallet };
                        }
                    }));

                    responses.forEach(({ wallet, ensName }) => {
                        addresses[wallet] = ensName;
                    });
                    setWalletAddresses(addresses);
                } catch (error) {
                    console.error("Error fetching ENS names:", error);
                }
            }
        };

        fetchENSNames();
    }, [submissions]);

    useEffect(() => {
        // Call the callback function when currentSubmissionId changes
        if (currentSubmissionId) {
            onSelectedSubmissionChange(currentSubmissionId);
        }
    }, [currentSubmissionId, onSelectedSubmissionChange]);

    const scrollToCenter = (index) => {
        const imageRef = imageRefs.current[index];
        if (galleryRef.current && imageRef) {
            const galleryWidth = galleryRef.current.offsetWidth;
            const imageWidth = imageRef.offsetWidth;
            const imageLeftOffset = imageRef.offsetLeft;
            const scrollPosition = imageLeftOffset + imageWidth / 2 - galleryWidth / 2;
            galleryRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" });
            setCurrentSubmissionId(submissions[index]._id);
        }
    };

    const scrollByOneImage = (direction) => {
        const currentIndex = imageRefs.current.findIndex(
            (ref) => galleryRef.current.scrollLeft + galleryRef.current.offsetWidth / 2 >= ref.offsetLeft &&
                     galleryRef.current.scrollLeft + galleryRef.current.offsetWidth / 2 <= ref.offsetLeft + ref.offsetWidth
        );
        const nextIndex = direction === "left" ? Math.max(currentIndex - 1, 0) : Math.min(currentIndex + 1, submissions.length - 1);
        scrollToCenter(nextIndex);
    };

    return (
        <div className={styles.memeContestGalleryWrapper}>
            {loading ? (
                <div>Loading...</div>
            ) : !submissions || submissions.length === 0 ? (
                <div>No submissions available</div>
            ) : (
                <>
                    <img src={leftSlider} alt="Scroll left" onClick={() => scrollByOneImage("left")} className={styles.arrowButton} />
                    <div className={styles.memeContestGallery} ref={galleryRef}>
                        <div className={styles.scrollRegionLeft} onClick={() => scrollByOneImage("left")} />
                        {submissions.map((submission, index) => (
                            <div key={submission._id} className={styles.submissionDetail} onClick={() => scrollToCenter(index)} ref={el => imageRefs.current[index] = el}>
                                <div className={styles.entryBar}>
                                    <div className={styles.etherScanLink}>
                                        <a href={`https://etherscan.io/address/${walletAddresses[submission.wallet] || submission.wallet}`} target="_blank" rel="noopener noreferrer">
                                            {walletAddresses[submission.wallet] || submission.wallet}
                                        </a>
                                    </div>
                                    <div className={styles.detailText}>👌 {submission.votes} </div>
                                </div>
                                <div className={styles.memeImageContainer}>
                                    <img src={`https://crimson-rear-vole-353.mypinata.cloud/ipfs/${submission.image}?pinataGatewayToken=${GWK}`} className={styles.memeImage} alt='' />
                                </div>
                            </div>
                        ))}
                        <div className={styles.scrollRegionRight} onClick={() => scrollByOneImage("right")} />
                    </div>
                    <img src={rightSlider} alt="Scroll right" onClick={() => scrollByOneImage("right")} className={styles.arrowButton} />
                </>
            )}
        </div>
    );
    
};

export default MemeContestGallery;
