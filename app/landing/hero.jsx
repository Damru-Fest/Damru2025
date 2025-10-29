"use client";
import Link from "next/link";
import React, { useState } from "react";
import NavOverlay from "../../components/NavOverlay";

export default function Hero() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/video/herobg.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />

      {/* Dim overlay for contrast */}
      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-black/60" />

      {/* Top-left logo */}
      <a href="/" className="absolute top-6 left-12 z-20 flex items-center">
        <img
          src="/assets/Damru-logo.svg"
          alt="Damru"
          className="w-26 md:w-30"
        />
      </a>

      <div className="absolute top-4 right-4 z-20">
        <Link
          href="/register"
          className="inline-flex items-center justify-center rounded-full bg-white/95 text-[#1a1a1a] px-5 py-2 md:px-6 md:py-2.5 text-base md:text-l  border border-black/10 hover:scale-[1.03] hover:shadow-lg hover:bg-white transition-transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          Register now
        </Link>
      </div>

      {/* Menu button bottom-right (pill with wheel + text) */}
      <div className="absolute z-20 bottom-4 right-4">
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="hero-menu"
          className="group inline-flex items-center gap-3 rounded-full bg-white/95 px-6 py-3 shadow-2xl backdrop-blur transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
        >
          <img src="/assets/fullwheel.svg" alt="wheel" className="h-10 w-10" />
          <span className="font-['WsParadose'] text-3xl text-black">Menu</span>
        </button>
      </div>

      {/* Menu overlay (moved to component) */}
      <NavOverlay open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
