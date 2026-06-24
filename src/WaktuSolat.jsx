import { useState, useEffect, useRef, useCallback } from "react";

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
  { key: "dhuhr",   label: "Zohor",   icon: "☀️",  arabik: "الظهر" },
  { key: "asr",     label: "Asar",    icon: "🌤️", arabik: "العصر" },
  { key: "maghrib", label: "Maghrib", icon: "🌅", arabik: "المغرب" },
  { key: "isha",    label: "Isyak",   icon: "🌙", arabik: "العشاء" },
];

const HADITH = [
  { arab: "إِنَّ الصَّلاَةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَاباً مَّوْقُوتاً", ms: "Sesungguhnya solat itu adalah kewajipan yang telah ditentukan waktunya ke atas orang-orang yang beriman.", ref: "Al-Quran, An-Nisa' 4:103" },
  { arab: "بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ", ms: "Islam dibina atas lima perkara — syahadah, mendirikan solat, menunaikan zakat, berpuasa Ramadan, dan menunaikan haji.", ref: "Hadith Riwayat Al-Bukhari & Muslim" },
  { arab: "أَوَّلُ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ صَلاَتُهُ", ms: "Amalan pertama yang akan dihisab daripada seorang hamba pada hari kiamat ialah solatnya.", ref: "Hadith Riwayat Abu Dawud & At-Tirmizi" },
  { arab: "الصَّلَوَاتُ الْخَمْسُ كَفَّارَةٌ لِمَا بَيْنَهُنَّ", ms: "Solat lima waktu adalah penebus dosa di antara waktu-waktunya, selagi mana dosa-dosa besar dijauhi.", ref: "Hadith Riwayat Muslim" },
  { arab: "مَثَلُ الصَّلَوَاتِ الْخَمْسِ كَمَثَلِ نَهَرٍ جَارٍ", ms: "Perumpamaan solat lima waktu adalah seperti sungai yang mengalir di depan pintu rumah seseorang, dia mandi padanya lima kali sehari.", ref: "Hadith Riwayat Al-Bukhari & Muslim" },
  { arab: "مَنْ صَلَّى الْبَرْدَيْنِ دَخَلَ الْجَنَّةَ", ms: "Sesiapa yang mengerjakan solat dua waktu yang dingin (Subuh dan Asar), nescaya dia akan masuk syurga.", ref: "Hadith Riwayat Al-Bukhari & Muslim" },
  { arab: "صَلِّ قَائِماً فَإِنْ لَمْ تَسْتَطِعْ فَقَاعِداً", ms: "Solatlah dalam keadaan berdiri, jika tidak mampu maka duduklah, jika tidak mampu maka berbaringlah.", ref: "Hadith Riwayat Al-Bukhari" },
  { arab: "لاَ تَزَالُ أُمَّتِي بِخَيْرٍ مَا حَافَظُوا عَلَى الصَّلَوَاتِ الْخَمْسِ", ms: "Umatku sentiasa berada dalam kebaikan selagi mana mereka menjaga solat lima waktu.", ref: "Hadith Riwayat Ibn Hibban" },
];

function toSeconds(t) { const [h,m] = t.split(":").map(Number); return h*3600+m*60; }
function nowSec() { const n=new Date(); return n.getHours()*3600+n.getMinutes()*60+n.getSeconds(); }
function fmt(sec) {
  if(sec<=0) return "—";
  const h=Math.floor(sec/3600), m=Math.floor((sec%3600)/60), s=sec%60;
  if(h>0) return `${h}j ${String(m).padStart(2,"0")}m ${String(s).padStart(2,"0")}s`;
  if(m>0) return `${m}m ${String(s).padStart(2,"0")}s`;
  return `${s}s`;
}

function beepTick(ctx) {
  if(!ctx) return;
  const o=ctx.createOscillator(), g=ctx.createGain();
  o.connect(g); g.connect(ctx.destination);
  o.frequency.value=660; o.type="sine";
  g.gain.setValueAtTime(0,ctx.currentTime);
  g.gain.linearRampToValueAtTime(0.3,ctx.currentTime+0.02);
  g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.15);
  o.start(ctx.currentTime); o.stop(ctx.currentTime+0.18);
}

function beepAdhan(ctx) {
  if(!ctx) return;
  // 3 beep serius — pendek, tegas, selang 0.5 saat
  [0, 0.55, 1.1].forEach(t => {
    const o=ctx.createOscillator(), g=ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value=880; o.type="square";
    const st=ctx.currentTime+t;
    g.gain.setValueAtTime(0,st);
    g.gain.linearRampToValueAtTime(0.35,st+0.03);
    g.gain.setValueAtTime(0.35,st+0.28);
    g.gain.exponentialRampToValueAtTime(0.001,st+0.42);
    o.start(st); o.stop(st+0.45);
  });
}

// Analog clock component
function AnalogClock({ now }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    const cx=110, cy=110, r=100;
    const h = now.getHours()%12 + now.getMinutes()/60 + now.getSeconds()/3600;
    const m = now.getMinutes() + now.getSeconds()/60;
    const s = now.getSeconds();

    ctx.clearRect(0,0,220,220);

    // Outer glow ring
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.strokeStyle="rgba(196,164,89,0.5)"; ctx.lineWidth=2; ctx.stroke();

    // Face
    ctx.beginPath(); ctx.arc(cx,cy,r-2,0,Math.PI*2);
    ctx.fillStyle="#0b1e35"; ctx.fill();

    // Minute markers
    for(let i=0;i<60;i++){
      const ang=(i/60)*Math.PI*2-Math.PI/2;
      const isHour=i%5===0;
      ctx.beginPath();
      ctx.moveTo(cx+Math.cos(ang)*(r-10), cy+Math.sin(ang)*(r-10));
      ctx.lineTo(cx+Math.cos(ang)*(r-(isHour?20:14)), cy+Math.sin(ang)*(r-(isHour?20:14)));
      ctx.strokeStyle=isHour?"rgba(196,164,89,0.9)":"rgba(196,164,89,0.3)";
      ctx.lineWidth=isHour?2.5:1;
      ctx.stroke();
    }

    // Hour numbers
    ctx.font="bold 11px 'Courier New'";
    ctx.fillStyle="rgba(196,164,89,0.7)";
    ctx.textAlign="center"; ctx.textBaseline="middle";
    [12,3,6,9].forEach((n,i)=>{
      const ang=(i/4)*Math.PI*2-Math.PI/2;
      ctx.fillText(n, cx+Math.cos(ang)*76, cy+Math.sin(ang)*76);
    });

    // Hour hand
    const hA=(h/12)*Math.PI*2-Math.PI/2;
    ctx.beginPath(); ctx.moveTo(cx,cy);
    ctx.lineTo(cx+Math.cos(hA)*55, cy+Math.sin(hA)*55);
    ctx.strokeStyle="#f0e6c8"; ctx.lineWidth=5; ctx.lineCap="round"; ctx.stroke();

    // Minute hand
    const mA=(m/60)*Math.PI*2-Math.PI/2;
    ctx.beginPath(); ctx.moveTo(cx,cy);
    ctx.lineTo(cx+Math.cos(mA)*76, cy+Math.sin(mA)*76);
    ctx.strokeStyle="#c4a459"; ctx.lineWidth=3; ctx.lineCap="round"; ctx.stroke();

    // Second hand
    const sA=(s/60)*Math.PI*2-Math.PI/2;
    ctx.beginPath(); ctx.moveTo(cx+Math.cos(sA+Math.PI)*18, cy+Math.sin(sA+Math.PI)*18);
    ctx.lineTo(cx+Math.cos(sA)*85, cy+Math.sin(sA)*85);
    ctx.strokeStyle="#ff8c69"; ctx.lineWidth=1.5; ctx.lineCap="round"; ctx.stroke();

    // Centre
    ctx.beginPath(); ctx.arc(cx,cy,6,0,Math.PI*2); ctx.fillStyle="#c4a459"; ctx.fill();
    ctx.beginPath(); ctx.arc(cx,cy,2.5,0,Math.PI*2); ctx.fillStyle="#ff8c69"; ctx.fill();
  }, [now]);

  return <canvas ref={canvasRef} width={220} height={220} />;
}

export default function WaktuSolat() {
  const [zone, setZone] = useState("WLY01");
  const [now, setNow] = useState(new Date());
  const [alarmOn, setAlarmOn] = useState(true);
  const [audioReady, setAudioReady] = useState(false);
  const [log, setLog] = useState([]);
  const [showZones, setShowZones] = useState(false);
  const [hadithIdx, setHadithIdx] = useState(0);
  const audioRef = useRef(null);
  const firedRef = useRef({});

  useEffect(() => { const t=setInterval(()=>setNow(new Date()),1000); return()=>clearInterval(t); }, []);

  // Rotate hadith every 10 saat
  useEffect(() => {
    const t = setInterval(() => setHadithIdx(i=>(i+1)%HADITH.length), 10000);
    return () => clearInterval(t);
  }, []);

  const initAudio = useCallback(() => {
    if(!audioRef.current) {
      audioRef.current = new (window.AudioContext||window.webkitAudioContext)();
      setAudioReady(true);
    } else if(audioRef.current.state==="suspended") {
      audioRef.current.resume().then(()=>setAudioReady(true));
    }
  }, []);

  const data = PRAYER_DB[zone];
  const prayerList = PRAYERS.map(p=>({ ...p, time:data[p.key]||null, sec:data[p.key]?toSeconds(data[p.key]):null }));
  const ns = nowSec();

  let currentIdx=-1;
  for(let i=prayerList.length-1;i>=0;i--){ if(prayerList[i].sec<=ns){currentIdx=i;break;} }
  const nextPrayer = prayerList.find(p=>p.sec>ns)||null;
  const nextDiff = nextPrayer ? nextPrayer.sec-ns : null;

  useEffect(() => {
    if(!alarmOn) return;
    prayerList.forEach(p=>{
      if(!p.sec) return;
      const diff=p.sec-ns;
      if(diff>=1&&diff<=60){
        const k=`${zone}_${p.key}_beep_${diff}_${now.toDateString()}`;
        if(!firedRef.current[k]){ firedRef.current[k]=true; beepTick(audioRef.current); if(diff===60) setLog(l=>[{t:now.toLocaleTimeString("ms-MY",{hour:"2-digit",minute:"2-digit"}),msg:`⏰ 1 minit sebelum ${p.label}`},...l.slice(0,4)]); }
      }
      const ka=`${zone}_${p.key}_adhan_${now.toDateString()}`;
      if(diff>=-3&&diff<=3&&!firedRef.current[ka]){
        firedRef.current[ka]=true; beepAdhan(audioRef.current);
        setLog(l=>[{t:now.toLocaleTimeString("ms-MY",{hour:"2-digit",minute:"2-digit"}),msg:`🕌 Masuk waktu ${p.label}`},...l.slice(0,4)]);
      }
    });
  }, [ns, alarmOn, zone]);

  const pad=n=>String(n).padStart(2,"0");
  const timeStr=`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const days=["Ahad","Isnin","Selasa","Rabu","Khamis","Jumaat","Sabtu"];
  const months=["Januari","Februari","Mac","April","Mei","Jun","Julai","Ogos","September","Oktober","November","Disember"];
  const dateStr=`${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  const isWarning=nextDiff!==null&&nextDiff<=60&&nextDiff>0;
  const isAdhan=nextDiff!==null&&nextDiff<=3;
  const hadith=HADITH[hadithIdx];

  // Build display list: prayer rows + hadith slots between them
  const displayItems = [];
  prayerList.forEach((p, i) => {
    displayItems.push({ type: "prayer", data: p });
    if(i < prayerList.length - 1) {
      displayItems.push({ type: "hadith", idx: i });
    }
  });

  return (
    <div onClick={initAudio} style={{ minHeight:"100vh", margin:0, padding:0, background:"#0b1320", fontFamily:"'Segoe UI',system-ui,sans-serif", color:"#e2d9c5", userSelect:"none" }}>

      {/* ── HEADER ── */}
      <div style={{ background:"linear-gradient(180deg,#112240 0%,#0b1320 100%)", borderBottom:"1px solid rgba(196,164,89,0.2)", padding:"16px 20px 12px", textAlign:"center", position:"relative" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"3px", background:"linear-gradient(90deg,transparent,#c4a459,transparent)" }}/>
        <div style={{ fontSize:10, letterSpacing:4, color:"#c4a459", textTransform:"uppercase", marginBottom:8 }}>Jam Solat Institut Teknologi Unggas</div>

        {/* Analog + Digital side by side */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:20, flexWrap:"wrap" }}>
          <AnalogClock now={now} />
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:42, fontWeight:300, letterSpacing:3, color:isAdhan?"#ffb347":isWarning?"#ff8c69":"#f0e6c8", fontFamily:"'Courier New',monospace", lineHeight:1 }}>{timeStr}</div>
            <div style={{ fontSize:13, color:"#8aaa7a", marginTop:6 }}>{dateStr}</div>
            <div style={{ fontSize:11, color:"rgba(196,164,89,0.5)", marginTop:4 }}>Data: api.waktusolat.app · JAKIM</div>

            {/* Next prayer countdown */}
            {nextPrayer && (
              <div style={{ marginTop:10, padding:"8px 14px", borderRadius:8, background:isWarning?"rgba(255,140,105,0.15)":"rgba(196,164,89,0.1)", border:`1px solid ${isWarning?"rgba(255,140,105,0.4)":"rgba(196,164,89,0.3)"}` }}>
                <div style={{ fontSize:11, color:"rgba(226,217,197,0.5)", letterSpacing:1 }}>WAKTU SETERUSNYA</div>
                <div style={{ fontSize:16, fontWeight:600, color:isWarning?"#ff8c69":"#f0e6c8", marginTop:2 }}>{nextPrayer.icon} {nextPrayer.label} · {nextPrayer.time}</div>
                <div style={{ fontSize:20, fontWeight:700, fontFamily:"'Courier New',monospace", color:isWarning?"#ff8c69":"#c4a459", marginTop:2 }}>{fmt(nextDiff)}</div>
                {isWarning&&!isAdhan&&<div style={{ fontSize:11, color:"#ff8c69" }}>🔔 Countdown {nextDiff}s lagi...</div>}
                {isAdhan&&<div style={{ fontSize:12, color:"#ffb347", fontWeight:"bold" }}>🕌 MASUK WAKTU!</div>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── ZONE PICKER ── */}
      <div style={{ padding:"10px 16px 0" }}>
        <button onClick={e=>{e.stopPropagation();initAudio();setShowZones(v=>!v);}} style={{ width:"100%", padding:"9px 14px", background:"rgba(196,164,89,0.1)", border:"1px solid rgba(196,164,89,0.35)", borderRadius:8, color:"#e2d9c5", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", fontSize:13 }}>
          <span>📍 {data.label}</span>
          <span style={{ color:"#c4a459", fontSize:11 }}>{showZones?"▲ tutup":"▼ tukar zon"}</span>
        </button>
        {showZones && (
          <div style={{ marginTop:4, borderRadius:8, border:"1px solid rgba(196,164,89,0.2)", overflow:"hidden", maxHeight:200, overflowY:"auto" }}>
            {Object.entries(PRAYER_DB).map(([code,d])=>(
              <button key={code} onClick={e=>{e.stopPropagation();setZone(code);setShowZones(false);firedRef.current={};}} style={{ width:"100%", padding:"9px 14px", textAlign:"left", background:code===zone?"rgba(196,164,89,0.2)":"rgba(11,19,32,0.95)", border:"none", borderBottom:"1px solid rgba(255,255,255,0.04)", color:code===zone?"#c4a459":"#e2d9c5", cursor:"pointer", fontSize:12, display:"flex", justifyContent:"space-between" }}>
                <span>{d.label}</span>{code===zone&&<span>✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── PRAYER LIST + HADITH ── */}
      <div style={{ padding:"10px 16px 0" }}>
        {displayItems.map((item, idx) => {
          if(item.type === "hadith") {
            const h = HADITH[item.idx % HADITH.length];
            return (
              <div key={`hadith-${idx}`} style={{ margin:"6px 0", padding:"12px 14px", borderRadius:10, background:"rgba(196,164,89,0.06)", border:"1px solid rgba(196,164,89,0.15)", textAlign:"center" }}>
                <div style={{ fontSize:10, letterSpacing:3, color:"rgba(196,164,89,0.5)", textTransform:"uppercase", marginBottom:6 }}>✦ Mutiara Hadith ✦</div>
                <div style={{ fontSize:15, color:"#c4a459", fontFamily:"serif", lineHeight:1.7, marginBottom:6, direction:"rtl" }}>{h.arab}</div>
                <div style={{ fontSize:12, color:"rgba(226,217,197,0.75)", lineHeight:1.6, fontStyle:"italic", marginBottom:4 }}>"{h.ms}"</div>
                <div style={{ fontSize:10, color:"rgba(196,164,89,0.5)" }}>— {h.ref}</div>
              </div>
            );
          }

          const p = item.data;
          if(!p.sec) return null;
          const isPast=p.sec<ns;
          const isCurrent=currentIdx>=0&&prayerList[currentIdx]?.key===p.key;
          const isNext=nextPrayer?.key===p.key;
          const isNearby=isNext&&nextDiff<=60;
          const diff=p.sec-ns;

          return (
            <div key={p.key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", marginBottom:4, borderRadius:10, background:isCurrent?"linear-gradient(135deg,rgba(138,170,122,0.2),rgba(138,170,122,0.06))":isNearby?"linear-gradient(135deg,rgba(255,140,105,0.15),rgba(255,140,105,0.04))":"rgba(255,255,255,0.03)", border:isCurrent?"1px solid rgba(138,170,122,0.5)":isNearby?"1px solid rgba(255,140,105,0.4)":"1px solid rgba(255,255,255,0.05)", opacity:isPast&&!isCurrent?0.45:1, transition:"all 0.3s" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ fontSize:22, width:28, textAlign:"center" }}>{p.icon}</div>
                <div>
                  <div style={{ fontSize:16, fontWeight:isCurrent||isNearby?600:400, color:isCurrent?"#8aaa7a":isNearby?"#ff8c69":"#e2d9c5" }}>{p.label}</div>
                  <div style={{ fontSize:11, color:"rgba(226,217,197,0.35)", letterSpacing:1 }}>{p.arabik}</div>
                  {isCurrent&&<div style={{ fontSize:10, color:"#8aaa7a", letterSpacing:2, textTransform:"uppercase", marginTop:1 }}>● Waktu sekarang</div>}
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:22, fontWeight:700, fontFamily:"'Courier New',monospace", color:isCurrent?"#8aaa7a":isNearby?"#ff8c69":"#c4a459" }}>{p.time}</div>
                <div style={{ fontSize:12, color:"rgba(226,217,197,0.35)", fontFamily:"monospace" }}>{!isPast?fmt(diff):"sudah lepas"}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── ALARM PANEL ── */}
      <div style={{ padding:"12px 16px 24px" }}>
        <div style={{ padding:"14px 16px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:"#e2d9c5" }}>🔔 Alarm Peringatan</div>
              <div style={{ fontSize:11, color:"rgba(226,217,197,0.4)", marginTop:2 }}>Beep countdown 60 saat · Nada masuk waktu 10 saat</div>
            </div>
            <button onClick={e=>{e.stopPropagation();initAudio();setAlarmOn(v=>!v);}} style={{ padding:"7px 18px", borderRadius:20, border:"none", background:alarmOn?"#8aaa7a":"rgba(255,255,255,0.1)", color:alarmOn?"#0b1320":"#e2d9c5", fontWeight:700, fontSize:12, cursor:"pointer" }}>
              {alarmOn?"HIDUP":"MATI"}
            </button>
          </div>
          {!audioReady&&<div style={{ marginTop:10, padding:"8px 10px", borderRadius:6, background:"rgba(196,164,89,0.08)", border:"1px solid rgba(196,164,89,0.2)", fontSize:11, color:"#c4a459" }}>👆 Ketik skrin untuk aktifkan audio</div>}
          <div style={{ display:"flex", gap:8, marginTop:10 }}>
            <button onClick={e=>{e.stopPropagation();initAudio();setTimeout(()=>beepTick(audioRef.current),50);}} style={{ flex:1, padding:"8px 0", borderRadius:6, border:"1px solid rgba(255,140,105,0.3)", background:"rgba(255,140,105,0.08)", color:"#ff8c69", fontSize:12, cursor:"pointer" }}>🔊 Test Countdown</button>
            <button onClick={e=>{e.stopPropagation();initAudio();setTimeout(()=>beepAdhan(audioRef.current),50);}} style={{ flex:1, padding:"8px 0", borderRadius:6, border:"1px solid rgba(196,164,89,0.3)", background:"rgba(196,164,89,0.08)", color:"#c4a459", fontSize:12, cursor:"pointer" }}>🕌 Test Waktu</button>
          </div>
          {log.length>0&&<div style={{ marginTop:10, borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:8 }}>
            <div style={{ fontSize:10, color:"rgba(226,217,197,0.3)", letterSpacing:2, marginBottom:4 }}>LOG ALARM</div>
            {log.map((l,i)=><div key={i} style={{ fontSize:12, color:"rgba(226,217,197,0.55)", padding:"2px 0" }}><span style={{ color:"rgba(226,217,197,0.25)", marginRight:8 }}>{l.t}</span>{l.msg}</div>)}
          </div>}
        </div>
      </div>
    </div>
  );
}
