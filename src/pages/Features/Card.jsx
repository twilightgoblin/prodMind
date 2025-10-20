"use client";
/**
 * Dark / Neon Premium Card Flip
 * @author: @nuelst
 * @description: Card Flip for Features Page
 */

import { cn } from "@/lib/utils";
import { ArrowRight, Code2, Copy, Rocket, Zap } from "lucide-react";
import { useState } from "react";

export default function CardFlip({
  title = "Build MVPs Fast",
  subtitle = "Launch your idea in record time",
  description = "Copy, paste, customize—and launch your MVP faster than ever.",
  features = ["Copy & Paste Ready", "Developer-First", "MVP Optimized", "Zero Setup Required"],
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group relative h-[360px] w-full max-w-[300px] [perspective:2000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={cn(
          "relative h-full w-full [transform-style:preserve-3d] transition-all duration-700",
          isFlipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"
        )}
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
                  className={cn(
                    "h-3 rounded-sm bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30 animate-[slideIn_2s_ease-in-out_infinite]",
                    "opacity-0"
                  )}
                  style={{
                    width: `${60 + Math.random() * 40}%`,
                    animationDelay: `${i * 0.2}s`,
                    marginLeft: `${Math.random() * 20}%`,
                  }}
                />
              ))}

              {/* Central rocket icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center shadow-lg shadow-primary/50 animate-pulse transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
                >
                  <Rocket className="h-6 w-6 text-white" />
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
                <div className="absolute inset-[-8px] rounded-lg transition-opacity duration-300 from-primary/20 via-primary/10 bg-gradient-to-br to-transparent opacity-0 group-hover/icon:opacity-100" />
                <Zap className="text-primary h-5 w-5 transition-all duration-300 group-hover/icon:scale-110 group-hover/icon:rotate-12" />
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
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-primary/90 to-primary/80">
                  <Code2 className="h-4 w-4 text-white" />
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
                const icons = [Copy, Code2, Rocket, Zap];
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
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-primary/20">
                      <IconComponent className="text-primary h-3 w-3" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 mt-auto border-t border-gray-700 pt-4">
            <div className="group/start relative flex items-center justify-between rounded-lg p-2.5 transition-all duration-300 bg-gray-800 hover:bg-gradient-to-r hover:from-primary/10 hover:via-primary/5 hover:to-transparent hover:scale-[1.02] cursor-pointer border border-transparent hover:border-primary/20">
              <span className="text-sm font-semibold text-white group-hover/start:text-primary transition-colors duration-300">
                Start Building
              </span>
              <div className="group/icon relative">
                <div className="absolute inset-[-6px] rounded-lg transition-all duration-300 scale-90 opacity-0 group-hover/start:scale-100 group-hover/start:opacity-100 from-primary/20 via-primary/10 bg-gradient-to-br to-transparent" />
                <ArrowRight className="text-primary h-4 w-4 transition-all duration-300 group-hover/start:translate-x-1 group-hover/start:scale-110" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          0% {
            transform: translateX(-100px);
            opacity: 0;
          }
          50% {
            transform: translateX(0);
            opacity: 0.8;
          }
          100% {
            transform: translateX(100px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
