import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Stage, Layer, Text } from 'react-konva';
import { useDropzone } from 'react-dropzone';
import { HexColorPicker } from 'react-colorful';
import { FaCopy } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import URLImage from '../URLImage/URLImage';
import DraggableText from '../DraggableText/DraggableText';
import styles from './Dankify.module.css';

const Dankify = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(20);
  const [fontStyle, setFontStyle] = useState('normal');
  const [fontFamily, setFontFamily] = useState('Arial');

  const imageContainerRef = useRef(null);
  const stageRef = useRef(null);

  const stockImages = [
    '/dankifyImages/moon.jpg',
    '/dankifyImages/mars.jpg',
    '/dankifyImages/pond.jpg',
    '/dankifyImages/ring.jpg',
    '/dankifyImages/sec.jpg',
    '/dankifyImages/prison.jpg',
    '/dankifyImages/whitehouse.jpeg',
    '/dankifyImages/beach.jpeg',
    '/dankifyImages/chart.jpg',
    '/dankifyImages/chartdown.png',
    '/dankifyImages/meadow.jpeg',
    '/dankifyImages/water.jpeg',
  ];

  const imagePaths = Array.from({ length: 68 }, (_, i) => `/dankifyImages/image${i + 1}.png`);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (e) => setUploadedImage(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleTransform = (newAttrs) => {
    const { id, ...rest } = newAttrs;
    const newItems = items.map((item) => (item.id === id ? { ...item, ...rest } : item));
    setItems(newItems);
  };

  const addImageToCanvas = (src) => {
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    setItems([...items, { id, type: 'image', src, x: 50, y: 50, width: 100, height: 100, rotation: 0 }]);
  };

  const openTextModal = () => setIsTextModalOpen(true);
  const closeTextModal = () => {
    setIsTextModalOpen(false);
    setTextInput('');
    setTextColor('#000000');
    setFontSize(20);
    setFontStyle('normal');
    setFontFamily('Arial');
  };

  const addTextToCanvas = () => {
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    setItems([...items, { id, type: 'text', x: 50, y: 50, text: textInput, fontSize: 100, fontStyle: fontStyle, fontFamily:fontFamily, fill: textColor, width: 200 }]);
    closeTextModal();
  };

  const changeBackgroundColor = (color) => setBackgroundColor(color);

  const clearCanvasItems = () => {
    setItems([]);
    setUploadedImage(null);
  };

  const handleDeleteSelected = useCallback(() => {
    if (selectedId) {
      const newItems = items.filter((item) => item.id !== selectedId);
      setItems(newItems);
      setSelectedId(null);
    }
  }, [selectedId, items]);

  useEffect(() => {
    if (imageContainerRef.current) {
      const { offsetWidth, offsetHeight } = imageContainerRef.current;
      setImageDimensions({ width: Math.min(offsetWidth, 500), height: offsetHeight });
    }
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Delete') {
        handleDeleteSelected();
      }
    });
    return () => window.removeEventListener('keydown', handleDeleteSelected);
  }, [handleDeleteSelected]);

  const handleStageMouseDown = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    const clickedOnTransformer = e.target.getParent() && e.target.getParent().className === 'Transformer';
    if (clickedOnEmpty || !clickedOnTransformer) {
      setSelectedId(null);
    }
  };

  const copyToClipboard = () => {
    const stage = stageRef.current.getStage();
    stage.toDataURL({
      mimeType: 'image/png',
      callback: (dataUrl) => {
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]).then(() => {
              toast.success('Dank Meme copied 👌');
            });
          });
        };
      },
    });
  };

  const handleContextMenu = (e) => {
    e.evt.preventDefault();
    copyToClipboard();
  };

  const handleStockImageClick = (src) => setUploadedImage(src);

  const handleTouchStart = (e, src) => {
    e.target.setAttribute('data-drag-src', src);
  };

  const handleTouchEnd = (e) => {
    const src = e.target.getAttribute('data-drag-src');
    if (src) {
      addImageToCanvas(src);
      e.target.removeAttribute('data-drag-src');
    }
  };

  return (
    <div className={styles.dankifyContainer}>
      <ToastContainer />
      <h2>Background</h2>
      <div className={styles.backgroundContainer}>
        <h3>Choose a Background Color</h3>
        <div className={styles.toolsContainer}>
          <HexColorPicker color={backgroundColor} onChange={changeBackgroundColor} />
        </div>
        <h3>Or</h3>
        <h3>Select a Stock Image</h3>
        <div className={styles.stockImageList}>
          {stockImages.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`stock-${index}`}
              className={styles.thumbnail}
              onClick={() => handleStockImageClick(src)}
            />
          ))}
        </div>
        <h3>Or</h3>
        <h3>Upload a Custom Image</h3>
        <div className={styles.uploadContainer} {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
          <button className={styles.uploadButton}>Choose File</button>
        </div>
      </div>
      <div className={styles.imageContainer} ref={imageContainerRef} style={{ backgroundColor }}>
        <Stage
          width={imageDimensions.width}
          height={imageDimensions.height}
          onMouseDown={handleStageMouseDown}
          onTouchStart={handleStageMouseDown}
          onContextMenu={handleContextMenu}
          ref={stageRef}
        >
          <Layer>
            {uploadedImage && (
              <URLImage
                src={uploadedImage}
                x={0}
                y={0}
                width={imageDimensions.width}
                height={imageDimensions.height}
              />
            )}
            {items.map((item) => {
              if (item.type === 'image') {
                return (
                  <URLImage
                    key={item.id}
                    id={item.id}
                    src={item.src}
                    x={item.x}
                    y={item.y}
                    width={item.width}
                    height={item.height}
                    rotation={item.rotation}
                    draggable
                    isSelected={item.id === selectedId}
                    onSelect={() => setSelectedId(item.id)}
                    onChange={handleTransform}
                    onTouchStart={() => setSelectedId(item.id)}
                  />
                );
              } else if (item.type === 'text') {
                return (
                  <DraggableText
                    key={item.id}
                    id={item.id}
                    x={item.x}
                    y={item.y}
                    text={item.text}
                    fontSize={item.fontSize}
                    fontStyle={item.fontStyle}
                    fontFamily={item.fontFamily}
                    fill={item.fill}
                    isSelected={item.id === selectedId}
                    onSelect={() => setSelectedId(item.id)}
                    onChange={handleTransform}
                    onTouchStart={() => setSelectedId(item.id)}
                  />
                );
              }
              return null;
            })}
          </Layer>
        </Stage>
        {!uploadedImage && (
          <div className={styles.placeholder}>
            <p>No image uploaded yet</p>
          </div>
        )}
      </div>
      <div className={styles.buttonGrid}>
        <div className={styles.toolsContainer}>
          <button className={styles.uploadButton} onClick={openTextModal}>Text</button>
        </div>
        <div className={styles.toolsContainer}>
          <button className={styles.uploadButton} onClick={copyToClipboard}>Copy <FaCopy /></button>
        </div>
        <div className={styles.toolsContainer}>
          <button className={styles.uploadButton} onClick={clearCanvasItems}>Clear</button>
        </div>
        <div className={styles.toolsContainer}>
          <button className={styles.uploadButton} onClick={handleDeleteSelected}>Delete</button>
        </div>
      </div>
      <div className={styles.displayContainer}>
        <p>Drag or click these images to add to the canvas:</p>
        <div className={styles.imageList}>
          {imagePaths.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`display-${index}`}
              className={styles.thumbnail}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('text/plain', src)}
              onDragEnd={(e) => addImageToCanvas(e.target.src)}
              onTouchStart={(e) => handleTouchStart(e, src)}
              onTouchEnd={handleTouchEnd}
              onClick={() => addImageToCanvas(src)}
            />
          ))}
        </div>
      </div>
      {isTextModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Enter Text</h3>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              style={{ width: '100%', height: '100px' }}
            />
            <div className={styles.textOptions}>
              <label>
                Font Size:
                <select value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={40}>40</option>
                  <option value={50}>50</option>
                </select>
              </label>
              <label>
                Font Style:
                <select value={fontStyle} onChange={(e) => setFontStyle(e.target.value)}>
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                  <option value="italic">Italic</option>
                </select>
              </label>
              <label>
                Font Family:
                <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                  <option value="Arial">Arial</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Verdana">Verdana</option>
                </select>
              </label>
              <label>
                Text Color:
                <HexColorPicker color={textColor} onChange={setTextColor} />
              </label>
            </div>
            <button className={styles.uploadButton} onClick={addTextToCanvas}>Add Text</button>
            <button className={styles.uploadButton} onClick={closeTextModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dankify;
