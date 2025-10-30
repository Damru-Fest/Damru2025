// import React from "react"

// export default function AboutSection() {
//   return (
//     <section className="relative w-full min-h-[80vh] md:h-screen bg-[#571a27] text-white overflow-hidden pb-20 md:pb-0">
//       {/* Footer SVG at top */}
//       <img
//         src="/assets/footer.svg"
//         alt="Footer decoration"
//         className="absolute -top-1 left-0 w-full pointer-events-none select-none"
//       />
//       {/* Decorative image with z-90 */}
//       <img
//         src="/assets/bridge.png"
//         alt="Decorative Damru image"
//         className="absolute left-0 w-full h-full object-cover z-10 pointer-events-none select-none opacity-12 top-10 md:top-20"
//         style={{ zIndex: 90 }}
//       />
      
//       {/* Gallery Card on left side (hidden on small screens) */}
//       <div className="absolute left-6 md:left-12 lg:left-24 top-1/2 -translate-y-1/2 z-40 hidden md:block">
//         <div className="relative">
//           {/* Stacked cards effect - bottom layer */}
//           <img
//             src="/assets/Gallery-Card.svg"
//             alt="Gallery Card"
//             className="absolute -top-3 -right-3 w-64 md:w-80 lg:w-120 opacity-20"
//           />
//           {/* Middle layer */}
//           <img
//             src="/assets/Gallery-Card.svg"
//             alt="Gallery Card"
//             className="absolute -top-2 -right-2 w-64 md:w-80 lg:w-120 opacity-40"
//           />
//           {/* Second middle layer */}
//           <img
//             src="/assets/Gallery-Card.svg"
//             alt="Gallery Card"
//             className="absolute -top-1 -right-1 w-64 md:w-80 lg:w-120 opacity-60"
//           />
//           {/* Top layer - full opacity */}
//           <img
//             src="/assets/Gallery-Card.svg"
//             alt="Gallery Card"
//             className="relative w-64 md:w-80 lg:w-120"
//           />
        
//         </div>
//           <button className="absolute text-2xl text-[#DB993D] -bottom-16 left-86   font-kamal px-8 py-2 rounded-full transition-colors border-2 border-[#DB993D]">
//             Gallery 
//           </button>
//       </div>

//       {/* Mobile-only Gallery CTA */}
//       <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-40">
//         <button className="text-xl text-[#DB993D] font-kamal px-6 py-2 rounded-full border-2 border-[#DB993D] bg-transparent">
//           Gallery
//         </button>
//       </div>

//       <div className="relative z-30 min-h-[60vh] md:h-full flex items-center justify-center md:justify-end px-6 md:pr-12 lg:pr-24">
//         <div className="max-w-2xl">
//           <div className=" mb-10">
//             <h2 className=" w-full text-center bg-white text-black text-2xl md:text-3xl lg:text-4xl font-[Kamal] py-4 rounded-full">
//               Welcome to Damru
//             </h2>
//           </div>
//           <p className="text-center md:text-right text-lg md:text-xl lg:text-2xl leading-relaxed font-[Kamal] tracking-wide" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
//             <span>Rishihood University's cultural heartbeat.</span><br />
//             Across two unforgettable days, the campus<br />
//             comes alive with performances, battles, art,<br />
//             and celebration. Join thousands of creators,<br />
//             dreamers, and culture lovers from Delhi NCR<br />
//             as Damru 2025 takes rhythm, creativity, and<br />
//             community to the next level.
//           </p>
//         </div>
//       </div>
//     </section>
//   )
// }


import React from "react"

export default function AboutSection() {
  return (
    // No changes to the main section tag, pb-20 for mobile is good
    <section className="relative w-full min-h-[80vh] md:h-screen bg-[#571a27] text-white overflow-hidden pb-20 md:pb-0">
      {/* Footer SVG at top */}
      <img
        src="/assets/footer.svg"
        alt="Footer decoration"
        className="absolute top-0 left-0 w-full pointer-events-none select-none origin-top scale-[3.2] md:scale-100"
      />
      {/* Decorative image with z-90 */}
      <img
        src="/assets/bridge.png"
        alt="Decorative Damru image"
        className="absolute left-0 w-full h-full object-cover z-10 pointer-events-none select-none opacity-12 top-10 md:top-20"
        style={{ zIndex: 90 }}
      />
      
      {/* Gallery Card on left side (hidden on small screens) - NO CHANGES */}
      <div className="absolute left-6 md:left-12 lg:left-24 top-1/2 -translate-y-1/2 z-40 hidden md:block">
        <div className="relative">
          {/* Stacked cards effect */}
          <img
            src="/assets/Gallery-Card.svg"
            alt="Gallery Card"
            className="absolute -top-3 -right-3 w-64 md:w-80 lg:w-120 opacity-20"
          />
          <img
            src="/assets/Gallery-Card.svg"
            alt="Gallery Card"
            className="absolute -top-2 -right-2 w-64 md:w-80 lg:w-120 opacity-40"
          />
          <img
            src="/assets/Gallery-Card.svg"
            alt="Gallery Card"
            className="absolute -top-1 -right-1 w-64 md:w-80 lg:w-120 opacity-60"
          />
          <img
            src="/assets/Gallery-Card.svg"
            alt="Gallery Card"
            className="relative w-64 md:w-80 lg:w-120"
          />
        
        </div>
          <button className="absolute text-2xl text-[#DB993D] -bottom-16 left-86   font-kamal px-8 py-2 rounded-full transition-colors border-2 border-[#DB993D]">
            Gallery 
          </button>
      </div>

      {/* Mobile-only Gallery CTA - NO CHANGES */}
      <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button className="text-xl text-[#DB993D] font-kamal px-6 py-2 rounded-full border-2 border-[#DB993D] bg-transparent">
          Gallery
        </button>
      </div>

      {/* UPDATED: 
        1. Added 'pt-20 md:pt-0' to push content down on mobile, avoiding the top SVG.
        2. Changed 'px-6' to 'px-4 sm:px-6' for slightly tighter padding on the smallest screens.
      */}
      <div className="relative z-30 min-h-[60vh] md:h-full flex items-center justify-center md:justify-end pt-20 md:pt-0 px-4 sm:px-6 md:pr-12 lg:pr-24">
        <div className="max-w-2xl">
          {/* UPDATED: 
            1. Reduced bottom margin on mobile from 'mb-10' to 'mb-6'.
          */}
          <div className="mb-6 md:mb-10">
            <h2 className=" w-full text-center bg-white text-black text-2xl md:text-3xl lg:text-4xl font-[Kamal] py-4 rounded-full">
              Welcome to Damru
            </h2>
          </div>
          {/* UPDATED: 
            1. Changed 'text-lg' to 'text-base sm:text-lg' to make the font slightly smaller on very small screens.
          */}
          <p className="text-center md:text-right text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed font-['Kamal'] tracking-wide" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            <span>Rishihood University&apos;s cultural heartbeat.</span><br />
            Across two unforgettable days, the campus<br />
            comes alive with performances, battles, art,<br />
            and celebration. Join thousands of creators,<br />
            dreamers, and culture lovers from Delhi NCR<br />
            as Damru 2025 takes rhythm, creativity, and<br />
            community to the next level.
          </p>
        </div>
      </div>
    </section>
  )
}