// components/Statistics.tsx
'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { AnimatedNumber } from '@/components/ui/animated-number';

const STATS_DATA = [
  {
    id: 1,
    value: 50,
    suffix: '+',
    label: 'Years since \n founded in Japan',
  },
  {
    id: 2,
    value: 4700,
    suffix: '+',
    label: 'Employees \n Worldwide',
  },
  {
    id: 3,
    value: 11,
    suffix: 'T',
    label: 'Sales Revenue (¥11 \n Trillion ~ USD 76B)',
  },
  {
    id: 4,
    value: 25,
    suffix: '+',
    label: 'years since listed in \n Tokyo Stock Exchange',
  },
];

export default function Statistics() {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [animatedValues, setAnimatedValues] = useState([0, 0, 0, 0]);
  const ref = useRef(null);

  const stats = useMemo(() => STATS_DATA, []);

  // Custom intersection observer for more reliable detection
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !animationStarted) {
            setAnimationStarted(true);
            // Set the target values to trigger animation
            setAnimatedValues(stats.map(stat => stat.value));
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
  }, [animationStarted, stats]);

  return (
    <div
      ref={ref}
      className="relative w-full h-auto py-12 sm:py-16 lg:py-0 lg:h-[500px] bg-orange-500"
    >
      {/* Statistics Overlay */}
      <div className="relative lg:absolute lg:inset-0 flex items-center justify-center z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Company subtitle */}
          <div className="text-center mb-12 lg:mb-24">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-2">
              A Company of Macnica
            </h2>
            <p className="text-white ">Global Expertise. Local Impact.</p>
          </div>

          {/* Statistics */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 justify-center items-center">
            {stats.map((stat, index) => (
              <div key={stat.id} className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                  <AnimatedNumber
                    value={animatedValues[index]}
                    format={num => num.toLocaleString()}
                    mass={0.8}
                    stiffness={75}
                    damping={15}
                  />
                  {animationStarted && stat.suffix}
                </div>
                <div className="text-sm sm:text-base text-white max-w-[220px] mx-auto whitespace-pre-line">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
