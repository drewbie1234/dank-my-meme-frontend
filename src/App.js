import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TopBar from "./components/TopBar/TopBar";
import HomePage from "./components/HomePage/HomePage";
import ContestCreationPage from "./components/ContestCreationPage/ContestCreationPage";
import VotesPage from "./components/VotesPage/VotesPage"; // Add the new votes page import
import SubmissionsPage from "./components/SubmissionsPage/SubmissionsPage"; // Add the new votes page import
import styles from "./App.module.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WalletProvider } from './contexts/WalletContext';
import Footer from "./components/Footer/Footer";
const App = () => {
  return (
    <Router>
      <WalletProvider>
        <TopBar className={styles.top} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contestcreationpage" element={<ContestCreationPage />} />
          <Route path="/votes" element={<VotesPage />} /> 
          <Route path="/votes" element={<SubmissionsPage />} /> 
          <Route path="*" element={<div>Not Found — <Link to="/">Go Home</Link></div>} />
        </Routes>
        <Footer />
      </WalletProvider>
      
    </Router>
  );
};

export default App;
