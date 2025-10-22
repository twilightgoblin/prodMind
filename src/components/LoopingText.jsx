import React from 'react';
import { motion } from 'framer-motion';

const LoopingText = () => {
  // Website-relevant terms
  const terms = [
    'AI-POWERED',
    'SMART LEARNING',
    'YOUTUBE INTEGRATION', 
    'CONTENT CURATION',
    'INTELLIGENT SCHEDULER',
    'VIDEO SUMMARIZER',
    'PRODMIND',
    'LEARNING ANALYTICS',
    'MOBILE OPTIMIZED',
    'PROGRESS TRACKING'
  ];

  return (
    <div className="relative w-full overflow-hidden py-12 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="relative">
        {/* Looping text animation */}
        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: [0, -1500],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {/* Repeat the terms multiple times for seamless loop */}
          {Array.from({ length: 3 }).map((_, setIndex) => 
            terms.map((term, termIndex) => (
              <span
                key={`${setIndex}-${termIndex}`}
                className="inline-block text-3xl md:text-4xl lg:text-5xl font-bold mx-8 transition-all duration-300 ease-in-out text-white cursor-default tracking-wide"
                style={{
                  fontFamily: 'inherit',
                  textShadow: '0 0 20px rgba(230, 230, 250, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(45deg, #E6E6FA 0%, #FFFFFF 50%, #E6E6FA 100%)';
                  e.target.style.webkitBackgroundClip = 'text';
                  e.target.style.webkitTextFillColor = 'transparent';
                  e.target.style.backgroundClip = 'text';
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.textShadow = '0 0 30px rgba(230, 230, 250, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'none';
                  e.target.style.webkitTextFillColor = 'white';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'scale(1)';
                  e.target.style.textShadow = '0 0 20px rgba(230, 230, 250, 0.2)';
                }}
              >
                {term}
              </span>
            ))
          )}
        </motion.div>
      </div>
      
      {/* Enhanced gradient overlays for smooth fade effect */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-black via-black/90 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black via-black/90 to-transparent z-10 pointer-events-none" />
      
      {/* Subtle background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-900/3 to-transparent pointer-events-none" />
    </div>
  );
};

export default LoopingText;