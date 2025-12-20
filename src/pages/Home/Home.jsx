import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Beams from './Beams';
import VariableProximity from './VariableProximity';
import GhostCursor from './GhostCursor';

const Home = () => {
  const containerRef = useRef(null);
  const [proximityRadius, setProximityRadius] = useState(200);
  const [beamCount, setBeamCount] = useState(20);

  useEffect(() => {
    const updateResponsiveSettings = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setProximityRadius(100); // Mobile
        setBeamCount(12); // Fewer beams for better mobile performance
      } else if (width < 768) {
        setProximityRadius(150); // Small tablet
        setBeamCount(16);
      } else {
        setProximityRadius(200); // Desktop
        setBeamCount(20);
      }
    };

    updateResponsiveSettings();
    window.addEventListener('resize', updateResponsiveSettings);
    return () => window.removeEventListener('resize', updateResponsiveSettings);
  }, []);

  return (
    // 🔹 added id="home" so navbar anchors can scroll here
    <section
      id="home"
      ref={containerRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#060010]"
    >
      <Beams
        beamWidth={3}
        beamHeight={30}
        beamNumber={beamCount}
        lightColor="#ffffff"
        speed={2}
        noiseIntensity={1.75}
        scale={0.2}
        rotation={30}
      />

      <GhostCursor
        color="#E5E4E2"
        brightness={1}
        edgeIntensity={0}
        trailLength={18}
        inertia={0.5}
        grainIntensity={0.05}
        bloomStrength={0.1}
        bloomRadius={1.0}
        bloomThreshold={0.025}
        fadeDelayMs={1000}
        fadeDurationMs={1500}
        className="absolute inset-0"
        style={{ width: '100%', height: '100%' }}
        zIndex={1}
      />

      <div
        className="absolute text-center px-6 sm:px-8 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl font-playfair
        bg-gradient-to-r from-gray-800 via-white to-gray-700
        bg-clip-text text-transparent z-10"
      >
        <VariableProximity
          label="Productive Content Consumption"
          className="text-[28px] sm:text-[40px] md:text-[52px] lg:text-[64px] leading-tight font-bold"
          fromFontVariationSettings="'wght' 400, 'opsz' 9"
          toFontVariationSettings="'wght' 1000, 'opsz' 40"
          containerRef={containerRef}
          radius={proximityRadius}
          falloff="linear"
        />
        <p className="mt-3 sm:mt-4 text-[14px] sm:text-[18px] md:text-[20px] lg:text-[24px] leading-relaxed">
          Delivering smarter, faster and more focused content to you.
        </p>

        {/* Link to signup */}
        <Link
          to="/signup"
          className="inline-block mt-6 sm:mt-8 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
};

export default Home;
