import { initialImages } from "./image";
import React, { useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styled, { css } from "styled-components";

const GalleryWrapper = styled.div`
  width: 800px;
  height: 600px;
  overflow: hidden;
  border: 2px solid #333;
  border-radius: 12px;
  margin: 20px auto;
  background: #f9f9f9;
`;

const Container = styled.div`
  columns: 5 100px; /* Masonry-style layout */
  column-gap: 1.5rem;
  width: 90%;
  margin: 0 auto;
`;

const ImageCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.5rem 0;
  cursor: pointer;
  transition: all 0.3s ease;

  img {
    width: 100%;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  ${({ isSelected }) =>
    isSelected &&
    css`
      padding: 20px; /* extra spacing */
      img {
        width: 150%; /* make it bigger */
        max-width: 400px; /* limit max */
      }
    `}
`;



function App() {
  const [images, setImages] = useState(initialImages);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const transformRef = useRef(null); // 👈 reference to TransformWrapper
  const imageRefs = useRef([]);

const handleClick = (index) => {
  const newImages = [...images];
  const clicked = newImages.splice(index, 1)[0];
  const middleIndex = Math.floor(newImages.length / 2);
  newImages.splice(middleIndex, 0, clicked);

  setImages(newImages);
  setSelectedIndex(middleIndex);

  if (transformRef.current && imageRefs.current[middleIndex]) {
    // 1. Reset transform instantly
    transformRef.current.resetTransform(0);

    // 2. Wait for DOM to update (image at new position)
    setTimeout(() => {
      // 3. Zoom to element and center
      transformRef.current.zoomToElement(
        imageRefs.current[middleIndex],
        2,    // scale
        300   // animation duration
      );
    }, 50); // small delay to ensure element is rendered
  }
};


  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <GalleryWrapper>
        <TransformWrapper
         ref={transformRef} // 👈 attach ref
          defaultScale={1}
          minScale={0.5}
          maxScale={5}
          wheel={{ step: 0.1 }}
          doubleClick={{ disabled: true }}
          pinch={{ step: 5 }}
          pan={{ velocityDisabled: true }}
          limitToBounds={true}
          // 👇 center the content inside the wrapper
          defaultPositionX={-2000} // shift horizontally
          defaultPositionY={-1500} // shift vertically
        >
          <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
            <Container>
              {images.map((src, index) => (
                <ImageCard
                  key={index}
                  onClick={() => handleClick(index)}
                  isSelected={index === selectedIndex}
                                    ref={(el) => (imageRefs.current[index] = el)} // attach ref

                >
                  <img src={src} alt={`img-${index}`} />
                </ImageCard>
              ))}
            </Container>
          </TransformComponent>
        </TransformWrapper>
      </GalleryWrapper>
    </div>
  );
}

export default App;


