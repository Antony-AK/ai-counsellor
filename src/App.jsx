import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import Universities from "./pages/Universities";
import AiCounsellor from "./pages/AiCounsellor";
import ApplicationGuidance from "./pages/ApplicationGuidance";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import Onboarding from "./components/Onboarding";
import { useAuth } from "./context/AuthContext";
import PrivateRoute from "./context/PrivateRoute";
import OnboardingChoice from "./pages/OnboardingChoice";
import VoiceOnboarding from "./components/VoiceOnboarding";
import AIExamPage from "./pages/AIExamPage";

export default function App() {
  const location = useLocation();
  const { user, loading } = useAuth();

  const hideSidebar =
    location.pathname === "/" ||
    location.pathname.startsWith("/auth") ||
    location.pathname.startsWith("/onboarding") ||
    location.pathname === "/voice-onboarding" ||
    location.pathname.startsWith("/ai-exam");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#FBFAF8] overflow-hidden">

      {/* ================= DESKTOP LAYOUT ================= */}
      <div className="hidden md:flex h-full">
        {user && !hideSidebar && <Sidebar />}

        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Login />} />

            <Route
              path="/onboarding-choice"
              element={user ? <OnboardingChoice /> : <Navigate to="/auth?mode=login" replace />}
            />

            <Route
              path="/voice-onboarding"
              element={user ? <VoiceOnboarding /> : <Navigate to="/auth?mode=login" replace />}
            />

            <Route
              path="/onboarding"
              element={user ? <Onboarding /> : <Navigate to="/auth?mode=login" replace />}
            />

            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/universities" element={<PrivateRoute><Universities /></PrivateRoute>} />
            <Route path="/ai-counsellor" element={<PrivateRoute><AiCounsellor /></PrivateRoute>} />
            <Route path="/application-guidance" element={<PrivateRoute><ApplicationGuidance /></PrivateRoute>} />

            <Route
              path="/ai-exam/:examType"
              element={
                <PrivateRoute>
                  <AIExamPage />
                </PrivateRoute>
              }
            />

            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>

      {/* ================= MOBILE LAYOUT ================= */}
      <div className="md:hidden h-full">
        {user && !hideSidebar && <Sidebar />}

        <div className="h-full overflow-y-auto">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Login />} />

            <Route
              path="/onboarding-choice"
              element={user ? <OnboardingChoice /> : <Navigate to="/auth?mode=login" replace />}
            />

            <Route
              path="/voice-onboarding"
              element={user ? <VoiceOnboarding /> : <Navigate to="/auth?mode=login" replace />}
            />

            <Route
              path="/onboarding"
              element={user ? <Onboarding /> : <Navigate to="/auth?mode=login" replace />}
            />

            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/universities" element={<PrivateRoute><Universities /></PrivateRoute>} />
            <Route path="/ai-counsellor" element={<PrivateRoute><AiCounsellor /></PrivateRoute>} />
            <Route path="/application-guidance" element={<PrivateRoute><ApplicationGuidance /></PrivateRoute>} />

            <Route
              path="/ai-exam/:examType"
              element={
                <PrivateRoute>
                  <AIExamPage />
                </PrivateRoute>
              }
            />

            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>

    </div>
  );
}
