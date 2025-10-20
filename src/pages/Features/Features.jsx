"use client";
import React from "react";
import CardFlip from "./Card"; // your CardFlip component

const featuresData = [
  {
    title: "AI-Powered Summaries",
    subtitle: "Quickly digest content",
    description:
      "Get concise and personalized summaries of articles, blogs, and papers tailored to your interests.",
    features: ["Personalized Summaries", "Time-Saving", "Contextual Insights", "Multi-Source Support"],
  },
  {
    title: "Smart Recommendations",
    subtitle: "Discover relevant content",
    description:
      "Our AI agent recommends the most relevant content based on your reading habits and preferences.",
    features: ["Curated Feeds", "Adaptive Learning", "Trending Topics", "Deep Analysis"],
  },
  {
    title: "Content Highlighting",
    subtitle: "Focus on key points",
    description:
      "Highlight the most important sections of any text automatically, saving time and improving comprehension.",
    features: ["Automatic Highlighting", "Key Insights", "Visual Focus", "Export Notes"],
  },
  {
    title: "Cross-Platform Sync",
    subtitle: "Always stay updated",
    description:
      "Sync your reading progress and AI recommendations across all your devices seamlessly.",
    features: ["Device Sync", "Cloud Storage", "Offline Access", "Secure & Private"],
  },
];

export default function FeaturesPage() {
  return (
    // 🔹 added section + id so #features scroll works
    <section
      id="features"
      className="min-h-screen bg-gradient-to-b from-black via-gray-500 to-black py-24 px-6"
    >
      {/* Page Heading */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
          Personalised AI Agent For Productive Content Consumption
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
          Discover advanced features that help you consume content efficiently, save time, and maximize productivity.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 justify-items-center">
        {featuresData.map((item, index) => (
          <div
            key={index}
            className="w-full max-w-[300px] rounded-3xl backdrop-blur-md bg-gradient-to-br from-gray-800 via-gray-300 to-white border border-gray-700/50 shadow-lg shadow-black/50 hover:shadow-yellow-400/50 transition-all duration-500"
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
    </section>
  );
}
