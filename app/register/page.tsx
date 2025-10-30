export default function Competitions() {
    return(
        <div className="w-screen h-screen p-10" style={{background:'url("./assets/EventBg.svg")',backgroundSize:'cover',backgroundRepeat:'no-repeat'}}>
            <button className="flex  flex-row justify-center items-center bg-[#F99E00] p-1  w-60 gap-5 rounded-4xl">
                <img src="./assets/fullwheel.svg" alt="" />
                <h1 className="text-2xl text-black">Registrations</h1>
            </button>

            {/* card */}
            <div className="flex flex-col content-center items-center justify-around" style={{height:'80vh'}}>
                 <h1 className="md:text-9xl text-8xl text-amber-300 text-center">Coming Soon</h1>


            </div>
        </div>
    )
    
}