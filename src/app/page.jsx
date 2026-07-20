"use client";

import React, { useState, useEffect, useMemo, useRef, useId } from "react";

/* ------------------------------------------------------------------
   Tiny inline icon set — replaces lucide-react so this file has zero
   extra dependencies to install. Same look, plain SVG.
------------------------------------------------------------------- */
const Heart = ({ size = 14, fill = "none", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
  </svg>
);
const MapPin = ({ size = 14, fill = "none", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const CalendarPlus = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18M12 14v6M9 17h6" />
  </svg>
);
const Send = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z" />
  </svg>
);
const ChevronLeft = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);
const ChevronRight = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M9 18l6-6-6-6" />
  </svg>
);
const Music = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);
const MusicOff = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
    <path d="M2 2l20 20" />
  </svg>
);

/* ------------------------------------------------------------------
   EDIT THESE — everything about the couple, date & venue lives here
------------------------------------------------------------------- */
const CONFIG = {
  groom: "Ahmed",
  bride: "Aya",
  groomFull: "Ahmed Mamdouh Qurtam",
  brideFull: "Aya Nasr Hashish",
  weddingDate: "2026-07-27T20:00:00", // ISO — drives the countdown + calendar
  dateLabel: { weekday: "MONDAY", day: "27", month: "JULY", year: "2026" },
  ceremonyTime: "8:00 PM",
  ceremonyVenue: "Akhenaten Hall",
  ceremonySub: "Ceremonial House for Police Officers",
  receptionTime: "8:00 PM",
  receptionVenue: "Akhenaten Hall",
  receptionSub: "Ceremonial House for Police Officers",
  address: "26WC+QV2, Zamalek, Cairo Governorate 4270104, Egypt",
  mapsUrl: "https://maps.app.goo.gl/Qxobt6Khvy9KZHjf6",
  // Coordinates for the Police Officers Club / Akhenaten Hall — used to
  // center the embedded map preview below.
  venueLat: 30.0473389,
  venueLng: 31.2223459,
  arabicVerse:
    "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ",
  closing: "Your presence would be the greatest gift we could receive!",
  coverSubtitle: "You are invited to celebrate our wedding",

  // --- NEW: put real photo URLs here once you have them. Leave blank
  // ("") to show an elegant monogram placeholder instead of a photo.
  groomPhoto: "/Ahmed.jpeg",
  bridePhoto: "/Aya.jpeg",

  // --- NEW: background music. Paste a direct, hosted mp3/ogg URL here
  // (e.g. from your own file host — browsers can't play links to a
  // streaming-service "song page"). Leave blank to disable music.
  musicUrl: "/Um_Kalthoum.mp3",
};

// Precomputed, fixed date string — deterministic on both server and client
// (no Date.now()/Math.random() involved), so it never causes a hydration mismatch.
const COVER_DATE = new Date(CONFIG.weddingDate).toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

// Fixed (not random) positions/delays for the drifting background leaves —
// randomizing these would differ between server and client render and cause
// a hydration mismatch, same issue as the countdown.
const LEAVES = [
  { left: "8%", top: "6%", size: 16, delay: "0s", dur: "9s" },
  { left: "88%", top: "3%", size: 14, delay: "1.4s", dur: "11s" },
  { left: "20%", top: "70%", size: 12, delay: "2.6s", dur: "10s" },
  { left: "78%", top: "62%", size: 18, delay: "0.8s", dur: "12s" },
  { left: "4%", top: "42%", size: 10, delay: "3.4s", dur: "8s" },
  { left: "94%", top: "34%", size: 13, delay: "2s", dur: "10.5s" },
  { left: "60%", top: "88%", size: 11, delay: "1s", dur: "9.5s" },
];

// NEW — fixed (deterministic) set of petals that fall the full height of
// the dark background, independent from the ambient side leaves above.
const PETALS = [
  { left: "14%", size: 15, delay: "0s", dur: "13s", spin: "340deg" },
  { left: "30%", size: 11, delay: "3s", dur: "16s", spin: "-280deg" },
  { left: "48%", size: 17, delay: "1.5s", dur: "12s", spin: "300deg" },
  { left: "63%", size: 12, delay: "5s", dur: "15s", spin: "-320deg" },
  { left: "75%", size: 14, delay: "2.2s", dur: "14s", spin: "260deg" },
  { left: "85%", size: 10, delay: "6.5s", dur: "17s", spin: "-300deg" },
  { left: "5%", size: 13, delay: "4.2s", dur: "13.5s", spin: "310deg" },
  { left: "40%", size: 9, delay: "7.5s", dur: "11s", spin: "-260deg" },
  { left: "56%", size: 16, delay: "0.8s", dur: "16.5s", spin: "330deg" },
  { left: "93%", size: 12, delay: "3.8s", dur: "14.5s", spin: "-290deg" },
];

/* ------------------------------------------------------------------
   Small original line-art botanical motif (hand-built SVG, not traced
   from any source) — reused as a corner ornament throughout.
------------------------------------------------------------------- */
function Sprig({ className = "", flip = false }) {
  return (
    <svg
      viewBox="0 0 120 160"
      className={className}
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      fill="none"
    >
      <path d="M10 150 C 30 110, 25 70, 60 20" stroke="#9C7A56" strokeWidth="2" strokeLinecap="round" />
      {[
        [60, 20, 34, 6],
        [45, 55, 20, -10],
        [42, 85, 16, 8],
        [36, 115, 22, -6],
        [24, 140, 18, 10],
      ].map(([x, y, w, r], i) => (
        <ellipse
          key={i}
          cx={x}
          cy={y}
          rx={w}
          ry={w / 2.4}
          fill="#C9AE86"
          opacity="0.55"
          transform={`rotate(${r} ${x} ${y})`}
        />
      ))}
      <circle cx="60" cy="20" r="7" fill="#8A5A44" opacity="0.7" />
    </svg>
  );
}

// NEW — a larger, more detailed original botanical motif: a muted dried
// eucalyptus-style branch with a single pale anemone-style bloom (dark
// center, fine radiating stamens). Hand-built shapes/gradients, in the
// same warm brown/cream family as the rest of the invitation, not traced
// from any source image.
function AnemoneSprig({ className = "", flip = false, size = 220 }) {
  const rawId = useId();
  const uid = `ans${rawId.replace(/:/g, "")}`;
  const leafGrad = (id, c1, c2) => (
    <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor={c1} />
      <stop offset="100%" stopColor={c2} />
    </linearGradient>
  );
  return (
    <svg
      viewBox="0 0 240 200"
      width={size}
      height={size * (200 / 240)}
      className={className}
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      fill="none"
    >
      <defs>
        {leafGrad(`${uid}-l1`, "#a9825f", "#6b4232")}
        {leafGrad(`${uid}-l2`, "#c9ae86", "#8a5a44")}
        {leafGrad(`${uid}-l3`, "#8a5a44", "#4a2c1f")}
        {leafGrad(`${uid}-p1`, "#fbf3ea", "#e3cdae")}
        {leafGrad(`${uid}-p2`, "#f3e4d0", "#d8c3a5")}
      </defs>

      {/* main stem */}
      <path d="M6 148 C 60 128, 96 118, 150 78" stroke="#7a5540" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* three lance-shaped leaves fanning from the base, left side */}
      {[
        { d: "M14 150 C -2 108, 10 62, 34 30 C 40 74, 36 116, 26 152 Z", rot: -6, grad: 1 },
        { d: "M30 150 C 22 104, 34 66, 54 40 C 56 82, 50 118, 42 152 Z", rot: 4, grad: 2 },
        { d: "M46 148 C 44 108, 56 74, 78 52 C 76 90, 66 122, 58 150 Z", rot: -3, grad: 3 },
      ].map((leaf, i) => (
        <path
          key={i}
          d={leaf.d}
          fill={`url(#${uid}-l${leaf.grad})`}
          opacity="0.85"
          transform={`rotate(${leaf.rot} 40 100)`}
        />
      ))}

      {/* single pale anemone-style bloom, mid-branch */}
      <g transform="translate(118 96) rotate(-8)">
        {[
          { rx: 26, ry: 40, rot: 0, grad: 1 },
          { rx: 24, ry: 38, rot: 52, grad: 2 },
          { rx: 25, ry: 39, rot: 104, grad: 1 },
          { rx: 23, ry: 37, rot: 156, grad: 2 },
          { rx: 26, ry: 40, rot: 208, grad: 1 },
          { rx: 24, ry: 38, rot: 260, grad: 2 },
          { rx: 25, ry: 39, rot: 312, grad: 1 },
        ].map((p, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-22"
            rx={p.rx}
            ry={p.ry}
            fill={`url(#${uid}-p${p.grad})`}
            opacity="0.92"
            transform={`rotate(${p.rot})`}
          />
        ))}
        {/* dark anemone center */}
        <circle r="13" fill="#241a14" />
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (360 / 16) * i;
          return (
            <line
              key={i}
              x1="0"
              y1="0"
              x2="0"
              y2="-9"
              stroke="#e3cdae"
              strokeWidth="0.8"
              opacity="0.7"
              transform={`rotate(${a})`}
            />
          );
        })}
        <circle r="5" fill="#1a120d" />
      </g>

      {/* eucalyptus-style round leaves along the upper-right branch */}
      {[
        { cx: 152, cy: 76, r: 15, grad: 1 },
        { cx: 176, cy: 60, r: 17, grad: 2 },
        { cx: 200, cy: 66, r: 15, grad: 3 },
        { cx: 168, cy: 92, r: 14, grad: 2 },
        { cx: 192, cy: 90, r: 16, grad: 1 },
      ].map((c, i) => (
        <ellipse
          key={i}
          cx={c.cx}
          cy={c.cy}
          rx={c.r}
          ry={c.r * 1.15}
          fill={`url(#${uid}-l${c.grad})`}
          opacity="0.85"
          transform={`rotate(${(i - 2) * 12} ${c.cx} ${c.cy})`}
        />
      ))}
    </svg>
  );
}

// NEW — a small original open-bloom flower motif (five soft petals + a
// center), used as an extra decorative accent near key sections.
function Bloom({ className = "", size = 46, color = "#B4795A" }) {
  const petals = 5;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="none">
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (360 / petals) * i;
        return (
          <ellipse
            key={i}
            cx="50"
            cy="28"
            rx="14"
            ry="22"
            fill={color}
            opacity="0.55"
            transform={`rotate(${angle} 50 50)`}
          />
        );
      })}
      <circle cx="50" cy="50" r="9" fill="#7A4A34" opacity="0.75" />
    </svg>
  );
}

function Leaf({ className = "", style, size }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} style={style} fill="currentColor">
      <path d="M20 4C10 4 4 10 4 20c10 0 16-6 16-16z" opacity="0.5" />
    </svg>
  );
}

// NEW — a simple five-petal flower silhouette used for the falling-petal
// animation over the dark background.
function Petal({ className = "", style, size }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={className} style={style} fill="currentColor">
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (360 / 5) * i;
        return (
          <ellipse
            key={i}
            cx="20"
            cy="11"
            rx="6"
            ry="10"
            opacity="0.5"
            transform={`rotate(${a} 20 20)`}
          />
        );
      })}
    </svg>
  );
}

// NEW — a horizontal decorative floral band, echoing a pressed-flower
// ribbon. Built from layered Bloom + Sprig motifs on a warm gradient,
// used as the divider behind the couple's photo frames.
function FloralBand({ className = "" }) {
  const flowers = [
    { left: "4%", size: 34, color: "#C9AE86", top: "10%" },
    { left: "16%", size: 44, color: "#8A5A44", top: "45%" },
    { left: "30%", size: 30, color: "#B4795A", top: "5%" },
    { left: "44%", size: 40, color: "#C9AE86", top: "40%" },
    { left: "58%", size: 32, color: "#7A4A34", top: "10%" },
    { left: "70%", size: 42, color: "#B4795A", top: "42%" },
    { left: "83%", size: 34, color: "#C9AE86", top: "8%" },
    { left: "94%", size: 30, color: "#8A5A44", top: "38%" },
  ];
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: "linear-gradient(120deg, #3a2115 0%, #5c3a26 50%, #3a2115 100%)" }}
    >
      {flowers.map((f, i) => (
        <Bloom
          key={i}
          size={f.size}
          color={f.color}
          className="absolute"
          style={{ left: f.left, top: f.top }}
        />
      ))}
      <div className="absolute inset-0 bg-[#1c1008]/10" />
    </div>
  );
}

// NEW — a tilted photo frame: shows a real photo if src is given,
// otherwise an elegant monogram placeholder so the layout still looks
// intentional before real photos are added.
function PhotoFrame({ src, name, rotate = 0, className = "" }) {
  return (
    <div
      className={`relative h-32 w-28 shrink-0 overflow-hidden rounded-md border-2 border-[#8a5a44]/70 bg-[#EFE3D0] shadow-[0_10px_20px_rgba(58,33,21,0.35)] ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-[linear-gradient(160deg,#F3E4D0,#E3CDAE)]">
          <span
            className="font-serif text-3xl text-[#8a5a44]/70"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {name?.[0]}
          </span>
          <Heart size={12} className="text-[#8a5a44]/50" />
        </div>
      )}
    </div>
  );
}

function useCountdown(targetIso) {
  const target = useMemo(() => new Date(targetIso).getTime(), [targetIso]);
  // Start as null so the server render and the first client render match
  // exactly. The real value is filled in after mount, client-side only.
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    const tick = () => setRemaining(Math.max(target - Date.now(), 0));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (remaining === null) {
    return { days: null, hours: null, minutes: null, seconds: null };
  }
  const s = Math.floor(remaining / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

function CountdownBlock({ value, label }) {
  return (
    <div className="flex w-14 flex-col items-center sm:w-16">
      <div
        className="w-full rounded-lg border border-[#c9ae86]/50 bg-[#fffaf3] py-2 text-center font-serif text-lg text-[#4a2c1f] shadow-sm sm:text-xl"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        {value === null ? "--" : String(value).padStart(2, "0")}
      </div>
      <span className="mt-1 text-[10px] tracking-[0.15em] text-[#8a6a4f]">{label}</span>
    </div>
  );
}

function MiniCalendar({ targetIso }) {
  const target = new Date(targetIso);
  const [viewMonth, setViewMonth] = useState(target.getMonth());
  const [viewYear, setViewYear] = useState(target.getFullYear());

  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  // shift so week starts Monday
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [...Array(startOffset).fill(null), ...Array(daysInMonth).keys()].map((d) =>
    d === null ? null : d + 1
  );
  const monthName = firstOfMonth.toLocaleString("en-US", { month: "long" });
  const isTargetMonth = viewMonth === target.getMonth() && viewYear === target.getFullYear();

  const shift = (delta) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setViewMonth(m); setViewYear(y);
  };

  return (
    <div className="mx-auto w-full max-w-xs rounded-xl border border-[#c9ae86]/40 bg-[#fffaf3] p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <button onClick={() => shift(-1)} className="text-[#8a6a4f] hover:text-[#4a2c1f]" aria-label="Previous month">
          <ChevronLeft size={16} />
        </button>
        <span className="font-serif text-sm tracking-wide text-[#4a2c1f]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {monthName} {viewYear}
        </span>
        <button onClick={() => shift(1)} className="text-[#8a6a4f] hover:text-[#4a2c1f]" aria-label="Next month">
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-[#a9825f]">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d, i) =>
          d === null ? (
            <span key={i} />
          ) : (
            <span
              key={i}
              className={`flex h-7 items-center justify-center rounded-full text-xs ${
                isTargetMonth && d === target.getDate()
                  ? "bg-[#4a2c1f] font-semibold text-[#f3e6d8]"
                  : "text-[#5c4632]"
              }`}
            >
              {isTargetMonth && d === target.getDate() ? <Heart size={12} fill="currentColor" /> : d}
            </span>
          )
        )}
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="mx-auto my-6 flex w-24 items-center gap-2 text-[#c9ae86]">
      <span className="h-px flex-1 bg-[#c9ae86]/60" />
      <Heart size={10} fill="currentColor" />
      <span className="h-px flex-1 bg-[#c9ae86]/60" />
    </div>
  );
}

// Fades + slides a section into place the first time it scrolls into view.
// Starts identically on server and client (opacity 0, not yet visible), so
// there's no hydration mismatch — the reveal only ever happens after mount,
// driven by IntersectionObserver, which doesn't exist during SSR.
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// Safe wrappers around window.storage — every call is try/caught since a
// missing key throws rather than returning null, and storage may not be
// available at all outside the Claude.ai artifact runtime.
async function storageGetJSON(key, shared, fallback) {
  try {
    if (!window.storage) return fallback;
    const res = await window.storage.get(key, shared);
    if (!res) return fallback;
    return JSON.parse(res.value);
  } catch {
    return fallback;
  }
}
async function storageSetJSON(key, value, shared) {
  try {
    if (!window.storage) return false;
    await window.storage.set(key, JSON.stringify(value), shared);
    return true;
  } catch {
    return false;
  }
}

export default function WeddingInvitation() {
  const [stage, setStage] = useState("cover"); // "cover" -> "closing" -> "open"
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpAttending, setRsvpAttending] = useState("yes");
  const [rsvpGuests, setRsvpGuests] = useState(1);
  const [confirmed, setConfirmed] = useState(null);
  const [allRsvps, setAllRsvps] = useState([]);

  const [wishName, setWishName] = useState("");
  const [wishText, setWishText] = useState("");
  const [wishes, setWishes] = useState([]);
  const [wishesLoaded, setWishesLoaded] = useState(false);

  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef(null);

  const { days, hours, minutes, seconds } = useCountdown(CONFIG.weddingDate);
  const scrollRef = useRef(null);

  // Load persisted guestbook wishes + this browser's own RSVP once, on
  // mount. Wishes are shared (every guest sees the same guestbook); the
  // "myRsvp" flag is personal so each guest's own confirmation banner
  // survives a reload without leaking who anyone else replied as.
  useEffect(() => {
    (async () => {
      const savedWishes = await storageGetJSON("wishes", true, null);
      if (savedWishes && Array.isArray(savedWishes)) setWishes(savedWishes);
      setWishesLoaded(true);

      const savedRsvps = await storageGetJSON("rsvps", true, []);
      setAllRsvps(Array.isArray(savedRsvps) ? savedRsvps : []);

      const mine = await storageGetJSON("myRsvp", false, null);
      if (mine) setConfirmed(mine);
    })();
  }, []);

  useEffect(() => {
    if (stage === "closing") {
      const t = setTimeout(() => setStage("open"), 550);
      return () => clearTimeout(t);
    }
  }, [stage]);

  // Try to start the music the moment the invitation opens. Browsers only
  // allow audio.play() reliably right after a user gesture, so this piggy-
  // backs on the click that opened the card.
  const openInvitation = () => {
    if (stage !== "cover") return;
    setStage("closing");
    if (CONFIG.musicUrl && audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current
        .play()
        .then(() => setMusicOn(true))
        .catch(() => setMusicOn(false));
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicOn) {
      audioRef.current.pause();
      setMusicOn(false);
    } else {
      audioRef.current.play().then(() => setMusicOn(true)).catch(() => {});
    }
  };

  const submitRsvp = async (e) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;
    const entry = {
      name: rsvpName,
      attending: rsvpAttending,
      guests: rsvpGuests,
      time: new Date().toLocaleString(),
    };
    setConfirmed(entry);
    setRsvpOpen(false);
    const updated = [entry, ...allRsvps];
    setAllRsvps(updated);
    await storageSetJSON("rsvps", updated, true);
    await storageSetJSON("myRsvp", entry, false);
  };

  const submitWish = async (e) => {
    e.preventDefault();
    if (!wishName.trim() || !wishText.trim()) return;
    const entry = { name: wishName, text: wishText, time: "just now" };
    const updated = [entry, ...wishes];
    setWishes(updated);
    setWishName("");
    setWishText("");
    await storageSetJSON("wishes", updated, true);
  };

  const joiningCount = allRsvps
    .filter((r) => r.attending === "yes")
    .reduce((sum, r) => sum + (Number(r.guests) || 1), 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Amiri:wght@400;700&display=swap');
        @keyframes riseIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cardIn { from { opacity: 0; transform: scale(0.94) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes cardOut { from { opacity: 1; transform: scale(1) translateY(0); } to { opacity: 0; transform: scale(0.96) translateY(-10px); } }
        @keyframes heartPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @keyframes leafDrift { 0% { transform: translateY(0) rotate(0deg); opacity: 0; } 15% { opacity: 0.55; } 85% { opacity: 0.55; } 100% { transform: translateY(40px) rotate(25deg); opacity: 0; } }
        @keyframes petalFall {
          0% { transform: translateY(-10%) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.65; }
          50% { transform: translateY(50vh) translateX(18px) rotate(var(--spin-half, 150deg)); }
          90% { opacity: 0.6; }
          100% { transform: translateY(110vh) translateX(-10px) rotate(var(--spin, 300deg)); opacity: 0; }
        }
        @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .rise { animation: riseIn 0.7s ease both; }
        .card-in { animation: cardIn 0.6s ease both; }
        .card-out { animation: cardOut 0.5s ease both; }
        .heart-pulse { animation: heartPulse 2.4s ease-in-out infinite; }
        .leaf-drift { animation: leafDrift linear infinite; }
        .petal-fall { animation: petalFall linear infinite; }
        .vinyl-spin { animation: spinSlow 4s linear infinite; }
      `}</style>

      {CONFIG.musicUrl && <audio ref={audioRef} src={CONFIG.musicUrl} loop preload="none" />}

      {/* Persistent dark background — sits behind BOTH the cover and the
          invitation card, so the warm gradient + drifting leaves/petals are
          visible the whole time, not just before the invitation opens. */}
      <div
        className="fixed inset-0 z-0 overflow-hidden"
        style={{
          background: "radial-gradient(ellipse at 50% 35%, #4a2c1f 0%, #2a1811 55%, #170d09 100%)",
        }}
      >
        {LEAVES.map((leaf, i) => (
          <Leaf
            key={i}
            className="leaf-drift absolute text-[#c9ae86]"
            style={{
              left: leaf.left,
              top: leaf.top,
              width: leaf.size,
              height: leaf.size,
              animationDelay: leaf.delay,
              animationDuration: leaf.dur,
            }}
          />
        ))}
        {PETALS.map((p, i) => (
          <Petal
            key={`petal-${i}`}
            className="petal-fall absolute text-[#e3c9a3]"
            style={{
              left: p.left,
              top: "-10%",
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.dur,
              "--spin": p.spin,
            }}
          />
        ))}
      </div>

      {/* Floating music toggle — only shown once the card is open and a
          track has been configured. */}
      {stage === "open" && CONFIG.musicUrl && (
        <button
          onClick={toggleMusic}
          aria-label={musicOn ? "Pause music" : "Play music"}
          className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full text-[#f3e6d8] shadow-[0_6px_16px_rgba(0,0,0,0.4)]"
          style={{ background: "radial-gradient(circle at 35% 30%, #6b4232, #2a1811 75%)" }}
        >
          <span className={musicOn ? "vinyl-spin" : ""}>
            {musicOn ? <Music size={16} /> : <MusicOff size={16} />}
          </span>
        </button>
      )}

      {/* COVER — sits above the dark background, fills the viewport */}
      {stage !== "open" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-6">
          <div className={`relative w-full max-w-lg ${stage === "closing" ? "card-out" : "card-in"}`}>
            <div
              className="absolute inset-0 overflow-hidden rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
              style={{ background: "linear-gradient(180deg, #FBF3EA 0%, #F3E4D0 100%)" }}
            >
              <AnemoneSprig className="pointer-events-none absolute -top-6 -right-8" size={150} flip />
              <AnemoneSprig className="pointer-events-none absolute -bottom-8 -left-10 opacity-90" size={130} />
            </div>

            <div className="relative z-10 px-8 pb-9 pt-11 text-center">
              <button
                onClick={openInvitation}
                aria-label="Open the invitation"
                className="heart-pulse absolute -top-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full shadow-[0_6px_16px_rgba(74,42,29,0.4)] transition-transform hover:scale-105 active:scale-95"
                style={{ background: "radial-gradient(circle at 35% 30%, #6b4232, #3a2115 75%)" }}
              >
                <Heart size={20} fill="#f3e6d8" className="text-[#f3e6d8]" />
              </button>

              <h1 className="mt-3 font-serif text-3xl text-[#4a2c1f]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {CONFIG.groom}
              </h1>
              <p className="my-0.5 text-sm text-[#a9825f]">&amp;</p>
              <h1 className="font-serif text-3xl text-[#4a2c1f]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {CONFIG.bride}
              </h1>

              <div className="mx-auto my-4 flex w-40 items-center gap-2 text-[#c9ae86]">
                <span className="h-px flex-1 bg-[#c9ae86]/60" />
                <Leaf size={12} className="text-[#a9825f]" />
                <span className="h-px flex-1 bg-[#c9ae86]/60" />
              </div>

              <p className="text-sm text-[#8a6a4f]">{COVER_DATE}</p>
              <p className="mt-2 text-sm text-[#5c4632]">{CONFIG.coverSubtitle}</p>

              <button
                onClick={openInvitation}
                className="mt-6 rounded-full bg-[#4a2c1f] px-10 py-2.5 text-sm font-semibold tracking-wide text-[#f3e6d8] shadow-md transition-transform hover:scale-[1.03] active:scale-95 cursor-pointer"
              >
                Open
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN INVITATION — floats as a card over the dark background.
          Only mounted once the cover has finished closing, so it takes up
          zero layout space beforehand. */}
      {stage === "open" && (
        <div
          className="relative z-10 mx-auto my-8 w-full max-w-2xl overflow-hidden rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          style={{
            background: "linear-gradient(180deg, #FBF3EA 0%, #F7EBDD 100%)",
            fontFamily: "'EB Garamond', 'Lora', serif",
          }}
        >
        <div ref={scrollRef} className="rise px-6 pb-10 pt-10">
          <AnemoneSprig className="pointer-events-none absolute -top-4 -left-8 opacity-90" size={170} />
          <AnemoneSprig className="pointer-events-none absolute -top-8 -right-10 opacity-80" size={170} flip />

        {/* QURAN VERSE — placed first, ahead of the couple's names */}
        <Reveal>
        <p dir="rtl" className="pt-15 text-center text-[20px] leading-relaxed text-[#4a2c1f]" style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}>
          {CONFIG.arabicVerse}
        </p>
        </Reveal>

        <Divider />

        {/* HERO */}
        <Reveal>
        <div className="relative text-center">
          <p className="text-xs tracking-[0.3em] text-[#a9825f]">THE WEDDING OF</p>
          <h1
            className="mt-2 font-serif text-4xl text-[#4a2c1f]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {CONFIG.groomFull}
          </h1>
          <span className="my-1 block font-serif text-lg italic text-[#a9825f]">and</span>
          <h1
            className="font-serif text-4xl text-[#4a2c1f]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {CONFIG.brideFull}
          </h1>
          <Bloom className="pointer-events-none absolute -right-2 -top-4 opacity-60" size={34} />
        </div>
        </Reveal>

        <Divider />

        {/* CEREMONY */}
        <Reveal>
        <section className="relative text-center">
          <Bloom className="pointer-events-none absolute -left-4 top-0 opacity-50" size={28} />
          <p className="text-xs tracking-[0.25em] text-[#a9825f]">WEDDING CEREMONY</p>
          <p className="mt-2 font-serif text-lg text-[#4a2c1f]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {CONFIG.ceremonyVenue}
          </p>
          <p className="text-sm text-[#8a6a4f]">{CONFIG.ceremonySub}</p>
          <p className="mt-3 font-serif text-2xl text-[#4a2c1f]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {CONFIG.ceremonyTime}
          </p>
          <div className="mt-2 flex items-center justify-center gap-3 text-sm text-[#8a6a4f]">
            <span className="tracking-widest">{CONFIG.dateLabel.weekday}</span>
            <span className="text-[#c9ae86]">|</span>
            <span className="font-serif text-xl text-[#4a2c1f]">{CONFIG.dateLabel.day}</span>
            <span className="text-[#c9ae86]">|</span>
            <span className="tracking-widest">{CONFIG.dateLabel.month}</span>
          </div>
          <p className="mt-1 text-sm text-[#8a6a4f]">{CONFIG.dateLabel.year}</p>
        </section>
        </Reveal>

        <Divider />


        {/* COUNTDOWN */}
        <Reveal>
        <section className="text-center">
          <p className="text-xs tracking-[0.25em] text-[#a9825f]">COUNTING DOWN TO OUR DAY</p>
          <div className="mt-4 flex justify-center gap-1.5 sm:gap-2">
            <CountdownBlock value={days} label="DAYS" />
            <CountdownBlock value={hours} label="HRS" />
            <CountdownBlock value={minutes} label="MIN" />
            <CountdownBlock value={seconds} label="SEC" />
          </div>
        </section>

        <div className="mt-6">
          <MiniCalendar targetIso={CONFIG.weddingDate} />
        </div>

        <div className="mt-4 flex justify-center">
          <button className="flex items-center gap-1.5 text-xs tracking-wide text-[#8a6a4f] underline underline-offset-4 hover:text-[#4a2c1f]">
            <CalendarPlus size={13} /> Add to calendar
          </button>
        </div>
        </Reveal>

        {/* RSVP */}
        <Reveal>
        <div className="mt-6 flex flex-col items-center gap-2">
          {confirmed ? (
            <div className="rounded-lg border border-[#c9ae86]/50 bg-[#fffaf3] px-5 py-3 text-center text-sm text-[#5c4632]">
              Thank you, {confirmed.name} — we've recorded that you{" "}
              {confirmed.attending === "yes" ? `will join us (party of ${confirmed.guests}).` : "can't make it, but you'll be missed."}
            </div>
          ) : (
            <button
              onClick={() => setRsvpOpen(true)}
              className="rounded-full bg-[#4a2c1f] px-8 py-3 text-xs font-semibold tracking-[0.15em] text-[#f3e6d8] shadow-md transition-transform hover:scale-[1.02] active:scale-95"
            >
              CONFIRM ATTENDANCE
            </button>
          )}
          {joiningCount > 0 && (
            <p className="text-[11px] tracking-wide text-[#a9825f]">
              {joiningCount} guest{joiningCount === 1 ? "" : "s"} joining us so far
            </p>
          )}
        </div>
        </Reveal>

        {rsvpOpen && (
          <form
            onSubmit={submitRsvp}
            className="mt-4 space-y-3 rounded-xl border border-[#c9ae86]/40 bg-[#fffaf3] p-4"
          >
            <input
              value={rsvpName}
              onChange={(e) => setRsvpName(e.target.value)}
              placeholder="Your full name*"
              className="w-full rounded-md border border-[#c9ae86]/50 bg-white px-3 py-2 text-sm text-[#4a2c1f] outline-none focus:border-[#4a2c1f]"
            />
            <div className="flex gap-2 text-sm">
              {["yes", "no"].map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setRsvpAttending(v)}
                  className={`flex-1 rounded-md border py-2 ${
                    rsvpAttending === v
                      ? "border-[#4a2c1f] bg-[#4a2c1f] text-[#f3e6d8]"
                      : "border-[#c9ae86]/50 text-[#5c4632]"
                  }`}
                >
                  {v === "yes" ? "Joyfully accept" : "Regretfully decline"}
                </button>
              ))}
            </div>
            {rsvpAttending === "yes" && (
              <div className="flex items-center justify-between text-sm text-[#5c4632]">
                <span>Number of guests</span>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={rsvpGuests}
                  onChange={(e) => setRsvpGuests(Number(e.target.value))}
                  className="w-16 rounded-md border border-[#c9ae86]/50 bg-white px-2 py-1 text-center"
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full rounded-md bg-[#4a2c1f] py-2 text-xs font-semibold tracking-widest text-[#f3e6d8]"
            >
              SEND RSVP
            </button>
          </form>
        )}

        <Divider />

        {/* VENUE */}
        <Reveal>
        <section className="text-center">
          <p className="text-lg font-serif tracking-wide text-[#4a2c1f]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            WEDDING VENUE
          </p>
          <p className="mt-1 text-sm text-[#5c4632]">{CONFIG.ceremonyVenue}</p>
          <p className="text-sm text-[#8a6a4f]">{CONFIG.ceremonySub}</p>

          <a
            href={CONFIG.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="relative mt-4 block h-48 overflow-hidden rounded-xl border border-[#c9ae86]/40"
            aria-label="Open venue location in Google Maps"
          >
            <iframe
              title="Venue location"
              src={`https://www.google.com/maps?q=${CONFIG.venueLat},${CONFIG.venueLng}&z=16&output=embed`}
              className="h-full w-full grayscale-15 sepia-10"
              style={{ border: 0, pointerEvents: "none" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute bottom-2 right-2 rounded bg-white/85 px-2 py-1 text-[10px] text-[#5c4632]">
              tap to open in Maps
            </div>
          </a>
          <p className="mt-2 text-xs text-[#8a6a4f]">{CONFIG.address}</p>
          <a
            href={CONFIG.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs tracking-wide text-[#8a6a4f] underline underline-offset-4 hover:text-[#4a2c1f]"
          >
            <MapPin size={12} /> Get directions
          </a>
        </section>
        </Reveal>

        <Divider />

        {/* GUESTBOOK */}
        <Reveal>
        <section>
          <p
            className="text-center text-lg font-serif tracking-wide text-[#4a2c1f]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            GUESTBOOK
          </p>
          <form onSubmit={submitWish} className="mt-4 space-y-2">
            <input
              value={wishName}
              onChange={(e) => setWishName(e.target.value)}
              placeholder="Your name*"
              className="w-full rounded-md border border-[#c9ae86]/50 bg-[#fffaf3] px-3 py-2 text-sm text-[#4a2c1f] outline-none focus:border-[#4a2c1f]"
            />
            <textarea
              value={wishText}
              onChange={(e) => setWishText(e.target.value)}
              placeholder="Enter your wishes*"
              rows={3}
              className="w-full resize-none rounded-md border border-[#c9ae86]/50 bg-[#fffaf3] px-3 py-2 text-sm text-[#4a2c1f] outline-none focus:border-[#4a2c1f]"
            />
            <button
              type="submit"
              className="ml-auto flex items-center gap-1.5 rounded-full bg-[#4a2c1f] px-5 py-2 text-xs font-semibold tracking-widest text-[#f3e6d8]"
            >
              <Send size={12} /> SEND WISHES
            </button>
          </form>

          <div className="mt-4 space-y-2">
            {!wishesLoaded && (
              <p className="text-center text-xs text-[#a9825f]">Loading wishes…</p>
            )}
            {wishes.map((w, i) => (
              <div key={i} className="rounded-lg border border-[#c9ae86]/40 bg-[#fffaf3] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#4a2c1f]">{w.name}</span>
                  <span className="text-[10px] text-[#a9825f]">{w.time}</span>
                </div>
                <p className="mt-1 text-sm text-[#5c4632]">{w.text}</p>
              </div>
            ))}
          </div>
        </section>
        </Reveal>

        <Divider />

        <Reveal>
        <p className="text-center text-sm italic text-[#5c4632]">{CONFIG.closing}</p>
        <div className="mt-4 flex justify-center">
          <AnemoneSprig size={110} className="opacity-80" />
        </div>
        <p className="mt-2 text-center text-[10px] tracking-widest text-[#c9ae86]">
          ♡ {CONFIG.groom.toUpperCase()} &amp; {CONFIG.bride.toUpperCase()}
        </p>
        <p className="mt-4 text-center text-[9px] tracking-wide text-[#c9ae86]/70">
          © {new Date(CONFIG.weddingDate).getFullYear()} Youssef Hashish. All rights reserved.
        </p>
        </Reveal>
        </div>
        </div>
      )}
    </>
  );
}