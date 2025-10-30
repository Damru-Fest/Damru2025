// "use client"
// import Link from "next/link"
// // Import useRef and useEffect from React
// import React, { useState, useRef, useEffect } from "react"
// import NavOverlay from "../../components/navOverlay"

// export default function Hero() {
//   const [open, setOpen] = useState(false)
//   // Create a ref for the video element
//   const videoRef = useRef(null)

//   // Set up the scroll listener
//   useEffect(() => {
//     const video = videoRef.current
//     if (!video) return

//     // Ensure video is paused at 0 seconds on load
//     video.pause()
//     video.currentTime = 0

//     const handleScroll = () => {
//       // Check if the video exists and is still paused
//       if (video && video.paused) {
//         // Play the video
//         video.play().catch(error => {
//           // Log any errors (e.g., browser autoplay policies)
//           console.error("Error attempting to play video:", error)
//         })

//         // Optimization: Once playback starts, remove the listener
//         window.removeEventListener("scroll", handleScroll)
//       }
//     }

//     // Add the event listener for scrolling
//     window.addEventListener("scroll", handleScroll)

//     // Cleanup: Remove the listener when the component unmounts
//     return () => {
//       window.removeEventListener("scroll", handleScroll)
//     }
//   }, []) // Empty array means this effect runs only once on mount

//   return (
//     <header className="relative w-full h-screen overflow-hidden bg-black">
//       {/* Background video */}
//       <video
//         // Add the ref here
//         ref={videoRef}
//         className="absolute inset-0 w-full h-full object-cover"
//         src="/video/herobg.mp4"
//         // Remove 'autoPlay'
//         muted
//         loop
//         playsInline
//         aria-hidden="true"
//       />

//       {/* Dim overlay for contrast */}
//       <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

//       {/* Top-left logo */}
//       <a href="/" className="absolute top-10 left-16 z-20 flex items-center">
//         <img src="/assets/Damru-logo.svg" alt="Damru" className="w-26 md:w-30" />
//       </a>

//       <div className="absolute top-4 right-6 z-20">
//         <Link
//           href="/register"
//           className="inline-flex items-center justify-center rounded-full bg-white/95 text-[#1a1a1a] px-5 py-2 md:px-6 md:py-2.5 text-base md:text-l  border border-black/10 hover:scale-[1.03] hover:shadow-lg hover:bg-white transition-transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
//         >
//           Register now
//         </Link>
//       </div>

//       {/* Menu button bottom-right (pill with wheel + text) */}
//       <div className="absolute z-20 bottom-4 right-4">
//         <button
//           onClick={() => setOpen(!open)}
//           aria-expanded={open}
//           aria-controls="hero-menu"
//           className="group inline-flex items-center gap-3 rounded-full bg-white/95 px-6 py-3 shadow-2xl backdrop-blur transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
//         >
//           <img src="/assets/fullwheel.svg" alt="wheel" className="h-10 w-10" />
//           <span className="font-['WsParadose'] text-3xl text-black">Menu</span>
//         </button>
//       </div>

//       {/* Menu overlay (moved to component) */}
//       <NavOverlay open={open} onClose={() => setOpen(false)} />
//     </header>
//   )
// }

"use client"

import Link from "next/link"
import React, { useState, useEffect, useRef } from "react"
import NavOverlay from "../../components/navOverlay"

export default function Hero() {
  const [open, setOpen] = useState(false)
  const videoRef = useRef(null)
  const [hasPlayed, setHasPlayed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!videoRef.current) return
      const scrollTop = window.scrollY
      if (scrollTop > 30 && !hasPlayed) {
        videoRef.current.play()
        setHasPlayed(true)
      }
      if (scrollTop <= 10 && hasPlayed) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
        setHasPlayed(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [hasPlayed])

  return (
    <header className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/video/herobg.mp4"
        muted
        loop
        playsInline
        aria-hidden="true"
      />

      {/* Dim overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

      <div className="relative z-20 flex h-full flex-col items-center p-4 md:items-stretch md:p-0">
        <a
          href="/"
          className="relative mt-8 flex items-center md:absolute md:top-10 md:left-16 md:mt-0"
        >
          {/* --- LOGO SIZE INCREASED --- */}
          <img
            src="/assets/Damru-logo.svg"
            alt="Damru"
            className="w-30 md:w-36"
          />
        </a>

        <div className="relative mt-6 md:absolute md:top-4 md:right-6 md:mt-0">
          <Link
            href="/register"
            // --- REGISTER BUTTON SIZE INCREASED & TYPO FIXED ---
            className="inline-flex items-center justify-center rounded-full bg-white/95 text-[#1a1a1a] px-6 py-2.5 md:px-7 md:py-3 text-lg md:text-xl border border-black/10 hover:scale-[1.03] hover:shadow-lg hover:bg-white transition-transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            Register now
          </Link>
        </div>

        {/* Spacer: Pushes the menu to the bottom on small screens. Ignored on medium+. */}
        <div className="flex-grow" />

        <div className="relative mb-4 md:absolute md:bottom-4 md:right-4 md:mb-0">
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="hero-menu"
            // --- MENU BUTTON SIZE INCREASED ---
            className="group inline-flex items-center gap-3 rounded-full bg-white/95 px-7 py-4 md:px-8 md:py-4 shadow-2xl backdrop-blur transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
          >
            <img
              src="/assets/fullwheel.svg"
              alt="wheel"
              // --- MENU ICON SIZE INCREASED ---
              className="h-12 w-12 md:h-14 md:w-14"
            />
            <span
              // --- MENU TEXT SIZE INCREASED ---
              className="font-['WsParadose'] text-4xl md:text-5xl text-black"
            >
              Menu
            </span>
          </button>
        </div>
      </div>

      {/* Menu overlay (unchanged) */}
      <NavOverlay open={open} onClose={() => setOpen(false)} />
    </header>
  )
}