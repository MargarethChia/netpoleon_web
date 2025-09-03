// components/Statistics.tsx
'use client';

import { useRef, useState, useEffect } from 'react';

export default function Statistics() {
  const [stats, setStats] = useState([
    {
      id: 1,
      target: 60,
      current: 0,
      suffix: '+',
      label: 'cloud services available globally',
    },
    {
      id: 2,
      target: 190,
      current: 0,
      suffix: 'B',
      label: 'cyber threats blocked each day',
    },
    {
      id: 3,
      target: 20,
      current: 0,
      suffix: '%',
      label: 'of all websites are protected by Netpoleon',
    },
    {
      id: 4,
      target: 330,
      current: 0,
      suffix: '+',
      label: 'cities in 125+ countries, including mainland China',
    },
  ]);

  const [animationStarted, setAnimationStarted] = useState(false);
  const ref = useRef(null);

  // Custom intersection observer for more reliable detection
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !animationStarted) {
            console.log('Statistics section in view, starting animation...');
            setAnimationStarted(true);
            startAnimation();
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the element is visible
        rootMargin: '0px 0px -50px 0px', // Start slightly before fully in view
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
            current: Math.round(newCurrent),
          };
        })
      );
    }, interval);

    // Cleanup timer after animation completes
    setTimeout(() => {
      clearInterval(timer);
    }, duration + 100);
  };

  return (
    <div
      ref={ref}
      className="relative w-full h-[400px] bg-gradient-to-r from-orange-400 to-amber-600"
    >
      {/* Statistics Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="flex space-x-16 px-8">
          {/* Stat 1 */}
          <div className="text-center">
            <div className="relative">
              <div className="w-3 h-3 bg-white rounded-full mx-auto mb-3"></div>
              <div className="w-1 h-12 bg-white mx-auto"></div>
            </div>
            <div className="text-5xl font-bold text-white mb-2">
              {stats[0].current}
              {stats[0].current === 0 ? '' : stats[0].suffix}
            </div>
            <div className="text-base text-white font-bold max-w-[160px]">
              {stats[0].label}
            </div>
          </div>

          {/* Stat 2 */}
          <div className="text-center">
            <div className="relative">
              <div className="w-3 h-3 bg-white rounded-full mx-auto mb-3"></div>
              <div className="w-1 h-12 bg-white mx-auto"></div>
            </div>
            <div className="text-5xl font-bold text-white mb-2">
              {stats[1].current}
              {stats[1].current === 0 ? '' : stats[1].suffix}
            </div>
            <div className="text-base text-white font-bold max-w-[160px]">
              {stats[1].label}
            </div>
          </div>

          {/* Stat 3 */}
          <div className="text-center">
            <div className="relative">
              <div className="w-3 h-3 bg-white rounded-full mx-auto mb-3"></div>
              <div className="w-1 h-12 bg-white mx-auto"></div>
            </div>
            <div className="text-5xl font-bold text-white mb-2">
              {stats[2].current}
              {stats[2].current === 0 ? '' : stats[2].suffix}
            </div>
            <div className="text-base text-white font-bold max-w-[160px]">
              {stats[2].label}
            </div>
          </div>

          {/* Stat 4 */}
          <div className="text-center">
            <div className="relative">
              <div className="w-3 h-3 bg-white rounded-full mx-auto mb-3"></div>
              <div className="w-1 h-12 bg-white mx-auto"></div>
            </div>
            <div className="text-5xl font-bold text-white mb-2">
              {stats[3].current}
              {stats[3].current === 0 ? '' : stats[3].suffix}
            </div>
            <div className="text-base text-white font-bold max-w-[160px]">
              {stats[3].label}
            </div>
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
