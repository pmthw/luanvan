import React, { useState, useEffect } from 'react';
import quyt1 from '../img/quyt1.jpg'; 
import quyt2 from '../img/quyt2.jpg';
import quyt3 from '../img/quyt3.jpg';
import quyt4 from '../img/quyt4.jpg';

const Slideshow = () => {
  const images = [quyt1, quyt2, quyt3, quyt4]; 
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Automatically change slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Extended to 3 seconds to better appreciate the zoom transition

    return () => clearInterval(interval); 
  }, [images.length]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Base styles
  const slideshowContainerStyle = {
    position: 'relative',
    textAlign: 'center',
    overflow: 'hidden',
    height: '65vh',
    width: '92vh',
    margin: '0 auto',
  };

  // CSS Animations
  const keyframes = `
    @keyframes zoomEffect {
      0% { transform: scale(1); opacity: 1; }
      90% { transform: scale(1.15); opacity: 1; }
      100% { transform: scale(1.2); opacity: 0; }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={slideshowContainerStyle}>
        {images.map((img, index) => (
          <img 
            key={index}
            src={img} 
            alt={`Slide ${index + 1}`} 
            style={{
              height: '100%',
              width: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: index === currentIndex ? 1 : 0,
              transform: `scale(${index === currentIndex ? '1' : '1.2'})`,
              transition: 'opacity 0.5s ease-in-out',
              animation: index === currentIndex ? 'zoomEffect 3s forwards' : 'none',
              zIndex: index === currentIndex ? 1 : 0
            }}
          />
        ))}
      </div>
    </>
  );
};

export default Slideshow;