import React, { useRef, useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import styles from "./MemeContestGallery.module.css";
import leftSlider from "../../svgs/leftSlider.svg";
import rightSlider from "../../svgs/rightSlider.svg";
import { fetchSubmissions } from "../../utils/fetchSubmissions";
import { shortenAddress } from "../../utils/shortenAddress";
import { FaLink } from "react-icons/fa"; // Importing Font Awesome link icon

const GWK = 'AMVTo16ddMxP42u7zyVkDn1ckRGXeKEAZ0N8_5qp3YEzcQl3yiATgfUpDD5tSdZj';

const MemeContestGallery = ({ contest, onSelectedSubmissionChange }) => {
    const galleryRef = useRef(null);
    const imageRefs = useRef([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [walletAddresses, setWalletAddresses] = useState({});
    const [currentSubmissionIndex, setCurrentSubmissionIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState('');
    const [copiedSubmissionId, setCopiedSubmissionId] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [hovered, setHovered] = useState(false); // Add state for hover

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => scrollByOneImage("right"),
        onSwipedRight: () => scrollByOneImage("left"),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeRemaining(formatTimeRemaining(contest.endDateTime));
        }, 1000);

        return () => clearInterval(interval);
    }, [contest.endDateTime]);

    useEffect(() => {
        const fetchAndSetSubmissions = async () => {
            if (contest && contest.submissions) {
                const submissionIds = contest.submissions;
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
            if (submissions.length > 0) {
                let addresses = {};
                try {
                    const responses = await Promise.all(
                        submissions.map(async (submission) => {
                            if (submission.wallet.includes('.eth')) {
                                return { wallet: submission.wallet, ensName: submission.wallet };
                            } else {
                                const response = await fetch(`https://app.dankmymeme.xyz:443/api/getEns?account=${submission.wallet}`);
                                const data = await response.json();
                                return { wallet: submission.wallet, ensName: data.ensName || submission.wallet };
                            }
                        })
                    );
                    responses.forEach(({ wallet, ensName }) => {
                        addresses[wallet] = ensName;
                    });
                } catch (error) {
                    console.error("Error fetching ENS names:", error);
                } finally {
                    setWalletAddresses(addresses);
                }
            }
        };
        fetchENSNames();
    }, [submissions]);

    useEffect(() => {
        if (currentSubmissionIndex !== null) {
            onSelectedSubmissionChange(currentSubmissionIndex);
        }
    }, [currentSubmissionIndex, onSelectedSubmissionChange]);

    const scrollToCenter = (index) => {
        const imageRef = imageRefs.current[index];
        if (galleryRef.current && imageRef) {
            const galleryWidth = galleryRef.current.offsetWidth;
            const imageWidth = imageRef.offsetWidth;
            const imageLeftOffset = imageRef.offsetLeft;
            const scrollPosition = imageLeftOffset + imageWidth / 2 - galleryWidth / 2;
            galleryRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" });
            setCurrentSubmissionIndex(index);
        }
    };

    const scrollByOneImage = (direction) => {
        const nextIndex = direction === "left" ? Math.max(currentSubmissionIndex - 1, 0) : Math.min(currentSubmissionIndex + 1, submissions.length - 1);
        scrollToCenter(nextIndex);
    };

    const formatTimeRemaining = (endDateTime) => {
        if (isNaN(Date.parse(endDateTime))) return "Invalid date format";
    
        const now = new Date();
        const endDate = new Date(endDateTime);
        const localTimeOffset = endDate.getTimezoneOffset() * 60000;
        const gmtPlusOneOffset = localTimeOffset - (60 * 60000);
        endDate.setTime(endDate.getTime() + gmtPlusOneOffset);
    
        const diffMs = endDate - now;
        if (diffMs <= 0) return "Time expired ⏰";
    
        const oneSecond = 1000;
        const oneMinute = 60 * oneSecond;
        const oneHour = 60 * oneMinute;
        const oneDay = 24 * oneHour;
    
        const days = Math.floor(diffMs / oneDay);
        const hours = Math.floor((diffMs % oneDay) / oneHour);
        const minutes = Math.floor((diffMs % oneHour) / oneMinute);
        const seconds = Math.floor((diffMs % oneMinute) / oneSecond);
    
        const formattedDays = String(days).padStart(2, '0');
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
    
        return `⏰ ${formattedDays}D ${formattedHours}H ${formattedMinutes}M ${formattedSeconds}S `;
    };

    const handleCopySubmissionId = (submissionId) => {
        navigator.clipboard.writeText(submissionId).then(() => {
            setCopiedSubmissionId(submissionId);
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 2000);
        });
    };

    const handleSubmissionIdClick = (submissionId) => {
        window.open(`https://www.dankmymeme.xyz/submissions/${submissionId}`, '_blank');
    };

    const handleImageButtonClick = (submission) => {
        window.open(`https://gateway.pinata.cloud/ipfs/${submission.image}`, '_blank');
    };

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    return (
        <div {...swipeHandlers} className={styles.memeContestGalleryWrapper}>
            {loading ? (
                <div>Loading...</div>
            ) : !submissions || submissions.length === 0 ? (
                <div>No submissions available</div>
            ) : (
                <>
                    <img
                        src={leftSlider}
                        alt="Scroll left"
                        onClick={() => scrollByOneImage("left")}
                        className={styles.arrowButton}
                        style={{ opacity: currentSubmissionIndex > 0 ? 1 : 0 }}
                    />
                    <div className={styles.memeContestGallery} ref={galleryRef}>
                        <div className={styles.scrollRegionLeft} onClick={() => scrollByOneImage("left")} />
                        {submissions.map((submission, index) => (
                            <div key={submission._id} className={styles.submissionDetail} onClick={() => scrollToCenter(index)} ref={el => imageRefs.current[index] = el}>
                                <div className={styles.entryBar}>
                                    <div className={styles.middleSection}>
                                        <div className={styles.etherScanLink}>
                                            <a href={`https://magmascan.org/address/${submission.wallet}`} target="_blank" rel="noopener noreferrer">
                                                {shortenAddress(walletAddresses[submission.wallet]) || shortenAddress(submission.wallet)}
                                            </a>
                                        </div>
                                    </div>
                                    <div className={styles.leftSection}>
                                        <div className={styles.circleID} onClick={() => handleSubmissionIdClick(submission._id)}>SHARE</div>
                                    </div>
                                    <div className={styles.rightSection}>
                                        <p className={styles.detailText}>👌 {submission.votes}</p>
                                    </div>
                                </div>
                                <div className={styles.memeImageContainer}>
                                    <img src={`https://crimson-rear-vole-353.mypinata.cloud/ipfs/${submission.image}?pinataGatewayToken=${GWK}`} className={styles.memeImage} alt='' loading="lazy" />
                                </div>
                                <div className={styles.bottomGalleryBar}>
                                    <p className={styles.leftAlign}># {String(index + 1).padStart(3, '0')}/{String(submissions.length).padStart(3, '0')}</p>
                                    <div 
                                        className={`${styles.imageButton} ${hovered ? styles.hovered : ''}`} 
                                        onMouseEnter={handleMouseEnter} 
                                        onMouseLeave={handleMouseLeave} 
                                        onClick={() => handleImageButtonClick(submission)}
                                    >
                                        <span>IPFS</span>
                                        <FaLink className={styles.icon} />
                                        {showTooltip && (
                                            <div className={styles.tooltip}>
                                                {submission.image}
                                            </div>
                                        )}
                                    </div>
                                    <p className={styles.rightAlign}>{timeRemaining}</p>
                                </div>
                            </div>
                        ))}
                        <div className={styles.scrollRegionRight} onClick={() => scrollByOneImage("right")} />
                    </div>
                    <img
                        src={rightSlider}
                        alt="Scroll right"
                        onClick={() => scrollByOneImage("right")}
                        className={styles.arrowButton}
                        style={{ opacity: currentSubmissionIndex < submissions.length - 1 ? 1 : 0 }}
                    />
                </>
            )}
        </div>
    );
};

export default MemeContestGallery;
