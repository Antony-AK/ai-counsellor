import React, { useEffect, useState } from "react";
import { Search, Lock, Check, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import Select from "../components/Select";
import { apiUrl } from "../context/api"

export default function Universities() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Canada");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedUni, setSelectedUni] = useState(null);
  // const [shortlisted, setShortlisted] = useState({});
  const [mode, setMode] = useState("ai");
  const [showOnlyShortlisted, setShowOnlyShortlisted] = useState(false);
  const [loadingUnis, setLoadingUnis] = useState(true);
  const location = useLocation();
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [pendingUni, setPendingUni] = useState(null);
  







  const { user, setUser } = useAuth();

  useEffect(() => {
    if (!user?.profile) return;

    fetchUniversities();
  }, [location.key, mode]);


  const shortlisted = user?.profile?.shortlistedUniversities || [];

  const isShortlisted = (uni) =>
    shortlisted.some(u => u.name === uni.name);

  const isLocked = (uni) => {
    if (!uni) return false;
    return shortlisted.some(u => u.name === uni.name && u.locked);
  };



  const fetchUniversities = async (selectedMode = mode) => {
    setLoadingUnis(true);

    const token = localStorage.getItem("token");
    const res = await fetch(
      `${apiUrl}/universities?mode=${selectedMode}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await res.json();
    setCountries(data.countries || []);
    setLoadingUnis(false);
  };



  const selectedCountryData =
    countries.find(c => c.country === country) || { universities: [] };

  const universities = selectedCountryData.universities;



  const stats = {
    total: universities.length,
    Dream: universities.filter((u) => u.fit === "Dream").length,
    Target: universities.filter((u) => u.fit === "Target").length,
    Safe: universities.filter((u) => u.fit === "Safe").length
  };

  const filtered = universities.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || u.fit === filter;
    const matchesShortlist = !showOnlyShortlisted || isShortlisted(u);

    return matchesSearch && matchesFilter && matchesShortlist;
  });


  useEffect(() => {
    if (countries.length > 0) {
      setCountry(countries[0].country); // always jump to first country in new dataset
    }
  }, [mode, countries]);

  const toggleShortlist = async (uni) => {
    // ✅ 1. OPTIMISTIC UPDATE
    const already = isShortlisted(uni);

    const optimistic = already
      ? shortlisted.filter(u => u.name !== uni.name)
      : [
        ...shortlisted,
        {
          name: uni.name,
          country: uni.country,
          portalUrl: uni.portalUrl,
          matchScore: uni.matchScore,
          tuition: uni.tuition,
          ranking: uni.ranking,
          locked: false
        }
      ];

    setUser({
      ...user,
      profile: {
        ...user.profile,
        shortlistedUniversities: optimistic
      }
    });

    // ✅ 2. BACKEND SYNC
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${apiUrl}/shortlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ university: uni })
      });

      const updated = await res.json();

      setUser({
        ...user,
        profile: {
          ...user.profile,
          shortlistedUniversities: updated.shortlistedUniversities
        },
        applicationStage: updated.applicationStage
      });
    } catch (err) {
      console.error("Shortlist failed", err);
    }
  };


  const lockUniversity = async (uni) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${apiUrl}/lock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name: uni.name })
    });

    const updated = await res.json();

    setUser({
      ...user,
      profile: {
        ...user.profile,
        shortlistedUniversities: updated.shortlistedUniversities
      },
      applicationStage: updated.applicationStage
    });

  };


  const FIT_PRIORITY = {
    Dream: 3,
    Target: 2,
    Safe: 1
  };

  const orderedUniversities = [...filtered].sort(
    (a, b) => FIT_PRIORITY[a.fit] - FIT_PRIORITY[b.fit]
  );


  const countryOptions = countries.map(c => ({
    label: c.country,
    value: c.country
  }));


  return (
    <div className="px-4 py-24 md:px-10 md:py-10 bg-[#FBFAF8] min-h-screen space-y-6 md:space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          University Discovery
        </h1>
        <p className="text-gray-500 text-sm md:text-md mt-1">
          Explore universities matched to your profile. Shortlist your favorites
          and lock your final choices.
        </p>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search universities..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-purple-200 outline-none bg-white shadow-sm focus:outline-none"
          />
        </div>

        <div className="hidden md:flex gap-4">
          {["All", "Dream", "Target", "Safe"].map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setShowOnlyShortlisted(false);
              }}
              className={`px-6 py-3 rounded-xl font-medium
        ${filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
                }`}
            >
              {f}
            </button>
          ))}

          <button
            onClick={() => {
              setShowOnlyShortlisted(v => !v);
              setFilter("All");
            }}
            className={`px-6 py-3 rounded-xl font-medium
      ${showOnlyShortlisted
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-600"
              }`}
          >
            Shortlisted
          </button>
        </div>

        {/* MOBILE FILTER DROPDOWN */}
        <div className="md:hidden">
          <Select
            value={
              showOnlyShortlisted
                ? "Shortlisted"
                : filter
            }
            onChange={(value) => {
              if (value === "Shortlisted") {
                setShowOnlyShortlisted(true);
                setFilter("All");
              } else {
                setFilter(value);
                setShowOnlyShortlisted(false);
              }
            }}
            options={[
              { label: "All ", value: "All" },
              { label: "Dream ", value: "Dream" },
              { label: "Target ", value: "Target" },
              { label: "Safe ", value: "Safe" },
              { label: "Shortlisted ", value: "Shortlisted" }
            ]}
            placeholder="Filter universities"
          />
        </div>



      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-10 items-stretch md:items-center">


        {/* COUNTRY */}
        <div className="w-full md:w-[80%]">
          <Select

            value={country}
            onChange={setCountry}   // ✅ NOT e.target.value
            options={countryOptions}
            placeholder="Select country"
          />
        </div>


        <div className="relative w-full md:w-80">

          <Select
            value={mode}
            onChange={setMode}
            options={[
              { label: "AI Recommended Countries", value: "ai" },
              { label: "Explore All Countries", value: "all" }
            ]}
          />
        </div>



      </div>


      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Stat value={stats.total} label="Total Matches" color="bg-blue-100 text-blue-600" />
        <Stat value={stats.Dream} label="Dream" color="bg-purple-100 text-purple-600" />
        <Stat value={stats.Target} label="Target" color="bg-blue-100 text-blue-600" />
        <Stat value={stats.Safe} label="Safe" color="bg-green-100 text-green-600" />
      </div>

      {/* UNIVERSITY GRID */}
      {loadingUnis ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          No universities found for this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {orderedUniversities.map((uni, i) => (
            <UniCard
              key={i}
              uni={uni}
              country={country}
              onClick={() => setSelectedUni(uni)}
              isShortlisted={isShortlisted}
              isLocked={isLocked}
              toggleShortlist={toggleShortlist}
              lockUniversity={lockUniversity}
              onLockRequest={(uni) => {
                setPendingUni(uni);
                setShowAgentModal(true);
              }}
            />
          ))}
        </div>
      )}


      {/* MODAL */}
      {selectedUni && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-[95%] md:w-[720px] max-h-[75vh] md:max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-5 md:p-8 relative">

            <button
              onClick={() => setSelectedUni(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-lg md:text-2xl font-semibold">{selectedUni.name}</h2>
            <p className="flex items-center gap-2 text-gray-500 mt-1 border-b pb-4 border-gray-400">
              <MapPin size={14} /> {country}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <ModalStat
                value={`${selectedUni.matchScore}%`}
                label="Profile Match"
                color="blue"
              />

              <ModalStat
                value={`#${selectedUni.ranking}`}
                label="World Ranking"
              />

              <ModalStat
                value={
                  selectedUni.fit === "Safe"
                    ? "60–80%"
                    : selectedUni.fit === "Target"
                      ? "30–60%"
                      : "5–20%"
                }
                label="Acceptance"
              />

              <ModalStat
                value={`$${selectedUni.tuition.toLocaleString()}`}
                label="Tuition / Year"
              />

            </div>

            <div className="mt-6">
              <p className="font-medium mb-2">Requirements</p>
              <div className="flex gap-3 flex-wrap">
                {[
                  selectedUni.fit === "Dream" && "High GPA (3.7+)",
                  selectedUni.fit !== "Safe" && "GRE / GMAT Recommended",
                  selectedUni.country !== "Germany" && "IELTS / TOEFL Required",
                  selectedUni.tuition > 30000 && "Financial Proof Required"
                ]
                  .filter(Boolean)
                  .map(r => (
                    <span key={r} className="bg-gray-100 px-4 py-1.5 rounded-full text-sm">
                      {r}
                    </span>
                  ))}

              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <p className="text-green-600 text-lg font-medium mb-2">Why it's a fit</p>
                <ul className="space-y-2 text-sm">
                  <li>✔ Matches your GPA & exam readiness</li>
                  <li>✔ Fits your budget range</li>
                  <li>✔ Strong alignment with your profile</li>
                </ul>

              </div>

              <div>
                <p className="text-red-500 text-lg font-medium mb-2">Considerations</p>
                <ul className="space-y-2 text-sm">

                  {(() => {
                    const issues = [];

                    // Difficulty based
                    if (selectedUni.fit === "Dream") {
                      issues.push("⚠ Highly competitive admission process");
                      issues.push("⚠ Requires a very strong academic and exam profile");
                    }

                    if (selectedUni.fit === "Target") {
                      issues.push("⚠ Admission depends strongly on GPA and test scores");
                    }

                    // Tuition based
                    if (selectedUni.tuition > 40000) {
                      issues.push("⚠ Tuition cost is on the higher side");
                    } else if (selectedUni.tuition > 30000) {
                      issues.push("⚠ Moderate to high tuition compared to other options");
                    }

                    // Country based
                    if (selectedUni.country === "United States" || selectedUni.country === "United Kingdom") {
                      issues.push("⚠ Visa and financial documentation requirements are strict");
                    }

                    if (selectedUni.country === "Germany") {
                      issues.push("⚠ Limited English-taught programs in some universities");
                    }

                    // Ranking based
                    if (selectedUni.ranking > 70) {
                      issues.push("⚠ Lower global ranking compared to top universities");
                    }

                    // Match based
                    if (selectedUni.matchScore < 60) {
                      issues.push("⚠ Your profile is weaker than the typical admitted student");
                    }

                    // Always show something
                    if (issues.length === 0) {
                      issues.push("⚠ Limited seats available for international students");
                    }

                    return issues.map((item, i) => <li key={i}>{item}</li>);
                  })()}

                </ul>
              </div>
            </div>

            <div className="bg-amber-300/30 rounded-xl p-4 mt-6 text-md font-medium">
              <span className="text-amber-500 me-2"> ⚠</span> Application Deadline: December 15, 2024
            </div>

            <div className="flex gap-4 mt-6">
              {!isShortlisted(selectedUni) ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleShortlist(selectedUni);
                  }}
                  className="flex-1 py-3 rounded-xl border font-medium bg-gray-50 hover:bg-orange-400 hover:text-white"
                >
                  + Add to Shortlist
                </button>
              ) : (
                <>
                  <button className="flex-1 py-3 rounded-xl bg-green-500 text-white font-medium">
                    ✔ Shortlisted
                  </button>

                  {/* <button
                    onClick={() => {
                      if (!isLocked(pendingUni)) {
                        lockUniversity(pendingUni);
                      }
                      setShowAgentModal(false);
                      setPendingUni(null);
                    }}

                    disabled={isLocked(selectedUni)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center
    ${isLocked(selectedUni)
                        ? "bg-yellow-400 text-white"
                        : "border text-gray-400 hover:bg-gray-100"
                      }`}
                  >
                    <Lock size={18} />
                  </button> */}

                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showAgentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Switch AI Assistance Mode
            </h3>

            <p className="text-sm text-gray-500 mb-6">
              You’re moving from discovery to application stage.
              Choose how the AI should assist you next.
            </p>

            <div className="space-y-4">

              {/* APPLICATION AGENT */}
              <button
                onClick={() => {
                  lockUniversity(pendingUni);
                  setShowAgentModal(false);
                  // optional: navigate("/ai-application-agent");
                }}
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium"
              >
                🤖 AI Application Guidance Agent
                <p className="text-xs opacity-90 mt-1">
                  SOP, documents, deadlines, step-by-step help
                </p>
              </button>

              {/* COUNSELLOR MODE */}
              <button
                onClick={() => {
                  setShowAgentModal(false);
                  setPendingUni(null);
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 font-medium"
              >
                🧭 Continue with AI Counsellor
                <p className="text-xs text-gray-500 mt-1">
                  Stay in discovery & planning mode
                </p>
              </button>

            </div>

            <button
              onClick={() => {
                setShowAgentModal(false);
                setPendingUni(null);
              }}
              className="w-full mt-5 text-sm text-gray-500 hover:text-gray-800"
            >
              Cancel
            </button>

          </div>
        </div>
      )}



    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Stat({ value, label, color }) {
  return (
    <div className={`rounded-2xl p-6 ${color}`}>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm">{label}</p>
    </div>
  );
}

function UniCard({ uni, country, onClick, isShortlisted, isLocked, toggleShortlist, lockUniversity, onLockRequest }) {

  const fitBorderColor = {
    Dream: "border-purple-500",
    Target: "border-blue-400",
    Safe: "border-green-400"
  };


  const CAMPUS_IMAGES = [
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f", // classic university building
    "https://images.unsplash.com/photo-1509062522246-3755977927d7", // modern campus block
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f", // ivy-style university
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1", // iconic campus
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b", // european university building
    "https://images.unsplash.com/photo-1571260899304-425eee4c7efc", // university exterior
    "https://images.unsplash.com/photo-1588072432836-e10032774350", // college campus building
    "https://images.unsplash.com/photo-1588075592446-1a9e8dbff2c9", // academic block
    "https://images.unsplash.com/photo-1588072432904-843af37f03ed", // campus architecture
    "https://images.unsplash.com/photo-1588075592472-0f9a42a66a18", // modern university building

    "https://images.unsplash.com/photo-1519452575417-564c1401ecc0", // university exterior
    "https://images.unsplash.com/photo-1562774053-701939374585", // campus building
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b", // academic campus
    "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a", // university architecture
    "https://images.unsplash.com/photo-1531265726475-52ad60219627", // european campus
    "https://images.unsplash.com/photo-1592066575517-58df903152f2", // university block
    "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b", // modern campus
    "https://images.unsplash.com/photo-1577896851231-70ef18881754", // academic institute
    "https://images.unsplash.com/photo-1564981797816-1043664bf78d", // university exterior
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644", // campus building

    "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9", // institutional building
    "https://images.unsplash.com/photo-1562519819-016930ada31a", // college architecture
    "https://images.unsplash.com/photo-1573164713988-8665fc963095", // modern academic block
    "https://images.unsplash.com/photo-1581091870622-2c0c4c2f7d68", // university campus
    "https://images.unsplash.com/photo-1596495577886-d920f1fb7238", // institutional exterior
    "https://images.unsplash.com/photo-1596495578065-1c1edfa43b54", // campus building
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f", // classic university
    "https://images.unsplash.com/photo-1505761671935-60b3a7427bad", // european university
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1", // global campus
    "https://images.unsplash.com/photo-1506973035872-a4f23f0b1e8a"  // modern university
  ];


  const getCampusImage = (name, country) => {
    let hash = 0;
    const seed = `${country}-${name}`; // 🔥 country + university

    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }

    return CAMPUS_IMAGES[Math.abs(hash) % CAMPUS_IMAGES.length];
  };


  const rawImage = getCampusImage(uni.name, country);

  const image = `${rawImage}?auto=format&fit=crop&w=600&q=60`;


  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-lg p-6 relative border-l-4 
  ${fitBorderColor[uni.fit] || "border-gray-300"}
`}
    >
      {/* TAG */}
      <span className="absolute top-5 right-5 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600">
        {uni.fit}
      </span>

      <img
        src={image}
        onError={(e) => {
          e.currentTarget.src =
            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1";
        }}
        loading="lazy"
        className="w-full h-32 object-cover rounded-xl"
      />




      <h3 className="font-semibold text-gray-900">{uni.name}</h3>

      <p className="flex items-center gap-2 text-sm text-gray-500 mt-1">
        <MapPin size={14} /> {country}
      </p>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-100 rounded-xl p-2 text-center">
          <p className="text-xl font-bold">{uni.matchScore}%</p>

          <p className="text-xs text-gray-500">Match</p>
        </div>

        <div className="bg-gray-100 rounded-xl p-2 text-center">
          <p className="text-xl font-bold">#{uni.ranking}</p>
          <p className="text-xs text-gray-500">Ranking</p>
        </div>
      </div>


      <p className="mt-4 text-gray-700 font-medium">
        ${uni.tuition.toLocaleString()}/year
      </p>

      <div className="flex gap-3 mt-5">
        {!isShortlisted(uni) ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleShortlist(uni);
            }} className="flex-1 py-1.5 rounded-xl bg-gray-100"
          >
            + Shortlist
          </button>
        ) : (
          <div className="flex w-full gap-3">
            <button className=" w-[70%] py-1.5 rounded-xl bg-green-500 text-white">
              ✔ Shortlisted
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onLockRequest(uni);
              }} className={` w-[20%] py-1.5 rounded-xl ${isLocked(uni) ? "bg-yellow-400 text-white" : "bg-red-600 text-white"}`}
            >
              🔒 {isLocked(uni) ? "" : ""}
            </button>
          </div>
        )}


      </div>


    </div>
  );
}


function ModalStat({ value, label, color = "gray" }) {
  const colors = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600"
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-600"
    },
    orange: {
      bg: "bg-orange-50",
      text: "text-orange-600"
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600"
    },
    gray: {
      bg: "bg-gray-50",
      text: "text-gray-700"
    }
  };

  const selected = colors[color] || colors.gray;

  return (
    <div className={`rounded-xl p-4 text-center ${selected.bg}`}>
      <p className={`text-xl font-bold ${selected.text}`}>
        {value}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        {label}
      </p>
    </div>
  );
}

