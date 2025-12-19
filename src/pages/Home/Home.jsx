import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Beams from './Beams';
import VariableProximity from './VariableProximity';
import GhostCursor from './GhostCursor';

const Home = () => {
  const containerRef = useRef(null);
  const [proximityRadius, setProximityRadius] = useState(200);
  const [beamConfig, setBeamConfig] = useState({
    width: 3,
    height: 30,
    number: 20
  });
  const [ghostConfig, setGhostConfig] = useState({
    trailLength: 18,
    fadeDelayMs: 1000,
    fadeDurationMs: 1500
  });

  useEffect(() => {
    const updateResponsiveValues = () => {
      const isMobile = window.innerWidth < 768;
      setProximityRadius(isMobile ? 100 : 200);
      setBeamConfig({
        width: isMobile ? 2 : 3,
        height: isMobile ? 20 : 30,
        number: isMobile ? 12 : 20
      });
      setGhostConfig({
        trailLength: isMobile ? 12 : 18,
        fadeDelayMs: isMobile ? 500 : 1000,
        fadeDurationMs: isMobile ? 1000 : 1500
      });
    };

    updateResponsiveValues();
    window.addEventListener('resize', updateResponsiveValues);
    return () => window.removeEventListener('resize', updateResponsiveValues);
  }, []);

  return (
    // 🔹 added id="home" so navbar anchors can scroll here
    <section
      id="home"
      ref={containerRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#060010] py-8 sm:py-12"
    >
      <Beams
        beamWidth={beamConfig.width}
        beamHeight={beamConfig.height}
        beamNumber={beamConfig.number}
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
        trailLength={ghostConfig.trailLength}
        inertia={0.5}
        grainIntensity={0.05}
        bloomStrength={0.1}
        bloomRadius={1.0}
        bloomThreshold={0.025}
        fadeDelayMs={ghostConfig.fadeDelayMs}
        fadeDurationMs={ghostConfig.fadeDurationMs}
        className="absolute inset-0"
        style={{ width: '100%', height: '100%' }}
        zIndex={1}
      />

      <div
        className="absolute text-center px-4 sm:px-6 lg:px-8 max-w-xs sm:max-w-2xl lg:max-w-4xl font-playfair
        bg-gradient-to-r from-gray-800 via-white to-gray-700
        bg-clip-text text-transparent z-10"
      >
        <VariableProximity
          label="Productive Content Consumption"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight font-bold"
          fromFontVariationSettings="'wght' 400, 'opsz' 9"
          toFontVariationSettings="'wght' 1000, 'opsz' 40"
          containerRef={containerRef}
          radius={proximityRadius}
          falloff="linear"
        />
        <p className="mt-2 sm:mt-4 text-sm sm:text-lg md:text-xl lg:text-2xl leading-relaxed">
          Delivering smarter, faster and more focused content to you.
        </p>

        {/* Link to signup */}
        <Link
          to="/signup"
          className="inline-block mt-4 sm:mt-6 lg:mt-8 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all text-sm sm:text-base"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
};

export default Home;
