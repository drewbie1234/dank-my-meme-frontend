import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCopy } from 'react-icons/fa';
import axios from 'axios';
import styles from './PepeToPork.module.css';

const PepeToPork = () => {
  const defaultSettings = {
    greenThreshold: 255,
    greenDifference: 20,
    pinkLevel: 221,
    saturation: 120,
    brightness: 115,
  };

  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isOriginalEnlarged, setIsOriginalEnlarged] = useState(false);
  const [isProcessedEnlarged, setIsProcessedEnlarged] = useState(false);
  const [greenThreshold, setGreenThreshold] = useState(defaultSettings.greenThreshold);
  const [greenDifference, setGreenDifference] = useState(defaultSettings.greenDifference);
  const [pinkLevel, setPinkLevel] = useState(defaultSettings.pinkLevel);
  const [saturation, setSaturation] = useState(defaultSettings.saturation);
  const [brightness, setBrightness] = useState(defaultSettings.brightness);
  const [inputThreshold, setInputThreshold] = useState(defaultSettings.greenThreshold);
  const [inputDifference, setInputDifference] = useState(defaultSettings.greenDifference);
  const [inputPinkLevel, setInputPinkLevel] = useState(defaultSettings.pinkLevel);
  const [tweetText, setTweetText] = useState('');
  const [tweetUrl, setTweetUrl] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUrl, setAuthUrl] = useState('');
  const [targetColor, setTargetColor] = useState('green');
  const canvasRef = useRef(null);
  const copyCanvasRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target.result);
    };
    reader.readAsDataURL(file);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    if (originalImage) {
      convertColorToPink();
    }
  }, [greenThreshold, greenDifference, pinkLevel, originalImage, targetColor]);

  useEffect(() => {
    applyFilters();
  }, [saturation, brightness]);

  const convertColorToPink = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = originalImage;
    image.onload = () => {
      processImage(canvas, ctx, image);
    };
  };

  const processImage = (canvas, ctx, image) => {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const targetPink = { r: 254, g: 167, b: pinkLevel };
    const clusters = findColorClusters(data, canvas.width, canvas.height);
    clusters.forEach((cluster) => {
      const [dr, dg, db] = getDominantColor(cluster, data);
      cluster.forEach((index) => {
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        if (isTargetColor(r, g, b)) {
          const factor = getFactor(targetColor, r, g, b, dr, dg, db);
          data[index] = Math.min(targetPink.r * factor, 255);
          data[index + 1] = Math.min(targetPink.g * factor, 255);
          data[index + 2] = Math.min(targetPink.b * factor, 255);
        }
      });
    });

    ctx.putImageData(imageData, 0, 0);
    setProcessedImage(canvas.toDataURL());
  };

  const getFactor = (color, r, g, b, dr, dg, db) => {
    switch (color) {
      case 'red':
        return r / dr;
      case 'green':
        return g / dg;
      case 'blue':
        return b / db;
      default:
        return 1;
    }
  };

  const applyFilters = () => {
    const imgElement = document.getElementById('processedImage');
    if (imgElement) {
      let filters = '';
      filters += `brightness(${brightness}%) `;
      filters += `saturate(${saturation}%) `;
      imgElement.style.filter = filters.trim();
    }
  };

  const isTargetColor = (r, g, b) => {
    if (targetColor === 'green') {
      return g > r && g > b && (g > greenThreshold || (g - Math.min(r, b) > greenDifference));
    } else if (targetColor === 'red') {
      return r > g && r > b && (r > greenThreshold || (r - Math.min(g, b) > greenDifference));
    } else if (targetColor === 'blue') {
      return b > r && b > g && (b > greenThreshold || (b - Math.min(r, g) > greenDifference));
    }
  };

  const getDominantColor = (cluster, data) => {
    const colorCounts = {};
    cluster.forEach((index) => {
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const colorKey = `${r},${g},${b}`;
      colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
    });
    const dominantColor = Object.keys(colorCounts).reduce((a, b) =>
      colorCounts[a] > colorCounts[b] ? a : b
    );
    return dominantColor.split(',').map(Number);
  };

  const findColorClusters = (data, width, height) => {
    const clusters = [];
    const visited = new Set();
    const getColorIndex = (x, y) => (y * width + x) * 4;
    const isValidPixel = (x, y) => {
      if (x < 0 || y < 0 || x >= width || y >= height) return false;
      const index = getColorIndex(x, y);
      return isTargetColor(data[index], data[index + 1], data[index + 2]);
    };
    const dfs = (x, y, cluster) => {
      const stack = [[x, y]];
      while (stack.length) {
        const [cx, cy] = stack.pop();
        const index = getColorIndex(cx, cy);
        if (!visited.has(index)) {
          visited.add(index);
          cluster.push(index);
          const neighbors = [
            [cx + 1, cy],
            [cx - 1, cy],
            [cx, cy + 1],
            [cx, cy - 1],
          ];
          for (const [nx, ny] of neighbors) {
            if (isValidPixel(nx, ny) && !visited.has(getColorIndex(nx, ny))) {
              stack.push([nx, ny]);
            }
          }
        }
      }
    };
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = getColorIndex(x, y);
        if (isTargetColor(data[index], data[index + 1], data[index + 2]) && !visited.has(index)) {
          const cluster = [];
          dfs(x, y, cluster);
          clusters.push(cluster);
        }
      }
    }
    return clusters;
  };

  const toggleProcessedSize = () => {
    setIsProcessedEnlarged(!isProcessedEnlarged);
  };

  const toggleOriginalSize = () => {
    setIsOriginalEnlarged(!isOriginalEnlarged);
  };

  const updateThreshold = (value) => {
    setGreenThreshold(value);
    setInputThreshold(value);
  };

  const updateDifference = (value) => {
    setGreenDifference(value);
    setInputDifference(value);
  };

  const updatePinkLevel = (value) => {
    setPinkLevel(value);
    setInputPinkLevel(value);
  };

  const updateSaturation = (value) => {
    setSaturation(value);
    applyFilters();
  };

  const updateBrightness = (value) => {
    setBrightness(value);
    applyFilters();
  };

  const handleThresholdChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setInputThreshold(value);
    updateThreshold(value);
  };

  const handleDifferenceChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setInputDifference(value);
    updateDifference(value);
  };

  const handlePinkLevelChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setInputPinkLevel(value);
    updatePinkLevel(value);
  };

  const handleSaturationChange = (e) => {
    const value = parseInt(e.target.value, 10);
    updateSaturation(value);
  };

  const handleBrightnessChange = (e) => {
    const value = parseInt(e.target.value, 10);
    updateBrightness(value);
  };

  const resetToDefaultSettings = () => {
    setGreenThreshold(defaultSettings.greenThreshold);
    setGreenDifference(defaultSettings.greenDifference);
    setPinkLevel(defaultSettings.pinkLevel);
    setSaturation(defaultSettings.saturation);
    setBrightness(defaultSettings.brightness);
    setInputThreshold(defaultSettings.greenThreshold);
    setInputDifference(defaultSettings.greenDifference);
    setInputPinkLevel(defaultSettings.pinkLevel);
    applyFilters();
  };

  const handleClickOutside = (e) => {
    if (isOriginalEnlarged || isProcessedEnlarged) {
      if (!e.target.closest(`.${styles.imageBox}`)) {
        setIsOriginalEnlarged(false);
        setIsProcessedEnlarged(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOriginalEnlarged, isProcessedEnlarged]);

  const handleCopyImage = () => {
    const canvas = copyCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = processedImage;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.filter = `brightness(${brightness}%) saturate(${saturation}%)`;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([item]).then(() => {
          alert("Image copied to clipboard!");
        }).catch(err => {
          console.error("Failed to copy image: ", err);
        });
      });
    };
  };

  return (
    <div className={styles.pepeToPink}>
      <h2>Pepe to Pork</h2>
      <div className={styles.uploadContainer} {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
        <button className={styles.uploadButton}>
          Choose File
        </button>
      </div>
      <div className={styles.imageContainer}>
        <div className={`${styles.imageBox} ${isOriginalEnlarged ? styles.enlarged : ''}`}>
          <h3>Original Image</h3>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          {originalImage ? (
            <>
              <img src={originalImage} alt="Original" className={styles.image} />
              <FaCopy
                onClick={handleCopyImage}
                className={styles.copyIcon}
              />
            </>
          ) : (
            <div className={styles.placeholder}>No Original Image</div>
          )}
          <button onClick={toggleOriginalSize} className={styles.defaultButton}>
            {isOriginalEnlarged ? 'Minimize' : 'Enlarge'}
          </button>
        </div>
      </div>
      <div className={styles.imageContainer}>
        <div className={`${styles.imageBox} ${isProcessedEnlarged ? styles.enlarged : ''}`}>
          <h3>Pork'd Image</h3>
          {processedImage ? (
            <>
              <img id="processedImage" src={processedImage} alt="Processed" className={styles.image} />
              <FaCopy
                onClick={handleCopyImage}
                className={styles.copyIcon}
              />
            </>
          ) : (
            <div className={styles.placeholder}>No Processed Image</div>
          )}
          <button onClick={toggleProcessedSize} className={styles.enlargeButton}>
            {isProcessedEnlarged ? 'Minimize' : 'Enlarge'}
          </button>
        </div>
      </div>
      <canvas ref={copyCanvasRef} style={{ display: 'none' }} />
      <div className={styles.slidersContainer}>
        <div className={styles.targetGroup}>
          <label>Target Color:</label>
          <select value={targetColor} onChange={(e) => setTargetColor(e.target.value.toLowerCase())} className={styles.select}>
            <option value="green">Green</option>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <div className={styles.labelColorContainer}>
            <label>Target Threshold: {inputThreshold}</label>
            <div className={styles.colorDisplay} style={{ backgroundColor: targetColor === 'green' ? `rgb(0, ${inputThreshold}, 0)` : targetColor === 'red' ? `rgb(${inputThreshold}, 0, 0)` : `rgb(0, 0, ${inputThreshold})` }}></div>
          </div>
          <div className={styles.controlsContainer}>
            <input type="range" min="0" max="255" value={inputThreshold} onChange={handleThresholdChange} className={styles.slider} />
            <input type="number" value={inputThreshold} onChange={handleThresholdChange} className={styles.input} />
            <button onClick={() => updateThreshold(greenThreshold + 1)} className={styles.button}>+</button>
            <button onClick={() => updateThreshold(greenThreshold - 1)} className={styles.button}>-</button>
          </div>
        </div>
        <div className={styles.formGroup}>
          <div className={styles.labelColorContainer}>
            <label>Target Difference: {inputDifference}</label>
            <div className={styles.colorDisplay} style={{ backgroundColor: targetColor === 'green' ? `rgb(0, ${inputDifference + 100}, 0)` : targetColor === 'red' ? `rgb(${inputDifference + 100}, 0, 0)` : `rgb(0, 0, ${inputDifference + 100})` }}></div>
          </div>
          <div className={styles.controlsContainer}>
            <input type="range" min="0" max="100" value={inputDifference} onChange={handleDifferenceChange} className={styles.slider} />
            <input type="number" value={inputDifference} onChange={handleDifferenceChange} className={styles.input} />
            <button onClick={() => updateDifference(greenDifference + 1)} className={styles.button}>+</button>
            <button onClick={() => updateDifference(greenDifference - 1)} className={styles.button}>-</button>
          </div>
        </div>
        <div className={styles.formGroup}>
          <div className={styles.labelColorContainer}>
            <label>Pink Level: {inputPinkLevel}</label>
            <div className={styles.colorDisplay} style={{ backgroundColor: `rgb(254, 167, ${inputPinkLevel})` }}></div>
          </div>
          <div className={styles.controlsContainer}>
            <input type="range" min="0" max="255" value={inputPinkLevel} onChange={handlePinkLevelChange} className={styles.slider} />
            <input type="number" value={inputPinkLevel} onChange={handlePinkLevelChange} className={styles.input} />
            <button onClick={() => updatePinkLevel(pinkLevel + 1)} className={styles.button}>+</button>
            <button onClick={() => updatePinkLevel(pinkLevel - 1)} className={styles.button}>-</button>
          </div>
        </div>
        <div className={styles.formGroup}>
          <div className={styles.labelColorContainer}>
            <label>Saturation: {saturation}%</label>
          </div>
          <div className={styles.controlsContainer}>
            <input type="range" min="0" max="200" value={saturation} onChange={handleSaturationChange} className={styles.slider} />
            <input type="number" value={saturation} onChange={handleSaturationChange} className={styles.input} />
            <button onClick={() => updateSaturation(saturation + 1)} className={styles.button}>+</button>
            <button onClick={() => updateSaturation(saturation - 1)} className={styles.button}>-</button>
          </div>
        </div>
        <div className={styles.formGroup}>
          <div className={styles.labelColorContainer}>
            <label>Brightness: {brightness}%</label>
          </div>
          <div className={styles.controlsContainer}>
            <input type="range" min="0" max="200" value={brightness} onChange={handleBrightnessChange} className={styles.slider} />
            <input type="number" value={brightness} onChange={handleBrightnessChange} className={styles.input} />
            <button onClick={() => updateBrightness(brightness + 1)} className={styles.button}>+</button>
            <button onClick={() => updateBrightness(brightness - 1)} className={styles.button}>-</button>
          </div>
        </div>
        <button onClick={resetToDefaultSettings} className={styles.defaultButton}>Default Settings</button>
      </div>
    </div>
  );
};

export default PepeToPork;
