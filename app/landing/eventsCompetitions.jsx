import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const EventsCompetitions = () => {
  return (
    <div className="relative w-full min-h-screen bg-[#3f0f0f]   overflow-hidden">
      {/* Register button - top right */}
     
      <Image
        src="/assets/footer.svg"
        alt="Footer decoration"
        width={1920}
        height={200}
        className="absolute top-0 left-0 w-full h-auto pointer-events-none select-none"
      />
       
      {/* Left background flower */}
      <Image
        src="/assets/fullflower.png"
        alt="Left flower decoration"
        width={300}
        height={300}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-auto opacity-30 pointer-events-none select-none"
      />

      {/* Right background flower */}
      <Image
        src="/assets/fullflower.png"
        alt="Right flower decoration"
        width={300}
        height={300}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-auto opacity-30 pointer-events-none select-none"
      />

      {/* Main content container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen  py-6 ">
        <div className="w-full max-full flex items-center justify-between gap-6">
          
          {/* Left side cards */}
          <div className="flex-shrink-0 relative">
            <Image 
              src="/assets/leftthreecards.svg"
              alt="Left decorative cards"
              width={320}
              height={800}
              className="w-[320px] h-[800px]"
            />
          </div>

          {/* Center - Events Gate */}
          <div className="flex-shrink-0 relative group cursor-pointer">
            <Image 
              src="/assets/eventsGate.svg"
              alt="Events Gate"
              width={400}
              height={600}
              className="w-[400px] h-[600px] transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center font-['WsParadose'] tracking-wider">
                Events
              </h2>
            </div>
          </div>

          {/* Center - Competitions Gate */}
          <div className="flex-shrink-0 relative group cursor-pointer">
            <Image 
              src="/assets/eventsGate.svg"
              alt="Competitions Gate"
              width={400}
              height={600}
              className="w-[400px] h-[600px] transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
              <h2 className="text-4xl md:text-3xl font-bold text-white text-center font-['WsParadose'] tracking-wider">
                Competitions
              </h2>
            </div>
          </div>

          {/* Right side cards */}
          <div className="flex-shrink-0 relative ">
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
