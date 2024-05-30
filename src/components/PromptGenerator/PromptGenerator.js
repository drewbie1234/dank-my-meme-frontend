import React, { useState } from 'react';
import styles from './PromptGenerator.module.css';

const options = {
  activity: [
    'dancing',
    'reading',
    'cooking',
    'playing guitar',
    'walking the dog',
    // Add more activity options as needed
  ],
  location: [
    'beach',
    'space',
    'mountains',
    'city',
    'forest',
    // Add more location options as needed
  ],
  outfit: [
    'superhero costume',
    'suit',
    'pajamas',
    'formal attire',
    'casual wear',
    // Add more outfit options as needed
  ],
  build: [
    'muscular',
    'skinny',
    'chubby',
    'athletic',
    // Add more build options as needed
  ],
  object: [
    'book',
    'guitar',
    'smartphone',
    'umbrella',
    'pizza',
    // Add more object options as needed
  ],
  vehicle: [
    'bicycle',
    'spaceship',
    'car',
    'motorcycle',
    'scooter',
    // Add more vehicle options as needed
  ],
};

function PromptGenerator() {
  const [activity, setActivity] = useState('');
  const [location, setLocation] = useState('');
  const [outfit, setOutfit] = useState('');
  const [build, setBuild] = useState('');
  const [object, setObject] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [memeCharacter, setMemeCharacter] = useState('Pepe the Frog');
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const generatePrompt = () => {
    let prompt = `Create a meme with ${memeCharacter}`;

    if (activity) {
      prompt += ` doing ${activity}`;
    }
    if (location) {
      prompt += ` at/in ${location}`;
    }
    if (outfit) {
      prompt += ` wearing a ${outfit}`;
    }
    if (build) {
      prompt += ` with a ${build} build`;
    }
    if (object) {
      prompt += ` holding a ${object}`;
    }
    if (vehicle) {
      prompt += ` traveling in/on a ${vehicle}`;
    }
    prompt += '.';

    setGeneratedPrompt(prompt);

    // Open a new window with the Bing Images Create page
    const newWindow = window.open("https://www.bing.com/images/create");

    // Add event listener to handle message from new window
    window.addEventListener("message", receiveMessage);

    // Function to send the prompt to the new window
    function receiveMessage(event) {
      if (event.data === "ready") {
        newWindow.postMessage(prompt, "*");
      }
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleSelectChange = (setter) => (e) => {
    const value = e.target.value;
    if (options[setter].includes(value)) {
      setter(value);
    } else {
      setter('');
    }
  };

  return (
    <div className={styles.promptGeneratorContainer}>
      <div className={styles.promptGenerator}>
        <h2>Prompt Generator</h2>
        <div className={styles.formGroup}>
          <label htmlFor="memeCharacter">Meme Character:</label>
          <select id="memeCharacter" value={memeCharacter} onChange={(e) => setMemeCharacter(e.target.value)} className={styles.input}>
            <option value="Pepe the Frog">Pepe the Frog</option>
            <option value="Grumpy Cat">Grumpy Cat</option>
            <option value="Doge">Doge</option>
            <option value="Success Kid">Success Kid</option>
            {/* Add more meme characters as needed */}
          </select>
        </div>
        {Object.keys(options).map((option) => (
          <div key={option} className={styles.formGroup}>
            <label htmlFor={option}>{option.charAt(0).toUpperCase() + option.slice(1)}:</label>
            <input
              list={`${option}Options`}
              id={option}
              value={eval(option)}
              onChange={handleInputChange(eval('set' + option.charAt(0).toUpperCase() + option.slice(1)))}
              className={styles.input}
            />
            <datalist id={`${option}Options`}>
              {options[option].map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </div>
        ))}
        <div className={styles.formGroup}>
          <button onClick={generatePrompt} className={styles.button}>
            Generate Prompt
          </button>
        </div>
        <div className={styles.generatedPrompt}>{generatedPrompt}</div>
      </div>
    </div>
  );
}

export default PromptGenerator;
