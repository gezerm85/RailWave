import React, { useEffect, useState } from "react";
import page1 from '../assets/slider/page1.jpg'
import page2 from '../assets/slider/page2.jpg'
import page3 from '../assets/slider/page3.jpg'
import page4 from '../assets/slider/page4.jpg'
import page5 from '../assets/slider/page5.jpg'
import page6 from '../assets/slider/page6.jpg'
import page7 from '../assets/slider/page7.jpg'

const sliderImages = [
  page1,
  page2,
  page3,
  page4,
  page5,
  page6, 
  page7
];

export default function BackgroundSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      {sliderImages.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`slide-${index}`}
          className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 backdrop-blur-sm" />
    </div>
  );
}
