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
    title: "AI-Powered Learning",
    description:
      "Intelligent content curation and summarization that transforms how you learn from YouTube videos and educational content.",
    icon: "Lightbulb",
  },
  {
    title: "Smart Scheduling",
    description:
      "Optimize your learning time with AI-driven scheduling, calendar integration, and personalized learning paths.",
    icon: "Users",
  },
  {
    title: "Interactive Experience",
    description:
      "Take notes while watching, track progress, and build your personal knowledge base with seamless video integration.",
    icon: "Sparkles",
  },
  {
    title: "Mobile-First Design",
    description:
      "Access your learning content anywhere with mobile-optimized design and cross-device synchronization.",
    icon: "Globe",
  },
];

export default function AboutUs() {
  const aboutData = {
    title: "About ProdMind",
    subtitle:
      "Revolutionizing learning through AI-powered video intelligence and smart scheduling.",
    mission:
      "Our mission is to transform how people learn by providing intelligent tools that curate, summarize, and schedule educational content—helping learners maximize their productivity and retention while minimizing time waste.",
    vision:
      "We envision a future where personalized AI learning assistants help everyone achieve their educational goals efficiently, making quality learning accessible, organized, and optimized for individual needs.",
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

        {/* What We Do */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={missionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <h2 className="bg-gradient-to-r from-gray-400 via-white to-black bg-clip-text text-transparent text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              What We Do
            </h2>
            <p className="text-gray-300 mx-auto max-w-3xl text-lg leading-relaxed">
              ProdMind is your AI-powered learning companion that transforms how you consume educational content. 
              We specialize in YouTube video intelligence, smart content curation, and personalized learning optimization.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={missionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/30 rounded-xl p-6 backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Smart Content Intelligence</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Our AI analyzes YouTube videos to provide intelligent summaries, priority scoring, and personalized recommendations based on your learning goals and preferences.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={missionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700/30 rounded-xl p-6 backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Intelligent Scheduling</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Optimize your learning time with AI-powered scheduling that integrates with your calendar, sends mobile reminders, and tracks your progress analytics.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={missionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
              className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700/30 rounded-xl p-6 backdrop-blur-sm md:col-span-2 lg:col-span-1"
            >
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Enhanced Learning Hub</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Take interactive notes while watching videos, export to calendar apps, and build your personal knowledge base with comprehensive learning analytics.
              </p>
            </motion.div>
          </div>
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
              The core principles that drive our mission to revolutionize learning through intelligent technology.
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

        {/* Impact Stats */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <h2 className="bg-gradient-to-r from-gray-400 via-white to-black bg-clip-text text-transparent text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Our Impact
            </h2>
            <p className="text-gray-300 mx-auto max-w-2xl text-lg">
              Helping learners worldwide optimize their educational journey with AI-powered intelligence.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-4 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={valuesInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-blue-400 mb-2">70%</div>
              <div className="text-gray-300 text-sm">Time Saved</div>
              <div className="text-gray-500 text-xs mt-1">Average learning efficiency improvement</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={valuesInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-purple-400 mb-2">3x</div>
              <div className="text-gray-300 text-sm">Better Retention</div>
              <div className="text-gray-500 text-xs mt-1">Improved knowledge retention rates</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={valuesInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-gray-300 text-sm">AI Assistant</div>
              <div className="text-gray-500 text-xs mt-1">Always available learning support</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={valuesInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-yellow-400 mb-2">∞</div>
              <div className="text-gray-300 text-sm">Content Access</div>
              <div className="text-gray-500 text-xs mt-1">Unlimited YouTube integration</div>
            </motion.div>
          </div>
        </div>


      </div>
    </section>
  );
}
