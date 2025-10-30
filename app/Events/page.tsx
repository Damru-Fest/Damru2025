"use client"
import { useState } from "react"
import NavOverlay from "@/components/NavOverlay"

export default function Events() {
    const [open, setOpen] = useState(false)
    return(
        <div className="w-screen h-screen p-10" style={{background:'url("./assets/EventBg.svg")',backgroundSize:'cover',backgroundRepeat:'no-repeat'}}>
            <div className="flex flex-row justify-between  content-center items-center"> 
                <a href="/"><img src="./assets/Damru-logo.svg" alt="" /></a>
                <button className="flex  flex-row justify-center items-center bg-[#F99E00] p-1 h-15  w-60 gap-5 rounded-4xl">
                    <img src="./assets/fullwheel.svg" alt="" />
                    <h1 className="text-2xl text-black">Events</h1>
                </button>
            </div>

            {/* card */}
            <div className="flex flex-col content-center items-center justify-around" style={{height:'80vh'}}>
                 <h1 className="md:text-9xl text-8xl text-amber-300 text-center">Coming Soon</h1>


            </div>

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
          <NavOverlay open={open} onClose={() => setOpen(false)} />
        </div>
        
        </div>
    )
    
}