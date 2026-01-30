import React, { useState, useEffect, useRef } from "react";
import { Send, Bot } from "lucide-react";
import axios from "axios";
import { apiUrl } from "../context/api"


export default function AiCounsellor() {
  const [messages, setMessages] = useState([]);


  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const examAnalyzedRef = useRef(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);



  useEffect(() => {
    const loadChat = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${apiUrl}/ai/chat/history`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages(
        res.data.chats.map(c => ({
          from: c.role === "assistant" ? "bot" : "user",
          text: c.message
        }))
      );

      // 🔥 Handle task-based auto prompt
      const taskContext = localStorage.getItem("ai_task_context");
      if (taskContext) {
        const { title, desc, university } = JSON.parse(taskContext);

        sendMessage(`
Help me with this application task:

Task: ${title}
Details: ${desc}
University: ${university}

If SOP-related, generate a full SOP draft.
`);

        localStorage.removeItem("ai_task_context");
      }
    };

    loadChat();
  }, []);




  const suggested = [
    "What universities match my profile?",
    "What are my profile strengths and gaps?",
    "Suggest Dream, Target, and Safe universities",
    "What should I focus on right now?",
    "Help me understand my acceptance chances"
  ];

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { from: "user", text }]);
    setIsTyping(true);

    const token = localStorage.getItem("token");

    const res = await axios.post(`${apiUrl}/ai/chat`, {
      message: text
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setIsTyping(false);

    setMessages(prev => [
      ...prev,
      { from: "bot", text: res.data.result }
    ]);
  };


  useEffect(() => {
    if (examAnalyzedRef.current) return;

    const examResultRaw = localStorage.getItem("ai_exam_result");
    if (!examResultRaw) return;

    const { examType, responses, university } = JSON.parse(examResultRaw);
    if (!responses || responses.length === 0) return;

    examAnalyzedRef.current = true;

    const formattedAnswers = responses
      .map(
        (r, i) =>
          `Question ${i + 1}: ${r.question}\nAnswer: ${r.answer}`
      )
      .join("\n\n");

    if (examType === "ielts") {
      sendMessage(`
You are an IELTS Speaking Examiner inside a premium web application.

STRICT STYLE RULES:
No markdown.
No bullet symbols.
No numbering.
No bold text.

Use this structure only:

🗣 Fluency and Coherence
Short explanation.

📚 Lexical Resource
Short explanation.

✍️ Grammar Accuracy
Short explanation.

🔊 Pronunciation
Short explanation.

🎯 Overall Band Score
One clear band score.

💪 Strengths
Two short lines.

⚠️ Weaknesses
Two short lines.

🚀 Improvement Plan
Three short actionable tips.

Target University: ${university}

Candidate Responses:
${formattedAnswers}
`);
    }

    if (examType === "gre") {
      sendMessage(`
You are a GRE Verbal & Analytical Speaking Evaluator.

STRICT STYLE RULES:
No markdown.
No bullets.
No numbering.
Plain text only.

Evaluate based on:

🧠 Logical Thinking
Short explanation.

🗣 Clarity of Explanation
Short explanation.

📚 Vocabulary Usage
Short explanation.

✍️ Sentence Structure
Short explanation.

🎯 Estimated GRE Verbal Score Range
One range.

💪 Strengths
Two short lines.

⚠️ Weaknesses
Two short lines.

🚀 Improvement Plan
Three actionable tips.

Candidate Responses:
${formattedAnswers}
`);
    }

    // 🧹 CLEANUP
    localStorage.removeItem("ai_exam_result");
  }, []);





  return (
    <div className="h-full flex flex-col bg-[#FBFAF8] pt-[56px] md:pt-0">

      {/* HEADER */}
      <div className="hidden md:flex items-center gap-3 px-6 py-6 bg-white border-b border-purple-200">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white">
          <Bot size={20} />
        </div>
        <div>
          <p className="font-semibold text-gray-900">AI Counsellor</p>
          <p className="text-sm text-gray-500">
            Your personal study abroad guide
          </p>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 px-5 py-8 overflow-y-auto space-y-6">

        {messages.map((msg, i) => (
          <div key={i} className="flex gap-4 max-w-3xl">

            {msg.from === "bot" && (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white shrink-0">
                <Bot size={18} />
              </div>
            )}

            <div>
              <div
                className={`px-6 py-3 rounded-2xl leading-relaxed text-[15px]
                  ${msg.from === "bot"
                    ? "bg-white shadow-sm text-gray-700"
                    : "bg-blue-600 text-white ml-auto justify-end"
                  }`}
              >
                {msg.text.split("\n").map((line, idx) => (
                  <p className="leading-relaxed" key={idx}>{line}</p>
                ))}
              </div>

              <p className="text-xs text-gray-400 mt-2">{msg.time}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-4 items-center text-purple-600 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white">
              <Bot size={18} />
            </div>
            <p className="italic">AI is analyzing your profile…</p>
          </div>
        )}

        <div ref={messagesEndRef} />


        {/* SUGGESTED */}
        <div className="mt-10">
          <p className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            ✨ Suggested questions
          </p>

          <div className="flex flex-wrap gap-3">
            {suggested.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                className="px-4 py-2 bg-white rounded-full text-sm shadow-sm hover:bg-gray-50 transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* INPUT BAR */}
      <div className=" px-4 md:px-10 py-6 bg-white border-t border-purple-200">
        <div className="flex items-center gap-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your study abroad journey..."
            className="flex-1 px-6 py-4 rounded-xl bg-gray-100 focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          />

          <button
            onClick={() => sendMessage(input)}
            className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white hover:scale-95 transition"
          >
            <Send size={20} />
          </button>
        </div>
      </div>




    </div>
  );
}
