import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Mail, Lock, GraduationCap, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";


export default function Auth() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "login";
  const { login, signup, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");



  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password || (view && !name)) {
      alert("Please fill all required fields");
      return;
    }

    // Password strength
    const strong =
      password.length >= 6 &&
      /[A-Z]/i.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password);

    if (!strong) {
      alert("Password must be at least 6 characters and include a number and special character");
      return;
    }

    try {
      if (view) {
        await signup(name, email, password);
        navigate("/onboarding-choice");
      } else {
        await login(email, password);
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Authentication failed");
    }
  };





  const [view, setView] = useState(mode === "signup");
  const [isSignup, setIsSignup] = useState(mode === "signup");
  return (
    <div className="min-h-screen bg-[#FBFAF8] overflow-hidden relative">

      {/* LEFT PANEL */}
      <div
        className={`absolute top-0 h-full w-full md:w-1/2 bg-[#FBFAF8]
  flex flex-col justify-center
  px-6 sm:px-12 md:px-24 lg:px-36
  transition-all duration-700 ease-in-out will-change-transform
  ${isSignup ? "md:translate-x-full" : "translate-x-0"}`}
      >

<div className="max-w-md mx-auto w-full bg-purple-600/20 rounded-xl md:rounded-none md:bg-transparent p-5 md:p-0">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-500 flex items-center justify-center text-white shadow-md">
            <GraduationCap size={22} />
          </div>
          <span className="text-base sm:text-lg font-semibold text-gray-900">
            AI Counsellor</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {view ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mb-8 sm:mb-10">
          {view
            ? "Begin your guided study abroad journey"
            : "Continue your study abroad journey"}
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name (Signup) */}
          {view && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required

                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                type="password"
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            {view && (
              <p className="text-sm text-gray-400 mt-2">Minimum 8 characters</p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="btn-hero w-full py-3 rounded-xl
text-white font-medium text-base sm:text-lg
transition hover:scale-105"
          >
            {view ? "Create Account →" : "Login →"}
          </button>


          {/* Switch */}
          <p className="text-center text-sm sm:text-base text-gray-500 mt-4">
            {view ? "Already have an account?" : "Don’t have an account?"}{" "}
            <span
              onClick={() => {
                const next = !view;
                setIsSignup(next);

                setTimeout(() => {
                  setView(next);
                  navigate(`/auth?mode=${next ? "signup" : "login"}`);
                }, 250);
              }}

              className="text-blue-600 font-medium cursor-pointer hover:underline"
            >
              {view ? "Login" : "Sign up"}
            </span>
          </p>
        </form>
      </div>

      </div>

      {/* RIGHT PANEL */}
      <div
        className={`hidden md:flex absolute top-0 h-full w-1/2 right-0
        bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600
         flex-col justify-center items-center text-white px-24
        transition-all duration-700 ease-in-out will-change-transform
        ${isSignup ? "-translate-x-full" : "translate-x-0"}`}
      >
        <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mb-10">
          <GraduationCap size={40} />
        </div>

        <h2 className="text-3xl font-bold text-center mb-6">
          {view ? "Start Your Journey Today" : "Your AI-Powered Study Abroad Journey"}
        </h2>

        <p className="text-lg text-white/80 text-center max-w-sm mb-10">
          {view
            ? "Join thousands of students who found their dream universities with AI-powered guidance."
            : "Get personalized guidance, university recommendations, and step-by-step application support."}
        </p>

        {view && (
          <div className="flex gap-6">
            <Stat value="10k+" label="Students" />
            <Stat value="500+" label="Universities" />
            <Stat value="50+" label="Countries" />
          </div>
        )}
      </div>
    </div>
  );
}

/* Stats */
function Stat({ value, label }) {
  return (
    <div className="bg-white/10 px-6 py-4 rounded-xl text-center backdrop-blur-md">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-white/70">{label}</p>
    </div>
  );
}
