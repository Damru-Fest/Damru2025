"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from 'react';
import { motion } from 'framer-motion';
const EventsCompetitions = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration in ms
      once: true, // whether animation should happen only once
    });
  }, []);
  
  return (
    <div className="relative w-full min-h-screen bg-[#3f0f0f] overflow-hidden">
      {/* ... other background images (footer) ... */}
      <Image
        src="/assets/footer.svg"
        alt="Footer decoration"
        width={1920}
        height={200}
        className="absolute top-0 left-0 w-full pointer-events-none select-none origin-top scale-[3.2] md:scale-100"
      />
      {/* Responsive Background Flowers */}
      <Image
        src="/assets/fullflower.png"
        alt="Left flower decoration"
        width={300}
        height={300}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-auto opacity-30 pointer-events-none select-none"
        style={{ animation: 'spin 15s linear infinite' }}
      />
      <Image
        src="/assets/fullflower.png"
        alt="Right flower decoration"
        width={300}
        height={300}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-auto opacity-30 pointer-events-none select-none"
        style={{ animation: 'spin 15s linear infinite' }}
      />

      {/* Main content container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen  py-6 ">
        <div className="w-full max-full flex items-center justify-between gap-6">
          
          {/* Left side cards */}
          <div className="flex-shrink-0 relative"
          data-aos="fade-right">
            <Image 
              src="/assets/leftthreecards.svg"
              alt="Left decorative cards"
              width={320}
              height={800}
              className="w-[320px] h-[800px]"
            />
          </div>

              {/* Center - Events Gate */}
              <motion.div
                layoutId="event-gate-animation" // ID for Event animation
                onClick={() => {
                  hasEventRedirectedRef.current = false // Reset flag on click
                  setActiveGate('event')
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-shrink-0 relative group cursor-pointer"
              >
                <Image
                  src="/assets/eventsGate.svg"
                  alt="Events Gate"
                  width={400}
                  height={600}
                  // Responsive image size
                  className="w-[300px] h-[450px] md:w-[400px] md:h-[600px] transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  <h2 className="text-2xl md:text-3xl font-bold text-white text-center font-['WsParadose'] tracking-wider">
                    Events
                  </h2>
                </div>
              </motion.div>

              {/* Center - Competitions Gate */}
              <motion.div
                layoutId="competition-gate-animation" // NEW unique ID for Competition animation
                onClick={() => {
                  hasCompetitionRedirectedRef.current = false // Reset flag on click
                  setActiveGate('competition')
                }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-shrink-0 relative group cursor-pointer"
              >
                <Image
                  src="/assets/CompetitionGate.svg"
                  alt="Competitions Gate"
                  width={400}
                  height={600}
                  // Responsive image size
                  className="w-[300px] h-[450px] md:w-[400px] md:h-[600px] transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  {/* Fixed text size */}
                  <h2 className="text-2xl md:text-3xl font-bold text-white text-center font-['WsParadose'] tracking-wider">
                    Competitions
                  </h2>
                </div>
              </motion.div>

          {/* Right side cards */}
          <div className="flex-shrink-0 relative "
          data-aos="fade-left">
            <Image 
              src="/assets/rightthreecards.svg"
              alt="Right decorative cards"
             width={350}
              height={800}
              className="w-[340px] h-[800px]"
            />
          </div>

        </div>
      </div>
    </div>
  )
}

export default EventsCompetitions