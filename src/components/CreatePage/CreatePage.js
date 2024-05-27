import React, { useState, useRef, useEffect } from 'react';
import styles from './CreatePage.module.css';

const CreatePage = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isOriginalEnlarged, setIsOriginalEnlarged] = useState(false);
  const [isProcessedEnlarged, setIsProcessedEnlarged] = useState(false);
  const [greenThreshold, setGreenThreshold] = useState(255);
  const [greenDifference, setGreenDifference] = useState(20);
  const [pinkLevel, setPinkLevel] = useState(221);
  const [saturation, setSaturation] = useState(120);
  const [brightness, setBrightness] = useState(115);
  const [inputThreshold, setInputThreshold] = useState(greenThreshold);
  const [inputDifference, setInputDifference] = useState(greenDifference);
  const [inputPinkLevel, setInputPinkLevel] = useState(pinkLevel);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (originalImage) {
      convertGreenToPink();
    }
  }, [greenThreshold, greenDifference, pinkLevel, originalImage]);

  useEffect(() => {
    applyFilters();
  }, [saturation, brightness]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const convertGreenToPink = () => {
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

    const clusters = findGreenClusters(data, canvas.width, canvas.height);
    clusters.forEach((cluster) => {
      const [dr, dg, db] = getDominantColor(cluster, data);

      cluster.forEach((index) => {
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];

        if (isGreen(r, g, b)) {
          const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          const factor = luminance / dg;

          data[index] = Math.min(targetPink.r * factor, 255);
          data[index + 1] = Math.min(targetPink.g * factor, 255);
          data[index + 2] = Math.min(targetPink.b * factor, 255);
        }
      });
    });

    ctx.putImageData(imageData, 0, 0);
    setProcessedImage(canvas.toDataURL());
  };

  const applyFilters = () => {
    const imgElement = document.getElementById('processedImage');
    if (imgElement) {
      let filters = '';
      filters += `brightness(${brightness}%) saturate(${saturation}%)`;
      imgElement.style.filter = filters.trim();
    }
  };

  const isGreen = (r, g, b) => {
    return g > r && g > b && (g > greenThreshold || (g - Math.min(r, b) > greenDifference));
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

  const findGreenClusters = (data, width, height) => {
    const clusters = [];
    const visited = new Set();

    const getColorIndex = (x, y) => (y * width + x) * 4;

    const isValidPixel = (x, y) => {
      if (x < 0 || y < 0 || x >= width || y >= height) return false;
      const index = getColorIndex(x, y);
      return isGreen(data[index], data[index + 1], data[index + 2]);
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
        if (isGreen(data[index], data[index + 1], data[index + 2]) && !visited.has(index)) {
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

  return (
    <div className={styles.createContainer}>
      <h1 className={styles.contestId}>Create</h1>
      <div className={styles.pepeToPink}>
        <h2>Pepe to Pork</h2>
        <div className={styles.uploadContainer}>
          <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} className={styles.uploadInput} />
        </div>
        <div className={styles.imageContainer}>
          <div className={`${styles.imageBox} ${isOriginalEnlarged ? styles.enlarged : ''}`}>
            <h3>Original Image</h3>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            {originalImage ? (
              <img src={originalImage} alt="Original" className={styles.image} />
            ) : (
              <div className={styles.placeholder}>No Original Image</div>
            )}
            <button onClick={toggleOriginalSize} className={styles.button}>
              {isOriginalEnlarged ? 'Minimize' : 'Enlarge'}
            </button>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <div className={`${styles.imageBox} ${isProcessedEnlarged ? styles.enlarged : ''}`}>
            <h3>Pork'd Image</h3>
            {processedImage ? (
              <img id="processedImage" src={processedImage} alt="Processed" className={styles.image} />
            ) : (
              <div className={styles.placeholder}>No Processed Image</div>
            )}
            <button onClick={toggleProcessedSize} className={styles.button}>
              {isProcessedEnlarged ? 'Minimize' : 'Enlarge'}
            </button>
          </div>
        </div>
        <div className={styles.slidersContainer}>
          <div className={styles.formGroup}>
            <label>Green Threshold: {inputThreshold}</label>
            <input type="range" min="0" max="255" value={inputThreshold} onChange={handleThresholdChange} className={styles.slider} />
            <div className={styles.adjustButtons}>
              <div className={styles.colorDisplay} style={{ backgroundColor: `rgb(0, ${inputThreshold}, 0)` }}></div>
              <input type="number" value={inputThreshold} onChange={handleThresholdChange} className={styles.input} />
              <button onClick={() => updateThreshold(greenThreshold + 1)} className={styles.button}>+</button>
              <button onClick={() => updateThreshold(greenThreshold - 1)} className={styles.button}>-</button>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Green Difference: {inputDifference}</label>
            <input type="range" min="0" max="100" value={inputDifference} onChange={handleDifferenceChange} className={styles.slider} />
            <div className={styles.adjustButtons}>
              <div className={styles.colorDisplay} style={{ backgroundColor: `rgb(0, ${inputDifference + 100}, 0)` }}></div>
              <input type="number" value={inputDifference} onChange={handleDifferenceChange} className={styles.input} />
              <button onClick={() => updateDifference(greenDifference + 1)} className={styles.button}>+</button>
              <button onClick={() => updateDifference(greenDifference - 1)} className={styles.button}>-</button>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Pink Level: {inputPinkLevel}</label>
            <input type="range" min="0" max="255" value={inputPinkLevel} onChange={handlePinkLevelChange} className={styles.slider} />
            <div className={styles.adjustButtons}>
              <div className={styles.colorDisplay} style={{ backgroundColor: `rgb(254, 167, ${inputPinkLevel})` }}></div>
              <input type="number" value={inputPinkLevel} onChange={handlePinkLevelChange} className={styles.input} />
              <button onClick={() => updatePinkLevel(pinkLevel + 1)} className={styles.button}>+</button>
              <button onClick={() => updatePinkLevel(pinkLevel - 1)} className={styles.button}>-</button>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Saturation: {saturation}%</label>
            <input type="range" min="0" max="200" value={saturation} onChange={handleSaturationChange} className={styles.slider} />
            <div className={styles.adjustButtons}>
              <div className={styles.colorDisplay} style={{ backgroundColor: `hsl(120, ${saturation}%, 50%)` }}></div>
              <input type="number" value={saturation} onChange={handleSaturationChange} className={styles.input} />
              <button onClick={() => updateSaturation(saturation + 1)} className={styles.button}>+</button>
              <button onClick={() => updateSaturation(saturation - 1)} className={styles.button}>-</button>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Brightness: {brightness}%</label>
            <input type="range" min="0" max="200" value={brightness} onChange={handleBrightnessChange} className={styles.slider} />
            <div className={styles.adjustButtons}>
              <div className={styles.colorDisplay} style={{ backgroundColor: `hsl(0, 0%, ${brightness}%)` }}></div>
              <input type="number" value={brightness} onChange={handleBrightnessChange} className={styles.input} />
              <button onClick={() => updateBrightness(brightness + 1)} className={styles.button}>+</button>
              <button onClick={() => updateBrightness(brightness - 1)} className={styles.button}>-</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
