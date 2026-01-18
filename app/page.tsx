"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { FaArrowRight } from "react-icons/fa6";

// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";

const Banner = () => {
  // Use the exact names from your public/images folder
  const images = [
    "/images/banner1.jpg",
    "/images/banner2.jpg",
    "/images/banner3.jpg",
  ];



  return (
    <div className="relative w-full h-[550px] overflow-hidden">
      {/* Background Slider */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade" // Added fade effect for a smoother transition
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
              {/* Dark Overlay inside the slide to ensure text is always readable */}
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

          {/* <div className="flex flex-wrap gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                className="group border border-white/30 hover:border-primary px-6 py-3 text-white flex items-center gap-x-3 rounded-full bg-white/5 backdrop-blur-sm hover:bg-primary transition-all duration-300"
              >
                <span className="font-medium">{cat}</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Banner;