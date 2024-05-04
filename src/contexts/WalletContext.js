// src/contexts/WalletContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet as useWalletHook } from '../hooks/useWallet';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const wallet = useWalletHook();
    return (
        <WalletContext.Provider value={wallet}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);
