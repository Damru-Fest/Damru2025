"use client"
import { useEffect, useState, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";


export default function Announcement(){
    useEffect(() => {
        AOS.init({
          duration: 1000, // animation duration in ms
          once: true, // whether animation should happen only once
        });
      }, []);
    // target date: 29 November 2025 at 00:00 local time
    const target = new Date(2025, 10, 29, 0, 0, 0); // month is 0-indexed (10 -> November)

    const [timeLeft, setTimeLeft] = useState(getTimeRemaining(target));
    // used to trigger small pop animation when numbers change
    const [pops, setPops] = useState({days:false,hours:false,minutes:false});
    const prev = useRef(timeLeft);

    useEffect(()=>{
        const timer = setInterval(()=>{
            setTimeLeft(prev => {
                const next = getTimeRemaining(target);
                return next;
            });
        }, 1000);
        return ()=> clearInterval(timer);
    },[]);

    // watch for changes and flash the box that changed
    useEffect(()=>{
        const changed = {
            days: timeLeft.days !== prev.current.days,
            hours: timeLeft.hours !== prev.current.hours,
            minutes: timeLeft.minutes !== prev.current.minutes,
        };
        const newPops = {days:false,hours:false,minutes:false};
        let any=false;
        (Object.keys(changed) as Array<keyof typeof changed>).forEach(k=>{
            if(changed[k]){
                newPops[k]=true; any=true;
            }
        });
        if(any){
            const t1 = setTimeout(()=> setPops(newPops), 0);
            const t2 = setTimeout(()=> setPops({days:false,hours:false,minutes:false}), 350);
            return ()=> { clearTimeout(t1); clearTimeout(t2); };
        }
        prev.current = timeLeft;
    },[timeLeft]);

    return(
        <>
        <div className="bg-[#200808] w-screen overflow-hidden" style={{height:'90vh'}}>

            {/* header */}
            <div className="flex flex-row justify-between">
                <img src="./assets/flowerImage.svg" className="relative sm:-top-30 -top-15 lg:w-auto sm:w-60 w-30" alt="flower" 
                style={{ animation: 'spin 25s linear infinite' }}
                />

                <img src="./assets/RightFlower.svg" data-aos="fade-left" className="relative sm:-top-30 -top-15 sm:w-auto w-40" alt="right flower" />

            </div>

            {/* main content */}
            <div className="sm:ml-15 ml-5 lg:ml-30  flex flex-col content-center relative sm:-top-60 -top-30 justify-center items-center gap-5" style={{width:'90vw'}}>
                    <div className="flex flex-col mb-5 items-center justify-center">
                        <img src="/assets/Mask.svg"  className="w-40 mb-2" data-aos="zoom-in" alt="" />
                        <h1 className="sm:text-4xl text-2xl text-white">Join us on</h1>
                    </div>
                <h1 className="text-7xl  text-center text-white" data-aos="zoom-in" >29-30</h1>
                <h1 className="text-7xl  text-center text-white" data-aos="zoom-in">November</h1>

                {/* Timer display matching the design */}
                <div className="mt-10 w-screen justify-center relative flex flex-row">
                
                    <div className="flex flex-col justify-center content-center items-center">
                        <img src="/assets/Timer.svg" data-aos="flip-up"  className="sm:w-100 w-90 lg:w-full mx-auto" alt="Timer" />
                        <div data-aos="flip-up" className="mx-auto  w-90 sm:w-100 lg:w-150 absolute inset-0  flex items-center justify-between mb-6  pointer-events-none">
                            <div  className="w-26 md:w-50  md:h-30 lg:h-50 relative md:right-2 lg:right-9 justify-center items-center flex">
                                <TimerBox value={timeLeft.days}    />
                            </div>
                            <div  className=" w-26 md:w-50 md:h-30 lg:h-50 relative sm:right-auto  justify-center items-center flex"> 
                                <TimerBox value={timeLeft.hours}   />
                            </div>
                            <div className="w-26 md:w-50  md:h-30 lg:h-50 relative lg:-right-10 md:-right-2 justify-center items-center flex">
                                <TimerBox value={timeLeft.minutes}  />
                            </div>
                            

                            
                        </div>
                        <div className="sm:w-10/12 w-10/12 ml-5 flex flex-row justify-between content-center items-center  text-red-600 text-xl  sm:text-2xl mt-2">
                            <h1>Days</h1>
                            <h1>Hours</h1>
                            <h1>Minutes</h1>
                        </div>
                    </div>
                    <img src="./assets/RightfullFlower.svg" className="absolute lg:right-5 right-5 -top-50 lg:w-100 w-0 sm:w-60" alt="" />
                    
                </div>
            </div>
            <img src="./assets/LeftFlower.svg" data-aos="fade-right" className="relative lg:-top-60 sm:-top-40 -bottom-7 sm:w-auto w-40" alt="right flower" />
            
            
        </div>

        <style>{`
            .number { transition: transform 220ms cubic-bezier(.2,.8,.2,1); }
            @keyframes pop { 0%{ transform: scale(1); } 40%{ transform: scale(1.12); } 100%{ transform: scale(1); } }
        `}</style>
        </>
    )
}

function TimerBox({value}:{value:number}){
    // pad numbers
    const str = value < 10 ? String(value).padStart(2,'0') : String(value);
    return (
        <div className={`number text-4xl lg:text-8xl text-white font-bold`}>
            {str}
        </div>
    )
}

function getTimeRemaining(target:Date){
    const now = new Date();
    const total = Math.max(0, target.getTime() - now.getTime());
    const secondsTotal = Math.floor(total/1000);
    const days = Math.floor(secondsTotal / (3600*24));
    const hours = Math.floor((secondsTotal % (3600*24)) / 3600);
    const minutes = Math.floor((secondsTotal % 3600) / 60);
    const seconds = secondsTotal % 60;
    return { total, days, hours, minutes, seconds };
}