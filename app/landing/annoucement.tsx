
"use client"

import { useEffect, useState, useRef } from "react";

export default function Announcement(){
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
            setPops(newPops);
            const t = setTimeout(()=> setPops({days:false,hours:false,minutes:false}), 350);
            return ()=> clearTimeout(t);
        }
        prev.current = timeLeft;
    },[timeLeft]);

    return(
        <>
        <div className="bg-[#200808] w-screen overflow-hidden" style={{height:'90vh'}}>
            <div className="flex flex-row justify-between">
                <img src="./assets/flowerImage.svg" className="relative -top-30" alt="flower" />
                <div className="flex flex-col  items-center justify-center">
                    <img src="/assets/Mask.svg"  className="w-40 mb-2" alt="" />
                    <h1 className="text-4xl text-white">Join us on</h1>
                </div>
                <img src="./assets/RightFlower.svg" className="relative -top-30" alt="right flower" />
                
            </div>
            <div className="ml-37 flex flex-col content-center relative -top-20 justify-center items-center gap-5" style={{width:'90vw'}}>
                <h1 className="text-7xl  text-center text-white">28-29</h1>
                <h1 className="text-7xl  text-center text-white">November</h1>

                {/* Timer display matching the design */}
                <div className="mt-10 w-screen justify-center relative flex flex-row">
                    <div className="flex flex-col justify-center content-center items-center">
                        <img src="/assets/Timer.svg" className="w-full mx-auto" alt="Timer" />
                        <div className="mx-auto w-150 absolute inset-0 flex items-center justify-center mb-6 gap-30 pointer-events-none">
                           
                                 <TimerBox value={timeLeft.days}  pop={pops.days}  />
                            
                           
                                 <TimerBox value={timeLeft.hours}  pop={pops.hours}  />
                        
                           
                            
                            <TimerBox value={timeLeft.minutes}  pop={pops.minutes} />
                        </div>
                        <div className="w-full mx-auto flex flex-row justify-around text-red-600 text-2xl mt-2">
                            <h1>Days</h1>
                            <h1>Hours</h1>
                            <h1>Minutes</h1>
                        </div>
                    </div>
                    <img src="./assets/RightfullFlower.svg" className="absolute right-15 -top-50" alt="" />
                    
                </div>

                
            </div>
            <img src="./assets/LeftFlower.svg" className="relative -top-30" alt="right flower" />
            
            
        </div>

        <style>{`
            .number { transition: transform 220ms cubic-bezier(.2,.8,.2,1); }
            .pop { animation: pop 320ms ease; }
            @keyframes pop { 0%{ transform: scale(1); } 40%{ transform: scale(1.12); } 100%{ transform: scale(1); } }
        `}</style>
        </>
    )
}

function TimerBox({value, pop}:{value:number, pop:boolean}){
    // pad numbers
    const str = value < 10 ? String(value).padStart(2,'0') : String(value);
    return (
        <div className={`number text-8xl text-white font-bold ${pop ? 'pop' : ''}`}>
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