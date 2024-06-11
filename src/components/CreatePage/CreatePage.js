import React, { useState } from 'react';
import styles from './CreatePage.module.css';
import PepeToPork from '../PepeToPork/PepeToPork';
import PromptGenerator from '../PromptGenerator/PromptGenerator';
import Dankify from '../Dankify/Dankify'; // Assuming this component exists

const CreatePage = () => {
  const [activeComponent, setActiveComponent] = useState('Dankify');

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'PepeToPork':
        return <PepeToPork />;
      case 'PromptGenerator':
        return <PromptGenerator />;
      case 'Dankify':
        return <Dankify />;
      default:
        return <PepeToPork />;
    }
  };

  return (
    <div className={styles.createContainer}>
      <h1>Create</h1>
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.button} ${activeComponent === 'PepeToPork' ? styles.activeButton : styles.inactiveButton}`}
          onClick={() => setActiveComponent('PepeToPork')}
        >
          Pepe to Pork
        </button>
        <button
          className={`${styles.button} ${activeComponent === 'PromptGenerator' ? styles.activeButton : styles.inactiveButton}`}
          onClick={() => setActiveComponent('PromptGenerator')}
        >
          Prompt Generator
        </button>
        <button
          className={`${styles.button} ${activeComponent === 'Dankify' ? styles.activeButton : styles.inactiveButton}`}
          onClick={() => setActiveComponent('Dankify')}
        >
          Dankify
        </button>
      </div>
      {renderActiveComponent()}
    </div>
  );
};

export default CreatePage;
