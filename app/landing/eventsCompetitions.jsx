

// 'use client' // Add this at the very top

// import React, { useState } from 'react'
// import Image from 'next/image'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation' // Use next/navigation for App Router
// import { motion, AnimatePresence } from 'framer-motion'

// const EventsCompetitions = () => {
//   const [isEventClicked, setIsEventClicked] = useState(false)
//   const router = useRouter()

//   // Function to handle the redirect after the video finishes
//   const handleVideoEnd = () => {
//     // You can add a fade-out animation here if you want
//     // For now, it will redirect as soon as the video ends.
//     router.push('/events') // Redirect to the event page
//   }

//   return (
//     <div className="relative w-full min-h-screen bg-[#3f0f0f] overflow-hidden">
//       {/* ... other background images (footer, flowers) ... */}
//       <Image
//         src="/assets/footer.svg"
//         alt="Footer decoration"
//         width={1920}
//         height={200}
//         className="absolute top-0 left-0 w-full h-auto pointer-events-none select-none"
//       />
//       <Image
//         src="/assets/fullflower.png"
//         alt="Left flower decoration"
//         width={300}
//         height={300}
//         className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-auto opacity-30 pointer-events-none select-none"
//       />
//       <Image
//         src="/assets/fullflower.png"
//         alt="Right flower decoration"
//         width={300}
//         height={300}
//         className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-auto opacity-30 pointer-events-none select-none"
//       />

//       {/* Main content container */}
//       <div className="relative z-10 flex items-center justify-center min-h-screen py-6">
//         <AnimatePresence>
//           {!isEventClicked ? (
//             // STATE 1: Default view with all gates and cards
//             <motion.div
//               key="gate-container"
//               initial={{ opacity: 1 }}
//               exit={{ opacity: 0, transition: { duration: 0.5 } }} // Fade out the whole container
//               className="w-full max-full flex items-center justify-between gap-6"
//             >
//               {/* Left side cards */}
//               <motion.div
//                 exit={{ x: -200, opacity: 0 }} // Slide out
//                 transition={{ duration: 0.5 }}
//                 className="flex-shrink-0 relative"
//               >
//                 <Image
//                   src="/assets/leftthreecards.svg"
//                   alt="Left decorative cards"
//                   width={320}
//                   height={800}
//                   className="w-[320px] h-[800px]"
//                 />
//               </motion.div>

//               {/* Center - Events Gate */}
//               <motion.div
//                 layoutId="event-gate-animation" // The magic key for the transition
//                 onClick={() => setIsEventClicked(true)}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="flex-shrink-0 relative group cursor-pointer"
//               >
//                 <Image
//                   src="/assets/eventsGate.svg"
//                   alt="Events Gate"
//                   width={400}
//                   height={600}
//                   className="w-[400px] h-[600px] transition-transform duration-300 group-hover:scale-105"
//                 />
//                 <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
//                   <h2 className="text-2xl md:text-3xl font-bold text-white text-center font-['WsParadose'] tracking-wider">
//                     Events
//                   </h2>
//                 </div>
//               </motion.div>

//               {/* Center - Competitions Gate */}
//               <motion.div
//                 exit={{ scale: 0.5, opacity: 0 }} // Shrink and fade out
//                 transition={{ duration: 0.5 }}
//                 className="flex-shrink-0 relative group cursor-pointer"
//               >
//                 <Image
//                   src="/assets/CompetitionGate.svg"
//                   alt="Competitions Gate"
//                   width={400}
//                   height={600}
//                   className="w-[400px] h-[600px] transition-transform duration-300 group-hover:scale-105"
//                 />
//                 <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
//                   <h2 className="text-4xl md:text-3xl font-bold text-white text-center font-['WsParadose'] tracking-wider">
//                     Competitions
//                   </h2>
//                 </div>
//               </motion.div>

//               {/* Right side cards */}
//               <motion.div
//                 exit={{ x: 200, opacity: 0 }} // Slide out
//                 transition={{ duration: 0.5 }}
//                 className="flex-shrink-0 relative "
//               >
//                 <Image
//                   src="/assets/rightthreecards.svg"
//                   alt="Right decorative cards"
//                   width={350}
//                   height={800}
//                   className="w-[340px] h-[800px]"
//                 />
//               </motion.div>
//             </motion.div>
//           ) : (
          
//             <motion.div
//               key="video-player"
//               layoutId="event-gate-animation"
//               // ADD `mix-blend-screen` HERE
//               className="absolute z-20 mix-blend-screen"
//               animate={{
//                 scale: 1.4,
//                 transition: { duration: 2.5, ease: 'easeInOut' },
//               }}
//             >
//               <video
//                 src="/video/eventDoor.mp4"
//                 autoPlay
//                 muted
//                 playsInline  
//                 onEnded={handleVideoEnd}
//                 className="w-[400px] h-[600px] mix-blend-screen "  
//               />
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   )
// }

// export default EventsCompetitions
 'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const EventsCompetitions = () => {
  const [activeGate, setActiveGate] = useState(null)
  const router = useRouter()

  // --- Refs for Event Video ---
  const eventVideoRef = useRef(null)
  const hasEventRedirectedRef = useRef(false)

  // --- Refs for Competition Video ---
  const competitionVideoRef = useRef(null)
  const hasCompetitionRedirectedRef = useRef(false)

  // === Event Video Handlers ===

  // Function to handle the event redirect
  const handleEventVideoEnd = () => {
    router.push('/events') // Redirect to the event page
  }

  const handleEventMetadataLoaded = () => {
    if (eventVideoRef.current) {
      eventVideoRef.current.currentTime = 0.5
    }
  }

  const handleEventTimeUpdate = () => {
    if (hasEventRedirectedRef.current) return

    if (eventVideoRef.current) {
      const video = eventVideoRef.current
      const endTime = video.duration - 0.5

      if (isFinite(endTime) && video.currentTime >= endTime) {
        video.pause()
        hasEventRedirectedRef.current = true
        handleEventVideoEnd()
      }
    }
  }

  // === Competition Video Handlers ===
  const handleCompetitionVideoEnd = () => {
    router.push('/competitions')
  }

  const handleCompetitionMetadataLoaded = () => {
    if (competitionVideoRef.current) {
      competitionVideoRef.current.currentTime = 0.5
    }
  }

  const handleCompetitionTimeUpdate = () => {
    if (hasCompetitionRedirectedRef.current) return

    if (competitionVideoRef.current) {
      const video = competitionVideoRef.current
      const endTime = video.duration - 0.5

      if (isFinite(endTime) && video.currentTime >= endTime) {
        video.pause() // Stop the video
        hasCompetitionRedirectedRef.current = true // Mark as redirected
        handleCompetitionVideoEnd() // Trigger the page navigation
      }
    }
  }

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
        width={500}
        height={500}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[250px] md:w-[500px] h-auto opacity-20 md:opacity-30 pointer-events-none select-none"
      />
      <Image
        src="/assets/fullflower.png"
        alt="Right flower decoration"
        width={500}
        height={500}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[250px] md:w-[500px] h-auto opacity-20 md:opacity-30 pointer-events-none select-none"
      />

      {/* Responsive Main Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen py-20 md:py-6 px-4 md:px-0">
        <AnimatePresence>
          {/* STATE 1: Show both gates */}
          {activeGate === null ? (
            <motion.div
              key="gate-container"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
              // Mobile: col stack, centered, large gap
              // Desktop (md): row, space-between, original gap
              className="w-full max-w-full flex flex-col md:flex-row items-center justify-center md:items-center md:justify-between gap-24 md:gap-6"
            >
              {/* Left side cards - Hidden on mobile */}
              <motion.div
                exit={{ x: -200, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-shrink-0 relative hidden md:block" // <-- hidden on mobile
              >
                <Image
                  src="/assets/leftthreecards.svg"
                  alt="Left decorative cards"
                  width={320}
                  height={800}
                  className="w-[320px] h-[800px]" // <-- Original size
                />
              </motion.div>

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

              {/* Right side cards - Hidden on mobile */}
              <motion.div
                exit={{ x: 200, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-shrink-0 relative hidden md:block" // <-- hidden on mobile
              >
                <Image
                  src="/assets/rightthreecards.svg"
                  alt="Right decorative cards"
                  width={350}
                  height={800}
                  className="w-[340px] h-[800px]" // <-- Original size
                />
              </motion.div>
            </motion.div>
          ) : activeGate === 'event' ? (
            // STATE 2: Event Video
            <motion.div
              key="event-video-player"
              layoutId="event-gate-animation" // Matches Event Gate ID
              className="absolute z-20 mix-blend-screen"
              animate={{
                scale: 1.4,
                transition: { duration: 2.5, ease: 'easeInOut' },
              }}
            >
              <video
                ref={eventVideoRef} // Use Event ref
                src="/video/eventDoor.mp4"
                autoPlay
                muted
                playsInline
                onLoadedMetadata={handleEventMetadataLoaded}
                onTimeUpdate={handleEventTimeUpdate}
                // Responsive video size
                className="w-[320px] h-[550px] md:w-[400px] md:h-[600px] mix-blend-screen "
              />
            </motion.div>
          ) : (
            // STATE 3: Competition Video
            <motion.div
              key="competition-video-player"
              layoutId="competition-gate-animation"
              className="absolute z-20 mix-blend-screen"
              animate={{
                scale: 1.4,
                transition: { duration: 2.5, ease: 'easeInOut' },
              }}
            >
              <video
                ref={competitionVideoRef}
                src="/video/compDoor.mp4"
                autoPlay
                muted
                playsInline
                onLoadedMetadata={handleCompetitionMetadataLoaded}
                onTimeUpdate={handleCompetitionTimeUpdate}
                // Responsive video size
                className="w-[350px] h-[550px] md:w-[400px] md:h-[600px] mix-blend-screen "
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default EventsCompetitions