import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CardFlip from "./Card";

gsap.registerPlugin(ScrollTrigger);

const featuresData = [
  {
    title: "Smart Content Intelligence",
    subtitle: "AI-powered content curation",
    description:
      "Discover and prioritize YouTube videos with AI-driven analysis, smart tagging, and personalized recommendations based on your learning goals.",
    features: ["AI Priority Scoring", "Smart Tagging", "Content Analysis", "YouTube Integration"],
  },
  {
    title: "Intelligent Scheduler",
    subtitle: "Optimize your learning time",
    description:
      "Schedule your learning sessions with AI optimization, calendar integration, and mobile-friendly reminders for maximum productivity.",
    features: ["AI Time Optimization", "Calendar Sync", "Mobile Reminders", "Progress Analytics"],
  },
  {
    title: "Content Summarizer",
    subtitle: "Extract key insights instantly",
    description:
      "Generate comprehensive summaries with multiple modes (TL;DR, Insight, Detailed), educational focus, and interactive learning tools.",
    features: ["3 Summary Modes", "Educational Focus", "Key Insights", "Learning Analytics"],
  },
  {
    title: "Video Learning Hub",
    subtitle: "Enhanced video experience",
    description:
      "Take notes while watching, track progress, export to calendar apps, and build your personal knowledge base with seamless video integration.",
    features: ["Interactive Notes", "Progress Tracking", "Calendar Export", "Knowledge Base"],
  },
];

export default function FeaturesPage() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);
  const benefitsRef = useRef([]);
  const ctaRef = useRef(null);
  const spotlightRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation with 3D entrance
      gsap.from(headingRef.current.children, {
        y: 100,
        opacity: 0,
        rotationX: -90,
        transformOrigin: "top center",
        duration: 1.2,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
          once: true
        }
      });

      // Cards entrance with 3D rotation and stagger
      const validCards = cardsRef.current.filter(card => card !== null);
      if (validCards.length > 0) {
        gsap.set(validCards, { opacity: 1 }); // Ensure cards are visible first
        
        gsap.from(validCards, {
          y: 100,
          opacity: 0,
          rotationX: -30,
          scale: 0.9,
          duration: 1,
          stagger: {
            each: 0.12,
            from: "start"
          },
          ease: "power3.out",
          scrollTrigger: {
            trigger: validCards[0],
            start: "top 90%",
            once: true
          }
        });

        // Floating animation for cards
        validCards.forEach((card, index) => {
          gsap.to(card, {
            y: "+=8",
            duration: 2 + index * 0.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.1
          });
        });
      }

      // Benefits section with slide-in effect
      const validBenefits = benefitsRef.current.filter(benefit => benefit !== null);
      if (validBenefits.length > 0) {
        gsap.from(validBenefits, {
          x: (index) => (index % 2 === 0 ? -80 : 80),
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: validBenefits[0],
            start: "top 85%",
            once: true
          }
        });

        // Pulse animation for benefit icons
        validBenefits.forEach((benefit) => {
          const icon = benefit.querySelector("div:first-child");
          if (icon) {
            gsap.to(icon, {
              scale: 1.15,
              boxShadow: "0 0 20px rgba(251, 191, 36, 0.4)",
              duration: 1.5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut"
            });
          }
        });
      }

      // CTA animation with bounce
      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          scale: 0.95,
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 90%",
            once: true
          }
        });

        // Breathing effect for CTA
        gsap.to(ctaRef.current, {
          scale: 1.01,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }

      // Parallax background effect
      gsap.to(sectionRef.current, {
        backgroundPosition: "50% 100%",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });

      // Mouse spotlight effect
      const handleMouseMove = (e) => {
        if (spotlightRef.current) {
          const rect = sectionRef.current.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          gsap.to(spotlightRef.current, {
            x: x - 150,
            y: y - 150,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      };

      sectionRef.current.addEventListener("mousemove", handleMouseMove);

      return () => {
        if (sectionRef.current) {
          sectionRef.current.removeEventListener("mousemove", handleMouseMove);
        }
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    // 🔹 added section + id so #features scroll works
    <section
      id="features"
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-b from-black via-gray-500 to-black py-24 px-6 relative overflow-hidden"
      style={{ backgroundSize: "100% 200%", backgroundPosition: "50% 0%" }}
    >
      {/* Spotlight effect */}
      <div
        ref={spotlightRef}
        className="absolute w-[300px] h-[300px] rounded-full pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)",
          filter: "blur(40px)"
        }}
      />
      
      {/* Page Heading */}
      <div ref={headingRef} className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
          <span 
            className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-400 bg-clip-text text-transparent animate-shimmer"
            style={{
              backgroundSize: "200% auto",
              animation: "shimmer 3s linear infinite"
            }}
          >
            ProdMind
          </span>{" "}
          AI-Powered Learning Suite
        </h1>
        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: 0% center;
            }
            100% {
              background-position: 200% center;
            }
          }
        `}</style>
        <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Transform your learning journey with intelligent content curation, smart scheduling,
          AI-powered summarization, and seamless video learning experiences.
        </p>
        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>AI-Powered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>YouTube Integration</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <span>Mobile Optimized</span>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 justify-items-center mb-20">
        {featuresData.map((item, index) => (
          <div
            key={index}
            ref={(el) => (cardsRef.current[index] = el)}
            className="w-full max-w-[300px] rounded-3xl backdrop-blur-md bg-gradient-to-br from-gray-800 via-gray-300 to-white border border-gray-700/50 shadow-lg shadow-black/50 hover:shadow-yellow-400/50 transition-all duration-500"
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                y: -15,
                scale: 1.06,
                rotationY: 3,
                rotationX: 3,
                boxShadow: "0 20px 50px rgba(251, 191, 36, 0.3)",
                duration: 0.4,
                ease: "back.out(1.5)"
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                y: 0,
                scale: 1,
                rotationY: 0,
                rotationX: 0,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                duration: 0.4,
                ease: "power2.inOut"
              });
            }}
          >
            <CardFlip
              title={item.title}
              subtitle={item.subtitle}
              description={item.description}
              features={item.features}
            />
          </div>
        ))}
      </div>



      {/* Key Benefits */}
      <div className="max-w-4xl mx-auto mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose ProdMind?
          </h2>
          <p className="text-gray-400 text-lg">
            Experience the future of personalized learning with our comprehensive AI-powered platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div ref={(el) => (benefitsRef.current[0] = el)} className="flex items-start gap-4">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Save 70% of Your Learning Time</h3>
              <p className="text-gray-300 text-sm">
                AI-powered summaries and smart scheduling help you consume more content in less time while retaining key insights.
              </p>
            </div>
          </div>

          <div ref={(el) => (benefitsRef.current[1] = el)} className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Personalized Learning Path</h3>
              <p className="text-gray-300 text-sm">
                AI analyzes your preferences and learning patterns to recommend the most relevant content for your goals.
              </p>
            </div>
          </div>

          <div ref={(el) => (benefitsRef.current[2] = el)} className="flex items-start gap-4">
            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Mobile-First Experience</h3>
              <p className="text-gray-300 text-sm">
                Seamlessly sync across devices with mobile-optimized calendar integration and offline capabilities.
              </p>
            </div>
          </div>

          <div ref={(el) => (benefitsRef.current[3] = el)} className="flex items-start gap-4">
            <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Comprehensive Analytics</h3>
              <p className="text-gray-300 text-sm">
                Track your learning progress, completion rates, and optimize your study habits with detailed insights.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-4xl mx-auto text-center">
        <div ref={ctaRef} className="bg-gradient-to-r from-gray-900/50 to-amber-900/50 border border-amber-800/50 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of learners who have already optimized their content consumption with ProdMind's AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/dashboard/content"
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-semibold rounded-lg hover:from-yellow-400 hover:to-amber-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 no-underline"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1.08,
                  y: -3,
                  boxShadow: "0 25px 60px rgba(251, 191, 36, 0.7)",
                  duration: 0.4,
                  ease: "back.out(1.7)"
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1,
                  y: 0,
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                  duration: 0.4,
                  ease: "power2.out"
                });
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(e.currentTarget, {
                  x: x * 0.1,
                  y: y * 0.1,
                  duration: 0.3,
                  ease: "power2.out"
                });
              }}
            >
              Start Learning Smarter
            </a>
            <a
              href="/signin"
              className="px-8 py-4 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:border-gray-500 hover:text-white transition-all duration-200 no-underline"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1.05,
                  y: -3,
                  borderColor: "#fbbf24",
                  color: "#fbbf24",
                  duration: 0.4,
                  ease: "back.out(1.5)"
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1,
                  y: 0,
                  x: 0,
                  borderColor: "#4b5563",
                  color: "#d1d5db",
                  duration: 0.4,
                  ease: "power2.out"
                });
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(e.currentTarget, {
                  x: x * 0.08,
                  y: y * 0.08,
                  duration: 0.3,
                  ease: "power2.out"
                });
              }}
            >
              Sign In to Continue
            </a>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Free to use • No credit card required • Start in seconds
          </p>
        </div>
      </div>
    </section>
  );
}
