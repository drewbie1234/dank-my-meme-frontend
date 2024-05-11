

// Utility function to parse Ethereum errors and extract meaningful messages
export const parseEthereumError = (error) => {
    let errorMessage = "Operation failed. Please try again."; // Default error message

    // Check if the error object contains detailed data from the EVM
    if (error.data && error.data.message) {
        errorMessage += ` Revert reason: ${error.data.message}`;
    } else if (error.message) {
        errorMessage += ` Error message: ${error.message}`;
    }

    return errorMessage;
};


