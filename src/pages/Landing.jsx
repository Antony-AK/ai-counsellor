import React from "react";
import { motion } from "framer-motion";
import {
    GraduationCap,
    Brain,
    Target,
    CheckCircle,
    ArrowRight,
    ChevronDown,
    Menu, X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

/* ---------------- DATA ---------------- */

const FEATURES = [
    {
        title: "AI Profile Intelligence",
        desc: "Understands your academics, exams, goals & budget like a real counsellor.",
        icon: <Brain />
    },
    {
        title: "University Fit Engine",
        desc: "Dream, Target & Safe universities with transparent reasoning.",
        icon: <Target />
    },
    {
        title: "Execution & Tracking",
        desc: "Tasks, SOP guidance, deadlines & application tracking.",
        icon: <CheckCircle />
    }
];

const TESTIMONIALS = [
    {
        name: "Rahul, India",
        text: "This felt better than paid counsellors. Clear and honest."
    },
    {
        name: "Ananya, Bangalore",
        text: "I finally understood why a university was right for me."
    },
    {
        name: "Siddharth, Chennai",
        text: "The task plan alone saved me months of confusion."
    }
];

const FAQS = [
  {
    q: "What makes AI Counsellor different from traditional study abroad platforms?",
    a: "AI Counsellor doesn’t just list universities. It understands your profile, explains every recommendation with clear reasoning, and gives you a step-by-step action plan instead of generic advice."
  },
  {
    q: "Is there a voice-based onboarding option?",
    a: "Yes. You can complete your entire profile using voice onboarding, where AI asks guided questions and understands your answers naturally — no long forms required."
  },
  {
    q: "How accurate are the university recommendations?",
    a: "Recommendations are generated using your academics, exams, budget, intake, and competition level. Universities are categorized into Dream, Target, and Safe with transparent explanations for each."
  },
  {
    q: "Does the AI help beyond university shortlisting?",
    a: "Absolutely. AI Counsellor guides you through exam readiness, SOP preparation, document tracking, and application timelines — not just university selection."
  },
  {
    q: "Is there any real-time AI interaction?",
    a: "Yes. You interact with the AI in real time through guided flows and voice-based onboarding, making the experience conversational rather than form-based."
  },
  {
    q: "Do I need a counsellor or agent along with this platform?",
    a: "No. AI Counsellor is designed to replace biased counselling by giving you clarity, reasoning, and full control over every decision."
  },
  {
    q: "Is my personal and academic data safe?",
    a: "Yes. All your data is securely stored, encrypted, and used only to generate personalized guidance. Your data is never sold or shared."
  }
];


/* ---------------- PAGE ---------------- */

export default function Landing() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);


    return (
        <div className="bg-[#FBFAF8] text-gray-900 overflow-x-hidden">

            <header className="fixed top-0 left-0 w-full z-50">
                {/* Blur background */}
                <div className="backdrop-blur-md bg-white/80 border-b border-purple-200">
                    <div className=" mx-auto px-6 md:px-16 py-4 flex items-center justify-between">

                        {/* LOGO */}
                        <div
                            onClick={() => navigate("/")}
                            className="flex items-center gap-3 cursor-pointer"
                        >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow">
                                <GraduationCap size={20} />
                            </div>
                            <span className="font-semibold text-lg text-gray-900">
                                AI Counsellor
                            </span>
                        </div>

                        {/* DESKTOP ACTIONS */}
                        <div className="hidden md:flex items-center gap-6">
                            <button
                                onClick={() => navigate("/auth")}
                                className="text-md font-medium text-gray-600 hover:text-black transition"
                            >
                                Login
                            </button>

                            <button
                                onClick={() => navigate("/auth?mode=signup")}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow hover:scale-105 transition"
                            >
                                Get Started
                            </button>
                        </div>

                        {/* MOBILE MENU ICON */}
                        <button
                            className="md:hidden text-gray-700"
                            onClick={() => setOpen(true)}
                        >
                            <Menu size={26} />
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU */}
                {open && (
                    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden">
                        <div className="absolute right-0 top-0 h-full w-[75%] bg-white shadow-xl p-6">

                            <div className="flex justify-between items-center mb-8">
                                <span className="font-semibold text-lg">Menu</span>
                                <X
                                    size={24}
                                    className="cursor-pointer"
                                    onClick={() => setOpen(false)}
                                />
                            </div>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => {
                                        navigate("/auth");
                                        setOpen(false);
                                    }}
                                    className="py-3 rounded-xl border text-gray-700 font-medium"
                                >
                                    Login
                                </button>

                                <button
                                    onClick={() => {
                                        navigate("/auth?mode=signup");
                                        setOpen(false);
                                    }}
                                    className="py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold"
                                >
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* ================= HERO ================= */}
            <section className="relative min-h-screen flex items-center justify-center px-6 pt-22">

                {/* Background image */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1523240795612-9a054b0db644


"
                        alt="students"
                        className="w-full h-full object-cover opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/80 to-[#FBFAF8]" />
                </div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="relative z-10 max-w-5xl text-center"
                >
                    <div className="flex justify-center mb-6">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700">
                            <GraduationCap size={18} />
                            <span className="text-sm font-medium">
                                AI-powered study abroad platform
                            </span>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                        Your personal AI guide
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            to studying abroad
                        </span>
                    </h1>

                    <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                        From profile building to university shortlisting and applications -
                        everything explained clearly, step by step.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate("/auth?mode=signup")}
                            className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold flex items-center gap-2 justify-center hover:scale-105 transition"
                        >
                            Start Free <ArrowRight size={18} />
                        </button>

                        <button
                            onClick={() => navigate("/auth")}
                            className="px-8 py-4 rounded-xl border border-gray-300 hover:bg-gray-100 transition font-medium"
                        >
                            Login
                        </button>
                    </div>

                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="mt-20 flex justify-center text-gray-400"
                    >
                        <ChevronDown />
                    </motion.div>
                </motion.div>
            </section>

            {/* ================= FEATURES ================= */}
            <section className="py-28 px-6 bg-white">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
                    {FEATURES.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition"
                        >
                            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-5">
                                {f.icon}
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                            <p className="text-gray-600 text-sm">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ================= PRODUCT PREVIEW ================= */}
            <section className="py-28 px-6 bg-gradient-to-br from-blue-50 via-purple-50 to-white">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-32 items-center">
                    <div>
                        <h2 className="text-4xl font-bold mb-6">
                            See how decisions actually become clear
                        </h2>

                        <p className="text-gray-600 mb-6 leading-relaxed text-justify">
                            AI Counsellor doesn’t just recommend universities —
                            it explains the <strong>reasoning behind every decision</strong>.
                            From academics and exams to budget and competition level,
                            you always know <em>why</em> a university fits your profile
                            and what risks to consider.
                        </p>

                        <ul className="space-y-4 text-gray-700">
                            <li className="flex gap-3">
                                <span>✔</span>
                                <span>
                                    <strong>Transparent reasoning:</strong> Every university is explained using
                                    your GPA, exams, budget, and acceptance probability.
                                </span>
                            </li>

                            <li className="flex gap-3">
                                <span>✔</span>
                                <span>
                                    <strong>No sales pressure:</strong> No agents, no commissions,
                                    and no hidden agendas influencing recommendations.
                                </span>
                            </li>

                            <li className="flex gap-3">
                                <span>✔</span>
                                <span>
                                    <strong>Actionable next steps:</strong> Know exactly what to improve,
                                    prepare, or submit — with clear AI-generated tasks.
                                </span>
                            </li>
                        </ul>
                    </div>


                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="rounded-3xl overflow-hidden shadow-xl bg-white"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df"
                            alt="product"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>
            </section>

            {/* ================= TESTIMONIALS ================= */}
            <section className="py-28 px-6 bg-white overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-16">
                        Students love the clarity
                    </h2>

                    <motion.div
                        className="flex gap-6"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    >
                        {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                            <div
                                key={i}
                                className="min-w-[300px] bg-white border-2 border-purple-600 shadow-xl rounded-2xl p-6 "
                            >
                                <p className="text-gray-700 mb-4">“{t.text}”</p>
                                <p className="text-sm text-gray-500">— {t.name}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ================= FAQ ================= */}
            <section className="py-28 px-6 bg-[#FBFAF8]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-16">
                        Frequently asked questions
                    </h2>

                    <div className="space-y-6">
                        {FAQS.map((f, i) => (
                            <details
                                key={i}
                                className="group bg-white border border-purple-500 rounded-xl p-6 shadow-sm outline-none"
                            >
                                <summary className="cursor-pointer font-medium flex justify-between items-center">
                                    {f.q}
                                    <span className="group-open:rotate-180 transition">⌄</span>
                                </summary>
                                <p className="mt-4 text-gray-600 text-sm">{f.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= FINAL CTA ================= */}
            <footer className="relative overflow-hidden bg-white border-t border-purple-200">

                {/* Soft gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50" />

                <div className="relative max-w-7xl mx-auto px-6 py-20">

                    {/* CTA CARD */}
                    <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-16 shadow-2xl text-center">

                        <h2 className="text-3xl md:text-4xl font-bold">
                            Build your future with clarity
                        </h2>

                        <p className="mt-4 text-white/90 max-w-2xl mx-auto">
                            No pressure. No agents. No confusion.
                            Just clear decisions backed by AI.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate("/auth?mode=signup")}
                                className="px-10 py-4 rounded-xl bg-white text-purple-700 font-bold hover:scale-105 transition"
                            >
                                Start Free
                            </button>

                            <button
                                onClick={() => navigate("/auth")}
                                className="px-10 py-4 rounded-xl border border-white/40 text-white font-semibold hover:bg-white/10 transition"
                            >
                                Login
                            </button>
                        </div>
                    </div>

                    {/* FOOTER LINKS */}
                    <div className="mt-24 border-t border-purple-200/60 pt-12">

                        <div className="max-w-8xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">

                            {/* BRAND */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
                                    <GraduationCap size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 leading-tight">
                                        AI Counsellor
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Your study abroad copilot
                                    </p>
                                </div>
                            </div>

                            {/* LINKS */}
                            <div className="flex gap-6 text-sm text-gray-500">
                                <span className="hover:text-purple-600 cursor-pointer transition">
                                    Privacy
                                </span>
                                <span className="hover:text-purple-600 cursor-pointer transition">
                                    Terms
                                </span>
                                <span className="hover:text-purple-600 cursor-pointer transition">
                                    Contact
                                </span>
                            </div>

                            {/* COPYRIGHT */}
                            <p className="text-xs text-gray-400 text-center">
                                © 2026 AI Counsellor. Built for students who choose clarity over confusion.
                            </p>

                        </div>
                    </div>

                </div>
            </footer>


        </div>
    );
}
