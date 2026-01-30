import React from "react";
import { MessageSquare, School, Target, TrendingUp, University, ListChecks } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const p = user?.profile || {};

    const shortlisted = p.shortlistedUniversities || [];
    const locked = shortlisted.filter(u => u.locked);

    const fitMap = {};

    (user?.universityMatches || []).forEach(country => {
        country.universities.forEach(uni => {
            fitMap[uni.name] = uni.fit;
        });
    });


    const dream = shortlisted.filter(u => fitMap[u.name] === "Dream").length;
    const target = shortlisted.filter(u => fitMap[u.name] === "Target").length;
    const safe = shortlisted.filter(u => fitMap[u.name] === "Safe").length;


    const firstLockedUni = locked[0];

    const uniTasks =
        p.applicationTasks?.find(
            t => t.universityName === firstLockedUni?.name
        )?.tasks || [];



    return (
        <div className="space-y-6 mt-20 md:mt-0 bg-[#FBFAF8] min-h-screen px-4 py-5 md:px-8 md:py-10">

            <div>
                <h1 className="text-[20px] md:text-[28px] font-semibold">
                    Welcome back, {user?.name || "Student"} 👋
                </h1>
                <p className="text-gray-500 mt-1">
                    Here's your study abroad journey at a glance
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <ActionCard
                    title="Talk to AI Counsellor"
                    desc="Get personalized guidance"
                    color="from-[#6A5BFF] to-[#7B68EE]"
                    icon={<MessageSquare size={20} />}
                    to="/ai-counsellor"
                />

                <ActionCard
                    title="Explore Universities"
                    desc="Find your dream schools"
                    color="from-[#FF9F1C] to-[#FF851B]"
                    icon={<School size={20} />}
                    to="/universities"
                />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                <ProfileSummary p={p} />
                <ProfileStrength p={p} />
                <Shortlist shortlisted={shortlisted}
                    locked={locked} dream={dream} target={target} safe={safe}
                />
            </div>

            <TodoList
                uniTasks={uniTasks}
                locked={locked}
            />
        </div>
    );
}



function ActionCard({ title, desc, color, icon, to }) {

    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(to)}
            className="bg-white rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.06)] p-5 md:p-7 flex items-center justify-between hover:shadow-lg transition">
            <div className="flex items-center gap-6">
                <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white`}
                >
                    {icon}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 text-[16px]">{title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{desc}</p>
                </div>
            </div>
            <span className="text-2xl text-gray-400">→</span>
        </div>
    );
}



/* ---------------- CARDS ---------------- */
function ProfileSummary({ p }) {
    return (
        <div className="bg-white rounded-2xl p-7 shadow">
            <h3 className="text-xl font-semibold mb-4">Profile Summary</h3>

            <Row label="Target Degree" value={p.intendedDegree} />
            <Row label="Field" value={p.fieldOfStudy} />
            <Row label="Intake" value={p.targetIntake} />
            <Row label="Countries" value={(p.preferredCountries || []).join(", ")} />
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex justify-between mb-3">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium ">{value || "Not set"}</span>
        </div>
    );
}


function ProfileStrength({ p }) {
    return (
        <div className="bg-white rounded-2xl p-7 shadow">
            <h3 className="text-xl font-semibold mb-4">Profile Strength</h3>

            <Strength label="Academics" status={p.gpa ? "Good" : "Missing"} />
            <Strength label="English Exam" status={p.ieltsStatus} />
            <Strength label="SOP" status={p.sopStatus} />
        </div>
    );
}

function Strength({ label, status }) {
    return (
        <div className="flex justify-between mb-4">
            <span>{label}</span>
            <span className={`px-3 py-1 rounded-full bg-gray-100 ${status === "Completed" || status === "Good" ? "text-green-600 bg-green-100" : status === "In Progress" ? "text-orange-500 bg-orange-100" : "text-red-500 bg-red-100"}`}>
                {status || "Not Set"}
            </span>
        </div>
    );
}


function Shortlist({ shortlisted, locked, dream, target, safe }) {



    return (
        <div className="bg-white rounded-2xl p-7 shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
            <h3 className="font-semibold mb-5 flex items-center gap-3 text-[15px] text-[#5B5BFF]">
                <University size={18} />
                <span className="text-black text-xl">Shortlist Summary</span>
            </h3>

            <div className="flex justify-between mb-4 text-md text-gray-500">
                <span>Total Shortlisted</span>
                <span className="font-bold text-lg">{shortlisted.length}</span>
            </div>

            <div className="flex justify-between mb-5 text-md text-gray-500">
                <span>Locked Universities</span>
                <span className="text-green-600 font-semibold">{locked.length}</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <StatBox label="Dream" value={dream} color="bg-purple-100 text-purple-600" />
                <StatBox label="Target" value={target} color="bg-blue-100 text-blue-600" />
                <StatBox label="Safe" value={safe} color="bg-green-100 text-green-600" />

            </div>
        </div>
    );
}

function StatBox({ label, value, color }) {
    return (
        <div className={`rounded-xl py-4 text-center ${color}`}>
            <p className="text-xl font-bold">{value}</p>
            <p className="text-xs mt-1">{label}</p>
        </div>
    );
}


/* ---------------- TODO ---------------- */

function TodoList({ uniTasks, locked }) {
    return (
        <>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-6">
                <h3 className="font-semibold flex items-center gap-3 text-[#5B5BFF]">
                    <ListChecks size={20} />
                    <span className="text-black text-xl">Your To-Do List</span>
                </h3>
                <span className="text-md text-gray-400">
                    {uniTasks.filter(t => t.completed).length}/{uniTasks.length} completed
                </span>
            </div>
            <div className="bg-white rounded-2xl p-7 shadow-[0_6px_18px_rgba(0,0,0,0.06)]">

                {locked.length === 0 && (
                    <p className="text-md text-center text-gray-400 font-medium mt-2 ">
                        Discover, Shortlist and Lock a university to start your application tasks.
                    </p>
                )}


                {uniTasks.length === 0 && (
                    <p className="text-gray-400 hidden text-sm">
                        No tasks generated yet for your locked university.
                    </p>
                )}

                {uniTasks.map(task => (
                    <Task
                        key={task.id}
                        title={task.title}
                        sub={task.desc}
                        tag={task.priority.toUpperCase()}
                    />
                ))}

            </div></>
    );
}

function Task({ title, sub, tag }) {
    return (
        <div className="flex flex-col md:flex-row md:justify-between gap-3 py-5">
            <div className="flex gap-4">
                {/* <div className="w-5 h-5 rounded-full border border-gray-400 mt-3" /> */}
                <div>
                    <p className="font-medium text-[16px] md:text-[18px]">{title}</p>
                    <p className="text-[13px] text-gray-500">{sub}</p>
                </div>
            </div>
            <span className={`text-[13px] mt-3 font-semibold ${tag === "HIGH" ? "text-red-500" : "text-orange-500"}`}>
                {tag}
            </span>
        </div>
    );
}


