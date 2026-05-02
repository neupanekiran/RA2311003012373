"use client"

import { useRouter } from "next/navigation";
import { MdNotificationsActive } from "react-icons/md";
import { RiLoginBoxLine } from "react-icons/ri";

const Navbar = () => {
  const router = useRouter();

  function handleLogin() { 
    router.push('/login');
  }
 
  return (
    <div className="w-full bg-black border-b-2 border-white text-white font-mono flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-4">
        <span className="text-white border-2 border-white p-1.5 bg-black"> 
          <MdNotificationsActive size={24} /> 
        </span>
        <span className="text-xl md:text-2xl font-bold uppercase tracking-widest">Notification App</span>
      </div>
      <button 
        className="bg-white text-black font-bold uppercase tracking-widest px-4 md:px-6 py-2 md:py-2.5 border-2 border-white hover:bg-black hover:text-white transition-none flex items-center gap-2" 
        onClick={handleLogin}
      >
        <RiLoginBoxLine size={20} className="hidden md:block" /> LOGIN
      </button>
    </div>
  )
}

export default Navbar;
