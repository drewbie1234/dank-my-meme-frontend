import React, { useState, useEffect, useRef } from 'react';
import { Image as KonvaImage, Transformer } from 'react-konva';

const URLImage = ({ src, x, y, width, height, id, draggable, isSelected, onSelect, onChange }) => {
  const [image, setImage] = useState(null);
  const imageRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => setImage(img);
  }, [src]);

  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleTransformEnd = () => {
    const node = imageRef.current;
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
    });
  };

  return (
    <>
      <KonvaImage
        image={image}
        x={x}
        y={y}
        draggable={draggable}
        ref={imageRef}
        width={width}
        height={height}
        id={id ? id.toString() : undefined}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => onChange({
          id,
          x: e.target.x(),
          y: e.target.y(),
          rotation: e.target.rotation(),
          width: e.target.width(),
          height: e.target.height(),
        })}
        onTransformEnd={handleTransformEnd}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => newBox}
        />
      )}
    </>
  );
};

export default URLImage;
