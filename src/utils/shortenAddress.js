// src/utils/shortenAddress.js

const shortenAddress = (address, startChars = 7, endChars = 6) => {
    if (!address || address.length !== 42) return address;
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};


export { shortenAddress };
