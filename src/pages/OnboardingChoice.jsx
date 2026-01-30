import React from "react";
import { Mic, Edit3, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OnboardingChoice() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20">

      <div className="w-full max-w-5xl">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-semibold text-purple-600 mb-4 tracking-tight">
            Set up your profile
          </h1>

          <p className="text-black text-base md:text-lg max-w-xl mx-auto">
            Choose the onboarding experience that feels most comfortable for you.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Manual */}
          <ChoiceCard
            icon={<Edit3 size={26} />}
            title="Manual setup"
            desc="Fill in your academic and study preferences step by step."
            onClick={() => navigate("/onboarding")}
            accent="blue"
          />

          {/* Voice */}
          <ChoiceCard
            icon={<Mic size={26} />}
            title="Voice-guided setup"
            desc="Answer a few questions naturally. Our AI will handle the rest."
            onClick={() => navigate("/voice-onboarding")}
            accent="purple"
            highlight
          />

        </div>

      </div>
    </div>
  );
}



function ChoiceCard({ icon, title, desc, onClick, accent, highlight }) {
  return (
    <div
      onClick={onClick}
      className="relative group cursor-pointer rounded-2xl 
      bg-black border border-white/10 
      px-8 py-10 hover:bg-black/80 transition-all duration-300"
    >

      {highlight && (
        <div className="absolute top-5 right-5 text-[11px] px-3 py-1 rounded-full 
        bg-purple-500/20 text-purple-300 font-medium">
          Recommended
        </div>
      )}

      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6
        ${accent === "purple"
            ? "bg-purple-500/15 text-purple-400"
            : "bg-blue-500/15 text-blue-400"}
        `}
      >
        {icon}
      </div>

      {/* Text */}
      <h3 className="text-xl font-semibold text-white mb-3">
        {title}
      </h3>

      <p className="text-white/60 text-sm leading-relaxed mb-10">
        {desc}
      </p>

      {/* CTA */}
      <div className="flex items-center gap-2 text-sm font-medium text-white/80">
        Continue
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
      </div>
    </div>
  );
}
