import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import Beams from './Beams';
import VariableProximity from './VariableProximity';

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

      <div
        className="absolute text-center px-4 max-w-3xl font-playfair
        bg-gradient-to-r from-gray-500 via-gray-300 to-white
        bg-clip-text text-transparent"
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
