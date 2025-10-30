"use client"

import React, { useState } from "react"

export default function NavOverlay({ open = false, onClose = () => {} }) {
  const [hovered, setHovered] = useState(null)
  const [rotation, setRotation] = useState(0)


  const items = [
    { href: "#home", label: "Home" },
    { href: "/About", label: "About Damru" },
    { href: "/Events", label: "Events" },
    { href: "/Competitions", label: "Competitions" },
  ]

  return (
    <div
      id="nav-overlay"
      aria-hidden={!open}
      className={`fixed inset-0 z-99 flex items-start justify-center overflow-hidden transition-all duration-500 ease-out ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop with light blur and subtle tint */}
      <div
        className={`absolute inset-0 bg-white/8 backdrop-blur-md transition-opacity duration-500 ease-out ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Close icon */}
      <button
        onClick={onClose}
        aria-label="Close menu"
        className={`absolute top-6 right-6 z-60 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 shadow-lg transition-all duration-200 ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="text-black"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="relative z-50 w-full">
        {/* full-width menu area */}
        <div className="w-full">
          <nav className="w-full">
            <div className="min-h-screen flex flex-col justify-center">
              <ul className="w-full ">
                {items.map((item, idx) => (
                  <li
                    key={item.href}
                    className={`relative border-b border-b-2 border-white ${
                      idx === 0 ? "border-t border-t-2 border-white" : ""
                    }`}
                    onMouseEnter={() => {setHovered(idx); setRotation(-45*idx)}}
                    onMouseLeave={() => {setHovered(null); setRotation(0)}}
                  >
                    <a
                      href={item.href}
                      onClick={onClose}
                      onFocus={() => setHovered(idx)}
                      onBlur={() => setHovered(null)}
                      className={`group block w-full text-left text-4xl sm:text-6xl font-['WsParadose'] text-white/95 transform transition-all duration-400 ease-out ${
                        open
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-6"
                      }`}
                      style={{ transitionDelay: `${idx * 90}ms` }}
                    >
                      <div className="relative w-full mx-auto py-6 flex items-center justify-center text-left">
                        <div
                          className={`absolute inset-0 rounded transition-all duration-300 ease-out pointer-events-none ${
                            hovered === idx || (hovered === null && idx === 0)
                              ? "opacity-100 bg-white/10 backdrop-blur-lg"
                              : "opacity-0"
                          }`}
                        />
                        <span className="relative z-10 block">{item.label}</span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </div>

      <div
        className={`hidden md:block pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 ${
          open ? "opacity-100" : "opacity-60"
        } z-99`}
      >
        <div
          className={`relative h-[520px] w-[520px] transform transition-all duration-700 ${
            open ? "translate-x-1/2 scale-100" : "translate-x-1/2 scale-95"
          }`}
        >
          <img
            src="/assets/fullwheel.svg"
            alt="decorative wheel"
            className="h-[520px] w-[520px] object-contain drop-shadow-2xl transform transition-all  duration-700"
            style={{ rotate: `${rotation}deg` }}
          />
        </div>
      </div>
    </div>
  )
}