export default function Events() {
    return(
        <div className="w-screen h-screen p-10" style={{background:'url("./assets/EventBg.svg")',backgroundSize:'cover',backgroundRepeat:'no-repeat'}}>
            <button className="flex  flex-row justify-center items-center bg-[#F99E00] p-1 w-50 gap-5 rounded-4xl">
                <img src="./assets/fullwheel.svg" alt="" />
                <h1 className="text-2xl text-black">Events</h1>
            </button>

            {/* card */}
            <div className="flex flex-col h-screen w-screen content-center items-center justify-center">
                <h1 className="text-9xl text-amber-300">Coming Soon</h1>


            </div>
        </div>
    )
    
}