import React, { useState, useEffect } from 'react';
import nuocmam1 from '../img/nuocmam.jpg'; 
import nuocmam2 from '../img/nuocmam2.jpg';
import nuocmam3 from '../img/nammam3.jpg';
import nuocmam4 from '../img/nuocmam4.jpg'


const Slideshow = () => {
  const images = [nuocmam1, nuocmam2, nuocmam3, nuocmam4]; 
  const [currentIndex, setCurrentIndex] = useState(0); 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000); 

    return () => clearInterval(interval); 
  }, [images.length]);

  return (
    <div className="slideshow-container">
      <img 
        src={images[currentIndex]} 
        alt={`Slide ${currentIndex + 1}`} 
        className="img-fluid animated-img"
        style={{ height: '65vh', width: '92vh' }}
      />
    </div>
  );
};

export default Slideshow;
