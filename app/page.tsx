"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules"; 
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";  // Ensure casing matches your file
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";

const Home = () => {
  const images = [
    "/images/banner1.jpg",
    "/images/banner2.jpg",
    "/images/banner3.jpg",
  ];

  return (
    // 1. Main wrapper for the whole page
    <main className="min-h-screen flex flex-col bg-base-200">
      
 

      {/* 3. The Hero/Banner Section (Fixed Height) */}
      <div className="relative w-full h-[550px] overflow-hidden">
        
        {/* Background Slider */}
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          className="absolute inset-0 h-full w-full z-0"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <div
                className="h-full w-full bg-cover bg-center filter blur-[1px]"
                style={{ backgroundImage: `url(${img})` }}
              >
                <div className="absolute inset-0 bg-black/50"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Content Layer */}
        <div className="absolute inset-0 flex items-center z-20 px-6 lg:px-20">
          <div className="max-w-4xl">
            <h2 className="font-bold text-5xl lg:text-6xl text-white leading-[1.1] mb-8 tracking-tight">
              Discover talent, <br />
              accept projects, and <br />
              <span className="text-primary">achieve goals</span> effortlessly.
            </h2>
          </div>
        </div>
      </div>

  
    </main>
  );
};

export default Home;