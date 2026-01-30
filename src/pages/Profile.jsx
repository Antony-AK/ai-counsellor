import React, { useState, useEffect } from "react";
import {
  User,
  BookOpen,
  Target,
  Wallet,
  ClipboardCheck,
  Save
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "../components/Select";




export default function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();


  const handleLogout = () => {
    // 🔥 Clear everything
    localStorage.clear();

    // 🔥 Reset auth context
    setUser(null);

    // 🔥 Redirect to login / landing
    navigate("/login"); // change if your route is different
  };


  const token = localStorage.getItem("token");

  const [form, setForm] = useState(user?.profile || {});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) setForm(user.profile);
  }, [user]);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const res = await axios.put("http://localhost:5000/auth/onboarding", form, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 20000
      });

      setUser(res.data);

      alert("Profile updated successfully ✅");
    } catch (err) {
      console.error("❌ SAVE ERROR:", err);
      console.error("❌ RESPONSE:", err?.response);
      console.error("❌ MESSAGE:", err?.message);

      alert(
        err?.response?.data?.msg ||
        err?.message ||
        "Failed to save profile"
      );
    }
    finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="px-4 py-20 md:px-8 md:py-10 bg-[#FBFAF8] min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-8 md:mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Your Profile</h1>
          <p className="text-gray-500 mt-1">
            Keep your profile updated for accurate university recommendations
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl 
    bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
          >
            <Save size={16} />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={handleLogout}
            className="px-6 py-3 rounded-xl  text-red-600
    hover:bg-red-50 transition font-medium"
          >
            Logout
          </button>


        </div>

      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

        {/* PERSONAL */}
        <Card title="Personal Information" icon={<User size={18} />}>
          <Input label="Full Name" value={user?.name || ""} readOnly />
          <Input label="Email" value={user?.email || ""} readOnly />

        </Card>

        {/* ACADEMIC */}
        <Card title="Academic Background" icon={<BookOpen size={18} />}>
          <SelectComponent
            label="Education Level"
            value={form.educationLevel || ""}
            onChange={(e) => setForm({ ...form, educationLevel: e.target.value })}
            options={[
              { value: "High School", label: "High School" },
              { value: "Bachelor's Degree", label: "Bachelor's Degree" },
              { value: "Master's Degree", label: "Master's Degree" },
              { value: "PhD", label: "PhD" }
            ]}
          />

          <Input
            label="Degree / Major"
            value={form.major || ""}
            onChange={(e) => setForm({ ...form, major: e.target.value })}
          />

          <Input
            label="GPA / Percentage"
            value={form.gpa || ""}
            onChange={(e) => setForm({ ...form, gpa: e.target.value })}
          />

        </Card>

        {/* STUDY GOALS */}
        <Card title="Study Goals" icon={<Target size={18} />}>

          <SelectComponent
            label="Intended Degree"
            value={form.intendedDegree || ""}
            onChange={(e) => setForm({ ...form, intendedDegree: e.target.value })}
            options={[
              { value: "Bachelor's", label: "Bachelor's" },
              { value: "Master's", label: "Master's" },
              { value: "MBA", label: "MBA" },
              { value: "PhD", label: "PhD" }
            ]}
          />

          <Input
            label="Field of Study"
            value={form.fieldOfStudy || ""}
            onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })}
          />

          <SelectComponent
            label="Target Intake"
            value={form.targetIntake || ""}
            onChange={(e) => setForm({ ...form, targetIntake: e.target.value })}
            options={[
              { value: "Fall 2025", label: "Fall 2025" },
              { value: "Spring 2026", label: "Spring 2026" },
              { value: "Fall 2026", label: "Fall 2026" }
            ]}
          />

        </Card>

        {/* BUDGET */}
        <Card title="Budget & Funding" icon={<Wallet size={18} />}>
          <SelectComponent
            label="Budget Range"
            value={form.budgetRange || ""}
            onChange={(e) => setForm({ ...form, budgetRange: e.target.value })}
            options={[
              { value: "Under $20K", label: "Under $20K" },
              { value: "$20K - $40K", label: "$20K - $40K" },
              { value: "$40K - $60K", label: "$40K - $60K" },
              { value: "Over $60K", label: "Over $60K" }
            ]}
          />

          <SelectComponent
            label="Funding Plan"
            value={form.fundingPlan || ""}
            onChange={(e) => setForm({ ...form, fundingPlan: e.target.value })}
            options={[
              { value: "Self-Funded", label: "Self-Funded" },
              { value: "Scholarship-Dependent", label: "Scholarship-Dependent" },
              { value: "Loan-Dependent", label: "Loan-Dependent" }
            ]}
          />

        </Card>

        {/* EXAMS */}
        <div className="md:col-span-2">
          <Card title="Exam & Application Readiness" icon={<ClipboardCheck size={18} />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <SelectComponent
                label="IELTS Status"
                value={form.ieltsStatus || ""}
                onChange={(e) => setForm({ ...form, ieltsStatus: e.target.value })}
                options={[
                  { value: "Not Started", label: "Not Started" },
                  { value: "In Progress", label: "In Progress" },
                  { value: "Completed", label: "Completed" } 
                ]}
              />

              <SelectComponent
                label="GRE / GMAT Status"
                value={form.greStatus || ""}
                onChange={(e) => setForm({ ...form, greStatus: e.target.value })}
                options={[
                  { value: "Not Started", label: "Not Started" },
                  { value: "In Progress", label: "In Progress" },
                  { value: "Completed", label: "Completed" }
                ]}
              />

              <SelectComponent
                label="SOP Status"
                value={form.sopStatus || ""}
                onChange={(e) => setForm({ ...form, sopStatus: e.target.value })}
                options={[
                  { value: "Not Started", label: "Not Started" },
                  { value: "In Progress", label: "In Progress" },
                  { value: "Completed", label: "Completed" }
                ]}
              />

            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}

/* ---------------- UI ATOMS ---------------- */

function Card({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-[0_6px_18px_rgba(0,0,0,0.06)] space-y-4 md:space-y-5">
      <div className="flex items-center gap-2 font-semibold text-gray-900">
        <span className="text-blue-600">{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, readOnly }) {
  return (
    <div>
      <p className="text-sm font-medium mb-1">{label}</p>
      <input
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FBFAF8] focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function SelectComponent({ label, value, onChange, options }) {
  return (
    <div>
      {label && (
        <p className="text-sm font-medium text-gray-600 mb-1">
          {label}
        </p>
      )}

      <Select
        value={value}
        options={options}
        placeholder="Select"
        onChange={(val) =>
          onChange({ target: { value: val } }) // 🔥 ADAPTER MAGIC
        }
      />
    </div>
  );
}

