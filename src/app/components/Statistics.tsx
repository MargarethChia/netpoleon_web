// components/Statistics.tsx
"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useMemo, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";

export default function Statistics() {
  const [stats, setStats] = useState([
    { id: 1, target: 60, current: 0, suffix: '+', label: 'cloud services available globally' },
    { id: 2, target: 190, current: 0, suffix: 'B', label: 'cyber threats blocked each day' },
    { id: 3, target: 20, current: 0, suffix: '%', label: 'of all websites are protected by Netpoleon' },
    { id: 4, target: 330, current: 0, suffix: '+', label: 'cities in 125+ countries, including mainland China' }
  ]);
  
  const [animationStarted, setAnimationStarted] = useState(false);
  const ref = useRef(null);

  // Custom intersection observer for more reliable detection
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animationStarted) {
            console.log('Statistics section in view, starting animation...');
            setAnimationStarted(true);
            startAnimation();
          } 
        });
      },
      { 
        threshold: 0.3,  // Trigger when 30% of the element is visible
        rootMargin: '0px 0px -50px 0px'  // Start slightly before fully in view
      }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animationStarted]);

  // Remove fallback timer - animation only starts when in view

  const startAnimation = () => {
    const duration = 4000; // 4 seconds (increased from 2 seconds)
    const interval = 100; // Update every 100ms (increased from 50ms for smoother counting)
    const steps = duration / interval;
    
    const timer = setInterval(() => {
      setStats(prevStats => 
        prevStats.map(stat => {
          const increment = stat.target / steps;
          const newCurrent = Math.min(stat.current + increment, stat.target);
          
          return {
            ...stat,
            current: Math.round(newCurrent)
          };
        })
      );
    }, interval);

    // Cleanup timer after animation completes
    setTimeout(() => {
      clearInterval(timer);
    }, duration + 100);
  };


  // Animated background lights effect
  useEffect(() => {
    function animateWithRandomNumber(myClass: string, from: number, to: number) {
      gsap.fromTo(myClass, Math.floor((Math.random() * 20) + 1), 
        { y: from }, 
        { 
          y: to,
          onComplete: animateWithRandomNumber,
          onCompleteParams: [myClass, from, to],
          ease: "none"
        }
      );
    }

    const itemsDown = [".light4", ".light5", ".light6", ".light7", ".light8", ".light11", ".light12", ".light13", ".light14", ".light15", ".light16"];
    const itemsUp = [".light1", ".light2", ".light3", ".light9", ".light10", ".light17"];
    
    itemsDown.forEach(e => animateWithRandomNumber(e, -1080, 1080));
    itemsUp.forEach(e => animateWithRandomNumber(e, 1080, -1080));

    return () => {
      // Cleanup animations
      gsap.killTweensOf("*");
    };
  }, []);

  return (
    <div ref={ref} className="relative w-full h-[600px] bg-black">
      {/* Animated Background Lights */}
      <div className="absolute inset-0 overflow-hidden">
        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 1920 1080" 
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Static Vertical Lines */}
          <g className="lines" style={{ opacity: 0.05 }}>
            <rect className="line" x="1253.6" width="4.5" height="1080" fill="#4C3A90" />
            <rect className="line" x="873.3" width="1.8" height="1080" />
            <rect className="line" x="1100" width="1.8" height="1080" />
            <rect className="line" x="1547.1" width="4.5" height="1080" />
            <rect className="line" x="615" width="4.5" height="1080" />
            <rect className="line" x="684.6" width="1.8" height="1080" />
            <rect className="line" x="1369.4" width="1.8" height="1080" />
            <rect className="line" x="1310.2" width="0.9" height="1080" />
            <rect className="line" x="1233.4" width="0.9" height="1080" />
            <rect className="line" x="124.2" width="0.9" height="1080" />
            <rect className="line" x="1818.4" width="4.5" height="1080" />
            <rect className="line" x="70.3" width="4.5" height="1080" />
            <rect className="line" x="1618.6" width="1.8" height="1080" />
            <rect className="line" x="455.9" width="1.8" height="1080" />
            <rect className="line" x="328.7" width="1.8" height="1080" />
            <rect className="line" x="300.8" width="4.6" height="1080" />
            <rect className="line" x="1666.4" width="0.9" height="1080" />
          </g>
          
          {/* Animated Light Segments */}
          <g className="lights" style={{ opacity: 0.9 }}>
            <path className="light light1" d="M619.5,298.4H615v19.5h4.5V298.4z M619.5,674.8H615v9.8h4.5V674.8z M619.5,135.1H615v5.6h4.5V135.1z M619.5,55.5H615v68.7h4.5V55.5z" fill="#7A6BB5" />
            <path className="light light2" d="M1258.2,531.9h-4.5v8.1h4.5V531.9z M1258.2,497.9h-4.5v17.9h4.5V497.9z M1258.2,0h-4.5v25.3h4.5V0z M1258.2,252.2h-4.5v42.4h4.5V252.2z" fill="#7A6BB5" />
            <path className="light light3" d="M875.1,123.8h-1.8v4h1.8V123.8z M875.1,289.4h-1.8v24.1h1.8V289.4z M875.1,0h-1.8v31.4h1.8V0z M875.1,50.2h-1.8v11.5h1.8V50.2z" fill="#7A6BB5" />
            <path className="light light4" d="M1101.8,983.8h-1.8v8.2h1.8V983.8z M1101.8,1075.9h-1.8v4.1h1.8V1075.9z M1101.8,873.7h-1.8v4.2h1.8V873.7z M1101.8,851h-1.8v18.2h1.8V851z" fill="#7A6BB5" />
            <path className="light light5" d="M686.4,822.7h-1.8v3.8h1.8V822.7z M686.4,928.4h-1.8v23h1.8V928.4z M686.4,1043.8h-1.8v36.2h1.8V1043.8z" fill="#7A6BB5" />
            <path className="light light6" d="M1551.6,860.9h-4.4v-34.1h4.4V860.9z M1551.6,533.5h-4.4v-13.9h4.4V533.5z M1551.6,1080h-4.4v-89.1h4.4V1080z" fill="#7A6BB5" />
            <path className="light light7" d="M1311.1,707.7h-0.9V698h0.9V707.7z M1311.1,436.8h-0.9v-58.9h0.9V436.8z M1311.1,140.7h-0.9V48h0.9V140.7z" fill="#7A6BB5" />
            <path className="light light8" d="M125.1,514.5h-0.9v-9.7h0.9V514.5z M125.1,243.6h-0.9v-58.9h0.9V243.6z" fill="#7A6BB5" />
            <path className="light light9" d="M305.4,806.7h-4.6v-42.5h4.6V806.7z M305.4,398.5h-4.6v-17.3h4.6V398.5z M305.4,1080h-4.6V968.8h4.6V1080z" fill="#7A6BB5" />
            <path className="light light10" d="M1822.9,170.7h-4.5v13.7h4.5V170.7z M1822.9,435.1h-4.5v6.8h4.5V435.1z M1822.9,55.9h-4.5v4h4.5V55.9z M1822.9,0h-4.5v48.3h4.5V0z" fill="#7A6BB5" />
            <path className="light light11" d="M1666.4,331.5h0.9v9.7h-0.9V331.5z M1666.4,602.4h0.9v58.9h-0.9V602.4z M1666.4,898.5h0.9v92.7h-0.9V898.5z" fill="#7A6BB5" />
            <path className="light light12" d="M1620.4,200.7h-1.8v6.4h1.8V200.7z M1620.4,469.1h-1.8v39h1.8V469.1z M1620.4,0h-1.8v51h1.8V0z M1620.4,81.3h-1.8V100h1.8V81.3z" fill="#7A6BB5" />
            <path className="light light13" d="M74.8,201h-4.5v16.2h4.5V201z M74.8,512.3h-4.5v8.1h4.5V512.3z M74.8,65.8h-4.5v4.6h4.5V65.8z M74.8,0h-4.5v56.8h4.5V0z" fill="#7A6BB5" />
            <path className="light light14" d="M1371.2,655.3h-1.8v6.3h1.8V655.3z M1371.2,829.7h-1.8v37.9h1.8V829.7z M1371.2,1020.3h-1.8v59.7h1.8V1020.3z" fill="#7A6BB5" />
            <path className="light light15" d="M1234.3,898.1h-0.9v-4.9h0.9V898.1z M1234.3,762.5h-0.9v-29.5h0.9V762.5z M1234.3,614.4h-0.9v-46.4h0.9V614.4z" fill="#7A6BB5" />
            <path className="light light16" d="M457.7,1010.8h-1.8v-18.1h1.8V1010.8z M457.7,507.5h-1.8V398h1.8V507.5z" fill="#7A6BB5" />
            <path className="light light17" d="M330.5,170.7h-1.8v13.7h1.8V170.7z M330.5,435.1h-1.8v6.8h1.8V435.1z M330.5,55.9h-1.8v4h1.8V55.9z M330.5,0h-1.8v48.3h1.8V0z" fill="#7A6BB5" />
          </g>
        </svg>
      </div>



      {/* Statistics Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="flex space-x-20 px-12">
          {/* Stat 1 */}
          <div className="text-center">
            <div className="relative">
              <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-3"></div>
              <div className="w-1 h-12 bg-orange-500 mx-auto"></div>
            </div>
            <div className="text-6xl font-bold text-orange-500 mb-3">
              {stats[0].current}{stats[0].current === 0 ? '' : stats[0].suffix}
            </div>
            <div className="text-base text-white font-bold max-w-[160px]">{stats[0].label}</div>
          </div>

          {/* Stat 2 */}
          <div className="text-center">
            <div className="relative">
              <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-3"></div>
              <div className="w-1 h-12 bg-orange-500 mx-auto"></div>
            </div>
            <div className="text-6xl font-bold text-orange-500 mb-3">
              {stats[1].current}{stats[1].current === 0 ? '' : stats[1].suffix}
            </div>
            <div className="text-base text-white font-bold max-w-[160px]">{stats[1].label}</div>
          </div>

          {/* Stat 3 */}
          <div className="text-center">
            <div className="relative">
              <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-3"></div>
              <div className="w-1 h-12 bg-orange-500 mx-auto"></div>
            </div>
            <div className="text-6xl font-bold text-orange-500 mb-3">
              {stats[2].current}{stats[2].current === 0 ? '' : stats[2].suffix}
            </div>
            <div className="text-base text-white font-bold max-w-[160px]">{stats[2].label}</div>
          </div>

          {/* Stat 4 */}
          <div className="text-center">
            <div className="relative">
              <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-3"></div>
              <div className="w-1 h-12 bg-orange-500 mx-auto"></div>
            </div>
            <div className="text-6xl font-bold text-orange-500 mb-3">
              {stats[3].current}{stats[3].current === 0 ? '' : stats[3].suffix}
            </div>
            <div className="text-base text-white font-bold max-w-[160px]">{stats[3].label}</div>
          </div>
        </div>
        
        {/* Manual test button */}
        {/*<button 
          onClick={() => {
            console.log('Manual button clicked');
            setAnimationStarted(false);
            setStats(stats.map(stat => ({ ...stat, current: 0 })));
            // Start animation immediately after reset
            setTimeout(() => {
              setAnimationStarted(true);
              startAnimation();
            }, 100);
          }}
          className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded text-sm"
        >
          Reset Animation
        </button>
        */}
      </div>
    </div>
  );
}
