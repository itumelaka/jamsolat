import { useState, useEffect, useRef, useCallback } from "react";

// ─── PRAYER DATA (hardcoded dari API waktusolat.app) ─────────────────────────
// Data untuk hari ini — boleh update setiap bulan atau sambung API bila dah ada server
const PRAYER_DB = {
  WLY01: { label: "Kuala Lumpur / Putrajaya",    fajr:"06:02", syuruk:"07:10", dhuhr:"13:20", asr:"16:33", maghrib:"19:25", isha:"20:36" },
  SGR01: { label: "Selangor – Petaling / Shah Alam", fajr:"06:01", syuruk:"07:09", dhuhr:"13:19", asr:"16:32", maghrib:"19:24", isha:"20:35" },
  SGR02: { label: "Selangor – Kuala Selangor",   fajr:"06:03", syuruk:"07:11", dhuhr:"13:21", asr:"16:34", maghrib:"19:26", isha:"20:37" },
  SGR03: { label: "Selangor – Klang / Kuala Langat", fajr:"06:00", syuruk:"07:08", dhuhr:"13:18", asr:"16:31", maghrib:"19:23", isha:"20:34" },
  JHR02: { label: "Johor Bahru",                  fajr:"05:59", syuruk:"07:08", dhuhr:"13:14", asr:"16:30", maghrib:"19:21", isha:"20:32" },
  JHR03: { label: "Johor – Kluang / Pontian",    fajr:"05:58", syuruk:"07:07", dhuhr:"13:13", asr:"16:29", maghrib:"19:20", isha:"20:31" },
  MLK01: { label: "Melaka",                       fajr:"06:00", syuruk:"07:09", dhuhr:"13:16", asr:"16:31", maghrib:"19:22", isha:"20:33" },
  NGS03: { label: "Seremban / Port Dickson",      fajr:"06:01", syuruk:"07:10", dhuhr:"13:17", asr:"16:32", maghrib:"19:23", isha:"20:34" },
  PNG01: { label: "Pulau Pinang",                 fajr:"06:06", syuruk:"07:15", dhuhr:"13:24", asr:"16:38", maghrib:"19:30", isha:"20:41" },
  KDH01: { label: "Kedah – Kota Setar",           fajr:"06:07", syuruk:"07:16", dhuhr:"13:25", asr:"16:39", maghrib:"19:31", isha:"20:42" },
  PRK02: { label: "Perak – Ipoh",                 fajr:"06:04", syuruk:"07:13", dhuhr:"13:22", asr:"16:36", maghrib:"19:28", isha:"20:39" },
  KTN01: { label: "Kelantan – Kota Bharu",        fajr:"06:04", syuruk:"07:14", dhuhr:"13:22", asr:"16:37", maghrib:"19:28", isha:"20:39" },
  TRG01: { label: "Terengganu – Kuala Terengganu",fajr:"06:03", syuruk:"07:13", dhuhr:"13:21", asr:"16:36", maghrib:"19:27", isha:"20:38" },
  PHG02: { label: "Pahang – Kuantan",             fajr:"06:02", syuruk:"07:12", dhuhr:"13:20", asr:"16:34", maghrib:"19:26", isha:"20:37" },
  SBH07: { label: "Sabah – Kota Kinabalu",        fajr:"05:38", syuruk:"06:48", dhuhr:"12:56", asr:"16:09", maghrib:"19:00", isha:"20:11" },
  SWK08: { label: "Sarawak – Kuching",            fajr:"05:42", syuruk:"06:52", dhuhr:"12:59", asr:"16:13", maghrib:"19:03", isha:"20:14" },
  PLS01: { label: "Perlis",                       fajr:"06:09", syuruk:"07:18", dhuhr:"13:27", asr:"16:41", maghrib:"19:33", isha:"20:44" },
};

const PRAYERS = [
  { key: "fajr",    label: "Subuh",   icon: "🌙", arabik: "الفجر" },
  { key: "syuruk",  label: "Syuruk",  icon: "🌄", arabik: "الشروق", noAlarm: true },
  { key: "dhuhr",   label: "Zohor",   icon: "☀️",  arabik: "الظهر" },
  { key: "asr",     label: "Asar",    icon: "🌤️", arabik: "العصر" },
  { key: "maghrib", label: "Maghrib", icon: "🌅", arabik: "المغرب" },
  { key: "isha",    label: "Isyak",   icon: "🌙", arabik: "العشاء" },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────
function toSeconds(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 3600 + m * 60;
}

function nowSeconds() {
  const n = new Date();
  return n.getHours() * 3600 + n.getMinutes() * 60 + n.getSeconds();
}

function formatCountdown(sec) {
  if (sec <= 0) return "—";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}j ${String(m).padStart(2,"0")}m ${String(s).padStart(2,"0")}s`;
  if (m > 0) return `${m}m ${String(s).padStart(2,"0")}s`;
  return `${s}s`;
}

// ─── AUDIO ──────────────────────────────────────────────────────────────────
function beepWarning(ctx) {
  if (!ctx) return;
  // 3 beep pendek — amaran 2 minit
  [0, 0.45, 0.9].forEach(t => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = 880;
    o.type = "sine";
    g.gain.setValueAtTime(0, ctx.currentTime + t);
    g.gain.linearRampToValueAtTime(0.45, ctx.currentTime + t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.35);
    o.start(ctx.currentTime + t);
    o.stop(ctx.currentTime + t + 0.4);
  });
}

function beepAdhan(ctx) {
  if (!ctx) return;
  // Tone melodik untuk masuk waktu
  const notes = [440, 523, 587, 523, 440];
  notes.forEach((freq, i) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = freq;
    o.type = "sine";
    const t = ctx.currentTime + i * 0.28;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.5, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
    o.start(t);
    o.stop(t + 0.3);
  });
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function WaktuSolat() {
  const [zone, setZone] = useState("WLY01");
  const [now, setNow] = useState(new Date());
  const [alarmOn, setAlarmOn] = useState(true);
  const [audioReady, setAudioReady] = useState(false);
  const [log, setLog] = useState([]);
  const [showZones, setShowZones] = useState(false);
  const audioRef = useRef(null);
  const firedRef = useRef({});

  // tick every second
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // reset fired flags at midnight
  useEffect(() => {
    const midnight = new Date();
    midnight.setHours(24, 0, 5, 0);
    const ms = midnight - now;
    const t = setTimeout(() => { firedRef.current = {}; }, ms);
    return () => clearTimeout(t);
  }, []);

  const initAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new (window.AudioContext || window.webkitAudioContext)();
      setAudioReady(true);
    } else if (audioRef.current.state === "suspended") {
      audioRef.current.resume().then(() => setAudioReady(true));
    }
  }, []);

  const data = PRAYER_DB[zone];
  const prayerList = PRAYERS.map(p => ({
    ...p,
    time: data[p.key] || null,
    sec: data[p.key] ? toSeconds(data[p.key]) : null,
  }));

  const ns = nowSeconds();

  // Find current & next
  const activePrayers = prayerList.filter(p => p.sec !== null);
  let currentIdx = -1;
  for (let i = activePrayers.length - 1; i >= 0; i--) {
    if (activePrayers[i].sec <= ns) { currentIdx = i; break; }
  }
  const nextPrayer = activePrayers.find(p => p.sec > ns) || null;
  const nextDiff = nextPrayer ? nextPrayer.sec - ns : null;

  // Alarm logic
  useEffect(() => {
    if (!alarmOn) return;
    activePrayers.forEach(p => {
      if (!p.sec || p.noAlarm) return;
      const diff = p.sec - ns;

      const k2 = `${zone}_${p.key}_2min_${now.toDateString()}`;
      if (diff >= 118 && diff <= 122 && !firedRef.current[k2]) {
        firedRef.current[k2] = true;
        beepWarning(audioRef.current);
        setLog(l => [{ t: now.toLocaleTimeString("ms-MY", {hour:"2-digit",minute:"2-digit"}), msg:`⏰ 2 minit sebelum ${p.label}` }, ...l.slice(0,4)]);
      }

      const ka = `${zone}_${p.key}_adhan_${now.toDateString()}`;
      if (diff >= -3 && diff <= 3 && !firedRef.current[ka]) {
        firedRef.current[ka] = true;
        beepAdhan(audioRef.current);
        setLog(l => [{ t: now.toLocaleTimeString("ms-MY", {hour:"2-digit",minute:"2-digit"}), msg:`🕌 Masuk waktu ${p.label}` }, ...l.slice(0,4)]);
      }
    });
  }, [ns, alarmOn, zone]);

  // Formatting
  const timeStr = now.toLocaleTimeString("ms-MY", { hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false });
  const dateStr = now.toLocaleDateString("ms-MY", { weekday:"long", day:"numeric", month:"long", year:"numeric" });

  const isWarning = nextDiff !== null && nextDiff <= 120 && nextDiff > 0;
  const isAdhan   = nextDiff !== null && nextDiff <= 3;

  return (
    <div
      onClick={initAudio}
      style={{
        minHeight:"100vh", margin:0, padding:0,
        background:"#0b1320",
        fontFamily:"'Segoe UI', system-ui, sans-serif",
        color:"#e2d9c5",
        userSelect:"none",
      }}
    >
      {/* ── TOP CLOCK BAR ── */}
      <div style={{
        background:"linear-gradient(180deg,#112240 0%,#0b1320 100%)",
        borderBottom:"1px solid rgba(196,164,89,0.2)",
        padding:"20px 20px 16px",
        textAlign:"center",
        position:"relative",
      }}>
        {/* geometric Arabic-inspired accent */}
        <div style={{
          position:"absolute", top:0, left:0, right:0, height:"3px",
          background:"linear-gradient(90deg,transparent,#c4a459,transparent)",
        }}/>

        <div style={{ fontSize:11, letterSpacing:5, color:"#c4a459", textTransform:"uppercase", marginBottom:4 }}>
          Waktu Solat Malaysia
        </div>
        <div style={{
          fontSize:48, fontWeight:300, letterSpacing:2,
          fontVariantNumeric:"tabular-nums",
          color: isAdhan ? "#ffb347" : isWarning ? "#ff8c69" : "#f0e6c8",
          lineHeight:1, fontFamily:"'Courier New', monospace",
          transition:"color 0.5s",
        }}>
          {timeStr}
        </div>
        <div style={{ fontSize:13, color:"#8aaa7a", marginTop:6, letterSpacing:0.5 }}>
          {dateStr}
        </div>
        <div style={{ fontSize:11, color:"rgba(196,164,89,0.5)", marginTop:3 }}>
          Data: api.waktusolat.app · JAKIM
        </div>
      </div>

      {/* ── ZONE PICKER ── */}
      <div style={{ padding:"12px 16px 0" }}>
        <button
          onClick={e => { e.stopPropagation(); initAudio(); setShowZones(v => !v); }}
          style={{
            width:"100%", padding:"10px 14px",
            background:"rgba(196,164,89,0.1)",
            border:"1px solid rgba(196,164,89,0.35)",
            borderRadius:8, color:"#e2d9c5",
            display:"flex", justifyContent:"space-between", alignItems:"center",
            cursor:"pointer", fontSize:14,
          }}
        >
          <span>📍 {data.label}</span>
          <span style={{ color:"#c4a459", fontSize:12 }}>{showZones ? "▲ tutup" : "▼ tukar zon"}</span>
        </button>

        {showZones && (
          <div style={{
            marginTop:4, borderRadius:8,
            border:"1px solid rgba(196,164,89,0.2)",
            overflow:"hidden", maxHeight:220, overflowY:"auto",
          }}>
            {Object.entries(PRAYER_DB).map(([code, d]) => (
              <button key={code}
                onClick={e => { e.stopPropagation(); setZone(code); setShowZones(false); firedRef.current = {}; }}
                style={{
                  width:"100%", padding:"10px 14px", textAlign:"left",
                  background: code === zone ? "rgba(196,164,89,0.2)" : "rgba(11,19,32,0.95)",
                  border:"none", borderBottom:"1px solid rgba(255,255,255,0.04)",
                  color: code === zone ? "#c4a459" : "#e2d9c5",
                  cursor:"pointer", fontSize:13,
                  display:"flex", justifyContent:"space-between",
                }}
              >
                <span>{d.label}</span>
                {code === zone && <span>✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── NEXT PRAYER BANNER ── */}
      {nextPrayer && (
        <div style={{
          margin:"12px 16px 0",
          padding:"12px 16px",
          borderRadius:10,
          background: isWarning
            ? "linear-gradient(135deg,rgba(255,140,105,0.2),rgba(255,140,105,0.05))"
            : "linear-gradient(135deg,rgba(196,164,89,0.15),rgba(196,164,89,0.04))",
          border:`1px solid ${isWarning ? "rgba(255,140,105,0.5)" : "rgba(196,164,89,0.4)"}`,
          display:"flex", justifyContent:"space-between", alignItems:"center",
          transition:"all 0.4s",
        }}>
          <div>
            <div style={{ fontSize:11, color:"rgba(226,217,197,0.5)", letterSpacing:2, textTransform:"uppercase" }}>
              Waktu Seterusnya
            </div>
            <div style={{ fontSize:20, fontWeight:600, marginTop:2, color: isWarning ? "#ff8c69" : "#f0e6c8" }}>
              {nextPrayer.icon} {nextPrayer.label}
              <span style={{ fontSize:14, color:"rgba(226,217,197,0.5)", marginLeft:8 }}>{nextPrayer.time}</span>
            </div>
            {isWarning && !isAdhan && (
              <div style={{ fontSize:11, color:"#ff8c69", marginTop:2 }}>⚠️ Hampir masuk waktu!</div>
            )}
            {isAdhan && (
              <div style={{ fontSize:13, color:"#ffb347", fontWeight:"bold", marginTop:2 }}>🕌 MASUK WAKTU SEKARANG</div>
            )}
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:11, color:"rgba(226,217,197,0.4)" }}>lagi</div>
            <div style={{
              fontSize:26, fontWeight:700,
              fontFamily:"'Courier New', monospace",
              color: isWarning ? "#ff8c69" : "#c4a459",
              fontVariantNumeric:"tabular-nums",
            }}>
              {formatCountdown(nextDiff)}
            </div>
          </div>
        </div>
      )}

      {/* ── PRAYER LIST ── */}
      <div style={{ padding:"12px 16px 0" }}>
        {prayerList.map((p, i) => {
          if (!p.sec) return null;
          const isPast    = p.sec < ns;
          const isCurrent = currentIdx >= 0 && activePrayers[currentIdx]?.key === p.key;
          const isNext    = nextPrayer?.key === p.key;
          const isNearby  = isNext && nextDiff <= 120;
          const diff      = p.sec - ns;

          return (
            <div key={p.key} style={{
              display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"13px 16px",
              marginBottom:6,
              borderRadius:10,
              background: isCurrent
                ? "linear-gradient(135deg,rgba(138,170,122,0.2),rgba(138,170,122,0.06))"
                : isNearby
                ? "linear-gradient(135deg,rgba(255,140,105,0.15),rgba(255,140,105,0.04))"
                : "rgba(255,255,255,0.03)",
              border: isCurrent
                ? "1px solid rgba(138,170,122,0.5)"
                : isNearby
                ? "1px solid rgba(255,140,105,0.4)"
                : "1px solid rgba(255,255,255,0.05)",
              opacity: isPast && !isCurrent ? 0.45 : 1,
              transition:"all 0.3s",
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ fontSize:20, width:28, textAlign:"center" }}>{p.icon}</div>
                <div>
                  <div style={{
                    fontSize:16,
                    fontWeight: isCurrent || isNearby ? 600 : 400,
                    color: isCurrent ? "#8aaa7a" : isNearby ? "#ff8c69" : "#e2d9c5",
                  }}>
                    {p.label}
                  </div>
                  <div style={{ fontSize:11, color:"rgba(226,217,197,0.35)", letterSpacing:1 }}>
                    {p.arabik}
                  </div>
                  {isCurrent && (
                    <div style={{ fontSize:10, color:"#8aaa7a", letterSpacing:2, textTransform:"uppercase", marginTop:1 }}>
                      ● Waktu sekarang
                    </div>
                  )}
                </div>
              </div>

              <div style={{ textAlign:"right" }}>
                <div style={{
                  fontSize:22, fontWeight:700,
                  fontFamily:"'Courier New', monospace",
                  color: isCurrent ? "#8aaa7a" : isNearby ? "#ff8c69" : "#c4a459",
                }}>
                  {p.time}
                </div>
                <div style={{ fontSize:12, color:"rgba(226,217,197,0.35)", fontFamily:"monospace" }}>
                  {!isPast ? formatCountdown(diff) : "sudah lepas"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── ALARM PANEL ── */}
      <div style={{ padding:"12px 16px 20px" }}>
        <div style={{
          padding:"14px 16px",
          borderRadius:10,
          background:"rgba(255,255,255,0.03)",
          border:"1px solid rgba(255,255,255,0.07)",
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:"#e2d9c5" }}>🔔 Alarm Peringatan</div>
              <div style={{ fontSize:11, color:"rgba(226,217,197,0.4)", marginTop:2 }}>
                Bunyi 2 minit sebelum & tepat masuk waktu
              </div>
            </div>
            <button
              onClick={e => { e.stopPropagation(); initAudio(); setAlarmOn(v => !v); }}
              style={{
                padding:"7px 18px", borderRadius:20, border:"none",
                background: alarmOn ? "#8aaa7a" : "rgba(255,255,255,0.1)",
                color: alarmOn ? "#0b1320" : "#e2d9c5",
                fontWeight:700, fontSize:12, cursor:"pointer",
                transition:"all 0.2s",
              }}
            >
              {alarmOn ? "HIDUP" : "MATI"}
            </button>
          </div>

          {!audioReady && (
            <div style={{
              marginTop:10, padding:"8px 10px", borderRadius:6,
              background:"rgba(196,164,89,0.08)",
              border:"1px solid rgba(196,164,89,0.2)",
              fontSize:11, color:"#c4a459",
            }}>
              👆 Ketik mana-mana bahagian skrin untuk aktifkan audio
            </div>
          )}

          <div style={{ display:"flex", gap:8, marginTop:10 }}>
            <button
              onClick={e => { e.stopPropagation(); initAudio(); setTimeout(() => beepWarning(audioRef.current), 50); }}
              style={{
                flex:1, padding:"8px 0", borderRadius:6, border:"1px solid rgba(255,140,105,0.3)",
                background:"rgba(255,140,105,0.08)", color:"#ff8c69",
                fontSize:12, cursor:"pointer",
              }}
            >
              🔊 Test 2-min
            </button>
            <button
              onClick={e => { e.stopPropagation(); initAudio(); setTimeout(() => beepAdhan(audioRef.current), 50); }}
              style={{
                flex:1, padding:"8px 0", borderRadius:6, border:"1px solid rgba(196,164,89,0.3)",
                background:"rgba(196,164,89,0.08)", color:"#c4a459",
                fontSize:12, cursor:"pointer",
              }}
            >
              🕌 Test Waktu
            </button>
          </div>

          {log.length > 0 && (
            <div style={{ marginTop:10, borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:8 }}>
              <div style={{ fontSize:10, color:"rgba(226,217,197,0.3)", letterSpacing:2, marginBottom:4 }}>
                LOG ALARM
              </div>
              {log.map((l, i) => (
                <div key={i} style={{ fontSize:12, color:"rgba(226,217,197,0.55)", padding:"2px 0" }}>
                  <span style={{ color:"rgba(226,217,197,0.25)", marginRight:8 }}>{l.t}</span>
                  {l.msg}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
