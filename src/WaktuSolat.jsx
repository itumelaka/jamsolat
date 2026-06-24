import { useState, useEffect, useRef, useCallback } from "react";

const PRAYER_DB = {
  WLY01: { label: "Kuala Lumpur / Putrajaya",    lat:3.1390, lng:101.6869, fajr:"06:02", syuruk:"07:10", dhuhr:"13:20", asr:"16:33", maghrib:"19:25", isha:"20:36" },
  SGR01: { label: "Selangor – Petaling / Shah Alam", lat:3.0738, lng:101.5183, fajr:"06:01", syuruk:"07:09", dhuhr:"13:19", asr:"16:32", maghrib:"19:24", isha:"20:35" },
  SGR02: { label: "Selangor – Kuala Selangor",   lat:3.3408, lng:101.2567, fajr:"06:03", syuruk:"07:11", dhuhr:"13:21", asr:"16:34", maghrib:"19:26", isha:"20:37" },
  SGR03: { label: "Selangor – Klang / Kuala Langat", lat:3.0449, lng:101.4455, fajr:"06:00", syuruk:"07:08", dhuhr:"13:18", asr:"16:31", maghrib:"19:23", isha:"20:34" },
  JHR02: { label: "Johor Bahru",                  lat:1.4927, lng:103.7414, fajr:"05:59", syuruk:"07:08", dhuhr:"13:14", asr:"16:30", maghrib:"19:21", isha:"20:32" },
  JHR03: { label: "Johor – Kluang / Pontian",    lat:1.8578, lng:103.3278, fajr:"05:58", syuruk:"07:07", dhuhr:"13:13", asr:"16:29", maghrib:"19:20", isha:"20:31" },
  MLK01: { label: "Melaka",                       lat:2.1896, lng:102.2501, fajr:"06:00", syuruk:"07:09", dhuhr:"13:16", asr:"16:31", maghrib:"19:22", isha:"20:33" },
  NGS03: { label: "Seremban / Port Dickson",      lat:2.7297, lng:101.9381, fajr:"06:01", syuruk:"07:10", dhuhr:"13:17", asr:"16:32", maghrib:"19:23", isha:"20:34" },
  PNG01: { label: "Pulau Pinang",                 lat:5.4141, lng:100.3288, fajr:"06:06", syuruk:"07:15", dhuhr:"13:24", asr:"16:38", maghrib:"19:30", isha:"20:41" },
  KDH01: { label: "Kedah – Kota Setar",           lat:6.1184, lng:100.3685, fajr:"06:07", syuruk:"07:16", dhuhr:"13:25", asr:"16:39", maghrib:"19:31", isha:"20:42" },
  PRK02: { label: "Perak – Ipoh",                 lat:4.5975, lng:101.0901, fajr:"06:04", syuruk:"07:13", dhuhr:"13:22", asr:"16:36", maghrib:"19:28", isha:"20:39" },
  KTN01: { label: "Kelantan – Kota Bharu",        lat:6.1254, lng:102.2381, fajr:"06:04", syuruk:"07:14", dhuhr:"13:22", asr:"16:37", maghrib:"19:28", isha:"20:39" },
  TRG01: { label: "Terengganu – Kuala Terengganu",lat:5.3296, lng:103.1370, fajr:"06:03", syuruk:"07:13", dhuhr:"13:21", asr:"16:36", maghrib:"19:27", isha:"20:38" },
  PHG02: { label: "Pahang – Kuantan",             lat:3.8077, lng:103.3260, fajr:"06:02", syuruk:"07:12", dhuhr:"13:20", asr:"16:34", maghrib:"19:26", isha:"20:37" },
  SBH07: { label: "Sabah – Kota Kinabalu",        lat:5.9804, lng:116.0735, fajr:"05:38", syuruk:"06:48", dhuhr:"12:56", asr:"16:09", maghrib:"19:00", isha:"20:11" },
  SWK08: { label: "Sarawak – Kuching",            lat:1.5533, lng:110.3592, fajr:"05:42", syuruk:"06:52", dhuhr:"12:59", asr:"16:13", maghrib:"19:03", isha:"20:14" },
  PLS01: { label: "Perlis",                       lat:6.4449, lng:100.1986, fajr:"06:09", syuruk:"07:18", dhuhr:"13:27", asr:"16:41", maghrib:"19:33", isha:"20:44" },
};

const PRAYERS = [
  { key:"fajr",    label:"Subuh",   icon:"🌙", arabik:"الفجر" },
  { key:"dhuhr",   label:"Zohor",   icon:"☀️",  arabik:"الظهر" },
  { key:"asr",     label:"Asar",    icon:"🌤️", arabik:"العصر" },
  { key:"maghrib", label:"Maghrib", icon:"🌅", arabik:"المغرب" },
  { key:"isha",    label:"Isyak",   icon:"🌙", arabik:"العشاء" },
];

const HADITH = [
  { arab:"إِنَّ الصَّلاَةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَاباً مَّوْقُوتاً", ms:"Sesungguhnya solat itu adalah kewajipan yang telah ditentukan waktunya ke atas orang-orang yang beriman.", ref:"Al-Quran, An-Nisa' 4:103" },
  { arab:"بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ", ms:"Islam dibina atas lima perkara — syahadah, mendirikan solat, menunaikan zakat, berpuasa Ramadan, dan menunaikan haji.", ref:"Hadith Riwayat Al-Bukhari & Muslim" },
  { arab:"أَوَّلُ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ صَلاَتُهُ", ms:"Amalan pertama yang akan dihisab daripada seorang hamba pada hari kiamat ialah solatnya.", ref:"Hadith Riwayat Abu Dawud & At-Tirmizi" },
  { arab:"الصَّلَوَاتُ الْخَمْسُ كَفَّارَةٌ لِمَا بَيْنَهُنَّ", ms:"Solat lima waktu adalah penebus dosa di antara waktu-waktunya, selagi mana dosa-dosa besar dijauhi.", ref:"Hadith Riwayat Muslim" },
  { arab:"مَثَلُ الصَّلَوَاتِ الْخَمْسِ كَمَثَلِ نَهَرٍ جَارٍ", ms:"Perumpamaan solat lima waktu adalah seperti sungai yang mengalir di depan pintu rumah seseorang, dia mandi padanya lima kali sehari.", ref:"Hadith Riwayat Al-Bukhari & Muslim" },
  { arab:"مَنْ صَلَّى الْبَرْدَيْنِ دَخَلَ الْجَنَّةَ", ms:"Sesiapa yang mengerjakan solat dua waktu yang dingin (Subuh dan Asar), nescaya dia akan masuk syurga.", ref:"Hadith Riwayat Al-Bukhari & Muslim" },
  { arab:"صَلِّ قَائِماً فَإِنْ لَمْ تَسْتَطِعْ فَقَاعِداً", ms:"Solatlah dalam keadaan berdiri, jika tidak mampu maka duduklah, jika tidak mampu maka berbaringlah.", ref:"Hadith Riwayat Al-Bukhari" },
  { arab:"لاَ تَزَالُ أُمَّتِي بِخَيْرٍ مَا حَافَظُوا عَلَى الصَّلَوَاتِ الْخَمْسِ", ms:"Umatku sentiasa berada dalam kebaikan selagi mana mereka menjaga solat lima waktu.", ref:"Hadith Riwayat Ibn Hibban" },
];

const KAABAH = { lat:21.4225, lng:39.8262 };

function kiblatBearing(lat, lng) {
  const toRad = d => d*Math.PI/180;
  const toDeg = r => r*180/Math.PI;
  const dLng = toRad(KAABAH.lng - lng);
  const lat1 = toRad(lat), lat2 = toRad(KAABAH.lat);
  const y = Math.sin(dLng)*Math.cos(lat2);
  const x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLng);
  return (toDeg(Math.atan2(y,x)) + 360) % 360;
}

function toSec(t) { const [h,m]=t.split(":").map(Number); return h*3600+m*60; }
function nowSec() { const n=new Date(); return n.getHours()*3600+n.getMinutes()*60+n.getSeconds(); }
function fmt(sec) {
  if(sec<=0) return "—";
  const h=Math.floor(sec/3600), m=Math.floor((sec%3600)/60), s=sec%60;
  const p=v=>String(v).padStart(2,"0");
  if(h>0) return `${h}j ${p(m)}m ${p(s)}s`;
  if(m>0) return `${m}m ${p(s)}s`;
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
  [0,0.55,1.1].forEach(t=>{
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

function AnalogClock({ now }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    const cx=90, cy=90, r=84;
    const h=now.getHours()%12+now.getMinutes()/60+now.getSeconds()/3600;
    const m=now.getMinutes()+now.getSeconds()/60;
    const s=now.getSeconds();
    ctx.clearRect(0,0,180,180);

    // Face
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.strokeStyle="#1a6b3c"; ctx.lineWidth=3; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx,cy,r-2,0,Math.PI*2);
    ctx.fillStyle="#ffffff"; ctx.fill();

    // Markers
    for(let i=0;i<60;i++){
      const ang=(i/60)*Math.PI*2-Math.PI/2, isH=i%5===0;
      ctx.beginPath();
      ctx.moveTo(cx+Math.cos(ang)*(r-4),cy+Math.sin(ang)*(r-4));
      ctx.lineTo(cx+Math.cos(ang)*(r-(isH?16:8)),cy+Math.sin(ang)*(r-(isH?16:8)));
      ctx.strokeStyle=isH?"#1a6b3c":"#ccc";
      ctx.lineWidth=isH?2.5:1; ctx.stroke();
    }

    // Numbers
    ctx.font="bold 11px sans-serif"; ctx.fillStyle="#1a6b3c";
    ctx.textAlign="center"; ctx.textBaseline="middle";
    [{n:12,i:0},{n:3,i:1},{n:6,i:2},{n:9,i:3}].forEach(({n,i})=>{
      const ang=(i/4)*Math.PI*2-Math.PI/2;
      ctx.fillText(n, cx+Math.cos(ang)*64, cy+Math.sin(ang)*64);
    });

    // Hour hand
    const hA=(h/12)*Math.PI*2-Math.PI/2;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(hA)*48,cy+Math.sin(hA)*48);
    ctx.strokeStyle="#1a1a1a"; ctx.lineWidth=5; ctx.lineCap="round"; ctx.stroke();

    // Minute hand
    const mA=(m/60)*Math.PI*2-Math.PI/2;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(mA)*68,cy+Math.sin(mA)*68);
    ctx.strokeStyle="#1a6b3c"; ctx.lineWidth=3; ctx.lineCap="round"; ctx.stroke();

    // Second hand
    const sA=(s/60)*Math.PI*2-Math.PI/2;
    ctx.beginPath();
    ctx.moveTo(cx+Math.cos(sA+Math.PI)*14,cy+Math.sin(sA+Math.PI)*14);
    ctx.lineTo(cx+Math.cos(sA)*74,cy+Math.sin(sA)*74);
    ctx.strokeStyle="#e63946"; ctx.lineWidth=1.5; ctx.lineCap="round"; ctx.stroke();

    ctx.beginPath(); ctx.arc(cx,cy,5,0,Math.PI*2); ctx.fillStyle="#1a6b3c"; ctx.fill();
    ctx.beginPath(); ctx.arc(cx,cy,2.5,0,Math.PI*2); ctx.fillStyle="#fff"; ctx.fill();
  }, [now]);
  return <canvas ref={canvasRef} width={180} height={180} />;
}

function KiblatCompass({ bearing, deviceHeading }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    const cx=80, cy=80, r=72;
    ctx.clearRect(0,0,160,160);

    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.strokeStyle="#1a6b3c"; ctx.lineWidth=2; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx,cy,r-2,0,Math.PI*2);
    ctx.fillStyle="#f8f7f4"; ctx.fill();

    for(let i=0;i<360;i+=10){
      const ang=i*Math.PI/180-Math.PI/2, isMain=i%90===0, isMid=i%45===0;
      ctx.beginPath();
      ctx.moveTo(cx+Math.cos(ang)*(r-4),cy+Math.sin(ang)*(r-4));
      ctx.lineTo(cx+Math.cos(ang)*(r-(isMain?14:isMid?10:6)),cy+Math.sin(ang)*(r-(isMain?14:isMid?10:6)));
      ctx.strokeStyle=isMain?"#1a6b3c":"#ccc";
      ctx.lineWidth=isMain?2:1; ctx.stroke();
    }

    ctx.font="bold 11px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
    [{l:"U",a:-90,c:"#e63946"},{l:"S",a:90,c:"#999"},{l:"T",a:0,c:"#999"},{l:"B",a:180,c:"#999"}].forEach(({l,a,c})=>{
      const ang=a*Math.PI/180;
      ctx.fillStyle=c;
      ctx.fillText(l, cx+Math.cos(ang)*(r-8), cy+Math.sin(ang)*(r-8));
    });

    const kiblatAng = deviceHeading !== null
      ? (bearing - deviceHeading - 90)*Math.PI/180
      : (bearing - 90)*Math.PI/180;
    const arrowLen = r-16;
    const tipX = cx+Math.cos(kiblatAng)*arrowLen;
    const tipY = cy+Math.sin(kiblatAng)*arrowLen;
    const perpAng = kiblatAng+Math.PI/2;

    ctx.beginPath();
    ctx.moveTo(cx-Math.cos(kiblatAng)*14, cy-Math.sin(kiblatAng)*14);
    ctx.lineTo(tipX, tipY);
    ctx.strokeStyle="#1a6b3c"; ctx.lineWidth=3; ctx.lineCap="round"; ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(tipX-Math.cos(kiblatAng)*12+Math.cos(perpAng)*6, tipY-Math.sin(kiblatAng)*12+Math.sin(perpAng)*6);
    ctx.lineTo(tipX-Math.cos(kiblatAng)*12-Math.cos(perpAng)*6, tipY-Math.sin(kiblatAng)*12-Math.sin(perpAng)*6);
    ctx.closePath(); ctx.fillStyle="#1a6b3c"; ctx.fill();

    ctx.font="14px serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText("🕋", tipX+Math.cos(kiblatAng)*12, tipY+Math.sin(kiblatAng)*12);

    ctx.beginPath(); ctx.arc(cx,cy,5,0,Math.PI*2); ctx.fillStyle="#1a6b3c"; ctx.fill();
    ctx.beginPath(); ctx.arc(cx,cy,2,0,Math.PI*2); ctx.fillStyle="#fff"; ctx.fill();
  }, [bearing, deviceHeading]);
  return <canvas ref={canvasRef} width={160} height={160} />;
}

export default function WaktuSolat() {
  const [zone, setZone] = useState("WLY01");
  const [now, setNow] = useState(new Date());
  const [alarmOn, setAlarmOn] = useState(true);
  const [audioReady, setAudioReady] = useState(false);
  const [showZones, setShowZones] = useState(false);
  const [hadithIdx, setHadithIdx] = useState(0);
  const [hadithFade, setHadithFade] = useState(true);
  const [deviceHeading, setDeviceHeading] = useState(null);
  const [compassPerm, setCompassPerm] = useState("idle");
  const audioRef = useRef(null);
  const firedRef = useRef({});

  useEffect(() => { const t=setInterval(()=>setNow(new Date()),1000); return()=>clearInterval(t); }, []);

  // Auto rotate hadith every 12 saat with fade
  useEffect(() => {
    const t = setInterval(() => {
      setHadithFade(false);
      setTimeout(() => {
        setHadithIdx(i=>(i+1)%HADITH.length);
        setHadithFade(true);
      }, 500);
    }, 12000);
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

  const handleOrientation = useCallback((e) => {
    if(e.webkitCompassHeading!==undefined) setDeviceHeading(e.webkitCompassHeading);
    else if(e.alpha!==null) setDeviceHeading(360-e.alpha);
  }, []);

  const requestCompass = useCallback(() => {
    if(typeof DeviceOrientationEvent!=="undefined" && typeof DeviceOrientationEvent.requestPermission==="function") {
      DeviceOrientationEvent.requestPermission().then(state=>{
        if(state==="granted") { setCompassPerm("granted"); window.addEventListener("deviceorientation",handleOrientation); }
        else setCompassPerm("denied");
      });
    } else {
      setCompassPerm("granted");
      window.addEventListener("deviceorientation",handleOrientation);
    }
  }, [handleOrientation]);

  useEffect(() => { return()=>window.removeEventListener("deviceorientation",handleOrientation); }, [handleOrientation]);

  const isMobile = window.innerWidth < 768;
  const data = PRAYER_DB[zone];
  const kiblat = kiblatBearing(data.lat, data.lng);
  const prayerList = PRAYERS.map(p=>({ ...p, time:data[p.key]||null, sec:data[p.key]?toSec(data[p.key]):null }));
  const ns = nowSec();

  let currentIdx=-1;
  for(let i=prayerList.length-1;i>=0;i--){ if(prayerList[i].sec<=ns){currentIdx=i;break;} }
  const nextPrayer=prayerList.find(p=>p.sec>ns)||null;
  const nextDiff=nextPrayer?nextPrayer.sec-ns:null;
  const isWarning=nextDiff!==null&&nextDiff<=60&&nextDiff>0;
  const isAdhan=nextDiff!==null&&nextDiff<=3;

  useEffect(()=>{
    if(!alarmOn) return;
    prayerList.forEach(p=>{
      if(!p.sec) return;
      const diff=p.sec-ns;
      if(diff>=1&&diff<=60){
        const k=`${zone}_${p.key}_beep_${diff}_${now.toDateString()}`;
        if(!firedRef.current[k]){ firedRef.current[k]=true; beepTick(audioRef.current); }
      }
      const ka=`${zone}_${p.key}_adhan_${now.toDateString()}`;
      if(diff>=-3&&diff<=3&&!firedRef.current[ka]){ firedRef.current[ka]=true; beepAdhan(audioRef.current); }
    });
  }, [ns, alarmOn, zone]);

  const pad=n=>String(n).padStart(2,"0");
  const timeStr=`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const days=["Ahad","Isnin","Selasa","Rabu","Khamis","Jumaat","Sabtu"];
  const months=["Januari","Februari","Mac","April","Mei","Jun","Julai","Ogos","September","Oktober","November","Disember"];
  const dateStr=`${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  const hadith = HADITH[hadithIdx];

  const G = "#1a6b3c"; // hijau ITU

  return (
    <div onClick={initAudio} style={{ minHeight:"100vh", background:"#f8f7f4", fontFamily:"'Segoe UI',system-ui,sans-serif", color:"#1a1a1a" }}>

      {/* ── HEADER ── */}
      <div style={{ background:"#fff", borderBottom:`3px solid ${G}`, padding:"12px 24px", display:"flex", alignItems:"center", gap:16 }}>
        <img src="/icon-512.png" alt="Logo" style={{ width:64, height:64, objectFit:"contain" }} />
        <div style={{ flex:1 }}>
          <div style={{ fontSize:11, letterSpacing:3, color:G, textTransform:"uppercase", fontWeight:700 }}>
            Jam Solat Surau · Institut Teknologi Unggas
          </div>
          <div style={{ fontSize:13, color:"#888", marginTop:3 }}>{dateStr}</div>
        </div>

        {/* Analog + Digital */}
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <AnalogClock now={now} />
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:44, fontWeight:300, fontFamily:"'Courier New',monospace", color:isAdhan?"#e63946":isWarning?"#e8a020":"#1a1a1a", lineHeight:1 }}>{timeStr}</div>
            {nextPrayer && (
              <div style={{ marginTop:6, padding:"6px 12px", borderRadius:8, background:isWarning?"#fff8e6":isAdhan?"#fff0f0":"#f0f9f4", border:`1px solid ${isWarning?"#e8a020":isAdhan?"#e63946":G}`, textAlign:"right" }}>
                <div style={{ fontSize:10, color:"#999", letterSpacing:1, textTransform:"uppercase" }}>Waktu Seterusnya</div>
                <div style={{ fontSize:16, fontWeight:700, color:isWarning?"#e8a020":isAdhan?"#e63946":G }}>{nextPrayer.icon} {nextPrayer.label} · {nextPrayer.time}</div>
                <div style={{ fontSize:22, fontWeight:700, fontFamily:"'Courier New',monospace", color:isWarning?"#e8a020":isAdhan?"#e63946":G }}>{fmt(nextDiff)}</div>
                {isAdhan && <div style={{ fontSize:11, fontWeight:700, color:"#e63946" }}>🕌 MASUK WAKTU SEKARANG!</div>}
              </div>
            )}
          </div>
        </div>

        {/* Zone picker */}
        <div style={{ position:"relative" }}>
          <button onClick={e=>{e.stopPropagation();setShowZones(v=>!v);}} style={{ padding:"8px 14px", background:"#f0f9f4", border:`1px solid ${G}`, borderRadius:8, color:G, fontSize:13, cursor:"pointer", fontWeight:600 }}>
            📍 {zone} {showZones?"▲":"▼"}
          </button>
          {showZones && (
            <div style={{ position:"absolute", right:0, top:"110%", zIndex:99, width:280, borderRadius:8, border:`1px solid ${G}`, background:"#fff", overflow:"hidden", maxHeight:300, overflowY:"auto", boxShadow:"0 4px 16px rgba(0,0,0,0.1)" }}>
              {Object.entries(PRAYER_DB).map(([code,d])=>(
                <button key={code} onClick={e=>{e.stopPropagation();setZone(code);setShowZones(false);firedRef.current={};}} style={{ width:"100%", padding:"9px 14px", textAlign:"left", background:code===zone?"#f0f9f4":"#fff", border:"none", borderBottom:"1px solid #f0f0f0", color:code===zone?G:"#333", cursor:"pointer", fontSize:12, display:"flex", justifyContent:"space-between" }}>
                  <span>{d.label}</span>{code===zone&&<span style={{ color:G }}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── 5 WAKTU SOLAT ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, padding:"16px 24px" }}>
        {prayerList.map(p=>{
          if(!p.sec) return null;
          const isPast=p.sec<ns;
          const isCurrent=currentIdx>=0&&prayerList[currentIdx]?.key===p.key;
          const isNext=nextPrayer?.key===p.key;
          const isNear=isNext&&nextDiff<=60;
          const diff=p.sec-ns;
          return (
            <div key={p.key} style={{ background:isCurrent?"#f0f9f4":isNear?"#fff8e6":"#fff", borderRadius:14, border:isCurrent?`2.5px solid ${G}`:isNear?"2.5px solid #e8a020":"1.5px solid #e8e5de", padding:"20px 16px", textAlign:"center", opacity:isPast&&!isCurrent?0.4:1, transition:"all 0.3s" }}>
              <div style={{ fontSize:32, marginBottom:8 }}>{p.icon}</div>
              <div style={{ fontSize:24, fontWeight:700, color:isCurrent?G:isNear?"#e8a020":"#1a1a1a" }}>{p.label}</div>
              <div style={{ fontSize:13, color:"#aaa", marginTop:2 }}>{p.arabik}</div>
              <div style={{ fontSize:38, fontWeight:700, fontFamily:"'Courier New',monospace", color:isCurrent?G:isNear?"#e8a020":"#1a1a1a", marginTop:8, lineHeight:1 }}>{p.time}</div>
              <div style={{ fontSize:13, marginTop:6, color:isCurrent?G:isNear?"#e8a020":"#999", fontWeight:isCurrent||isNear?600:400 }}>
                {isCurrent?"● WAKTU SEKARANG":isPast?"sudah lepas":fmt(diff)}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── HADITH + KIBLAT ── */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":`1fr ${isMobile?"":"300px"}`, gap:12, padding:"0 24px 16px" }}>

        {/* Hadith */}
        <div style={{ background:"#fff", borderRadius:14, border:`1.5px solid #e8e5de`, padding:"20px 24px", textAlign:"center", transition:"opacity 0.5s", opacity:hadithFade?1:0 }}>
          <div style={{ fontSize:10, letterSpacing:3, color:G, textTransform:"uppercase", fontWeight:700, marginBottom:10 }}>✦ Mutiara Hadith ✦</div>
          <div style={{ fontSize:22, color:G, fontFamily:"serif", direction:"rtl", lineHeight:1.8, marginBottom:10 }}>{hadith.arab}</div>
          <div style={{ fontSize:16, color:"#444", lineHeight:1.7, fontStyle:"italic", marginBottom:8 }}>"{hadith.ms}"</div>
          <div style={{ fontSize:12, color:"#aaa" }}>— {hadith.ref}</div>
          {/* Dots indicator */}
          <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:12 }}>
            {HADITH.map((_,i)=>(
              <div key={i} style={{ width:i===hadithIdx?20:6, height:6, borderRadius:3, background:i===hadithIdx?G:"#ddd", transition:"all 0.3s" }}/>
            ))}
          </div>
        </div>

        {/* Kiblat — mobile only */}
        {isMobile && (
          <div style={{ background:"#fff", borderRadius:14, border:`1.5px solid #e8e5de`, padding:"16px", textAlign:"center" }}>
            <div style={{ fontSize:10, letterSpacing:3, color:G, textTransform:"uppercase", fontWeight:700, marginBottom:10 }}>🧭 Arah Kiblat</div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, flexWrap:"wrap" }}>
              <KiblatCompass bearing={kiblat} deviceHeading={deviceHeading} />
              <div>
                <div style={{ fontSize:40, fontWeight:700, color:G, fontFamily:"'Courier New',monospace" }}>{Math.round(kiblat)}°</div>
                <div style={{ fontSize:12, color:"#888", marginTop:4 }}>dari Utara</div>
                <div style={{ fontSize:11, color:"#aaa", marginTop:2 }}>🕋 Kaabah, Makkah</div>
                {compassPerm==="idle" && (
                  <button onClick={e=>{e.stopPropagation();requestCompass();}} style={{ marginTop:10, padding:"8px 14px", borderRadius:20, border:`1px solid ${G}`, background:"#f0f9f4", color:G, fontSize:12, cursor:"pointer" }}>
                    📱 Aktif Kompas
                  </button>
                )}
                {compassPerm==="granted"&&deviceHeading!==null && (
                  <div style={{ marginTop:8, padding:"6px 10px", borderRadius:8, background:"#f0f9f4", border:`1px solid ${G}`, fontSize:11, color:G }}>
                    ✅ Kompas aktif — pusing badan sampai 🕋 ke atas
                  </div>
                )}
                {compassPerm==="denied" && <div style={{ marginTop:8, fontSize:11, color:"#e63946" }}>❌ Akses ditolak</div>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── ALARM + FOOTER ── */}
      <div style={{ margin:"0 24px 24px", padding:"14px 18px", background:"#fff", borderRadius:14, border:"1.5px solid #e8e5de" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:"#1a1a1a" }}>🔔 Alarm Peringatan</div>
            <div style={{ fontSize:12, color:"#999", marginTop:2 }}>Beep countdown 60 saat · 3 beep masuk waktu</div>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button onClick={e=>{e.stopPropagation();initAudio();setTimeout(()=>beepTick(audioRef.current),50);}} style={{ padding:"7px 14px", borderRadius:8, border:`1px solid ${G}`, background:"#f0f9f4", color:G, fontSize:12, cursor:"pointer" }}>🔊 Test</button>
            <button onClick={e=>{e.stopPropagation();initAudio();setAlarmOn(v=>!v);}} style={{ padding:"7px 18px", borderRadius:20, border:"none", background:alarmOn?G:"#ddd", color:alarmOn?"#fff":"#666", fontWeight:700, fontSize:13, cursor:"pointer" }}>
              {alarmOn?"HIDUP":"MATI"}
            </button>
          </div>
        </div>
        {!audioReady && <div style={{ marginTop:8, fontSize:11, color:"#e8a020", background:"#fff8e6", padding:"6px 10px", borderRadius:6, border:"1px solid #e8a020" }}>👆 Ketik skrin untuk aktifkan audio</div>}
      </div>

      {/* Footer */}
      <div style={{ borderTop:"1px solid #e8e5de", background:"#fff", padding:"10px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <img src="/icon-512.png" alt="" style={{ width:24, height:24, objectFit:"contain" }} />
          <span style={{ fontSize:11, color:"#bbb" }}>Institut Teknologi Unggas · jamsolatitu.netlify.app</span>
        </div>
        <span style={{ fontSize:11, color:"#bbb" }}>Data: api.waktusolat.app · JAKIM · {zone}</span>
      </div>
    </div>
  );
}
