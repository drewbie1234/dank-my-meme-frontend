import React, { useRef, useEffect, useState } from 'react';
import { Text, Group, Transformer } from 'react-konva';

const DraggableText = ({ id, x, y, text, fontSize, width, isSelected, onSelect, onChange }) => {
  const textRef = useRef(null);
  const trRef = useRef(null);
  const [textWidth, setTextWidth] = useState(width);

  useEffect(() => {
    if (isSelected && trRef.current && textRef.current) {
      trRef.current.nodes([textRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Group>
        <Text
          ref={textRef}
          x={x}
          y={y}
          text={text}
          fontSize={fontSize}
          width={textWidth}
          draggable
          onClick={onSelect}
          onTap={onSelect}
          onDragEnd={(e) => {
            onChange({
              id,
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onTransformEnd={(e) => {
            const node = textRef.current;
            const newWidth = Math.max(30, node.width() * node.scaleX());
            node.scaleX(1); // Reset scale to avoid distortion
            setTextWidth(newWidth);
            onChange({
              id,
              width: newWidth,
            });
          }}
          onDragStart={onSelect}
        />
      </Group>
      {isSelected && textRef.current && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            newBox.width = Math.max(30, newBox.width); // Ensure minimum width
            return newBox;
          }}
          enabledAnchors={['middle-left', 'middle-right']}
        />
      )}
    </>
  );
};

export default DraggableText;
