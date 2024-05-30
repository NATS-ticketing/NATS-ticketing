"use client";
import { NextUIProvider } from "@nextui-org/react";
import Header from "@/app/components/Header";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useState } from "react";

const carouselImgs = [
  { id: "1", src: "/bgimg1.jpeg", alt: "aespa LIVE TOUR - SYNK" },
  { id: "2", src: "/bgimg2.jpeg", alt: "mixer" },
  { id: "3", src: "/bgimg3.jpeg", alt: "elijah woods" },
  { id: "4", src: "/bgimg4.jpeg", alt: "imase 1st Asia Tour Shiki" },
  { id: "5", src: "/bgimg5.jpeg", alt: "Porter Robinson SMILE!" },
  { id: "6", src: "/bgimg6.jpeg", alt: "Cosmos people" },
];

export default function Home() {
  const [currSlide, setCurrSlide] = useState(0);

  function handleSlideChange(index) {
    setCurrSlide(index);
  }

  return (
    <NextUIProvider>
      <Header />
      <main className="h-screen bg-slate-100">
        <div className="h-1/4">
          <Carousel
            centerMode
            centerSlidePercentage={60}
            infiniteLoop
            autoPlay
            showThumbs={false}
            onChange={handleSlideChange}
          >
            {carouselImgs.map((img, index) => (
              <img
                src={img.src}
                alt={img.alt}
                className={`p-1 ${
                  currSlide === index ? "opacity-100" : "opacity-50"
                }`}
                key={img.id}
              />
            ))}
          </Carousel>
        </div>
      </main>
    </NextUIProvider>
  );
}
