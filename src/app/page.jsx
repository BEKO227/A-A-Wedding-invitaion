"use client";

import React, { useState, useEffect, useMemo, useRef, useId } from "react";

/* ==================================================================
   DESIGN TOKENS — ivory paper, hand-painted white florals, sage
   greenery, soft charcoal ink. Quiet, botanical, editorial — the
   opposite of a "loud" invite. One signature element (the climbing
   floral border) carries the whole identity; everything else stays
   restrained so it reads like a printed card, not an app.

   NOTE ON IMAGE ASSETS
   The floral border and the couple illustration are now real image
   files imported straight from /public, cropped directly from your
   reference design (with the background made transparent) so the
   card matches it exactly instead of being an SVG re-drawing:
     /public/floral-spray.png   — the climbing floral corner
     /public/couple.png         — the bride & groom back-view illustration
   Drop both files into your project's /public folder (same folder
   Um_Kalthoum.mp3 already lives in) and they'll just work.
================================================================== */
const T = {
  paper: "#FBF8F1",
  ivory: "#F6F1E6",
  ivoryDeep: "#EEE6D4",
  line: "#E4DAC4",
  ink: "#33302A",
  inkSoft: "#6B6355",
  inkFaint: "#9A9284",
  sage: "#7C8863",
  sageDeep: "#54603F",
  sageLight: "#CBD3B7",
  petal: "#FFFFFF",
  petalShade: "#EFE7D5",
  charcoal: "#3A362F",
  charcoalSoft: "#5B5648",
  gold: "#B79A5D",
};

/* ------------------------------------------------------------------
   EDIT THESE — everything about the couple, families, date & venue
------------------------------------------------------------------- */
const CONFIG = {
  groom: "Ahmed",
  bride: "Aya",
  groomFull: "Ahmed Mamdouh Qurtam",
  brideFull: "Aya Nasr Hashish",

  familiesLabel: "THE FAMILIES OF",
  groomFamilyName: "QURTAM",
  brideFamilyName: "HASHISH",
  invitationLine: "wish to invite you to celebrate the wedding of their son and daughter",

  weddingDate: "2026-07-27T20:00:00",
  dateLabel: { weekday: "MONDAY", day: "27", month: "JULY", year: "2026" },
  ceremonyTime: "8:00 PM",
  ceremonyVenue: "Akhenaten Hall",
  ceremonySub: "Ceremonial House for Police Officers",
  receptionTime: "8:00 PM",
  receptionVenue: "Akhenaten Hall",
  receptionSub: "Ceremonial House for Police Officers",
  address: "26WC+QV2, Zamalek, Cairo Governorate 4270104, Egypt",
  mapsUrl: "https://maps.app.goo.gl/Qxobt6Khvy9KZHjf6",
  venueLat: 30.0473389,
  venueLng: 31.2223459,

  bismillah: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  arabicVerse:
    "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ",
  closing: "Your presence would be the greatest gift we could receive!",
  coverSubtitle: "You are invited to celebrate our wedding",

  musicUrl: "/Um_Kalthoum.mp3",
  monogram: "A & A",

  /* image assets — see note above */
  floralImageUrl: "/photo_5983371356298481365_y-removebg-preview.png",
  coupleImageUrl: "/couple.png",
  /* natural pixel size of the source crops, used to keep aspect ratio correct */
  floralImageNatural: { w: 340, h: 1280 },
  coupleImageNatural: { w: 301, h: 428 },
};

const COVER_DATE = new Date(CONFIG.weddingDate).toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

/* ------------------------------------------------------------------
   Tiny inline icon set
------------------------------------------------------------------- */
const MapPin = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const CalendarPlus = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18M12 14v6M9 17h6" />
  </svg>
);
const Send = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
    <path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z" />
  </svg>
);
const ChevronLeft = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);
const ChevronRight = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
    <path d="M9 18l6-6-6-6" />
  </svg>
);
const Music = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);
const MusicOff = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
    <path d="M2 2l20 20" />
  </svg>
);

/* ------------------------------------------------------------------
   FLORAL BORDER — now a real image import instead of generated SVG,
   so it matches your reference exactly. `side` mirrors it via CSS
   transform to reuse the same file for any corner.
------------------------------------------------------------------- */
function FloralImage({ side = "top-left", widthPx = 150, heightPx = 480, className = "ms-2 mt-2.5" }) {
  const flipX = side.includes("right");
  const flipY = side.includes("bottom");
  const ratio = CONFIG.floralImageNatural.h / CONFIG.floralImageNatural.w;
  const h = heightPx ?? Math.round(widthPx * ratio);
  return (
    <img
      src={CONFIG.floralImageUrl}
      alt=""
      aria-hidden="true"
      width={widthPx}
      height={h}
      draggable={false}
      className={className}
      style={{
        display: "block",
        width: widthPx,
        height: h,
        objectFit: "cover",
        objectPosition: flipY ? "bottom" : "top",
        transform: `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`,
        transformOrigin: "center",
      }}
    />
  );
}

/* Small standalone sprig used inline (dividers, closing). Kept as a
   light hand-drawn SVG since it's a small decorative flourish with
   no matching crop in the reference image. */
function Sprig({ className = "", size = 70 }) {
  const rawId = useId();
  const id = `sg${rawId.replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 140 60" width={size} height={size * (60 / 140)} className={className} fill="none">
      <defs>
        <radialGradient id={`${id}-petal`} cx="45%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor={T.petalShade} />
        </radialGradient>
        <radialGradient id={`${id}-center`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E8D9A8" />
          <stop offset="100%" stopColor={T.gold} />
        </radialGradient>
      </defs>
      <path d="M8 40 C 40 14, 100 14, 132 40" stroke={T.sageDeep} strokeWidth="1.2" opacity="0.6" />
      <path
        d="M40,22 C46,22.5 46,32.8 40,34.6 C34,32.8 34,22.5 40,22 Z"
        fill={T.sage}
        transform="rotate(-30 40 28)"
      />
      <path
        d="M100,22 C106,22.5 106,32.8 100,34.6 C94,32.8 94,22.5 100,22 Z"
        fill={T.sage}
        transform="rotate(30 100 28)"
      />
      <g transform="translate(26 34) scale(0.55)">
        {Array.from({ length: 5 }).map((_, i) => (
          <ellipse key={i} cx="0" cy="-11" rx="8" ry="12" fill={`url(#${id}-petal)`} stroke={T.line} strokeWidth="0.5" transform={`rotate(${72 * i})`} />
        ))}
        <circle r="4" fill={`url(#${id}-center)`} />
      </g>
      <g transform="translate(70 16) scale(0.75)">
        {Array.from({ length: 5 }).map((_, i) => (
          <ellipse key={i} cx="0" cy="-11" rx="8" ry="12" fill={`url(#${id}-petal)`} stroke={T.line} strokeWidth="0.5" transform={`rotate(${72 * i})`} />
        ))}
        <circle r="4" fill={`url(#${id}-center)`} />
      </g>
      <g transform="translate(114 34) scale(0.55)">
        {Array.from({ length: 5 }).map((_, i) => (
          <ellipse key={i} cx="0" cy="-11" rx="8" ry="12" fill={`url(#${id}-petal)`} stroke={T.line} strokeWidth="0.5" transform={`rotate(${72 * i})`} />
        ))}
        <circle r="4" fill={`url(#${id}-center)`} />
      </g>
    </svg>
  );
}

/* A slim rule with a single centered blossom — replaces heavy
   dividers with something that matches the botanical language. */
function FloralDivider() {
  return (
    <div className="mx-auto my-7 flex items-center justify-center gap-3">
      <span style={{ width: 56, height: 1, background: T.line }} />
      <Sprig size={40} />
      <span style={{ width: 56, height: 1, background: T.line }} />
    </div>
  );
}

/* ------------------------------------------------------------------
   COUPLE ILLUSTRATION — real image import (cropped from your
   reference, background removed) instead of a generated silhouette.
------------------------------------------------------------------- */
function CoupleImage({ width = 150, className = "" }) {
  const ratio = CONFIG.coupleImageNatural.h / CONFIG.coupleImageNatural.w;
  const height = Math.round(width * ratio);
  return (
    <img
      src={CONFIG.coupleImageUrl}
      alt="The bride and groom"
      width={width}
      height={height}
      draggable={false}
      className={className}
      style={{ display: "block", width, height: "auto" }}
    />
  );
}

/* ------------------------------------------------------------------
   COUNTDOWN + CALENDAR
------------------------------------------------------------------- */
function useCountdown(targetIso) {
  const target = useMemo(() => new Date(targetIso).getTime(), [targetIso]);
  const [remaining, setRemaining] = useState(null);
  useEffect(() => {
    const tick = () => setRemaining(Math.max(target - Date.now(), 0));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  if (remaining === null) return { days: null, hours: null, minutes: null, seconds: null };
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
        className="w-full rounded-sm py-2 text-center font-serif text-lg shadow-sm sm:text-xl"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          background: T.paper,
          border: `1px solid ${T.line}`,
          color: T.ink,
        }}
      >
        {value === null ? "--" : String(value).padStart(2, "0")}
      </div>
      <span className="mt-1 text-[10px] tracking-[0.15em]" style={{ color: T.sageDeep }}>
        {label}
      </span>
    </div>
  );
}

function MiniCalendar({ targetIso }) {
  const target = new Date(targetIso);
  const [viewMonth, setViewMonth] = useState(target.getMonth());
  const [viewYear, setViewYear] = useState(target.getFullYear());
  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [...Array(startOffset).fill(null), ...Array(daysInMonth).keys()].map((d) => (d === null ? null : d + 1));
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
    <div
      className="mx-auto w-full max-w-xs rounded-sm p-4 shadow-sm"
      style={{ background: T.paper, border: `1px solid ${T.line}` }}
    >
      <div className="mb-3 flex items-center justify-between">
        <button onClick={() => shift(-1)} style={{ color: T.sageDeep }} aria-label="Previous month">
          <ChevronLeft size={16} />
        </button>
        <span className="font-serif text-sm tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif", color: T.ink }}>
          {monthName} {viewYear}
        </span>
        <button onClick={() => shift(1)} style={{ color: T.sageDeep }} aria-label="Next month">
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px]" style={{ color: T.inkFaint }}>
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d, i) =>
          d === null ? (
            <span key={i} />
          ) : (
            <span
              key={i}
              className="flex h-7 items-center justify-center rounded-full text-xs"
              style={
                isTargetMonth && d === target.getDate()
                  ? { background: T.sageDeep, color: T.paper, fontWeight: 600 }
                  : { color: T.inkSoft }
              }
            >
              {d}
            </span>
          )
        )}
      </div>
    </div>
  );
}

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); }
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
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

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

function QuietButton({ children, onClick, type = "button", full = false, small = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${full ? "w-full" : ""} rounded-sm font-medium tracking-[0.18em] transition-colors hover:opacity-90 active:opacity-80 ${
        small ? "px-5 py-2 text-[11px]" : "px-9 py-3 text-xs"
      }`}
      style={{
        background: T.sageDeep,
        color: T.paper,
        border: `1px solid ${T.sageDeep}`,
      }}
    >
      {children}
    </button>
  );
}

export default function WeddingInvitation() {
  const [stage, setStage] = useState("cover");
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

  const openInvitation = () => {
    if (stage !== "cover") return;
    setStage("closing");
    if (CONFIG.musicUrl && audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false));
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicOn) { audioRef.current.pause(); setMusicOn(false); }
    else { audioRef.current.play().then(() => setMusicOn(true)).catch(() => {}); }
  };

  const submitRsvp = async (e) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;
    const entry = { name: rsvpName, attending: rsvpAttending, guests: rsvpGuests, time: new Date().toLocaleString() };
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

  const joiningCount = allRsvps.filter((r) => r.attending === "yes").reduce((sum, r) => sum + (Number(r.guests) || 1), 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Amiri:wght@400;700&family=Parisienne&display=swap');
        @keyframes cardIn { from { opacity: 0; transform: scale(0.96) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes cardOut { from { opacity: 1; transform: scale(1) translateY(0); } to { opacity: 0; transform: scale(0.97) translateY(-10px); } }
        @keyframes riseIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .rise { animation: riseIn 0.7s ease both; }
        .card-in { animation: cardIn 0.6s ease both; }
        .card-out { animation: cardOut 0.5s ease both; }
        .vinyl-spin { animation: spinSlow 4s linear infinite; }
      `}</style>

      {CONFIG.musicUrl && <audio ref={audioRef} src={CONFIG.musicUrl} loop preload="none" />}

      {/* Soft paper ground */}
      <div className="fixed inset-0 z-0" style={{ background: T.ivory }} />

      {stage === "open" && CONFIG.musicUrl && (
        <button
          onClick={toggleMusic}
          aria-label={musicOn ? "Pause music" : "Play music"}
          className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full shadow-md"
          style={{ background: T.sageDeep, border: `1px solid ${T.sageDeep}`, color: T.paper }}
        >
          <span className={musicOn ? "vinyl-spin" : ""}>{musicOn ? <Music size={16} /> : <MusicOff size={16} />}</span>
        </button>
      )}

      {/* COVER — matches the reference: floral vine down the entire
          left edge, couple illustration bottom-right, no florals on
          the right side. */}
      {stage !== "open" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-5">
          <div className={`relative w-full max-w-md ${stage === "closing" ? "card-out" : "card-in"}`}>
            <div
              className="absolute inset-0 rounded-sm"
              style={{ background: T.paper, boxShadow: `0 0 0 1px ${T.line}, 0 24px 60px rgba(40,35,25,0.25)` }}
            />
            <div className="pointer-events-none absolute -top-2 -left-2 z-10 overflow-hidden" style={{ width: 170, height: "100%" }}>
              <FloralImage side="top-left" widthPx={170} heightPx={null} />
            </div>

            <div className="relative z-10 flex min-h-140 flex-col px-9 pb-8 pt-10 text-center">
              <p className="text-[10px] tracking-[0.35em]" style={{ color: T.inkFaint }}>{CONFIG.familiesLabel}</p>
              <p className="mt-8 font-serif text-2xl" style={{ fontFamily: "'Amiri', serif", color: T.ink }}>{CONFIG.bismillah}</p>

              <p dir="rtl" className="mx-auto mt-4 max-w-65 text-[13px] leading-[1.9]" style={{ fontFamily: "'Amiri', serif", color: T.inkSoft }}>
                {CONFIG.arabicVerse}
              </p>

              <div className="mt-auto flex flex-col items-center">
                <h1 className="text-5xl" style={{ fontFamily: "'Parisienne', cursive", color: T.ink }}>
                  {CONFIG.groom} <span style={{ color: T.sageDeep, fontFamily: "'Cormorant Garamond', serif" }}>&amp;</span> {CONFIG.bride}
                </h1>
                <p className="mt-2 text-xs tracking-[0.2em]" style={{ color: T.inkFaint }}>{COVER_DATE.toUpperCase()}</p>

                <div className="mt-4 self-end">
                  <CoupleImage width={128} />
                </div>

                <button
                  onClick={openInvitation}
                  className="mt-4 rounded-sm px-9 py-2.5 text-xs font-medium tracking-[0.2em]"
                  style={{ background: T.sageDeep, color: T.paper, border: `1px solid ${T.sageDeep}` }}
                >
                  OPEN INVITATION
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN INVITATION */}
      {stage === "open" && (
        <div
          className="relative z-10 mx-auto my-10 w-full max-w-2xl overflow-hidden rounded-sm"
          style={{ background: T.paper, fontFamily: "'EB Garamond', 'Lora', serif", boxShadow: `0 0 0 1px ${T.line}, 0 30px 80px rgba(40,35,25,0.3)` }}
        >
          <div className="pointer-events-none absolute -top-2 -left-2 z-0 overflow-hidden" style={{ width: 190, height: 560 }}>
            <FloralImage side="top-left" widthPx={190} heightPx={560} />
          </div>

          <div className="rise relative z-10 px-8 pb-10 pt-10">
            {/* BISMILLAH + QURAN VERSE */}
            <Reveal>
              <p className="text-center font-serif text-2xl" style={{ fontFamily: "'Amiri', serif", color: T.ink }}>{CONFIG.bismillah}</p>
              <p dir="rtl" className="mx-auto mt-4 max-w-md text-center text-[19px] leading-relaxed" style={{ fontFamily: "'Amiri', serif", color: T.inkSoft }}>
                {CONFIG.arabicVerse}
              </p>
            </Reveal>

            <FloralDivider />

            {/* FAMILIES + INVITATION LINE */}
            <Reveal>
              <div className="text-center">
                <p className="text-xs font-semibold tracking-[0.25em]" style={{ color: T.ink }}>{CONFIG.familiesLabel}</p>
                <p className="mt-1 text-sm font-semibold tracking-[0.15em]" style={{ color: T.ink }}>
                  {CONFIG.groomFamilyName} AND {CONFIG.brideFamilyName}
                </p>
                <p className="mx-auto mt-3 max-w-xs text-sm italic leading-relaxed" style={{ color: T.inkSoft }}>
                  {CONFIG.invitationLine}
                </p>
              </div>
            </Reveal>

            {/* HERO NAMES */}
            <Reveal>
              <div className="mt-6 text-center">
                <h1 className="text-6xl" style={{ fontFamily: "'Parisienne', cursive", color: T.ink }}>{CONFIG.groomFull}</h1>
                <span className="my-1 block font-serif text-lg italic" style={{ color: T.sageDeep }}>and</span>
                <h1 className="text-6xl" style={{ fontFamily: "'Parisienne', cursive", color: T.ink }}>{CONFIG.brideFull}</h1>
              </div>
            </Reveal>

            <FloralDivider />

            {/* DATE STRIP */}
            <Reveal>
              <section className="text-center">
                <div
                  className="mx-auto flex max-w-sm items-center justify-center gap-4 py-4"
                  style={{ borderTop: `1px solid ${T.line}`, borderBottom: `1px solid ${T.line}` }}
                >
                  <span className="rounded-sm px-3 py-1.5 text-xs font-semibold tracking-widest" style={{ border: `1px solid ${T.sageDeep}`, color: T.ink }}>
                    {CONFIG.dateLabel.weekday}
                  </span>
                  <div className="flex flex-col items-center leading-none">
                    <span className="text-xl" style={{ fontFamily: "'Parisienne', cursive", color: T.sageDeep }}>
                      {CONFIG.dateLabel.month[0] + CONFIG.dateLabel.month.slice(1).toLowerCase()}
                    </span>
                    <span className="font-serif text-5xl font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif", color: T.ink }}>
                      {CONFIG.dateLabel.day}
                    </span>
                    <span className="mt-1 text-sm font-semibold tracking-widest" style={{ color: T.ink }}>{CONFIG.dateLabel.year}</span>
                  </div>
                  <span className="rounded-sm px-3 py-1.5 text-xs font-semibold tracking-widest" style={{ border: `1px solid ${T.sageDeep}`, color: T.ink }}>
                    {CONFIG.ceremonyTime}
                  </span>
                </div>
                <p className="mt-4 text-xs font-semibold tracking-[0.15em]" style={{ color: T.sageDeep }}>
                  VENUE: {CONFIG.ceremonyVenue.toUpperCase()}, {CONFIG.ceremonySub.toUpperCase()}
                </p>
              </section>
            </Reveal>

            <FloralDivider />

            {/* RECEPTION LINE */}
            <Reveal>
              <section className="text-center">
                <p className="text-3xl" style={{ fontFamily: "'Parisienne', cursive", color: T.ink }}>Reception</p>
                <p className="mt-1 text-sm" style={{ color: T.inkSoft }}>{CONFIG.receptionVenue} @ {CONFIG.receptionTime}</p>
              </section>
            </Reveal>

            <FloralDivider />

            {/* RSVP */}
            <Reveal>
              <div className="flex flex-col items-center gap-4">
                {confirmed ? (
                  <div className="rounded-sm px-5 py-3 text-center text-sm" style={{ background: T.ivoryDeep, border: `1px solid ${T.line}`, color: T.inkSoft }}>
                    Thank you, {confirmed.name} — we've recorded that you{" "}
                    {confirmed.attending === "yes" ? `will join us (party of ${confirmed.guests}).` : "can't make it, but you'll be missed."}
                  </div>
                ) : (
                  <QuietButton onClick={() => setRsvpOpen(true)}>CONFIRM ATTENDANCE ONLINE</QuietButton>
                )}
                {joiningCount > 0 && (
                  <p className="text-[11px] tracking-wide" style={{ color: T.sageDeep }}>
                    {joiningCount} guest{joiningCount === 1 ? "" : "s"} joining us so far
                  </p>
                )}
              </div>
            </Reveal>

            <FloralDivider />

            {/* COUNTDOWN */}
            <Reveal>
              <section className="text-center">
                <p className="text-xs tracking-[0.25em]" style={{ color: T.sageDeep }}>COUNTING DOWN TO OUR DAY</p>
                <div className="mt-4 flex justify-center gap-1.5 sm:gap-2">
                  <CountdownBlock value={days} label="DAYS" />
                  <CountdownBlock value={hours} label="HRS" />
                  <CountdownBlock value={minutes} label="MIN" />
                  <CountdownBlock value={seconds} label="SEC" />
                </div>
              </section>
              <div className="mt-6"><MiniCalendar targetIso={CONFIG.weddingDate} /></div>
              <div className="mt-4 flex justify-center">
                <button className="flex items-center gap-1.5 text-xs tracking-wide underline underline-offset-4" style={{ color: T.sageDeep }}>
                  <CalendarPlus size={13} /> Add to calendar
                </button>
              </div>
            </Reveal>

            {rsvpOpen && (
              <form onSubmit={submitRsvp} className="mt-4 space-y-3 rounded-sm p-4" style={{ background: T.ivoryDeep, border: `1px solid ${T.line}` }}>
                <input
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder="Your full name*"
                  className="w-full rounded-sm px-3 py-2 text-sm outline-none"
                  style={{ background: T.paper, border: `1px solid ${T.line}`, color: T.inkSoft }}
                />
                <div className="flex gap-2 text-sm">
                  {["yes", "no"].map((v) => (
                    <button
                      type="button"
                      key={v}
                      onClick={() => setRsvpAttending(v)}
                      className="flex-1 rounded-sm py-2"
                      style={
                        rsvpAttending === v
                          ? { background: T.sageDeep, border: `1px solid ${T.sageDeep}`, color: T.paper }
                          : { border: `1px solid ${T.line}`, color: T.inkSoft }
                      }
                    >
                      {v === "yes" ? "Joyfully accept" : "Regretfully decline"}
                    </button>
                  ))}
                </div>
                {rsvpAttending === "yes" && (
                  <div className="flex items-center justify-between text-sm" style={{ color: T.inkSoft }}>
                    <span>Number of guests</span>
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={rsvpGuests}
                      onChange={(e) => setRsvpGuests(Number(e.target.value))}
                      className="w-16 rounded-sm px-2 py-1 text-center"
                      style={{ background: T.paper, border: `1px solid ${T.line}` }}
                    />
                  </div>
                )}
                <QuietButton type="submit" full small>SEND RSVP</QuietButton>
              </form>
            )}

            <FloralDivider />

            {/* VENUE */}
            <Reveal>
              <section className="text-center">
                <p className="text-lg font-serif tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif", color: T.ink }}>WEDDING VENUE</p>
                <p className="mt-1 text-sm" style={{ color: T.inkSoft }}>{CONFIG.ceremonyVenue}</p>
                <p className="text-sm" style={{ color: T.sageDeep }}>{CONFIG.ceremonySub}</p>

                <a
                  href={CONFIG.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="relative mt-4 block h-48 overflow-hidden rounded-sm"
                  style={{ border: `1px solid ${T.line}` }}
                  aria-label="Open venue location in Google Maps"
                >
                  <iframe
                    title="Venue location"
                    src={`https://www.google.com/maps?q=${CONFIG.venueLat},${CONFIG.venueLng}&z=16&output=embed`}
                    className="h-full w-full"
                    style={{ border: 0, pointerEvents: "none" }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute bottom-2 right-2 rounded bg-white/85 px-2 py-1 text-[10px]" style={{ color: T.inkSoft }}>
                    tap to open in Maps
                  </div>
                </a>
                <p className="mt-2 text-xs" style={{ color: T.sageDeep }}>{CONFIG.address}</p>
                <a
                  href={CONFIG.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs tracking-wide underline underline-offset-4"
                  style={{ color: T.sageDeep }}
                >
                  <MapPin size={12} /> Get directions
                </a>
              </section>
            </Reveal>

            {/* GUESTBOOK */}
            <Reveal>
              <section>
                <p className="text-center text-lg font-serif tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif", color: T.ink }}>GUESTBOOK</p>
                <form onSubmit={submitWish} className="mt-4 space-y-2">
                  <input
                    value={wishName}
                    onChange={(e) => setWishName(e.target.value)}
                    placeholder="Your name*"
                    className="w-full rounded-sm px-3 py-2 text-sm outline-none"
                    style={{ background: T.ivoryDeep, border: `1px solid ${T.line}`, color: T.inkSoft }}
                  />
                  <textarea
                    value={wishText}
                    onChange={(e) => setWishText(e.target.value)}
                    placeholder="Enter your wishes*"
                    rows={3}
                    className="w-full resize-none rounded-sm px-3 py-2 text-sm outline-none"
                    style={{ background: T.ivoryDeep, border: `1px solid ${T.line}`, color: T.inkSoft }}
                  />
                  <div className="flex justify-end">
                    <QuietButton type="submit" small>
                      <span className="flex items-center gap-1.5"><Send size={12} /> SEND WISHES</span>
                    </QuietButton>
                  </div>
                </form>

                <div className="mt-4 space-y-2">
                  {!wishesLoaded && <p className="text-center text-xs" style={{ color: T.sageDeep }}>Loading wishes…</p>}
                  {wishes.map((w, i) => (
                    <div key={i} className="rounded-sm p-3" style={{ background: T.ivoryDeep, border: `1px solid ${T.line}` }}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold" style={{ color: T.ink }}>{w.name}</span>
                        <span className="text-[10px]" style={{ color: T.sageDeep }}>{w.time}</span>
                      </div>
                      <p className="mt-1 text-sm" style={{ color: T.inkSoft }}>{w.text}</p>
                    </div>
                  ))}
                </div>
              </section>
            </Reveal>

            <FloralDivider />

            <Reveal>
              <div className="flex justify-center"><CoupleImage width={110} /></div>
              <p className="mt-4 text-center text-sm italic" style={{ color: T.inkSoft }}>{CONFIG.closing}</p>
              <p className="mt-3 text-center text-[10px] tracking-widest" style={{ color: T.sageDeep }}>
                {CONFIG.groom.toUpperCase()} &amp; {CONFIG.bride.toUpperCase()}
              </p>
            </Reveal>
          </div>

          <div className="pointer-events-none absolute -bottom-2 -right-2 z-0 overflow-hidden" style={{ width: 150, height: 380 }}>
            <FloralImage side="bottom-right" widthPx={150} heightPx={380} />
          </div>
        </div>
      )}
    </>
  );
}