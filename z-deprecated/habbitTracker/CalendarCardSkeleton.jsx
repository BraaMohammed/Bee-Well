'use client'
import React from 'react'
import { useState, useEffect } from 'react';



const CalendarCardSkeleton = ({ isVisible }) => {
    const [shouldRender, setShouldRender] = useState(isVisible);
  
    useEffect(() => {
      if (!isVisible) {
        const timeout = setTimeout(() => setShouldRender(false), 1500); // 100ms extra to ensure the fade-out completes
        return () => clearTimeout(timeout);
      } else {
        setShouldRender(true);
      }
    }, [isVisible]);
  
    return shouldRender ? (
      <div
        className={`border-none bg-neutral-700 shadow-xl shadow-neutral-600 rounded-xl animate-pulse transition-opacity duration-[1200ms] ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex w-64 aspect-square items-center justify-center p-6">
          <div className="w-44 h-8 bg-neutral-500 rounded-xl"></div>
        </div>
      </div>
    ) : null;
  };
  
  export default CalendarCardSkeleton;