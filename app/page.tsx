
"use client";

import { useEffect, useMemo, useState } from "react";

type Profile = {
  id: number;
  name: string;
  age: number;
  gender: string;
  city: string;
  distance: number;
  bio: string;
  photo: string;
  photos: string[];
  interests: string[];
  education: string;
  occupation: string;
  height: string;
  languages: string[];
  goal: string;
  verified: boolean;
  online: boolean;
  likedByUser?: boolean;
};

type Message = {
  id: number;
  text: string;
  time: string;
  sender: "You" | "Them";
  read?: boolean;
  reaction?: string;
};

type Post = {
  id: number;
  author: string;
  photo: string;
  image: string;
  caption: string;
  likes: number;
};

const demoProfiles: Profile[] = [
  {
    id: 1, name: "Aarav", age: 23, gender: "Male",
    city: "Hyderabad", distance: 3, bio: "Coffee, travel and meaningful conversations.",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800",
    photos: [], interests: ["Travel", "Music", "Coffee"],
    education: "University graduate", occupation: "Designer",
    height: "5'10", languages: ["English", "Hindi"],
    goal: "Long-term relationship", verified: true, online: true
  },
  {
    id: 2, name: "Ananya", age: 22, gender: "Female",
    city: "Bangalore", distance: 5, bio: "Here to meet genuine people and make connections.",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800",
    photos: [], interests: ["Gaming", "Music", "Sports"],
    education: "B.Tech", occupation: "Student",
    height: "5'5", languages: ["English", "Hindi"],
    goal: "Meaningful connection", verified: false, online: true
  },
  {
    id: 3, name: "Ishaan", age: 24, gender: "Male",
    city: "Jamshedpur", distance: 8, bio: "Adventure lover. Always looking for new experiences.",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800",
    photos: [], interests: ["Fitness", "Travel", "Photography"],
    education: "MBA", occupation: "Business",
    height: "6'0", languages: ["English", "Hindi"],
    goal: "Long-term relationship", verified: true, online: false
  },
  {
    id: 4, name: "Priya", age: 21, gender: "Female",
    city: "Pune", distance: 12, bio: "Books, sunsets and spontaneous road trips.",
    photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800",
    photos: [], interests: ["Books", "Travel", "Art"],
    education: "College student", occupation: "Student",
    height: "5'4", languages: ["English", "Hindi"],
    goal: "Friendship first", verified: true, online: true
  },
  {
    id: 5, name: "Kabir", age: 25, gender: "Male",
    city: "Delhi", distance: 18, bio: "Entrepreneur, foodie and fitness enthusiast.",
    photo: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=800",
    photos: [], interests: ["Business", "Fitness", "Food"],
    education: "Graduate", occupation: "Entrepreneur",
    height: "5'11", languages: ["English", "Hindi"],
    goal: "Long-term relationship", verified: false, online: true
  },
  {
    id: 6, name: "Meera", age: 23, gender: "Female",
    city: "Ranchi", distance: 22, bio: "Music is my love language.",
    photo: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800",
    photos: [], interests: ["Music", "Dance", "Movies"],
    education: "B.A.", occupation: "Artist",
    height: "5'6", languages: ["English", "Hindi"],
    goal: "Meaningful connection", verified: true, online: false
  },
  {
    id: 7, name: "Rohan", age: 22, gender: "Male",
    city: "Kolkata", distance: 25, bio: "Tech geek and weekend explorer.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    photos: [], interests: ["Technology", "Gaming", "Travel"],
    education: "B.Tech", occupation: "Developer",
    height: "5'9", languages: ["English", "Hindi", "Bengali"],
    goal: "Friendship first", verified: false, online: true
  },
  {
    id: 8, name: "Sara", age: 24, gender: "Female",
    city: "Mumbai", distance: 30, bio: "Making memories one city at a time.",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
    photos: [], interests: ["Travel", "Fashion", "Food"],
    education: "Graduate", occupation: "Marketing",
    height: "5'5", languages: ["English", "Hindi"],
    goal: "Long-term relationship", verified: true, online: true
  }
];

const initialPosts: Post[] = [
  {
    id: 1, author: "Ananya",
    photo: demoProfiles[1].photo,
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1000",
    caption: "Chasing sunsets and good vibes 🌅",
    likes: 124
  },
  {
    id: 2, author: "Ishaan",
    photo: demoProfiles[2].photo,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000",
    caption: "Weekend adventures!",
    likes: 86
  }
];

const tabs = [
  ["Discover", "♡"],
  ["Nearby", "⌖"],
  ["Map", "◎"],
  ["Stories", "◉"],
  ["Feed", "▤"],
  ["Matches", "♥"],
  ["Messages", "✉"],
  ["Profile", "☺"],
  ["Premium", "✦"]
];

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default function Home() {
  const [tab, setTab] = useState("Discover");
  const [profiles, setProfiles] = useState<Profile[]>(demoProfiles);
  const [swiped, setSwiped] = useState<number[]>([]);
  const [liked, setLiked] = useState<number[]>([]);
  const [matches, setMatches] = useState<number[]>([]);
  const [messages, setMessages] = useState<Record<number, Message[]>>({});
  const [selected, setSelected] = useState<Profile | null>(null);
  const [chatId, setChatId] = useState<number | null>(null);
  const [chatText, setChatText] = useState("");
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [storiesSeen, setStoriesSeen] = useState<number[]>([]);
  const [stories, setStories] = useState<number[]>([]);
  const [showStory, setShowStory] = useState<Profile | null>(null);
  const [showLogin, setShowLogin] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState("Login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(35);
  const [genderFilter, setGenderFilter] = useState("Everyone");
  const [interestFilter, setInterestFilter] = useState("All");
  const [maxDistance, setMaxDistance] = useState(50);
  const [rewind, setRewind] = useState<number | null>(null);
  const [blocked, setBlocked] = useState<number[]>([]);
  const [reported, setReported] = useState<number[]>([]);
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState("");
  const [profileBio, setProfileBio] = useState("Here to make meaningful connections.");
  const [profileName, setProfileName] = useState("Your Name");
  const [profileAge, setProfileAge] = useState("22");
  const [profileGender, setProfileGender] = useState("Prefer not to say");
  const [profileCity, setProfileCity] = useState("Jamshedpur");
  const [profileHeight, setProfileHeight] = useState("5'8");
  const [profileEducation, setProfileEducation] = useState("Undergraduate");
  const [profileOccupation, setProfileOccupation] = useState("Student");
  const [profileGoal, setProfileGoal] = useState("Long-term relationship");
  const [profileInterests, setProfileInterests] = useState("Music, Travel, Technology");
  const [personalityAnswers, setPersonalityAnswers] = useState<string[]>([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showPhotoVerification, setShowPhotoVerification] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [premiumPlan, setPremiumPlan] = useState("Gold");
  const [storyText, setStoryText] = useState("");
  const [typing, setTyping] = useState(false);
  const [showCall, setShowCall] = useState("");

  useEffect(() => {
    setSwiped(readStorage("salt-swiped", []));
    setLiked(readStorage("salt-liked", []));
    setMatches(readStorage("salt-matches", []));
    setMessages(readStorage("salt-messages", {}));
    setPosts(readStorage("salt-posts", initialPosts));
    setStoriesSeen(readStorage("salt-stories-seen", []));
    setBlocked(readStorage("salt-blocked", []));
    setReported(readStorage("salt-reported", []));
    setStories(readStorage("salt-stories", []));
    setProfileName(localStorage.getItem("salt-name") || "Your Name");
    setProfileBio(localStorage.getItem("salt-bio") || "Here to make meaningful connections.");
  }, []);

  useEffect(() => saveStorage("salt-swiped", swiped), [swiped]);
  useEffect(() => saveStorage("salt-liked", liked), [liked]);
  useEffect(() => saveStorage("salt-matches", matches), [matches]);
  useEffect(() => saveStorage("salt-messages", messages), [messages]);
  useEffect(() => saveStorage("salt-posts", posts), [posts]);
  useEffect(() => saveStorage("salt-stories-seen", storiesSeen), [storiesSeen]);
  useEffect(() => saveStorage("salt-blocked", blocked), [blocked]);
  useEffect(() => saveStorage("salt-reported", reported), [reported]);
  useEffect(() => saveStorage("salt-stories", stories), [stories]);

  const available = useMemo(() => profiles.filter((p) =>
    !swiped.includes(p.id) &&
    !blocked.includes(p.id) &&
    p.age >= minAge &&
    p.age <= maxAge &&
    p.distance <= maxDistance &&
    (genderFilter === "Everyone" || p.gender === genderFilter) &&
    (interestFilter === "All" || p.interests.includes(interestFilter)) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.city.toLowerCase().includes(search.toLowerCase()))
  ), [profiles, swiped, blocked, minAge, maxAge, maxDistance, genderFilter, interestFilter, search]);

  const current = available[0];
  const matchedProfiles = profiles.filter((p) => matches.includes(p.id));
  const activeChat = profiles.find((p) => p.id === chatId);

  function notify(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }

  async function swipe(action: "like" | "pass", profile = current) {
    if (!profile) return;

    const newSwiped = [...swiped, profile.id];
    setSwiped(newSwiped);

    if (action === "like") {
      const newLiked = [...liked, profile.id];
      setLiked(newLiked);

      // Seeded demo mutual likes.
      if (profile.likedByUser || [3, 8].includes(profile.id)) {
        setMatches((old) => old.includes(profile.id) ? old : [...old, profile.id]);
        notify("💗 It's a match with " + profile.name + "!");
      } else {
        notify("Like sent!");
      }
    } else {
      notify("Profile passed.");
    }

    // Connect to your existing backend when available.
    try {
      await fetch("/api/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: profile.id, action })
      });
    } catch {
      // Local demo remains usable without the backend.
    }
  }

  function undoSwipe() {
    if (!swiped.length) {
      notify("Nothing to rewind yet.");
      return;
    }
    const last = swiped[swiped.length - 1];
    setSwiped((old) => old.slice(0, -1));
    setLiked((old) => old.filter((id) => id !== last));
    setRewind(last);
    notify("Last swipe undone.");
  }

  function sendMessage() {
    if (!chatId || !chatText.trim()) return;

    const msg: Message = {
      id: Date.now(),
      text: chatText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sender: "You",
      read: true
    };

    setMessages((old) => ({
      ...old,
      [chatId]: [...(old[chatId] || []), msg]
    }));
    setChatText("");
    setTyping(false);
  }

  function addPost() {
    if (!postText.trim() && !postImage.trim()) {
      notify("Add a caption or image first.");
      return;
    }

    setPosts((old) => [{
      id: Date.now(),
      author: profileName,
      photo: demoProfiles[0].photo,
      image: postImage || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000",
      caption: postText,
      likes: 0
    }, ...old]);

    setPostText("");
    setPostImage("");
    notify("Your post has been published!");
  }

  function saveProfile() {
    localStorage.setItem("salt-name", profileName);
    localStorage.setItem("salt-bio", profileBio);
    notify("Profile saved on this device.");
  }

  function addStory() {
    setStories((old) => [...old, Date.now()]);
    setStoryText("");
    notify("Your demo story has been added.");
  }

  function reportProfile(id: number) {
    setReported((old) => [...old, id]);
    setShowReport(false);
    notify("Report submitted in demo mode.");
  }

  function deleteAccount() {
    if (!confirm("Delete your local demo account and its saved data?")) return;
    Object.keys(localStorage).filter((key) => key.startsWith("salt-")).forEach((key) => localStorage.removeItem(key));
    window.location.reload();
  }

  const panel = "rounded-3xl border border-pink-100 bg-white p-5 shadow-sm";
  const primary = "rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-3 font-bold text-white shadow-md transition hover:scale-[1.02]";
  const secondary = "rounded-full border border-pink-200 bg-white px-5 py-3 font-bold text-pink-600 transition hover:bg-pink-50";
  const field = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-pink-400";

  return (
    <main className="min-h-screen bg-[#faf7f9] text-[#211d24]">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-pink-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <button onClick={() => setTab("Discover")} className="text-left">
            <div className="text-3xl font-black tracking-tight">salt<span className="text-pink-500">.</span></div>
            <div className="text-[9px] font-bold uppercase tracking-[3px] text-gray-400">Find your connection</div>
          </button>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-green-50 px-3 py-2 text-xs font-bold text-green-600 sm:inline">● Demo mode</span>
            <button onClick={() => setShowSettings(true)} className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold">⚙</button>
            <button onClick={() => setShowLogin(true)} className="rounded-full bg-pink-50 px-4 py-2 text-sm font-bold text-pink-600">Account</button>
          </div>
        </div>
      </header>

      {/* NAVIGATION */}
      <nav className="sticky top-[65px] z-20 border-b border-pink-100 bg-white px-2 py-2">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto">
          {tabs.map(([name, icon]) => (
            <button key={name} onClick={() => setTab(name)}
              className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-bold transition ${tab === name ? "bg-[#251e29] text-white" : "text-gray-500 hover:bg-pink-50"}`}>
              <span className="mr-1">{icon}</span>{name}
              {name === "Matches" && matches.length > 0 ? ` (${matches.length})` : ""}
            </button>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-7">
        {/* DISCOVER */}
        {tab === "Discover" && (
          <section>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[3px] text-pink-500">Your next connection</p>
                <h1 className="mt-1 text-4xl font-black">Discover</h1>
                <p className="mt-2 text-sm text-gray-500">Meet people who share your interests.</p>
              </div>
              <div className="flex gap-2">
                <button className={secondary} onClick={() => setShowFilters(!showFilters)}>⚙ Filters</button>
                <button className={secondary} onClick={undoSwipe}>↶ Rewind</button>
              </div>
            </div>

            {showFilters && (
              <div className={`${panel} mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4`}>
                <label className="text-xs font-bold">Minimum age: {minAge}
                  <input className="mt-2 w-full accent-pink-500" type="range" min="18" max="35" value={minAge} onChange={(e) => setMinAge(Number(e.target.value))}/>
                </label>
                <label className="text-xs font-bold">Maximum age: {maxAge}
                  <input className="mt-2 w-full accent-pink-500" type="range" min="18" max="50" value={maxAge} onChange={(e) => setMaxAge(Number(e.target.value))}/>
                </label>
                <label className="text-xs font-bold">Gender preference
                  <select className={`${field} mt-2`} value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
                    <option>Everyone</option><option>Male</option><option>Female</option>
                  </select>
                </label>
                <label className="text-xs font-bold">Interest
                  <select className={`${field} mt-2`} value={interestFilter} onChange={(e) => setInterestFilter(e.target.value)}>
                    {["All","Music","Travel","Gaming","Sports","Fitness","Technology","Books","Photography"].map(x => <option key={x}>{x}</option>)}
                  </select>
                </label>
                <label className="text-xs font-bold sm:col-span-2">Maximum distance: {maxDistance} km
                  <input className="mt-2 w-full accent-pink-500" type="range" min="1" max="100" value={maxDistance} onChange={(e) => setMaxDistance(Number(e.target.value))}/>
                </label>
                <label className="text-xs font-bold sm:col-span-2">Search by name or city
                  <input className={`${field} mt-2`} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search profiles..."/>
                </label>
              </div>
            )}

            {current ? (
              <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-[1fr_0.8fr]">
                <div className="relative overflow-hidden rounded-[32px] bg-white shadow-xl">
                  <img src={current.photo} alt={current.name} className="h-[540px] w-full object-cover"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/10"/>
                  <div className="absolute left-5 top-5 flex gap-2">
                    {current.verified && <span className="rounded-full bg-blue-500 px-3 py-2 text-xs font-bold text-white">✓ Verified</span>}
                    {current.online && <span className="rounded-full bg-green-500 px-3 py-2 text-xs font-bold text-white">● Online</span>}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/70">Suggested for you</p>
                    <h2 className="mt-2 text-4xl font-black">{current.name}, {current.age}</h2>
                    <p className="mt-2 text-sm">📍 {current.city} · {current.distance} km away</p>
                    <p className="mt-4 text-sm leading-6 text-white/90">{current.bio}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {current.interests.map(i => <span key={i} className="rounded-full bg-white/20 px-3 py-2 text-xs font-bold backdrop-blur">{i}</span>)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-4">
                  <div className={panel}>
                    <h3 className="text-xl font-black">A little more about {current.name}</h3>
                    <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                      <div><p className="text-xs text-gray-400">Education</p><b>{current.education}</b></div>
                      <div><p className="text-xs text-gray-400">Occupation</p><b>{current.occupation}</b></div>
                      <div><p className="text-xs text-gray-400">Height</p><b>{current.height}</b></div>
                      <div><p className="text-xs text-gray-400">Languages</p><b>{current.languages.join(", ")}</b></div>
                    </div>
                    <div className="mt-5 border-t pt-4">
                      <p className="text-xs text-gray-400">Looking for</p>
                      <b>{current.goal}</b>
                    </div>
                    <button className={`${secondary} mt-5 w-full`} onClick={() => setSelected(current)}>View full profile →</button>
                  </div>
                  <div className="flex items-center justify-center gap-6">
                    <button onClick={() => swipe("pass")} className="flex h-16 w-16 items-center justify-center rounded-full border bg-white text-3xl text-gray-500 shadow-lg hover:text-red-500">✕</button>
                    <button onClick={() => swipe("like")} className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-4xl text-white shadow-xl">♥</button>
                  </div>
                  <p className="text-center text-xs text-gray-400">Swipe left to pass · Swipe right to like</p>
                </div>
              </div>
            ) : (
              <div className={`${panel} mx-auto max-w-lg py-16 text-center`}>
                <div className="text-6xl">🌸</div>
                <h2 className="mt-4 text-2xl font-black">You're all caught up!</h2>
                <p className="mt-2 text-sm text-gray-500">Try changing your filters or come back later.</p>
                <button className={`${primary} mt-5`} onClick={() => {setSwiped([]); setSearch("");}}>Reset demo feed</button>
              </div>
            )}
          </section>
        )}

        {/* NEARBY */}
        {tab === "Nearby" && (
          <section>
            <p className="text-xs font-black uppercase tracking-[3px] text-pink-500">Meet people around you</p>
            <h1 className="mt-1 text-4xl font-black">People Nearby</h1>
            <p className="mt-2 text-sm text-gray-500">Sample distances for this demo. Live GPS is not connected.</p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {profiles.filter(p => !blocked.includes(p.id)).sort((a,b) => a.distance-b.distance).map(p => (
                <button key={p.id} onClick={() => setSelected(p)} className="flex items-center gap-4 rounded-3xl bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative">
                    <img src={p.photo} className="h-20 w-20 rounded-2xl object-cover" alt={p.name}/>
                    {p.online && <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-white bg-green-500"/>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <b>{p.name}, {p.age} {p.verified ? "✓" : ""}</b>
                    <p className="mt-1 text-xs text-gray-500">{p.city}</p>
                    <p className="mt-1 text-xs font-bold text-pink-500">{p.distance} km away</p>
                  </div>
                  <span className="text-xl text-pink-500">›</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* MAP */}
        {tab === "Map" && (
          <section>
            <p className="text-xs font-black uppercase tracking-[3px] text-pink-500">Explore your area</p>
            <h1 className="mt-1 text-4xl font-black">salt Map</h1>
            <p className="mt-2 text-sm text-gray-500">Illustrative map-style discovery. No live location is being shared.</p>
            <div className="relative mt-7 h-[540px] overflow-hidden rounded-[32px] border border-pink-100 bg-[#e7eee5]">
              <div className="absolute inset-0 opacity-40" style={{backgroundImage:"linear-gradient(35deg,transparent 45%,white 46%,white 49%,transparent 50%),linear-gradient(120deg,transparent 45%,white 46%,white 49%,transparent 50%)",backgroundSize:"100px 100px"}}/>
              <div className="absolute left-[42%] top-0 h-full w-5 rotate-12 bg-white/80"/>
              <div className="absolute left-0 top-[55%] h-5 w-full -rotate-6 bg-white/80"/>
              <div className="absolute left-[15%] top-[20%] rounded-full bg-green-200/70 p-8 text-xs font-bold text-green-800">Park</div>
              <div className="absolute right-[12%] top-[55%] rounded-full bg-blue-100 p-8 text-xs font-bold text-blue-700">Lake</div>
              {profiles.filter(p => !blocked.includes(p.id)).map((p,i) => (
                <button key={p.id} onClick={() => setSelected(p)} style={{left:`${12+(i*17)%75}%`,top:`${15+(i*23)%70}%`}} className="absolute -translate-x-1/2 -translate-y-1/2">
                  <div className="rounded-full border-4 border-white shadow-xl">
                    <img src={p.photo} alt={p.name} className="h-14 w-14 rounded-full object-cover"/>
                  </div>
                  <span className="mt-1 block rounded-full bg-white px-2 py-1 text-[10px] font-black shadow">{p.name}</span>
                </button>
              ))}
              <div className="absolute bottom-4 left-4 rounded-2xl bg-white/90 p-3 text-xs font-bold shadow">◎ Sample discovery map</div>
            </div>
          </section>
        )}

        {/* STORIES */}
        {tab === "Stories" && (
          <section>
            <p className="text-xs font-black uppercase tracking-[3px] text-pink-500">Moments that disappear</p>
            <h1 className="mt-1 text-4xl font-black">Stories</h1>
            <div className="mt-6 flex gap-4 overflow-x-auto pb-3">
              <button onClick={() => {const value=prompt("Write your demo story"); if(value){setStoryText(value);addStory();}}} className="flex min-w-24 flex-col items-center gap-2">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-pink-400 bg-pink-50 text-3xl">＋</div>
                <span className="text-xs font-bold">Your story</span>
              </button>
              {profiles.map(p => (
                <button key={p.id} onClick={() => {setShowStory(p);setStoriesSeen(old=>[...old,p.id]);}} className="flex min-w-24 flex-col items-center gap-2">
                  <div className={`rounded-full p-1 ${storiesSeen.includes(p.id)?"bg-gray-300":"bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500"}`}>
                    <img src={p.photo} alt={p.name} className="h-[72px] w-[72px] rounded-full border-2 border-white object-cover"/>
                  </div>
                  <span className="text-xs font-bold">{p.name}</span>
                </button>
              ))}
            </div>
            <div className={`${panel} mt-6`}>
              <h3 className="text-lg font-black">Create a story</h3>
              <textarea className={`${field} mt-3`} rows={3} value={storyText} onChange={e=>setStoryText(e.target.value)} placeholder="Share a moment..."/>
              <button className={`${primary} mt-3`} onClick={addStory}>Publish story</button>
              <p className="mt-3 text-xs text-gray-400">Stories are simulated and do not automatically expire in this demo.</p>
            </div>
          </section>
        )}

        {/* FEED */}
        {tab === "Feed" && (
          <section className="mx-auto max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[3px] text-pink-500">Community</p>
            <h1 className="mt-1 text-4xl font-black">salt Feed</h1>
            <div className={`${panel} mt-6`}>
              <h3 className="font-black">Share something with the community</h3>
              <textarea className={`${field} mt-3`} rows={3} value={postText} onChange={e=>setPostText(e.target.value)} placeholder="What's happening?"/>
              <input className={`${field} mt-3`} value={postImage} onChange={e=>setPostImage(e.target.value)} placeholder="Image URL (optional)"/>
              <button className={`${primary} mt-3`} onClick={addPost}>＋ Publish post</button>
            </div>
            <div className="mt-6 space-y-6">
              {posts.map(post => (
                <article key={post.id} className="overflow-hidden rounded-3xl bg-white shadow-sm">
                  <div className="flex items-center gap-3 p-4">
                    <img src={post.photo} alt={post.author} className="h-11 w-11 rounded-full object-cover"/>
                    <div className="flex-1"><b>{post.author}</b><p className="text-xs text-gray-400">salt community</p></div>
                    <button onClick={()=>notify("Post options opened in demo.")}>•••</button>
                  </div>
                  <img src={post.image} alt="Post" className="max-h-[500px] w-full object-cover"/>
                  <div className="p-5">
                    <button onClick={()=>setPosts(old=>old.map(p=>p.id===post.id?{...p,likes:p.likes+1}:p))} className="text-xl text-pink-500">♥</button>
                    <b className="ml-2 text-sm">{post.likes} likes</b>
                    <p className="mt-3 text-sm"><b>{post.author}</b> {post.caption}</p>
                    <button className="mt-3 text-xs font-bold text-gray-400" onClick={()=>notify("Comments are a visual demo feature.")}>View comments · Comment</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* MATCHES */}
        {tab === "Matches" && (
          <section>
            <p className="text-xs font-black uppercase tracking-[3px] text-pink-500">Mutual connections only</p>
            <h1 className="mt-1 text-4xl font-black">Your Matches</h1>
            <p className="mt-2 text-sm text-gray-500">Only people who mutually liked you appear here.</p>
            {matchedProfiles.length === 0 ? (
              <div className={`${panel} mx-auto mt-8 max-w-md py-12 text-center`}>
                <div className="text-6xl">💌</div><h2 className="mt-4 text-2xl font-black">No matches yet</h2>
                <button className={`${primary} mt-5`} onClick={()=>setTab("Discover")}>Discover people</button>
              </div>
            ) : (
              <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {matchedProfiles.map(p => (
                  <div key={p.id} className="overflow-hidden rounded-3xl bg-white shadow-sm">
                    <button className="w-full" onClick={()=>setSelected(p)}><img src={p.photo} alt={p.name} className="h-64 w-full object-cover"/></button>
                    <div className="p-5"><b className="text-xl">{p.name}, {p.age}</b><p className="mt-1 text-sm text-gray-500">{p.city}</p><p className="mt-2 text-xs font-bold text-pink-500">♥ It's a mutual match</p>
                      <button className={`${primary} mt-4 w-full`} onClick={()=>setChatId(p.id)}>Message ✉</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* MESSAGES */}
        {tab === "Messages" && (
          <section>
            <p className="text-xs font-black uppercase tracking-[3px] text-pink-500">Your conversations</p>
            <h1 className="mt-1 text-4xl font-black">Messages</h1>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {matchedProfiles.map(p=>(
                <button key={p.id} onClick={()=>setChatId(p.id)} className="flex items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm">
                  <img src={p.photo} alt={p.name} className="h-14 w-14 rounded-full object-cover"/>
                  <div className="flex-1"><b>{p.name}</b><p className="mt-1 text-xs text-gray-400">{messages[p.id]?.at(-1)?.text || "Start a conversation"}</p></div>
                  <span className="text-pink-500">›</span>
                </button>
              ))}
            </div>
            {matchedProfiles.length===0 && <p className="mt-8 text-center text-sm text-gray-500">Your mutual matches will appear here.</p>}
          </section>
        )}

        {/* PROFILE */}
        {tab === "Profile" && (
          <section className="mx-auto max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[3px] text-pink-500">Your identity</p>
            <h1 className="mt-1 text-4xl font-black">My Profile</h1>
            <div className={`${panel} mt-6`}>
              <div className="flex flex-wrap items-center gap-5">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500" alt="Profile" className="h-28 w-28 rounded-full object-cover"/>
                <div><h2 className="text-2xl font-black">{profileName}</h2><p className="text-sm text-gray-500">{profileCity} · {profileAge}</p><button className="mt-2 text-xs font-bold text-blue-500" onClick={()=>setShowPhotoVerification(true)}>✓ Request photo verification</button></div>
              </div>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold">Name<input className={`${field} mt-2`} value={profileName} onChange={e=>setProfileName(e.target.value)}/></label>
                <label className="text-xs font-bold">Age (18+ only)<input className={`${field} mt-2`} type="number" min="18" value={profileAge} onChange={e=>setProfileAge(e.target.value)}/></label>
                <label className="text-xs font-bold">Gender<select className={`${field} mt-2`} value={profileGender} onChange={e=>setProfileGender(e.target.value)}><option>Prefer not to say</option><option>Male</option><option>Female</option><option>Non-binary</option></select></label>
                <label className="text-xs font-bold">Location<input className={`${field} mt-2`} value={profileCity} onChange={e=>setProfileCity(e.target.value)}/></label>
                <label className="text-xs font-bold">Height<input className={`${field} mt-2`} value={profileHeight} onChange={e=>setProfileHeight(e.target.value)}/></label>
                <label className="text-xs font-bold">Education<input className={`${field} mt-2`} value={profileEducation} onChange={e=>setProfileEducation(e.target.value)}/></label>
                <label className="text-xs font-bold">Occupation<input className={`${field} mt-2`} value={profileOccupation} onChange={e=>setProfileOccupation(e.target.value)}/></label>
                <label className="text-xs font-bold">Relationship goals<select className={`${field} mt-2`} value={profileGoal} onChange={e=>setProfileGoal(e.target.value)}><option>Long-term relationship</option><option>Friendship first</option><option>Meaningful connection</option><option>Still figuring it out</option></select></label>
              </div>
              <label className="mt-4 block text-xs font-bold">Short bio<textarea className={`${field} mt-2`} rows={3} value={profileBio} onChange={e=>setProfileBio(e.target.value)}/></label>
              <label className="mt-4 block text-xs font-bold">Hobbies and interests<input className={`${field} mt-2`} value={profileInterests} onChange={e=>setProfileInterests(e.target.value)}/></label>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="text-xs font-bold">Languages<input className={`${field} mt-2`} defaultValue="English, Hindi"/></label>
                <label className="text-xs font-bold">Lifestyle preferences<input className={`${field} mt-2`} placeholder="Fitness, smoking, pets..."/></label>
                <label className="text-xs font-bold">Instagram<input className={`${field} mt-2`} placeholder="@username"/></label>
                <label className="text-xs font-bold">Spotify<input className={`${field} mt-2`} placeholder="Spotify profile URL"/></label>
              </div>
              <div className="mt-5 rounded-2xl bg-pink-50 p-4">
                <b className="text-sm">Profile photos (up to 9)</b>
                <p className="mt-1 text-xs text-gray-500">Photo upload is represented in this demo by image URL fields.</p>
                <input className={`${field} mt-3`} placeholder="Paste a photo URL"/>
              </div>
              <button className={`${primary} mt-6 w-full`} onClick={saveProfile}>Save profile</button>
              <button className={`${secondary} mt-3 w-full`} onClick={()=>setShowQuestions(true)}>Complete personality questions</button>
            </div>
            <div className={`${panel} mt-5`}>
              <h3 className="font-black">Connected accounts</h3>
              <div className="mt-4 flex flex-wrap gap-3"><button className={secondary} onClick={()=>notify("Instagram connection is a demo.")}>Instagram ↗</button><button className={secondary} onClick={()=>notify("Spotify connection is a demo.")}>Spotify ♫</button></div>
            </div>
          </section>
        )}

        {/* PREMIUM */}
        {tab === "Premium" && (
          <section>
            <div className="rounded-[32px] bg-gradient-to-br from-[#261d32] via-[#55304c] to-pink-600 p-8 text-white sm:p-14">
              <p className="text-xs font-black uppercase tracking-[4px] text-pink-200">salt Plus</p>
              <h1 className="mt-3 text-5xl font-black">More connections.<br/>More possibilities.</h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/80">Explore premium-style features in this demo. No actual payment is taken.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {["Unlimited likes","See who liked you","Advanced filters","Rewind unlimited swipes","Profile boost","Priority recommendations","Travel discovery","Premium badge"].map(x=><div key={x} className="rounded-2xl bg-white/10 p-4 text-sm font-bold">✓ {x}</div>)}
              </div>
            </div>
            <div className="mt-7 grid gap-5 md:grid-cols-3">
              {[
                {name:"Free",price:"₹0",features:"Basic discovery, limited demo likes"},
                {name:"Gold",price:"₹299 / month",features:"Rewind, advanced filters, profile boost"},
                {name:"Platinum",price:"₹599 / month",features:"All Gold features, priority discovery"}
              ].map(plan=>(
                <div key={plan.name} className={`${panel} ${premiumPlan===plan.name?"border-2 border-pink-400":""}`}>
                  <h3 className="text-xl font-black">{plan.name}</h3><p className="mt-3 text-3xl font-black text-pink-500">{plan.price}</p><p className="mt-4 text-sm text-gray-500">{plan.features}</p>
                  <button className={`${premiumPlan===plan.name?primary:secondary} mt-6 w-full`} onClick={()=>{setPremiumPlan(plan.name);notify(plan.name+" demo plan selected. No payment made.");}}>Select {plan.name}</button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* PROFILE DETAIL MODAL */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={()=>setSelected(null)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[30px] bg-white" onClick={e=>e.stopPropagation()}>
            <div className="relative">
              <img src={selected.photo} alt={selected.name} className="h-80 w-full object-cover"/>
              <button onClick={()=>setSelected(null)} className="absolute right-4 top-4 rounded-full bg-black/60 px-4 py-2 text-white">✕</button>
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 pt-16 text-white">
                <h2 className="text-3xl font-black">{selected.name}, {selected.age}</h2>
                <p className="text-sm">📍 {selected.city} · {selected.distance} km</p>
              </div>
            </div>
            <div className="p-6">
              {selected.verified && <span className="rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600">✓ Verified profile</span>}
              <h3 className="mt-5 font-black">About</h3><p className="mt-2 text-sm leading-6 text-gray-600">{selected.bio}</p>
              <h3 className="mt-5 font-black">Interests</h3><div className="mt-3 flex flex-wrap gap-2">{selected.interests.map(i=><span key={i} className="rounded-full bg-pink-50 px-3 py-2 text-xs font-bold text-pink-600">{i}</span>)}</div>
              <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-xs text-gray-400">Education</span><p className="font-bold">{selected.education}</p></div>
                <div><span className="text-xs text-gray-400">Occupation</span><p className="font-bold">{selected.occupation}</p></div>
                <div><span className="text-xs text-gray-400">Height</span><p className="font-bold">{selected.height}</p></div>
                <div><span className="text-xs text-gray-400">Languages</span><p className="font-bold">{selected.languages.join(", ")}</p></div>
              </div>
              <p className="mt-5 text-sm"><b>Relationship goals:</b> {selected.goal}</p>
              <div className="mt-6 flex gap-2"><button className={`${primary} flex-1`} onClick={()=>{setSelected(null);swipe("like",selected);}}>♥ Like</button><button className={secondary} onClick={()=>{setShowReport(true);}}>Report</button><button className={secondary} onClick={()=>{setBlocked(old=>[...old,selected.id]);setSelected(null);notify("Profile blocked.");}}>Block</button></div>
            </div>
          </div>
        </div>
      )}

      {/* CHAT MODAL */}
      {chatId !== null && activeChat && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-3">
          <div className="flex h-[min(700px,92vh)] w-full max-w-lg flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
            <div className="flex items-center gap-3 bg-gradient-to-r from-pink-500 to-rose-500 p-4 text-white">
              <img src={activeChat.photo} alt={activeChat.name} className="h-12 w-12 rounded-full object-cover"/>
              <div className="flex-1"><b>{activeChat.name}</b><p className="text-xs text-white/80">{activeChat.online?"● Online":"Offline"} · Matched</p></div>
              <button onClick={()=>setShowCall("Audio call demo")} className="text-xl">☎</button>
              <button onClick={()=>setShowCall("Video call demo")} className="text-xl">▣</button>
              <button onClick={()=>setChatId(null)} className="text-xl">✕</button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto bg-[#faf7f9] p-4">
              <div className="mx-auto max-w-[250px] rounded-2xl bg-pink-50 p-4 text-center text-sm"><b>💗 It's a match!</b><p className="mt-1 text-xs text-gray-500">Say hello to {activeChat.name}.</p></div>
              {(messages[chatId]||[]).map(msg=>(
                <div key={msg.id} className={`flex ${msg.sender==="You"?"justify-end":"justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.sender==="You"?"rounded-br-sm bg-pink-500 text-white":"rounded-bl-sm bg-white text-gray-700 shadow-sm"}`}>
                    {msg.text}
                    <div className="mt-1 flex items-center justify-end gap-2 text-[10px] opacity-60">{msg.time} {msg.sender==="You"?"✓✓":""}<button onClick={()=>setMessages(old=>({...old,[chatId]:old[chatId].map(m=>m.id===msg.id?{...m,reaction:"❤️"}:m)}))}>♡</button></div>
                    {msg.reaction}
                  </div>
                </div>
              ))}
              {typing && <p className="text-xs text-gray-400">{activeChat.name} is typing...</p>}
            </div>
            <div className="border-t bg-white p-3">
              <div className="mb-2 flex flex-wrap gap-2 text-xs">
                <button className={secondary} onClick={()=>setChatText(t=>t+" 😊")}>GIF / Sticker 😊</button>
                <button className={secondary} onClick={()=>notify("Image sharing is a demo control.")}>▧ Image</button>
                <button className={secondary} onClick={()=>notify("Voice message recording is not connected.")}>🎙 Voice</button>
                <button className={secondary} onClick={()=>setTyping(!typing)}>Typing indicator</button>
              </div>
              <form className="flex gap-2" onSubmit={e=>{e.preventDefault();sendMessage();}}>
                <input className={`${field} flex-1`} value={chatText} onChange={e=>setChatText(e.target.value)} placeholder="Write a message..."/>
                <button className={primary} type="submit">Send</button>
              </form>
              <p className="mt-2 text-center text-[10px] text-gray-400">Local demo chat · Not delivered to another user</p>
              <button className="mt-2 w-full text-xs font-bold text-red-400" onClick={()=>{if(confirm("Unmatch and remove this conversation?")){setMatches(old=>old.filter(id=>id!==chatId));setMessages(old=>{const copy={...old};delete copy[chatId];return copy;});setChatId(null);}}}>Unmatch & delete conversation</button>
            </div>
          </div>
        </div>
      )}

      {/* AUTH MODAL */}
      {showLogin && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[30px] bg-white p-7 shadow-2xl">
            <div className="text-center"><h2 className="text-4xl font-black">salt<span className="text-pink-500">.</span></h2><p className="mt-2 text-sm text-gray-500">Welcome to meaningful connections.</p></div>
            <div className="mt-6 grid grid-cols-2 rounded-full bg-gray-100 p-1">
              {["Login","Register"].map(m=><button key={m} onClick={()=>setAuthMode(m)} className={`rounded-full py-3 text-sm font-bold ${authMode===m?"bg-white text-pink-600 shadow": "text-gray-500"}`}>{m}</button>)}
            </div>
            <div className="mt-5 space-y-3">
              <input className={field} value={authEmail} onChange={e=>setAuthEmail(e.target.value)} placeholder="Email address"/>
              <input className={field} type="password" value={authPassword} onChange={e=>setAuthPassword(e.target.value)} placeholder="Password"/>
              {authMode==="Register" && <><input className={field} placeholder="Date of birth (18+)" type="date"/><p className="text-xs text-gray-400">You must be at least 18 to use salt.</p></>}
              {otpSent && <input className={field} value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Enter demo OTP"/>}
              <button className={`${primary} w-full`} onClick={()=>{if(authMode==="Register" && !otpSent){setOtpSent(true);notify("Demo OTP: 123456");return;} if(authMode==="Register" && otp!=="123456"){notify("Enter demo OTP 123456.");return;}setLoggedIn(true);setShowLogin(false);notify("Demo session started.");}}>{otpSent?"Verify OTP":authMode==="Login"?"Continue":"Create account"}</button>
              <button className={secondary+" w-full"} onClick={()=>{setLoggedIn(true);setShowLogin(false);notify("Google sign-in demo selected.");}}>G Continue with Google</button>
              <button className={secondary+" w-full"} onClick={()=>{setLoggedIn(true);setShowLogin(false);notify("Apple sign-in demo selected.");}}>● Continue with Apple</button>
              <button className="w-full text-xs font-bold text-pink-500" onClick={()=>notify("Password reset email flow is a demo.")}>Forgot password?</button>
            </div>
            <button className="mt-5 w-full text-xs text-gray-400" onClick={()=>setShowLogin(false)}>Continue in demo mode</button>
          </div>
        </div>
      )}

      {/* PERSONALITY QUESTIONS */}
      {showQuestions && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6">
            <div className="flex justify-between"><h2 className="text-2xl font-black">Personality questions</h2><button onClick={()=>setShowQuestions(false)}>✕</button></div>
            {["Your ideal weekend?","What matters most in a relationship?","How do you prefer to communicate?","Choose your perfect first date."].map((q,i)=>(
              <label key={q} className="mt-5 block text-sm font-bold">{q}
                <select className={`${field} mt-2`} value={personalityAnswers[i]||""} onChange={e=>setPersonalityAnswers(old=>{const n=[...old];n[i]=e.target.value;return n;})}>
                  <option value="">Choose an answer</option>
                  {(i===0?["Adventure","Relaxing at home","Meeting friends","Exploring a city"]:i===1?["Trust","Communication","Honesty","Humour"]:i===2?["Texting","Calls","In person","A mix of everything"]:["Coffee","Dinner","Walk in the park","An activity together"]).map(x=><option key={x}>{x}</option>)}
                </select>
              </label>
            ))}
            <button className={`${primary} mt-6 w-full`} onClick={()=>{setShowQuestions(false);notify("Personality answers saved locally.");}}>Save answers</button>
          </div>
        </div>
      )}

      {/* PHOTO VERIFICATION */}
      {showPhotoVerification && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 text-center">
            <div className="text-5xl">📸</div><h2 className="mt-3 text-2xl font-black">Photo verification</h2>
            <p className="mt-3 text-sm leading-6 text-gray-500">A real verification system would compare a live selfie with your profile photos. This demo only displays the verification flow.</p>
            <button className={`${primary} mt-6 w-full`} onClick={()=>{setShowPhotoVerification(false);notify("Demo verification request recorded.");}}>Start demo verification</button>
            <button className="mt-4 text-sm text-gray-400" onClick={()=>setShowPhotoVerification(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* REPORT */}
      {showReport && selected && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-7">
            <h2 className="text-2xl font-black">Report {selected.name}</h2><p className="mt-2 text-sm text-gray-500">Why are you reporting this profile?</p>
            {["Fake profile","Harassment","Inappropriate content","Spam","Underage concern","Other"].map(reason=><button key={reason} className="mt-2 w-full rounded-xl border p-3 text-left text-sm hover:bg-pink-50" onClick={()=>reportProfile(selected.id)}>{reason} →</button>)}
            <button className="mt-4 text-sm text-gray-400" onClick={()=>setShowReport(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* SETTINGS */}
      {showSettings && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-7">
            <div className="flex justify-between"><h2 className="text-2xl font-black">Settings</h2><button onClick={()=>setShowSettings(false)}>✕</button></div>
            <div className="mt-5 space-y-3">
              <button className={`${secondary} w-full`} onClick={()=>notify("Privacy settings demo.")}>Privacy settings</button>
              <button className={`${secondary} w-full`} onClick={()=>notify("Notification settings demo.")}>Notifications</button>
              <button className={`${secondary} w-full`} onClick={()=>notify("Blocked profiles: "+blocked.length)}>Blocked profiles</button>
              <button className={`${secondary} w-full`} onClick={()=>notify("Reported profiles: "+reported.length)}>My reports</button>
              <button className={`${secondary} w-full`} onClick={()=>{setShowSettings(false);setShowLogin(true);}}>Log in / Register</button>
              <button className="w-full rounded-full border border-red-200 py-3 font-bold text-red-500" onClick={deleteAccount}>Delete local demo account</button>
            </div>
            <p className="mt-4 text-xs text-gray-400">This only clears demo data saved in this browser.</p>
          </div>
        </div>
      )}

      {/* STORY VIEWER */}
      {showStory && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black p-4" onClick={()=>setShowStory(null)}>
          <div className="relative h-[80vh] w-full max-w-md overflow-hidden rounded-3xl">
            <img src={showStory.photo} alt={showStory.name} className="h-full w-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
            <div className="absolute left-5 top-5 text-white"><b>{showStory.name}</b><p className="text-xs">salt story · Demo</p></div>
            <div className="absolute bottom-8 left-5 text-white"><h2 className="text-2xl font-black">{showStory.name}'s moment</h2><p className="mt-2 text-sm">Tap anywhere to close</p></div>
          </div>
        </div>
      )}

      {/* CALL DEMO */}
      {showCall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#211d24] p-5 text-center text-white">
          <div><div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-pink-500 text-5xl">☎</div><h2 className="mt-6 text-3xl font-black">{showCall}</h2><p className="mt-3 text-sm text-white/60">Call interface preview. No real call is being placed.</p><button className="mt-8 rounded-full bg-red-500 px-10 py-4 font-bold" onClick={()=>setShowCall("")}>End call</button></div>
        </div>
      )}

      {/* NOTIFICATION */}
      {notice && <div className="fixed bottom-6 left-1/2 z-[120] -translate-x-1/2 rounded-full bg-[#251e29] px-6 py-4 text-center text-sm font-bold text-white shadow-2xl">{notice}</div>}

      <footer className="border-t border-pink-100 bg-white px-5 py-8 text-center">
        <p className="text-2xl font-black">salt<span className="text-pink-500">.</span></p>
        <p className="mt-2 text-xs text-gray-400">Find your connection · salt Demo</p>
        <p className="mt-1 text-[10px] text-gray-300">Demo profiles and features. Not a live dating service.</p>
      </footer>
    </main>
  );
}
