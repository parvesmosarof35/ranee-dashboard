"use client";

import React from "react";
import { textPrimary, buttonbg, borderPrimary } from "@/contexts/theme";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/90 backdrop-blur-xl">
      <div className="relative flex flex-col items-center">
        {/* Main animated orb */}
        <div className="relative w-28 h-28">
          <div className={`absolute inset-0 ${borderPrimary} rounded-full opacity-20 animate-ping`}></div>
          <div className="absolute inset-2 bg-linear-to-tr from-[#F3AB0C] to-[#F96803] rounded-full opacity-30 animate-pulse delay-75"></div>
          <div className={`absolute inset-4 ${buttonbg} rounded-full shadow-2xl shadow-orange-200 flex items-center justify-center border-4 border-white`}>
            <svg 
              className="w-10 h-10 text-white animate-spin-slow" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 4V2M12 22V20M22 12H20M4 12H2M19.07 4.93L17.66 6.34M6.34 17.66L4.93 19.07M19.07 19.07L17.66 17.66M6.34 6.34L4.93 4.93" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Loading text with animated dots */}
        <div className="mt-10 flex flex-col items-center space-y-3">
          <h2 className={`text-2xl font-black italic tracking-tighter ${textPrimary} drop-shadow-sm`}>
            RANEE DASHBOARD
          </h2>
          <div className="flex items-center space-x-2 bg-orange-50 px-4 py-1.5 rounded-full border border-orange-100 shadow-inner">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Initialing</span>
            <div className="flex space-x-1.5">
              <div className="w-1.5 h-1.5 bg-[#F96803] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-[#F96803] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-[#F96803] rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>

        {/* Progress bar background */}
        <div className="mt-10 w-64 h-1.5 bg-orange-100 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-linear-to-r from-[#F3AB0C] to-[#F96803] rounded-full animate-loading-bar origin-left shadow-lg"></div>
        </div>
        
        <p className="mt-6 text-[10px] uppercase font-black tracking-[0.2em] text-gray-300">
          Powered by Ranee
        </p>
      </div>

      <style jsx global>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%) scaleX(0.1); }
          50% { transform: translateX(0) scaleX(0.6); }
          100% { transform: translateX(100%) scaleX(0.1); }
        }
        .animate-loading-bar {
          animation: loading-bar 2.5s infinite ease-in-out;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 4s infinite linear;
        }
      `}</style>
    </div>
  );
}
