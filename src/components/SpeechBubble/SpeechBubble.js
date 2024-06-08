import React, { useState, useEffect, useRef } from 'react';
import { Group, Path, Text, Transformer } from 'react-konva';

const SpeechBubble = ({ x, y, width, height, id, draggable, isSelected, onSelect, onChange, text }) => {
  const [currentText, setCurrentText] = useState(text);
  const [isEditing, setIsEditing] = useState(false);
  const groupRef = useRef();
  const trRef = useRef();

  const bubblePath = "M10 20 Q 20 10, 30 20 Q 40 30, 50 20 Q 60 10, 70 20 Q 80 30, 90 20"; // Sample SVG path

  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([groupRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleTransformEnd = () => {
    const node = groupRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    onChange({
      id,
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      width: node.width() * scaleX,
      height: node.height() * scaleY,
      text: currentText,
    });
  };

  const handleDragEnd = (e) => {
    onChange({
      id,
      x: e.target.x(),
      y: e.target.y(),
      rotation: e.target.rotation(),
      text: currentText,
    });
  };

  return (
    <>
      <Group
        x={x}
        y={y}
        draggable={draggable}
        ref={groupRef}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      >
        <Path
          data={bubblePath}
          fill="white"
          stroke="black"
          strokeWidth={2}
          scaleX={width / 100}
          scaleY={height / 100}
        />
        <Text
          x={10}
          y={10}
          width={width - 20}
          height={height - 20}
          text={currentText}
          fontSize={20}
          draggable={false}
          onClick={() => setIsEditing(true)}
          onTap={() => setIsEditing(true)}
        />
      </Group>
      {isEditing && (
        <textarea
          style={{
            position: 'absolute',
            top: `${groupRef.current.absolutePosition().y}px`,
            left: `${groupRef.current.absolutePosition().x}px`,
            width: `${groupRef.current.width()}px`,
            height: `${groupRef.current.height()}px`,
            fontSize: '20px',
            border: 'none',
            padding: '0px',
            margin: '0px',
            overflow: 'hidden',
            background: 'none',
            outline: 'none',
            resize: 'none',
            whiteSpace: 'pre',
          }}
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          onBlur={() => {
            setIsEditing(false);
            onChange({ id, text: currentText });
          }}
        />
      )}
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => newBox}
        />
      )}
    </>
  );
};

export default SpeechBubble;
