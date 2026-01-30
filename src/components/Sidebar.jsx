import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  MessageSquare,
  School,
  ClipboardList,
  User,
  Lock,
  CheckCircle2,
  Dot,
  Menu,
  X,
  GraduationCap
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false); // 🔑 mobile toggle
  const [stats, setStats] = useState({
    shortlisted: 0,
    locked: 0
  });

  const p = user?.profile || {};

  const shortlisted = p.shortlistedUniversities || [];
  const locked = shortlisted.filter(u => u.locked);


  const isActive = (path) => location.pathname === path;
  const stage = user?.applicationStage || "discovering";

  return (
    <>
      {/* ================= MOBILE HEADER ================= */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-purple-200">
        <div className="flex items-center justify-between px-6 py-4">

          {/* LEFT: ICON + TEXT */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white">
              <GraduationCap size={22} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">AI Counsellor</p>
              <p className="text-xs text-gray-500">
                Your personal study abroad guide
              </p>
            </div>
          </div>

          {/* RIGHT: HAMBURGER */}
          <Menu
            size={26}
            className="cursor-pointer text-gray-700"
            onClick={() => setOpen(true)}
          />
        </div>
      </div>


      {/* ================= OVERLAY (MOBILE) ================= */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* ================= SIDEBAR ================= */}
      <div
        className={`
          fixed md:static z-50
          top-0 left-0
          h-screen w-[260px]
          bg-white border-r border-purple-200
          flex flex-col justify-between
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* CLOSE (MOBILE) */}
        <div className="md:hidden flex justify-end p-4 border-b">
          <X size={22} className="cursor-pointer" onClick={() => setOpen(false)} />
        </div>

        {/* TOP */}
        <div>
          {/* LOGO */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-purple-200">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-500 flex items-center justify-center text-white">
              <GraduationCap size={22} />
            </div>
            <span className="font-semibold text-gray-900">AI Counsellor</span>
          </div>

          {/* JOURNEY */}
          <div className="px-6 pt-6">
            <p className="text-sm text-gray-500 font-medium mb-5">
              YOUR JOURNEY
            </p>

            <div className="space-y-5 font-medium">
              <JourneyItem
                icon={<CheckCircle2 size={16} />}
                label="Building Profile"
                color="text-green-500"
              />

              <JourneyItem
                icon={<CheckCircle2 size={16} />}
                label="Discovering"
                color={
                  stage !== "discovering"
                    ? "text-green-500"
                    : "text-white bg-blue-600 px-1 py-2 rounded-xl"
                }
              />

              <JourneyItem
                icon={
                  stage === "applying" ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <Dot size={22} />
                  )
                }
                label="Finalizing"
                color={stage === "applying" ? "text-green-500" : "text-gray-400"}
              />

              <JourneyItem
                icon={
                  stage === "applying" ? <Dot size={22} /> : <Lock size={16} />
                }
                label="Applying"
                disabled={stage !== "applying"}
                color={
                  stage === "applying"
                    ? "text-white bg-blue-600 px-1 py-2 rounded-xl"
                    : ""
                }
              />
            </div>
          </div>

          <div className="border-b border-purple-200 my-6" />

          {/* NAV */}
          <div className="px-4 space-y-1 font-medium">
            <NavItem icon={<LayoutGrid size={18} />} label="Dashboard" active={isActive("/dashboard")}
              onClick={() => {
                navigate("/dashboard");
                if (window.innerWidth < 768) {
                  setOpen(false);
                }
              }} />
            <NavItem icon={<MessageSquare size={18} />} label="AI Counsellor" active={isActive("/ai-counsellor")}
              onClick={() => {
                navigate("/ai-counsellor");
                if (window.innerWidth < 768) {
                  setOpen(false);
                }
              }} />
            <NavItem icon={<School size={18} />} label="Universities" active={isActive("/universities")}
              onClick={() => {
                navigate("/universities")
                if (window.innerWidth < 768) {
                  setOpen(false);
                }
              }
              } />
            <NavItem
              icon={<ClipboardList size={18} />}
              label="Applications"
              disabled={user.applicationStage !== "applying"}
              rightIcon={user.applicationStage !== "applying" && <Lock size={16} />}
              active={isActive("/application-guidance")}
              onClick={() => {
                navigate("/application-guidance")
                if (window.innerWidth < 768) {
                  setOpen(false);
                }
              }}
            />
            <NavItem icon={<User size={18} />} label="Profile" active={isActive("/profile")} onClick={() => {
              navigate("/profile")
              if (window.innerWidth < 768) {
                setOpen(false);
              }
            }} />
          </div>
        </div>

        {/* BOTTOM */}
        <div className="px-4 pb-6 space-y-4">
          <div className="bg-[#EEF0FF] rounded-2xl p-4">
            <p className="text-sm text-blue-600 font-medium">Shortlisted</p>
            <p className="text-2xl font-bold text-gray-900">{shortlisted.length}</p>
            <p className="text-xs text-gray-500">Locked: {locked.length}</p>
          </div>
        </div>
      </div>
    </>
  );
}



/* ---------------- JOURNEY ---------------- */

function JourneyItem({ icon, label, color, disabled }) {


  return (
    <div
      className={`flex items-center gap-3 text-sm
        ${disabled ? "text-gray-400" : "text-gray-600"}
        ${color || ""}
      `}
    >
      {/* fixed icon slot */}
      <div className="w-5 h-5 flex items-center justify-center">
        {icon}
      </div>

      <span>{label}</span>
    </div>
  );
}


function JourneyPill({ label }) {
  return (
    <div className="flex items-center gap-3 bg-[#EEF0FF] -ms-3 text-blue-600 px-3 py-2 rounded-xl text-sm font-medium w-full">

      {/* fixed icon slot */}
      <div className="w-5 h-5 flex items-center justify-center">
        <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
      </div>

      <span>{label}</span>
    </div>
  );
}


/* ---------------- NAV ---------------- */

function NavItem({ icon, label, active, disabled, rightIcon, onClick }) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm transition cursor-pointer
        ${active ? "bg-blue-600 text-white shadow" : "text-gray-700 hover:bg-gray-100"}
        ${disabled && "opacity-40 pointer-events-none"}
      `}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>

      {/* RIGHT */}
      {rightIcon && (
        <div className="text-gray-400">
          {rightIcon}
        </div>
      )}
    </div>
  );
}

