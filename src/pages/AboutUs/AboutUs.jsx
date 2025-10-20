"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { BorderBeam } from "@/components/ui/border-beam";
import { CardHoverEffect } from "@/components/ui/pulse-card";
import {
  Globe,
  Users,
  Heart,
  Lightbulb,
  Sparkles,
  Rocket,
  Target,
} from "lucide-react";

// Map icon names to components
const iconComponents = {
  Users: Users,
  Heart: Heart,
  Lightbulb: Lightbulb,
  Globe: Globe,
  Sparkles: Sparkles,
  Rocket: Rocket,
  Target: Target,
};

// Values for your topic
const defaultValues = [
  {
    title: "Smart Summaries",
    description:
      "AI agents quickly summarise long-form articles, blogs, and papers to save you time.",
    icon: "Lightbulb",
  },
  {
    title: "Personalised Recommendations",
    description:
      "Discover content aligned to your interests and reading habits with curated feeds.",
    icon: "Users",
  },
  {
    title: "Focus & Highlight",
    description:
      "Automatically highlight key insights and important points so you focus on what matters.",
    icon: "Sparkles",
  },
  {
    title: "Seamless Cross-Device",
    description:
      "Sync reading progress and AI suggestions across all your devices instantly.",
    icon: "Globe",
  },
];

export default function AboutUs() {
  const aboutData = {
    title: "About Us",
    subtitle:
      "Building personalised AI agents for productive content consumption.",
    mission:
      "Our mission is to empower readers with intelligent tools that condense, recommend, and highlight content—helping them stay informed without information overload.",
    vision:
      "We envision a world where people consume only the most relevant and insightful content, guided by AI agents that act as their personal knowledge companions.",
    values: defaultValues,
  };

  const missionRef = useRef(null);
  const valuesRef = useRef(null);
  const missionInView = useInView(missionRef, { once: true, amount: 0.3 });
  const valuesInView = useInView(valuesRef, { once: true, amount: 0.3 });

  return (
    <section
      id="aboutus"
      className="relative w-full overflow-hidden pt-20 bg-gradient-to-b from-black via-gray-700 to-black"
    >
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(50, 100%, 50%, 0.08) 0, hsla(50, 100%, 55%, 0.04) 50%, hsla(50, 100%, 45%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(50, 100%, 85%, 0.08) 0, hsla(50, 100%, 55%, 0.04) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(50, 100%, 85%, 0.06) 0, hsla(50, 100%, 85%, 0.06) 80%, transparent 100%)"
      />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h1 className="bg-gradient-to-r from-gray-600 via-white to-gray-800 bg-clip-text text-transparent text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {aboutData.title}
          </h1>
          <p className="text-gray-200 mt-6 text-xl">{aboutData.subtitle}</p>
        </motion.div>

        {/* Mission & Vision */}
        <div ref={missionRef} className="relative mx-auto mb-24 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={missionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative z-10 grid gap-12 md:grid-cols-2"
          >
            {/* Mission */}
            <motion.div
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              className="group border-border/40 relative block overflow-hidden rounded-2xl border bg-gradient-to-br from-black/20 to-gray-700/10 p-10 backdrop-blur-3xl"
            >
              <BorderBeam
                duration={8}
                size={300}
                className="via-white from-transparent to-transparent"
              />
              <div className="mb-6 inline-flex aspect-square h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-black/20 to-gray-700/10 backdrop-blur-sm">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-4">
                <h2 className="mb-4 bg-gradient-to-r from-gray-400 via-white to-gray-800 bg-clip-text text-3xl font-bold text-transparent">
                  Our Mission
                </h2>
                <p className="text-white text-lg leading-relaxed">{aboutData.mission}</p>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              className="group border-border/40 relative block overflow-hidden rounded-2xl border bg-gradient-to-br from-black/20 to-gray-700/10 p-10 backdrop-blur-3xl"
            >
              <BorderBeam
                duration={8}
                size={300}
                className="via-white from-transparent to-transparent"
                reverse
              />
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-black/20 to-gray-700/10 backdrop-blur-sm">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h2 className="mb-4 bg-gradient-to-r from-gray-400 via-white to-gray-800 bg-clip-text text-3xl font-bold text-transparent">
                Our Vision
              </h2>
              <p className="text-white text-lg leading-relaxed">{aboutData.vision}</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Core Values */}
        <div ref={valuesRef} className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-12 text-center"
          >
            <h2 className="bg-gradient-to-r from-gray-400 via-white to-black bg-clip-text text-transparent text-3xl font-bold tracking-tight sm:text-4xl">
              Our Core Values
            </h2>
            <p className="text-white mx-auto mt-4 max-w-2xl text-lg">
              The principles that guide everything we do and every decision we make.
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {aboutData.values?.map((value, index) => {
              const IconComponent = iconComponents[value.icon];
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.2, ease: "easeOut" }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <CardHoverEffect
                    icon={<IconComponent className="h-6 w-6 text-white" />}
                    title={value.title}
                    description={value.description}
                    variant="amber"
                    glowEffect={true}
                    size="lg"
                    className="bg-black/20 border border-gray-700/10 text-white" // ← ensure text-white here
                    titleClassName="text-white"  // override title text
                    descClassName="text-white"   // override description text
                  />
                </motion.div>
              );
            })}

          </div>

        </div>
      </div>
    </section>
  );
}
