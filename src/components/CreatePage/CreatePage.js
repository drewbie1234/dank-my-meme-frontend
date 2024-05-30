import React from 'react';
import styles from './CreatePage.module.css';
import PepeToPork from '../PepeToPork/PepeToPork';
import PromptGenerator from '../PromptGenerator/PromptGenerator';

const CreatePage = () => {


  return (
    <div className={styles.createContainer}>
      <h1>Create</h1>
      <PepeToPork />
      {/* <PromptGenerator /> */}

    </div>
  );
};

export default CreatePage;
