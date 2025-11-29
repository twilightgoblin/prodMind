import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function ParticleBurst({ trigger = false }) {
  const particlesRef = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (trigger && containerRef.current) {
      // Create particles
      const particles = [];
      for (let i = 0; i < 12; i++) {
        const particle = document.createElement("div");
        particle.className = "absolute w-2 h-2 rounded-full bg-amber-400";
        particle.style.left = "50%";
        particle.style.top = "50%";
        containerRef.current.appendChild(particle);
        particles.push(particle);

        // Animate particle
        const angle = (i / 12) * Math.PI * 2;
        const distance = 50 + Math.random() * 30;
        
        gsap.to(particle, {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          opacity: 0,
          scale: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => {
            particle.remove();
          }
        });
      }
    }
  }, [trigger]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
    />
  );
}
