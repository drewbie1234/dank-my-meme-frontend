import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Stage, Layer } from 'react-konva';
import { useDropzone } from 'react-dropzone';
import URLImage from '../URLImage/URLImage';
import DraggableText from '../DraggableText/DraggableText';
import styles from './Dankify.module.css';

const Dankify = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [backgroundColor, setBackgroundColor] = useState('white');
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [textInput, setTextInput] = useState('');

  const imageContainerRef = useRef(null);
  const stageRef = useRef(null);

  const imagePaths = Array.from({ length: 24 }, (_, i) => `/dankifyImages/image${i + 1}.png`);

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

  const openTextModal = () => {
    setIsTextModalOpen(true);
  };

  const closeTextModal = () => {
    setIsTextModalOpen(false);
    setTextInput('');
  };

  const addTextToCanvas = () => {
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    setItems([...items, { id, type: 'text', x: 50, y: 50, text: textInput, fontSize: 20, width: 200 }]); // Set default width
    closeTextModal();
  };

  const changeBackgroundColor = (color) => {
    setBackgroundColor(color);
  };

  const handleDeleteSelected = useCallback((e) => {
    if (e.key === 'Delete' && selectedId) {
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
    window.addEventListener('keydown', handleDeleteSelected);
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
            navigator.clipboard.write([item]);
          });
        };
      },
    });
  };

  const handleContextMenu = (e) => {
    e.evt.preventDefault();
    copyToClipboard();
  };

  return (
    <div className={styles.dankifyContainer}>
      <h2>Dankify</h2>
      <div className={styles.toolsContainer}>
        <button onClick={() => changeBackgroundColor('lightblue')}>Change Background Color</button>
        <button onClick={openTextModal}>Add Text</button>
        <button onClick={copyToClipboard}>Copy</button>
      </div>
      <div className={styles.uploadContainer} {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
        <button className={styles.uploadButton}>Choose File</button>
      </div>
      <div className={styles.imageContainer} ref={imageContainerRef} style={{ backgroundColor }}>
        <Stage
          width={imageDimensions.width}
          height={imageDimensions.height}
          onMouseDown={handleStageMouseDown}
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
                    width={item.width} // Pass default width for wrapping
                    isSelected={item.id === selectedId}
                    onSelect={() => setSelectedId(item.id)}
                    onChange={handleTransform}
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
      <div className={styles.displayContainer}>
        <p>Drag these images to the canvas:</p>
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
            <button onClick={addTextToCanvas}>Add Text</button>
            <button onClick={closeTextModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dankify;
