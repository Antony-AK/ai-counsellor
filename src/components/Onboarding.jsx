import React, { useState, useEffect } from "react";
import {
    BookOpen,
    Target,
    Wallet,
    ClipboardCheck,
    Check,
    GraduationCap
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Select from "./Select";





export default function Onboarding() {
    const [step, setStep] = useState(1);
    const { saveOnboarding } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        educationLevel: "",
        major: "",
        graduationYear: "",
        gpa: "",

        intendedDegree: "",
        fieldOfStudy: "",
        targetIntake: "",
        preferredCountries: [],

        budgetRange: "",
        fundingPlan: "",

        ieltsStatus: "",
        greStatus: "",
        sopStatus: ""
    });
    const [finalForm, setFinalForm] = useState(null);

    function canonicalize(value, allowed) {
        if (!value) return "";

        const v = value.toLowerCase().replace(/\./g, "").trim();
        return allowed.find(opt =>
            opt.toLowerCase().replace(/\./g, "").includes(v) ||
            v.includes(opt.toLowerCase().replace(/\./g, ""))
        ) || "";
    }

    useEffect(() => {
        const voiceData = localStorage.getItem("voiceProfile");
        if (!voiceData) return;

        const parsed = JSON.parse(voiceData);

        setForm(prev => ({
            ...prev,

            educationLevel: canonicalize(parsed.educationLevel, [
                "High School",
                "Bachelor's Degree",
                "Master's Degree",
                "PhD",
            ]),

            graduationYear: canonicalize(parsed.graduationYear, [
                "2020", "2021", "2022", "2023", "2024", "2025", "2026",
            ]),

            intendedDegree: canonicalize(parsed.intendedDegree, [
                "Bachelor's", "Master's", "MBA", "PhD",
            ]),

            targetIntake: canonicalize(parsed.targetIntake, [
                "Fall 2025", "Spring 2025", "Fall 2026", "Spring 2026",
            ]),

            budgetRange: canonicalize(parsed.budgetRange, [
                "Under $20K", "$20K - $40K", "$40K - $60K", "Over $60K",
            ]),

            fundingPlan: canonicalize(parsed.fundingPlan, [
                "Self-Funded", "Scholarship-Dependent", "Loan-Dependent",
            ]),

            ieltsStatus: canonicalize(parsed.ieltsStatus, [
                "Not Started", "In Progress", "Completed",
            ]),

            greStatus: canonicalize(parsed.greStatus, [
                "Not Started", "In Progress", "Completed",
            ]),

            sopStatus: canonicalize(parsed.sopStatus, [
                "Not Started", "In Progress", "Completed",
            ]),

            major: parsed.major?.replace(/\.$/, "") || "",
            fieldOfStudy: parsed.fieldOfStudy?.replace(/\.$/, "") || "",
            gpa: parsed.gpa?.replace(/\.$/, "") || "",
            preferredCountries: parsed.preferredCountries || [],
        }));

        // localStorage.removeItem("voiceProfile");
    }, []);





    const finish = async () => {
        await saveOnboarding(form);
        navigate("/dashboard");
    };

    useEffect(() => {
        if (!finalForm) return;

        const submit = async () => {
            console.log("FINAL COUNTRIES:", finalForm.preferredCountries);
            await saveOnboarding(finalForm);
            navigate("/dashboard");
        };

        submit();
    }, [finalForm]);

    const validateStep = () => {
        if (step === 1) {
            return form.educationLevel && form.major && form.graduationYear;
        }

        if (step === 2) {
            return (
                form.intendedDegree &&
                form.fieldOfStudy &&
                form.targetIntake &&
                form.preferredCountries.length > 0
            );
        }

        if (step === 3) {
            return form.budgetRange && form.fundingPlan;
        }

        if (step === 4) {
            return form.ieltsStatus && form.sopStatus;
        }

        return true;
    };






    return (
        <div className="min-h-screen flex flex-col lg:flex-row gap-6 lg:gap-8 bg-[#FBFAF8]">

            <div className="w-full lg:w-[35%]">
                <div
                    className="
                        sticky top-0 
                        h-auto lg:h-[100vh]
                        px-5 py-4 lg:p-5
                        bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600
                        text-white shadow-2xl
                        z-30
                      "
                >

                    <div className="flex  items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-500 flex items-center justify-center text-white">
                           <GraduationCap size={22} />
                        </div>
                        <span className="font-semibold text-xl">AI Counsellor</span>
                    </div>
                    {/* <div className="text-xl  block mt-10 w-full mx-auto text-center text-white">Step {step} of 4</div> */}


                    {/* Stepper */}
                    <div className="flex justify-center lg:mt-20 mt-4">
                        <div className="flex lg:flex-col flex-row gap-4 lg:gap-3 lg:ms-10 mt-5 md:mt-0">

                            <StepIcon active={step === 1} done={step > 1} icon={<BookOpen />} label="Academic Background" />
                            <Line done={step > 1} />
                            <StepIcon active={step === 2} done={step > 2} icon={<Target />} label="Study Goals" />
                            <Line done={step > 2} />
                            <StepIcon active={step === 3} done={step > 3} icon={<Wallet />} label="Budget" />
                            <Line done={step > 3} />
                            <StepIcon active={step === 4} done={step > 4} icon={<ClipboardCheck />} label="Readiness" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Card */}
            <div className="flex justify-center w-full px-4 py-6 lg:m-10">
                <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-5 sm:p-6 lg:p-10 transition-all duration-500">
                    {step === 1 && (
                        <Academic
                            form={form}
                            setForm={setForm}

                        />
                    )}
                    {step === 2 && <Goals form={form} setForm={setForm} />}
                    {step === 3 && <Budget form={form} setForm={setForm} />}
                    {step === 4 && <Readiness form={form} setForm={setForm} />}


                    <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 border-t pt-6">
                        <button
                            disabled={step === 1}
                            onClick={() => setStep(step - 1)}
                            className="px-6 py-3 border rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                        >
                            ← Back
                        </button>

                        <button
                            disabled={!validateStep()}
                            onClick={() => {
                                if (step < 4) {
                                    setStep(step + 1);
                                } else {
                                    setFinalForm({
                                        ...form,
                                        preferredCountries: [...form.preferredCountries]
                                    });
                                }
                            }}
                            className={`px-6 py-2 rounded-xl shadow-lg transition
        ${validateStep()
                                    ? "bg-gradient-to-r from-blue-600 to-purple-500 text-white hover:opacity-90"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"}
    `}
                        >
                            {step === 4 ? "Complete Setup →" : "Continue →"}
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}


function StepIcon({ active, done, icon, label }) {
    return (
        <div className="flex items-center gap-2 ">
            <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center
        ${done ? "bg-green-500 text-white" :
                        active ? "bg-purple-400 text-white shadow-lg" :
                            "bg-gray-100 text-gray-400"}`}
            >
                {done ? <Check /> : icon}
            </div>
            <span
                className={`
    hidden sm:inline
    ${active ? "text-purple-300 font-medium" : "text-white"}
    lg:text-lg text-sm
  `}
            >
                {label}
            </span>
        </div>
    );
}

function Line({ done }) {
    return (
        <div className={`w-10 h-1 md:w-1 md:h-20 mt-4 md:mt-0  md:ms-4.5 ${done ? "bg-green-500" : "bg-gray-200"}`} />
    );
}


function Academic({ form, setForm }) {
    return (
        <>
            <h2 className="text-2xl font-bold mb-1">Academic Background</h2>
            <p className="text-gray-500 mb-8">Tell us about your educational journey</p>




            <div className="flex flex-col  gap-6">
                <Select
                    label="Current Education Level"
                    value={form.educationLevel}
                    options={[
                        { label: "High School", value: "High School" },
                        { label: "Bachelor's Degree", value: "Bachelor's Degree" },
                        { label: "Master's Degree", value: "Master's Degree" },
                        { label: "PhD", value: "PhD" }
                    ]}
                    onChange={(val) =>
                        setForm({ ...form, educationLevel: val })
                    }
                />


                <Input
                    label="Degree / Major"
                    value={form.major}
                    onChange={v => setForm({ ...form, major: v })}
                    placeholder="Computer Science"
                />

                <Select
                    label="Graduation Year"
                    value={form.graduationYear}
                    options={["2022", "2023", "2024", "2025", "2026"]
                        .map(y => ({ label: y, value: y }))
                    }
                    onChange={val =>
                        setForm({ ...form, graduationYear: val })
                    }
                />



                <Input
                    label="GPA / Percentage"
                    value={form.gpa}
                    onChange={v => setForm({ ...form, gpa: v })}
                    placeholder="e.g. 3.5 or 85%"
                />

            </div>
        </>
    );
}


function Goals({ form, setForm }) {

    return (
        <>
            <h2 className="text-2xl font-bold mb-1">Study Goals</h2>
            <p className="text-gray-500 mb-8">What are you aiming to achieve?</p>




            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <Select
                    label="Intended Degree"
                    value={form.intendedDegree}
                    options={["Bachelor's", "Master's", "MBA", "PhD"]
                        .map(v => ({ label: v, value: v }))
                    }
                    onChange={val =>
                        setForm({ ...form, intendedDegree: val })
                    }
                />


                <Input
                    label="Field of Study"
                    value={form.fieldOfStudy}
                    onChange={v => setForm({ ...form, fieldOfStudy: v })}
                />
            </div>

            <div className="mt-6">
                <Select
                    label="Target Intake"
                    value={form.targetIntake}
                    options={[
                        "Fall 2025",
                        "Spring 2025",
                        "Fall 2026",
                        "Spring 2026"
                    ].map(v => ({ label: v, value: v }))}
                    onChange={val =>
                        setForm({ ...form, targetIntake: val })
                    }
                />

            </div>

            <div className="mt-6">
                <p className="text-sm font-medium mb-2">Preferred Countries (atleast 1)</p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                    {["USA", "UK", "Canada", "Australia", "Germany", "Singapore", "Netherlands"].map(c => (
                        <span
                            key={c}
                            onClick={() => {
                                setForm(prev => {
                                    const exists = prev.preferredCountries.includes(c);

                                    const list = exists
                                        ? prev.preferredCountries.filter(x => x !== c)
                                        : [...prev.preferredCountries, c];

                                    return {
                                        ...prev,
                                        preferredCountries: list
                                    };
                                });
                            }}
                            className={`px-4 py-2 rounded-xl cursor-pointer  
          border border-purple-200 
    ${form.preferredCountries.includes(c) ? "bg-purple-600 text-white" : " bg-white shadow"}
  `}
                        >
                            {c}
                        </span>


                    ))}
                </div>
            </div>
        </>
    );
}


function Budget({ form, setForm }) {
    return (
        <>
            <h2 className="text-2xl font-bold mb-1">Budget & Funding</h2>
            <p className="text-gray-500 mb-8">Help us find universities within your budget</p>

            <p className="font-medium mb-3">Budget Range</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {["Under $20K", "$20K - $40K", "$40K - $60K", "Over $60K"].map(b => (
                    <div
                        key={b}
                        onClick={() => setForm({ ...form, budgetRange: b })}
                        className={`p-4 rounded-xl text-center cursor-pointer transition  active:scale-95
  ${form.budgetRange === b
                                ? "bg-purple-600 text-white border-purple-600 shadow-lg"
                                : "bg-white border border-purple-600 sha text-gray-700 hover:border-purple-400 hover:bg-white"}
  `}
                    >

                        {b}
                    </div>
                ))}
            </div>


            <p className="font-medium mb-3">Funding Plan</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {["Self-Funded", "Scholarship-Dependent", "Loan-Dependent"].map(p => (
                    <div
                        key={p}
                        onClick={() => setForm({ ...form, fundingPlan: p })}
                        className={`p-6 rounded-xl cursor-pointer transition  active:scale-95
  ${form.fundingPlan === p
                                ? "bg-purple-600 text-white border-purple-600 shadow-lg"
                                : "bg-white border border-purple-600 text-white hover:border-purple-400  "}
  `}
                    >

                        <h4 className="font-semibold text-gray-800">{p}</h4>
                        <p className={` ${form.fundingPlan === p
                            ? " text-white text-sm mt-1  "
                            : "  text-gray-700 text-sm mt-1  "}
  `}>
                            {p === "Self-Funded" && "Family savings or personal funds"}
                            {p === "Scholarship-Dependent" && "Need scholarship to fund studies"}
                            {p === "Loan-Dependent" && "Planning to take education loan"}
                        </p>
                    </div>
                ))}
            </div>

        </>
    );
}


function Readiness({ form, setForm }) {


    return (
        <>
            <h2 className="text-xl sm:text-2xl font-bold mb-1">
                Exam & Application Readiness</h2>
            <p className="text-gray-500 mb-8">Where are you in your preparation?</p>

            <StatusGroup
                title="IELTS / TOEFL"
                value={form.ieltsStatus}
                onChange={v => setForm({ ...form, ieltsStatus: v })}
            />

            <StatusGroup
                title="GRE / GMAT"
                value={form.greStatus}
                onChange={v => setForm({ ...form, greStatus: v })}
            />

            <StatusGroup
                title="Statement of Purpose"
                value={form.sopStatus}
                onChange={v => setForm({ ...form, sopStatus: v })}
            />

        </>
    );
}

function StatusGroup({ title, value, onChange }) {
    return (
        <div className="mb-6">
            <p className="font-medium mb-3">{title}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {["Not Started", "In Progress", "Completed"].map(s => (
                    <div
                        key={s}
                        onClick={() => onChange(s)}
                        className={`p-4 rounded-xl cursor-pointer 
          border border-purple-200 shadow
            ${value === s ? "bg-purple-600 text-white" : "bg-white"}`}
                    >
                        {s}
                    </div>
                ))}
            </div>
        </div>
    );
}



function Input({ label, placeholder, value, onChange, }) {
    return (
        <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
            <input
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="
          w-full px-4 py-3  rounded-xl
          bg-white
          border border-purple-200 shadow
          text-gray-800 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-purple-400
          focus:border-purple-400 focus:shadow outline-none
          transition
        "
            />
        </div>
    );
}



function matchOption(value, options) {
    if (!value) return "";

    const v = value.toLowerCase().replace(/\./g, "").trim();

    return (
        options.find(o =>
            o.toLowerCase().replace(/\./g, "").includes(v) ||
            v.includes(o.toLowerCase().replace(/\./g, ""))
        ) || ""
    );
}
