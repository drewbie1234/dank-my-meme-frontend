import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TopBar from "./components/TopBar/TopBar";
import HomePage from "./components/HomePage/HomePage";
import ContestCreationPage from "./components/ContestCreationPage/ContestCreationPage";
import VotesPage from "./components/VotesPage/VotesPage";
import SubmissionsPage from "./components/SubmissionsPage/SubmissionsPage";
import SubmissionPage from "./components/SubmissionPage/SubmissionPage";
import ContestPage from "./components/ContestPage/ContestPage";
import CreatePage from "./components/CreatePage/CreatePage"; // Import the new component
import styles from "./App.module.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WalletProvider } from './contexts/WalletContext';
import Footer from "./components/Footer/Footer";
import BuyDankPage from "./components/BuyDankPage/BuyDankPage";

const NotFound = () => (
  <div className={styles.notFound}>
    <h2>Page Not Found</h2>
    <p>Sorry, the page you're looking for doesn't exist.</p>
    <Link to="/">Go Home</Link>
  </div>
);

const App = () => {
  return (
    <Router>
      <WalletProvider>
        <div className={styles.top}>
          <TopBar />
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
            <Route path="/submissions" element={<SubmissionsPage />} />
            <Route path="/buydank" element={<BuyDankPage />} />
            <Route path="/submissions/:submissionId" element={<SubmissionPage />} />
            <Route path="/contests/:contestId" element={<ContestPage />} />
            <Route path="/create" element={<CreatePage />} /> {/* Add the new route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </WalletProvider>
    </Router>
  );
};

export default App;
