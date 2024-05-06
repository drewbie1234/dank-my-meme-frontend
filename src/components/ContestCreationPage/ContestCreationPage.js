import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContestCreationForm from '../ContestCreationForm/ContestCreationForm';
import { createContest } from '../../utils/createContest';
import EndContestForm from '../EndContestForm/EndContestForm'; // Import your new component

const ContestCreationPage = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateContest = async (contestData) => {
        setIsLoading(true);
        try {
            const newContest = await createContest(contestData);
            console.log('New contest created:', newContest);
            toast.success('Contest created successfully!');
        } catch (error) {
            console.error('Error creating contest:', error);
            toast.error('Failed to create contest.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <ContestCreationForm onCreate={handleCreateContest} />
                    <hr /> {/* Optional separator for visual distinction */}
                    <EndContestForm /> {/* Include the new form */}
                </>
            )}
        </>
    );
};

export default ContestCreationPage;
