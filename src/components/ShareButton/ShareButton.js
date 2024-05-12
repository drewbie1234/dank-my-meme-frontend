const ShareButton = ({ contest, submissionId }) => {
    console.log(`Share button props:  C${contest} S${submissionId}`)

    const shareUrl = `${window.location.origin}/submission/${submissionId}`;

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Check out this submission!',
                text: submissionId,
                url: shareUrl,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(shareUrl).then(() => alert('Link copied to clipboard!'));
        }
    };

    return <button onClick={handleShare}>Share</button>;
};

export default ShareButton
