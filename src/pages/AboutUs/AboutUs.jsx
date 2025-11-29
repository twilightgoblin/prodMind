"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

gsap.registerPlugin(ScrollTrigger);

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

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const missionRef = useRef(null);
  const visionRef = useRef(null);
  const whatWeDoRef = useRef([]);
  const valuesRef = useRef([]);
  const statsRef = useRef([]);
  const spotlightRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation with 3D text reveal
      gsap.from(headerRef.current.children, {
        y: 100,
        opacity: 0,
        rotationX: -90,
        transformOrigin: "top center",
        duration: 1.2,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
          once: true
        }
      });

      // Mission card with 3D entrance
      if (missionRef.current) {
        gsap.from(missionRef.current, {
          x: -100,
          opacity: 0,
          rotationY: -30,
          scale: 0.9,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: missionRef.current,
            start: "top 85%",
            once: true
          }
        });

        // Floating animation
        gsap.to(missionRef.current, {
          y: "+=10",
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }

      // Vision card with 3D entrance
      if (visionRef.current) {
        gsap.from(visionRef.current, {
          x: 100,
          opacity: 0,
          rotationY: 30,
          scale: 0.9,
          duration: 1,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: visionRef.current,
            start: "top 85%",
            once: true
          }
        });

        // Floating animation
        gsap.to(visionRef.current, {
          y: "+=10",
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.3
        });
      }

      // What We Do cards with stagger
      const validWhatWeDo = whatWeDoRef.current.filter(card => card !== null);
      if (validWhatWeDo.length > 0) {
        gsap.from(validWhatWeDo, {
          y: 80,
          opacity: 0,
          scale: 0.9,
          rotationX: -20,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: validWhatWeDo[0],
            start: "top 85%",
            once: true
          }
        });
      }

      // Values cards with 3D rotation
      const validValues = valuesRef.current.filter(card => card !== null);
      if (validValues.length > 0) {
        gsap.from(validValues, {
          y: 100,
          opacity: 0,
          rotationY: -30,
          scale: 0.8,
          duration: 1,
          stagger: 0.12,
          ease: "elastic.out(1, 0.6)",
          scrollTrigger: {
            trigger: validValues[0],
            start: "top 85%",
            once: true
          }
        });
      }

      // Stats with simple fade-in animation
      const validStats = statsRef.current.filter(stat => stat !== null);
      if (validStats.length > 0) {
        gsap.from(validStats, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: validStats[0],
            start: "top 85%",
            once: true
          }
        });
      }

      // Mouse spotlight effect
      const handleMouseMove = (e) => {
        if (spotlightRef.current && sectionRef.current) {
          const rect = sectionRef.current.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          gsap.to(spotlightRef.current, {
            x: x - 200,
            y: y - 200,
            duration: 0.5,
            ease: "power2.out"
          });
        }
      };

      if (sectionRef.current) {
        sectionRef.current.addEventListener("mousemove", handleMouseMove);
      }

      return () => {
        if (sectionRef.current) {
          sectionRef.current.removeEventListener("mousemove", handleMouseMove);
        }
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="aboutus"
      ref={sectionRef}
      className="relative w-full overflow-hidden pt-20 bg-gradient-to-b from-black via-gray-700 to-black"
    >
      {/* Golden spotlight effect */}
      <div
        ref={spotlightRef}
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(251, 191, 36, 0.5) 0%, transparent 70%)",
          filter: "blur(60px)"
        }}
      />

      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(45, 100%, 50%, 0.08) 0, hsla(45, 100%, 55%, 0.04) 50%, hsla(45, 100%, 45%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(45, 100%, 85%, 0.08) 0, hsla(45, 100%, 55%, 0.04) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(45, 100%, 85%, 0.06) 0, hsla(45, 100%, 85%, 0.06) 80%, transparent 100%)"
      />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        {/* Header */}
        <div ref={headerRef} className="mx-auto mb-16 max-w-2xl text-center">
          <h1 className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-400 bg-clip-text text-transparent text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {aboutData.title}
          </h1>
          <p className="text-gray-200 mt-6 text-xl">{aboutData.subtitle}</p>
        </div>

        {/* Mission & Vision */}
        <div className="relative mx-auto mb-24 max-w-7xl">
          <div className="relative z-10 grid gap-12 md:grid-cols-2">
            {/* Mission */}
            <div
              ref={missionRef}
              className="group border-border/40 relative block overflow-hidden rounded-2xl border bg-gradient-to-br from-black/20 to-gray-700/10 p-10 backdrop-blur-3xl"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  y: -8,
                  scale: 1.02,
                  boxShadow: "0 25px 50px rgba(251, 191, 36, 0.2)",
                  duration: 0.4,
                  ease: "back.out(1.5)"
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  y: 0,
                  scale: 1,
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
                  duration: 0.4,
                  ease: "power2.out"
                });
              }}
            >
              <BorderBeam
                duration={8}
                size={300}
                className="via-white from-transparent to-transparent"
              />
              <div className="mb-6 inline-flex aspect-square h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 backdrop-blur-sm">
                <Rocket className="h-8 w-8 text-amber-400" />
              </div>
              <div className="space-y-4">
                <h2 className="mb-4 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-400 bg-clip-text text-3xl font-bold text-transparent">
                  Our Mission
                </h2>
                <p className="text-white text-lg leading-relaxed">{aboutData.mission}</p>
              </div>
            </div>

            {/* Vision */}
            <div
              ref={visionRef}
              className="group border-border/40 relative block overflow-hidden rounded-2xl border bg-gradient-to-br from-black/20 to-gray-700/10 p-10 backdrop-blur-3xl"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  y: -8,
                  scale: 1.02,
                  boxShadow: "0 25px 50px rgba(251, 191, 36, 0.2)",
                  duration: 0.4,
                  ease: "back.out(1.5)"
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  y: 0,
                  scale: 1,
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
                  duration: 0.4,
                  ease: "power2.out"
                });
              }}
            >
              <BorderBeam
                duration={8}
                size={300}
                className="via-white from-transparent to-transparent"
                reverse
              />
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 backdrop-blur-sm">
                <Target className="h-8 w-8 text-amber-400" />
              </div>
              <h2 className="mb-4 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-400 bg-clip-text text-3xl font-bold text-transparent">
                Our Vision
              </h2>
              <p className="text-white text-lg leading-relaxed">{aboutData.vision}</p>
            </div>
          </div>
        </div>

        {/* What We Do */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-400 bg-clip-text text-transparent text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              What We Do
            </h2>
            <p className="text-gray-300 mx-auto max-w-3xl text-lg leading-relaxed">
              ProdMind is your AI-powered learning companion that transforms how you consume educational content. 
              We specialize in YouTube video intelligence, smart content curation, and personalized learning optimization.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            <div
              ref={(el) => (whatWeDoRef.current[0] = el)}
              className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 border border-amber-700/30 rounded-xl p-6 backdrop-blur-sm"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  y: -10,
                  scale: 1.03,
                  boxShadow: "0 20px 40px rgba(251, 191, 36, 0.3)",
                  duration: 0.3,
                  ease: "power2.out"
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  y: 0,
                  scale: 1,
                  boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
                  duration: 0.3,
                  ease: "power2.out"
                });
              }}
            >
              <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Smart Content Intelligence</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Our AI analyzes YouTube videos to provide intelligent summaries, priority scoring, and personalized recommendations based on your learning goals and preferences.
              </p>
            </div>

            <div
              ref={(el) => (whatWeDoRef.current[1] = el)}
              className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-700/30 rounded-xl p-6 backdrop-blur-sm"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  y: -10,
                  scale: 1.03,
                  boxShadow: "0 20px 40px rgba(251, 191, 36, 0.3)",
                  duration: 0.3,
                  ease: "power2.out"
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  y: 0,
                  scale: 1,
                  boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
                  duration: 0.3,
                  ease: "power2.out"
                });
              }}
            >
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Intelligent Scheduling</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Optimize your learning time with AI-powered scheduling that integrates with your calendar, sends mobile reminders, and tracks your progress analytics.
              </p>
            </div>

            <div
              ref={(el) => (whatWeDoRef.current[2] = el)}
              className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border border-yellow-700/30 rounded-xl p-6 backdrop-blur-sm md:col-span-2 lg:col-span-1"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  y: -10,
                  scale: 1.03,
                  boxShadow: "0 20px 40px rgba(251, 191, 36, 0.3)",
                  duration: 0.3,
                  ease: "power2.out"
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  y: 0,
                  scale: 1,
                  boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
                  duration: 0.3,
                  ease: "power2.out"
                });
              }}
            >
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-4">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Enhanced Learning Hub</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Take interactive notes while watching videos, export to calendar apps, and build your personal knowledge base with comprehensive learning analytics.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-24">
          <div className="mb-12 text-center">
            <h2 className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-400 bg-clip-text text-transparent text-3xl font-bold tracking-tight sm:text-4xl">
              Our Core Values
            </h2>
            <p className="text-white mx-auto mt-4 max-w-2xl text-lg">
              The core principles that drive our mission to revolutionize learning through intelligent technology.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {aboutData.values?.map((value, index) => {
              const IconComponent = iconComponents[value.icon];
              return (
                <div
                  key={value.title}
                  ref={(el) => (valuesRef.current[index] = el)}
                >
                  <CardHoverEffect
                    icon={<IconComponent className="h-6 w-6 text-white" />}
                    title={value.title}
                    description={value.description}
                    variant="amber"
                    glowEffect={true}
                    size="lg"
                    className="bg-black/20 border border-gray-700/10 text-white"
                    titleClassName="text-white"
                    descClassName="text-white"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Impact Stats */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-400 bg-clip-text text-transparent text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Our Impact
            </h2>
            <p className="text-gray-300 mx-auto max-w-2xl text-lg">
              Helping learners worldwide optimize their educational journey with AI-powered intelligence.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            <div 
              ref={(el) => (statsRef.current[0] = el)} 
              className="relative group"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  y: -5,
                  duration: 0.4,
                  ease: "power2.out"
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  y: 0,
                  duration: 0.4,
                  ease: "power2.out"
                });
              }}
            >
              <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 border border-amber-700/30 rounded-2xl p-8 backdrop-blur-sm text-center">
                <div className="text-6xl font-bold text-amber-400 mb-4">70%</div>
                <div className="text-white text-lg font-semibold mb-2">Time Saved</div>
                <div className="text-gray-400 text-sm">Average learning efficiency improvement</div>
              </div>
            </div>

            <div 
              ref={(el) => (statsRef.current[1] = el)} 
              className="relative group"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  y: -5,
                  duration: 0.4,
                  ease: "power2.out"
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  y: 0,
                  duration: 0.4,
                  ease: "power2.out"
                });
              }}
            >
              <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border border-yellow-700/30 rounded-2xl p-8 backdrop-blur-sm text-center">
                <div className="text-6xl font-bold text-yellow-400 mb-4">3x</div>
                <div className="text-white text-lg font-semibold mb-2">Better Retention</div>
                <div className="text-gray-400 text-sm">Improved knowledge retention rates</div>
              </div>
            </div>

            <div 
              ref={(el) => (statsRef.current[2] = el)} 
              className="relative group"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  y: -5,
                  duration: 0.4,
                  ease: "power2.out"
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  y: 0,
                  duration: 0.4,
                  ease: "power2.out"
                });
              }}
            >
              <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-700/30 rounded-2xl p-8 backdrop-blur-sm text-center">
                <div className="text-6xl font-bold text-orange-400 mb-4">24/7</div>
                <div className="text-white text-lg font-semibold mb-2">AI Assistant</div>
                <div className="text-gray-400 text-sm">Always available learning support</div>
              </div>
            </div>

            <div 
              ref={(el) => (statsRef.current[3] = el)} 
              className="relative group"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  y: -5,
                  duration: 0.4,
                  ease: "power2.out"
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  y: 0,
                  duration: 0.4,
                  ease: "power2.out"
                });
              }}
            >
              <div className="bg-gradient-to-br from-amber-900/30 to-yellow-800/20 border border-amber-700/30 rounded-2xl p-8 backdrop-blur-sm text-center">
                <div className="text-6xl font-bold text-amber-500 mb-4">∞</div>
                <div className="text-white text-lg font-semibold mb-2">Content Access</div>
                <div className="text-gray-400 text-sm">Unlimited YouTube integration</div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}
