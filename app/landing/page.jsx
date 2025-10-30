import React from 'react'
import Hero from './hero'
import AboutSection from './aboutSection'
import EventsCompetitions from './eventsCompetitions'
import Announcement from './annoucement'
const page = () => {
  return (
  <div>
    <Hero/>
    <AboutSection />
    <EventsCompetitions />
    <Announcement />
    
  </div>
  )
}

export default page