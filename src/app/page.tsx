/* eslint-disable @next/next/no-img-element */
import Navbar from '@/Components/Navbar'

const page = () => {
  return (
    <div className="min-h-screen bg-black font-mono text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-8 gap-12 max-w-7xl mx-auto w-full">
        
        <div className="flex-1 flex flex-col items-start space-y-6">
          <div className="border-2 border-white px-4 py-1 text-sm font-bold tracking-widest uppercase inline-block bg-white text-black">
            SYSTEM STATUS: ONLINE
          </div>
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none">
            Notification <br/> System
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest max-w-md mt-4 leading-relaxed">
            REAL-TIME ALERTS. SECURE ACCESS. ZERO DISTRACTIONS.
          </p>
          <div className="pt-6 w-full sm:w-auto">
            <a href="/login" className="bg-white text-black font-bold uppercase tracking-widest py-4 px-8 border-2 border-white hover:bg-black hover:text-white transition-none text-center w-full sm:w-auto inline-flex justify-center items-center gap-3">
              INITIALIZE LOGIN 
              <span className="text-xl">→</span>
            </a>
          </div>
        </div>

        <div className="flex-1 flex justify-center lg:justify-end w-full mt-8 lg:mt-0">
          <div className="relative border-2 border-white p-2 bg-black max-w-md w-full shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
      
            <img
              src="https://cdn.dribbble.com/userupload/22181005/file/original-85de014fba26ebe8931b9740e19c4ac9.gif"
              alt="Notification Animation"
              className="w-full h-auto object-cover filter grayscale contrast-125 border-2 border-white"
            />
            <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-widest border-2 border-white">
              VISUAL_DATA_01
            </div>
            <div className="absolute bottom-4 right-4 bg-white text-black px-3 py-1 text-xs font-bold uppercase tracking-widest border-2 border-white">
              REC: ACTIVE
            </div>
          </div>
        </div>

      </main>

    
    </div>
  )
}

export default page
