"use client";
import { useEffect, useState } from "react";

export default function EventsPage() {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // fade the yellow overlay after 0.3s
    const timer = setTimeout(() => setFadeOut(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="relative w-screen h-screen p-10 overflow-hidden"
      style={{
        background: 'url("./assets/EventBg.svg") center/cover no-repeat',
      }}
    >
      {/* Full yellow overlay that fades down */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(249, 158, 0, 1)", // full yellow screen initially
          opacity: fadeOut ? 0 : 1,
          transform: fadeOut ? "translateY(100%)" : "translateY(0%)",
          transition: "opacity 1.8s ease-out, transform 2s ease-out",
          zIndex: 20,
          pointerEvents: "none",
        }}
      />

      {/* Button */}
      <button
        className="flex flex-row justify-center items-center gap-5 rounded-4xl shadow-lg"
        style={{
          background: "#F99E00",
          padding: "0.5rem 1rem",
          borderRadius: "2rem",
          position: "relative",
          zIndex: 10,
        }}
      >
        <img src="./assets/fullwheel.svg" alt="" />
        <h1 className="text-2xl text-black font-semibold">Events</h1>
      </button>

      {/* Main content */}
      <div
        className="flex flex-col items-center justify-center text-center"
        style={{
          height: "80vh",
          position: "relative",
          zIndex: 10,
        }}
      >
        <h1
          className="md:text-9xl text-8xl"
          style={{
            color: "#FBBF24",
            textShadow: "0 0 30px rgba(249,158,0,0.7)",
          }}
        >
          Coming Soon
        </h1>
      </div>
    </div>
  );
}
