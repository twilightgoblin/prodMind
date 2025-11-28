import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Beams from './Beams';
import VariableProximity from './VariableProximity';
import GhostCursor from './GhostCursor';

const Home = () => {
  const containerRef = useRef(null);

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
        beamNumber={20}
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
        className="absolute text-center px-4 max-w-3xl font-playfair
        bg-gradient-to-r from-gray-800 via-white to-gray-700
        bg-clip-text text-transparent z-10"
      >
        <VariableProximity
          label="Productive Content Consumption"
          className="text-[64px] leading-tight font-bold"
          fromFontVariationSettings="'wght' 400, 'opsz' 9"
          toFontVariationSettings="'wght' 1000, 'opsz' 40"
          containerRef={containerRef}
          radius={200}
          falloff="linear"
        />
        <p className="mt-4 text-[24px] leading-relaxed">
          Delivering smarter, faster and more focused content to you.
        </p>

        {/* Link to signup */}
        <Link
          to="/signup"
          className="inline-block mt-8 px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
};

export default Home;
