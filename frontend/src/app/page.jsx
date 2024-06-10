"use client";
import { NextUIProvider, Image } from "@nextui-org/react";
import { useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import carouselImgs from "/public/carouselImgs.json";
import eventsInfo from "/public/eventsInfo.json";

export default function Home() {
  const [currSlide, setCurrSlide] = useState(0);

  function handleSlideChange(index) {
    setCurrSlide(index);
  }

  return (
    <NextUIProvider>
      <div className="">
        <Header />
        <main className="bg-gray-100">
          <div>
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
          <div className="flex flex-wrap gap-5 pb-10 mx-10 mt-10">
            {eventsInfo.map((event) => (
              <EventCard
                key={event.imgAlt}
                imgSrc={event.imgSrc}
                imgAlt={event.imgAlt}
                date={event.date}
                title={event.title}
              />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </NextUIProvider>
  );
}

function EventCard({ imgSrc, imgAlt, date, title }) {
  return (
    <div className="min-w-[300px] max-w-[calc(33%-1rem)] p-5">
      <Link href="/ticket">
        <div>
          <Image
            isZoomed
            src={imgSrc}
            alt={imgAlt}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="m-3">
          <small className="text-default-500">{date}</small>
          <h4 className="font-bold hover:underline text-large hover:text-amber-500">
            {title}
          </h4>
        </div>
      </Link>
    </div>
  );
}
