import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VoiceOnboarding() {
    const navigate = useNavigate();
    const recognitionRef = useRef(null);

    const [step, setStep] = useState(0);
    const [listening, setListening] = useState(false);
    const [transcript, setTranscript] = useState([]);
    const [profile, setProfile] = useState({});
    const isRecognizingRef = useRef(false);
    const silenceTimerRef = useRef(null);
    const profileRef = useRef({});
    const advancingRef = useRef(false);
    const stepRef = useRef(0);
    const transcriptEndRef = useRef(null);

    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [transcript]);








    const QUESTIONS = [
        {
            key: "educationLevel",
            q: `
What is your current education level?

You can say:
Bachelor's degree
`
        },

        {
            key: "graduationYear",
            q: `
What is your expected graduation year?

For example:
2026
`
        },

        {
            key: "major",
            q: `
What is your major or primary field of study?

For example:
Computer Science
`
        },

        {
            key: "gpa",
            q: `
What is your current GPA or percentage?

For example:
8.2 CGPA
`
        },

        {
            key: "intendedDegree",
            q: `
Which degree are you planning to pursue for higher studies?

You can say:
Master's
`
        },

        {
            key: "fieldOfStudy",
            q: `
What field do you want to specialize in?

For example:
Computer Science
`
        },

        {
            key: "targetIntake",
            q: `
Which intake are you targeting?

You can say:
Fall 2025 or
Spring 2025
`
        },

        {
            key: "preferredCountries",
            q: `
Which countries are you interested in studying in?

You can say one or more countries like:
USA
Germany
`
        },

        {
            key: "budgetRange",
            q: `
What is your approximate budget range for your studies?

You can say:
Under 20k or 40k
`
        },

        {
            key: "fundingPlan",
            q: `
How do you plan to fund your studies?

You can say:
Scholarship Or loan dependent
`
        },

        {
            key: "ieltsStatus",
            q: `
What is your IELTS or TOEFL preparation status?

You can say:
Not started
In progress
Or completed
`
        },

        {
            key: "sopStatus",
            q: `
What is the status of your Statement of Purpose preparation?

You can say:
Not started
In progress
Or completed
`
        }
    ];


    useEffect(() => {
        stepRef.current = step;
    }, [step]);



    useEffect(() => {
        initRecognition();

        const welcome = new SpeechSynthesisUtterance(
            "Welcome to AI voice onboarding. Shall we begin?"
        );

        welcome.rate = 0.95;

        welcome.onend = () => {
            askQuestion(); // 🔥 START FIRST QUESTION PROPERLY
        };

        speechSynthesis.cancel();
        speechSynthesis.speak(welcome);
    }, []);


    useEffect(() => {
        if (step === 0) return;

        if (step < QUESTIONS.length) {
            askQuestion();
        } else {
            finish();
        }
    }, [step]);




    function initRecognition() {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (e) => {
            clearTimeout(silenceTimerRef.current);
            isRecognizingRef.current = false;
            recognition.stop();

            const text = e.results[0][0].transcript;

            setTranscript(prev => [
                ...prev,
                { role: "user", text }
            ]);


            const currentStep = stepRef.current;
            const currentQuestion = QUESTIONS[currentStep];

            const value = normalize(text, currentQuestion.key);

            profileRef.current = {
                ...profileRef.current,
                [currentQuestion.key]: value,
            };

            setProfile(profileRef.current);
            setListening(false);

            // 🔥 MOVE STEP FORWARD
            setStep(prev => prev + 1);

        };

        recognition.onend = () => {
            isRecognizingRef.current = false;
            setListening(false);
        };

        recognition.onerror = () => {
            isRecognizingRef.current = false;
            setListening(false);
        };


        recognitionRef.current = recognition;
    }

    function speak(text) {
        speechSynthesis.cancel();

        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = 0.95;

        utter.onend = () => {
            startListening(); // 🔥 ONLY listen here
        };

        speechSynthesis.speak(utter);
    }



    function askQuestion() {
        if (isRecognizingRef.current) return;

        if (step >= QUESTIONS.length) {
            finish();
            return;
        }

        setTranscript(prev => [
            ...prev,
            { role: "ai", text: QUESTIONS[step].q }
        ]);

        speak(QUESTIONS[step].q);
    }


    function startListening() {
        if (!recognitionRef.current) return;
        if (isRecognizingRef.current) return;

        try {
            recognitionRef.current.stop();
        } catch (e) { }

        isRecognizingRef.current = true;
        setListening(true);

        // 🔥 START LISTENING
        recognitionRef.current.start();

        // 🔥 AUTO TIMEOUT (5 seconds)
        silenceTimerRef.current = setTimeout(() => {
            if (isRecognizingRef.current) {
                recognitionRef.current.stop();
                isRecognizingRef.current = false;
                setListening(false);

                // 🔥 Speak fallback, then repeat question, then listen
                const fallback = new SpeechSynthesisUtterance(
                    "I didn't catch that. Let me repeat the question."
                );
                fallback.rate = 0.95;

                fallback.onend = () => {
                    speak(QUESTIONS[step].q); // 👈 this will auto-listen
                };

                speechSynthesis.cancel();
                speechSynthesis.speak(fallback);
            }
        }, 5000);

    }



    function finish() {
        // 🛑 STOP EVERYTHING
        speechSynthesis.cancel();

        try {
            recognitionRef.current?.stop();
        } catch (e) { }

        clearTimeout(silenceTimerRef.current);
        isRecognizingRef.current = false;

        console.group("🎙️ Voice Onboarding Debug");
        QUESTIONS.forEach(q => {
            console.log(q.key, "→", profileRef.current[q.key]);
        });
        console.groupEnd();


        // ✅ SAVE FINAL DATA
        localStorage.setItem(
            "voiceProfile",
            JSON.stringify(profileRef.current)
        );

        console.log(
            "✅ Saved voiceProfile:",
            JSON.parse(localStorage.getItem("voiceProfile"))
        );

        // 🔊 FINAL MESSAGE (ONE TIME)
        const utter = new SpeechSynthesisUtterance(

            "Thank you. Let's review your details."
        );
        utter.rate = 0.95;

        utter.onend = () => {
            console.log("🧪 Before navigate:", localStorage.getItem("voiceProfile"));

            navigate("/onboarding");
        };

        speechSynthesis.speak(utter);
    }



    const CANONICAL = {
        educationLevel: {
            bachelors: "Bachelor's Degree",
            bachelor: "Bachelor's Degree",
            masters: "Master's Degree",
            master: "Master's Degree",
            phd: "PhD",
            doctorate: "PhD",
            school: "High School",
        },

        intendedDegree: {
            bachelor: "Bachelor's",
            master: "Master's",
            mba: "MBA",
            phd: "PhD",
        },

        budgetRange: {
            "under 20": "Under $20K",
            "20k": "$20K - $40K",
            "40k": "$40K - $60K",
            "60k": "Over $60K",
            over: "Over $60K",
        },

        fundingPlan: {
            self: "Self-Funded",
            family: "Self-Funded",
            scholarship: "Scholarship-Dependent",
            grant: "Scholarship-Dependent",
            loan: "Loan-Dependent",
        },

        status: {
            not: "Not Started",
            started: "In Progress",
            progress: "In Progress",
            completed: "Completed",
            done: "Completed",
        },

        targetIntake: {
            "fall 2025": "Fall 2025",
            "spring 2025": "Spring 2025",
            "fall 2026": "Fall 2026",
            "spring 2026": "Spring 2026",
        },

        countries: [
            "USA",
            "UK",
            "Canada",
            "Australia",
            "Germany",
            "Singapore",
            "Netherlands",
        ],
    };



    function normalize(text, key) {
        if (!text) return "";

        const t = text.toLowerCase().replace(/\./g, "").trim();

        // 🎓 Education Level
        if (key === "educationLevel") {
            for (const k in CANONICAL.educationLevel) {
                if (t.includes(k)) return CANONICAL.educationLevel[k];
            }
        }

        // 🎓 Intended Degree
        if (key === "intendedDegree") {
            for (const k in CANONICAL.intendedDegree) {
                if (t.includes(k)) return CANONICAL.intendedDegree[k];
            }
        }

        // 💰 Budget
        if (key === "budgetRange") {
            for (const k in CANONICAL.budgetRange) {
                if (t.includes(k)) return CANONICAL.budgetRange[k];
            }
        }

        // 💳 Funding
        if (key === "fundingPlan") {
            for (const k in CANONICAL.fundingPlan) {
                if (t.includes(k)) return CANONICAL.fundingPlan[k];
            }
        }

        // 📅 Intake
        if (key === "targetIntake") {
            for (const k in CANONICAL.targetIntake) {
                if (t.includes(k)) return CANONICAL.targetIntake[k];
            }
        }

        // 📝 Status
        if (["ieltsStatus", "greStatus", "sopStatus"].includes(key)) {
            for (const k in CANONICAL.status) {
                if (t.includes(k)) return CANONICAL.status[k];
            }
        }

        // 🌍 Countries
        if (key === "preferredCountries") {
            return CANONICAL.countries.filter(c =>
                t.includes(c.toLowerCase())
            );
        }

        // ✏️ Text fields
        return text.replace(/\.$/, "").trim();
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0b0614] to-black text-white">

            {/* Main Card */}
            <div
                className="
    w-full max-w-[880px]
    rounded-3xl
    bg-white/5 backdrop-blur-xl
    border border-white/10 shadow-2xl
    px-6 py-6
    sm:px-10 sm:py-10
    lg:px-14 lg:py-12
  "
            >

                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
                            AI Voice Onboarding
                        </h1>
                        <p className="text-xs sm:text-sm text-white/60 mt-1">
                            Answer naturally. You can speak freely.
                        </p>
                    </div>

                    <div className="text-[10px] sm:text-xs text-white/50">
                        Step {Math.min(step + 1, QUESTIONS.length)} of {QUESTIONS.length}
                    </div>
                </div>

                {/* Center Listening Orb */}
                <div className="flex flex-col items-center mb-10">
                    <div
                        className={`w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full flex items-center justify-center
    ${listening
                                ? "bg-purple-500/80 animate-pulse shadow-[0_0_80px_#a855f7]"
                                : "bg-purple-700/80 shadow-lg"}
  `}
                    >

                        <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-black/40" />
                    </div>

                    <p className="mt-4 text-xs sm:text-sm tracking-wide text-white/70">
                        {listening ? "Listening..." : "AI speaking..."}
                    </p>
                </div>

                {/* Transcript */}
                <div
                    className="
    rounded-2xl bg-black/40 border border-white/10
    px-4 py-4 sm:px-6 sm:py-5
    max-h-[220px] sm:max-h-[280px]
    overflow-y-auto
    space-y-3 sm:space-y-4
    text-xs sm:text-sm
    leading-relaxed
  "
                >

                    {transcript.map((t, i) => (
                        <div
                            key={i}
                            className={`flex gap-3 ${t.role === "ai" ? "items-start" : "justify-end"}`}
                        >
                            {t.role === "ai" && (
                                <div className="text-purple-400 mt-1">🤖</div>
                            )}

                            <div
                                className={`
    max-w-[85%] sm:max-w-[70%]
    px-3 py-2 sm:px-4 sm:py-3
    rounded-2xl
    text-xs sm:text-sm
    ${t.role === "ai"
                                        ? "bg-white/10 text-white/90"
                                        : "bg-purple-600 text-white"}
  `}
                            >

                                {t.text}
                            </div>

                            {t.role === "user" && (
                                <div className="text-white/60 mt-1">🧑</div>
                            )}
                        </div>
                    ))}

                    <div ref={transcriptEndRef} />


                    {transcript.length === 0 && (
                        <p className="text-center text-white/40 text-sm">
                            Your conversation will appear here
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">

                    <button
                        onClick={() => speak(QUESTIONS[step].q)}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition  text-xs sm:text-sm"
                    >
                        Repeat Question
                    </button>

                    <button
                        onClick={() => {
                            speechSynthesis.cancel();
                            recognitionRef.current?.stop();
                            isRecognizingRef.current = false;

                            profileRef.current = {};
                            setTranscript([]);
                            setProfile({});
                            setStep(0);

                            const utter = new SpeechSynthesisUtterance(
                                "Restarting onboarding. Let's begin again."
                            );
                            utter.rate = 0.95;
                            utter.onend = () => askQuestion();
                            speechSynthesis.speak(utter);
                        }}
                        className="px-6 py-2.5 rounded-xl bg-red-500/90 hover:bg-red-600 transition text-sm"
                    >
                        Restart
                    </button>

                </div>
            </div>
        </div>
    );

}
