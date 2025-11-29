"use client";
/**
 * Dark / Neon Premium Card Flip
 * @author: @nuelst
 * @description: Card Flip for Features Page
 */

import { cn } from "@/lib/utils";
import { ArrowRight, Brain, BookOpen, Calendar, Zap, Play, Target } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

export default function CardFlip({
  title = "Smart Content Intelligence",
  subtitle = "AI-powered content curation",
  description = "Discover and prioritize YouTube videos with AI-driven analysis and personalized recommendations.",
  features = ["AI Priority Scoring", "Smart Tagging", "Content Analysis", "YouTube Integration"],
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef(null);
  const iconRef = useRef(null);
  const barsRef = useRef([]);

  useEffect(() => {
    // Continuous glow pulse for icon
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        boxShadow: "0 0 25px rgba(251, 191, 36, 0.8)",
        scale: 1.08,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

    // Animated bars with wave effect
    barsRef.current.forEach((bar, index) => {
      if (bar) {
        gsap.fromTo(bar,
          {
            x: -120,
            opacity: 0
          },
          {
            x: 120,
            opacity: 0.7,
            duration: 2,
            delay: index * 0.15,
            repeat: -1,
            ease: "power2.inOut"
          }
        );
      }
    });
  }, []);

  const handleFlip = (flip) => {
    setIsFlipped(flip);
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        rotateY: flip ? 180 : 0,
        duration: 0.7,
        ease: "back.out(1.3)"
      });
    }
  };

  return (
    <div
      className="group relative h-[360px] w-full max-w-[300px] [perspective:2000px]"
      onMouseEnter={() => handleFlip(true)}
      onMouseLeave={() => handleFlip(false)}
    >
      <div
        ref={cardRef}
        className="relative h-full w-full [transform-style:preserve-3d]"
      >
        {/* Front of card */}
        <div
          className={cn(
            "absolute inset-0 h-full w-full [transform:rotateY(0deg)] [backface-visibility:hidden] overflow-hidden rounded-2xl",
            "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
            "border border-gray-700 shadow-lg",
            "transition-all duration-700 group-hover:shadow-2xl",
            isFlipped ? "opacity-0" : "opacity-100"
          )}
        >
          {/* Animated code bars */}
          <div className="absolute inset-0 flex items-center justify-center pt-20">
            <div className="relative flex h-[100px] w-[200px] flex-col items-center justify-center gap-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  ref={(el) => (barsRef.current[i] = el)}
                  className="h-3 rounded-sm bg-gradient-to-r from-amber-400/30 via-amber-500/60 to-amber-400/30 opacity-0"
                  style={{
                    width: `${60 + Math.random() * 40}%`,
                    marginLeft: `${Math.random() * 20}%`,
                  }}
                />
              ))}

              {/* Central brain icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  ref={iconRef}
                  className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/50 transition-all duration-500 group-hover:rotate-12"
                >
                  <Brain className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom content */}
          <div className="absolute right-0 bottom-0 left-0 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold text-white transition-all duration-500 group-hover:translate-y-[-4px]">
                  {title}
                </h3>
                <p className="line-clamp-2 text-gray-400 text-sm transition-all delay-[50ms] duration-500 group-hover:translate-y-[-4px]">
                  {subtitle}
                </p>
              </div>
              <div className="group/icon relative">
                <div className="absolute inset-[-8px] rounded-lg transition-opacity duration-300 from-amber-400/20 via-amber-500/10 bg-gradient-to-br to-transparent opacity-0 group-hover/icon:opacity-100" />
                <Zap className="text-amber-400 h-5 w-5 transition-all duration-300 group-hover/icon:scale-110 group-hover/icon:rotate-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={cn(
            "absolute inset-0 h-full w-full [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-2xl p-5",
            "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
            "border border-gray-700 shadow-lg flex flex-col transition-all duration-700",
            !isFlipped ? "opacity-0" : "opacity-100"
          )}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />

          <div className="relative z-10 flex-1 space-y-5">
            <div className="space-y-2">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white transition-all duration-500">
                  {title}
                </h3>
              </div>
              <p className="line-clamp-2 text-gray-400 text-sm transition-all duration-500">
                {description}
              </p>
            </div>

            <div className="space-y-2.5">
              {features.map((feature, index) => {
                const icons = [Target, BookOpen, Calendar, Play];
                const IconComponent = icons[index % icons.length];
                return (
                  <div
                    key={feature}
                    className="flex items-center gap-3 text-sm text-gray-300 transition-all duration-500"
                    style={{
                      transform: isFlipped ? "translateX(0)" : "translateX(-10px)",
                      opacity: isFlipped ? 1 : 0,
                      transitionDelay: `${index * 100 + 200}ms`,
                    }}
                  >
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-amber-500/20">
                      <IconComponent className="text-amber-400 h-3 w-3" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 mt-auto border-t border-gray-700 pt-4">
            <a
              href="/dashboard/content"
              className="group/start relative flex items-center justify-between rounded-lg p-2.5 transition-all duration-300 bg-gray-800 hover:bg-gradient-to-r hover:from-amber-500/10 hover:via-amber-500/5 hover:to-transparent hover:scale-[1.02] cursor-pointer border border-transparent hover:border-amber-500/20 no-underline"
            >
              <span className="text-sm font-semibold text-white group-hover/start:text-amber-400 transition-colors duration-300">
                Start Learning
              </span>
              <div className="group/icon relative">
                <div className="absolute inset-[-6px] rounded-lg transition-all duration-300 scale-90 opacity-0 group-hover/start:scale-100 group-hover/start:opacity-100 from-amber-400/20 via-amber-500/10 bg-gradient-to-br to-transparent" />
                <ArrowRight className="text-amber-400 h-4 w-4 transition-all duration-300 group-hover/start:translate-x-1 group-hover/start:scale-110" />
              </div>
            </a>
          </div>
        </div>
      </div>


    </div>
  );
}
