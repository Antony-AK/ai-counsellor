import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AIExamPage() {
    const { examType } = useParams();
    const navigate = useNavigate();

    const recognitionRef = useRef(null);
    const stepRef = useRef(0);

    const [started, setStarted] = useState(false);
    const [listening, setListening] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [examContext, setExamContext] = useState(null);

    const [transcript, setTranscript] = useState([]);
    const silenceTimerRef = useRef(null);
    const isRecognizingRef = useRef(false);
    const answerReceivedRef = useRef(false);
    const answersRef = useRef([]);
    const transcriptEndRef = useRef(null);

    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [transcript]);



    // 🔥 Load exam context
    useEffect(() => {
        const ctx = JSON.parse(localStorage.getItem("ai_exam_context"));
        setExamContext(ctx);
        initRecognition();
    }, []);

    // 🎯 Question sets (extendable)
    const QUESTION_SETS = {
        ielts: [
            "Tell me about yourself.",
            "Why do you want to study abroad?",
            "Describe a challenge you recently faced.",
            "Do you prefer studying alone or in a group? Why?"
        ],
        gre: [
            "Describe a problem you solved logically.",
            "Explain a concept you recently learned.",
            "How do you handle time pressure?"
        ]
    };

    const QUESTIONS = QUESTION_SETS[examType] || [];

    function repeatQuestion(message) {
        const q = QUESTIONS[stepRef.current];

        const utter = new SpeechSynthesisUtterance(
            `${message} ${q}`
        );
        utter.rate = 0.95;

        utter.onend = () => {
            startListening();
        };

        speechSynthesis.cancel();
        speechSynthesis.speak(utter);
    }


    function initRecognition() {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SR();

        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (e) => {
            clearTimeout(silenceTimerRef.current);

            answerReceivedRef.current = true;
            isRecognizingRef.current = false;
            recognition.stop();

            const text = e.results[0][0].transcript.trim();

            if (text.split(" ").length < 3) {
                repeatQuestion("Please give a complete answer.");
                return;
            }

            const question = QUESTIONS[stepRef.current];

            setTranscript(prev => [
                ...prev,
                { role: "user", text }
            ]);

            answersRef.current.push({ question, answer: text });

            setAnswers(prev => [
                ...prev,
                { question, answer: text }
            ]);

            stepRef.current += 1;

            if (stepRef.current < QUESTIONS.length) {
                askQuestion();
            } else {
                finishExam();
            }
        };


        recognition.onend = () => {
            setListening(false);

            // 🔥 IF user stayed silent
            if (!answerReceivedRef.current && isRecognizingRef.current) {
                isRecognizingRef.current = false;
                repeatQuestion("I didn’t hear anything.");
            }
        };


        recognition.onerror = () => {
            isRecognizingRef.current = false;
            setListening(false);
        };

        recognitionRef.current = recognition;
    }

    function askQuestion() {
        if (isRecognizingRef.current) return;

        const q = QUESTIONS[stepRef.current];

        setTranscript(prev => [
            ...prev,
            { role: "ai", text: q }
        ]);

        speak(q);
    }



    function speak(text) {
        speechSynthesis.cancel();

        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = 0.95;

        utter.onend = () => {
            startListening();
        };

        speechSynthesis.speak(utter);
    }


    function startExam() {
        setStarted(true);
        stepRef.current = 0;

        const welcome = new SpeechSynthesisUtterance(
            `Welcome to ${examType?.toUpperCase()} speaking practice. Let's begin.`
        );

        welcome.rate = 0.95;
        welcome.onend = () => askQuestion();

        speechSynthesis.cancel();
        speechSynthesis.speak(welcome);
    }



    function finishExam() {
        speechSynthesis.cancel();

        localStorage.setItem(
            "ai_exam_result",
            JSON.stringify({
                examType,
                university: examContext?.university,
                responses: answersRef.current
            })
        );

        // cleanup
        localStorage.removeItem("ai_exam_context");

        const utter = new SpeechSynthesisUtterance(
            "Thank you. I will now analyze your answers."
        );

        utter.onend = () => navigate("/ai-counsellor");
        speechSynthesis.speak(utter);

    }

    function startListening() {
        if (!recognitionRef.current) return;
        if (isRecognizingRef.current) return;

        try {
            recognitionRef.current.stop();
        } catch { }

        answerReceivedRef.current = false;
        isRecognizingRef.current = true;
        setListening(true);

        recognitionRef.current.start();

        // ⏱️ HARD SILENCE BACKUP (15 seconds)
        silenceTimerRef.current = setTimeout(() => {
            if (!answerReceivedRef.current) {
                recognitionRef.current.stop();
                isRecognizingRef.current = false;
                setListening(false);

                repeatQuestion("I didn’t hear anything.");
            }
        }, 10000);
    }



    return (
        <div className="min-h-screen  flex items-center justify-center px-6">

            {/* MAIN CARD */}
            <div className="w-full max-w-3xl rounded-3xl bg-black backdrop-blur-xl border border-white/10 shadow-2xl p-10 relative overflow-hidden">

                {/* Glow */}
                {/* <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl" /> */}
                <div className="absolute -bottom-24 left-0 w-[700px] h-72 bg-indigo-600/20 rounded-full blur-3xl" />

                {!started ? (
                    <div className="relative z-10 flex flex-col items-center text-center">

                        <span className="text-xs uppercase tracking-widest text-white mb-3">
                            AI Voice Examination
                        </span>

                        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                            {examContext?.title || "AI Speaking Test"}
                        </h1>

                        <p className="text-gray-400 max-w-md mb-8">
                            This is a simulated {examType?.toUpperCase()} speaking test.
                            Speak naturally. The AI will evaluate your performance.
                        </p>

                        <div className="flex items-center gap-3 mb-10">
                            <span className="px-4 py-1 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-300 text-xs">
                                🎙️ Voice Enabled
                            </span>
                            <span className="px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs">
                                ⏱️ Real-time Analysis
                            </span>
                        </div>

                        <button
                            onClick={startExam}
                            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 transition text-lg font-semibold shadow-lg"
                        >
                            Start Taking Test
                        </button>
                    </div>
                ) : (
                    <div className="relative z-10">

                        {/* STATUS */}
                        <div className="flex flex-col items-center mb-10">
                            <div
                                className={`w-36 h-36 rounded-full flex items-center justify-center
              ${listening
                                        ? "bg-purple-500/20 animate-pulse"
                                        : "bg-indigo-500/20"
                                    }`}
                            >
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 shadow-xl" />
                            </div>

                            <p className="mt-6 text-lg tracking-wide">
                                {listening ? "Listening..." : "AI speaking..."}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                                Speak clearly and naturally
                            </p>
                        </div>

                        {/* TRANSCRIPT */}
                        <div className="max-h-[260px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {transcript.map((t, i) => (
                                <div
                                    key={i}
                                    className={`flex ${t.role === "ai" ? "justify-start" : "justify-end"}`}
                                >
                                    <div
                                        className={`px-5 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed
                  ${t.role === "ai"
                                                ? "bg-white/10 text-purple-200 border border-white/10"
                                                : "bg-gradient-to-br from-purple-600 to-indigo-600 text-white"
                                            }`}
                                    >
                                        <span className="block text-xs opacity-70 mb-1">
                                            {t.role === "ai" ? "AI Examiner" : "You"}
                                        </span>
                                        {t.text}
                                    </div>
                                </div>
                            ))}

                              <div ref={transcriptEndRef} />

                        </div>

                    </div>
                )}
            </div>
        </div>
    );

}
