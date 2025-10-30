import React from "react";
import Hero from "./hero";
import AboutSection from "./aboutSection";
import EventsCompetitions from "./eventsCompetitions";
import Announcement from "./annoucement";
import Footer from "@/components/Footer";
const page = () => {
  return (
    <div>
      <Hero />
      <AboutSection />
      <EventsCompetitions />
      <Announcement />
      <Footer />
    </div>
  );
};

export default page;
