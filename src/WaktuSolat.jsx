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
  // Beep pendek medium — countdown 10 saat
  const o=ctx.createOscillator(), g=ctx.createGain();
  o.connect(g); g.connect(ctx.destination);
  o.frequency.value=880; o.type="sine";
  g.gain.setValueAtTime(0,ctx.currentTime);
  g.gain.linearRampToValueAtTime(0.5,ctx.currentTime+0.02);
  g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.2);
  o.start(ctx.currentTime); o.stop(ctx.currentTime+0.22);
}

function beepAdhan(ctx) {
  if(!ctx) return;
  // Bunyi KRIIIINGGG 5 saat — macam loceng
  const duration = 5.0;
  const o=ctx.createOscillator(), g=ctx.createGain();
  o.connect(g); g.connect(ctx.destination);
  o.frequency.value=1046; // C6 — bunyi tinggi macam loceng
  o.type="sine";
  // Envelope — naik cepat, sustain, turun perlahan
  g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(0.7, ctx.currentTime+0.05);
  g.gain.setValueAtTime(0.7, ctx.currentTime+0.3);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+duration);
  o.start(ctx.currentTime); o.stop(ctx.currentTime+duration);

  // Harmonic kedua — bagi bunyi lebih "ting" macam loceng sebenar
  const o2=ctx.createOscillator(), g2=ctx.createGain();
  o2.connect(g2); g2.connect(ctx.destination);
  o2.frequency.value=2093; // C7 — octave atas
  o2.type="sine";
  g2.gain.setValueAtTime(0, ctx.currentTime);
  g2.gain.linearRampToValueAtTime(0.3, ctx.currentTime+0.03);
  g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+2.5);
  o2.start(ctx.currentTime); o2.stop(ctx.currentTime+2.5);

  // Harmonic ketiga — depth
  const o3=ctx.createOscillator(), g3=ctx.createGain();
  o3.connect(g3); g3.connect(ctx.destination);
  o3.frequency.value=523; // C5 — bass sikit
  o3.type="sine";
  g3.gain.setValueAtTime(0, ctx.currentTime);
  g3.gain.linearRampToValueAtTime(0.4, ctx.currentTime+0.05);
  g3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+3.0);
  o3.start(ctx.currentTime); o3.stop(ctx.currentTime+3.0);
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


// ── AYAM SVG ANIMATED ───────────────────────────────────────────────────────
function ChickenSVG({ type, size=60 }) {
  const colors = {
    jantan:   { body:"#8B4513", head:"#CD853F", comb:"#DC143C", beak:"#DAA520", leg:"#DAA520", tail:"#4a2800" },
    betina:   { body:"#D2691E", head:"#DEB887", comb:"#FF6B6B", beak:"#DAA520", leg:"#DAA520", tail:"#8B4513" },
    pedaging: { body:"#F5F5DC", head:"#FFFACD", comb:"#FF4500", beak:"#FFD700", leg:"#FFA500", tail:"#DDD" },
    penelur:  { body:"#8B0000", head:"#A0522D", comb:"#FF0000", beak:"#FFD700", leg:"#DAA520", tail:"#600000" },
    puyuh:    { body:"#8B7355", head:"#A0896C", comb:"#8B4513", beak:"#DAA520", leg:"#DAA520", tail:"#6B5B3E" },
    anak:     { body:"#FFD700", head:"#FFE44D", comb:"#FFA500", beak:"#FFA500", leg:"#FFA500", tail:"#FFC000" },
  };
  const c = colors[type] || colors.betina;
  const s = size;

  return (
    <svg width={s} height={s} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      {/* Ekor */}
      <ellipse cx="10" cy="28" rx="8" ry="5" fill={c.tail} transform="rotate(-30 10 28)"/>
      <ellipse cx="8" cy="24" rx="6" ry="3" fill={c.tail} transform="rotate(-50 8 24)"/>

      {/* Badan */}
      <ellipse cx="30" cy="32" rx="16" ry="12" fill={c.body}/>

      {/* Sayap */}
      <ellipse cx="26" cy="34" rx="10" ry="6" fill={c.tail} opacity="0.7"/>

      {/* Leher */}
      <ellipse cx="42" cy="26" rx="6" ry="8" fill={c.head}/>

      {/* Kepala */}
      <circle cx="44" cy="18" r="8" fill={c.head}/>

      {/* Jambul/Comb */}
      {type !== 'puyuh' && type !== 'anak' ? (
        <>
          <ellipse cx="42" cy="11" rx="3" ry="4" fill={c.comb}/>
          <ellipse cx="46" cy="10" rx="2.5" ry="3.5" fill={c.comb}/>
          <ellipse cx="44" cy="9" rx="2" ry="3" fill={c.comb}/>
        </>
      ) : (
        <ellipse cx="44" cy="11" rx="2" ry="5" fill={c.comb} transform="rotate(-20 44 11)"/>
      )}

      {/* Paruh */}
      <polygon points="52,18 58,16 52,21" fill={c.beak}/>

      {/* Mata */}
      <circle cx="47" cy="17" r="2" fill="#1a1a1a"/>
      <circle cx="48" cy="16" r="0.7" fill="white"/>

      {/* Gelambir */}
      {type !== 'anak' && <ellipse cx="52" cy="22" rx="2" ry="3" fill={c.comb} opacity="0.8"/>}

      {/* Kaki kiri */}
      <line x1="26" y1="43" x2="22" y2="52" stroke={c.leg} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="22" y1="52" x2="16" y2="54" stroke={c.leg} strokeWidth="2" strokeLinecap="round"/>
      <line x1="22" y1="52" x2="22" y2="57" stroke={c.leg} strokeWidth="2" strokeLinecap="round"/>
      <line x1="22" y1="52" x2="27" y2="56" stroke={c.leg} strokeWidth="2" strokeLinecap="round"/>

      {/* Kaki kanan */}
      <line x1="34" y1="43" x2="38" y2="52" stroke={c.leg} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="38" y1="52" x2="32" y2="54" stroke={c.leg} strokeWidth="2" strokeLinecap="round"/>
      <line x1="38" y1="52" x2="38" y2="57" stroke={c.leg} strokeWidth="2" strokeLinecap="round"/>
      <line x1="38" y1="52" x2="43" y2="56" stroke={c.leg} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function Chicken({ type, size, speed, startX, startY }) {
  const [x, setX] = useState(startX);
  const [y, setY] = useState(startY);
  const [dir, setDir] = useState(1);
  const [frame, setFrame] = useState(0);
  const [pecking, setPecking] = useState(false);
  const [peckAngle, setPeckAngle] = useState(0);
  const xRef = useRef(startX);
  const dirRef = useRef(1);
  const peckRef = useRef(false);

  useEffect(() => {
    // Walking animation frames
    const walk = setInterval(() => {
      if(peckRef.current) return;
      setFrame(f => (f+1) % 8);
      let newX = xRef.current + dirRef.current * speed;
      if(newX > window.innerWidth - size - 10) { dirRef.current = -1; newX = window.innerWidth - size - 10; }
      if(newX < 10) { dirRef.current = 1; newX = 10; }
      xRef.current = newX;
      setX(newX);
      setDir(dirRef.current);
    }, 120);

    // Random peck every 4-10 saat
    const peckTimer = setInterval(() => {
      if(Math.random() > 0.4) {
        peckRef.current = true;
        setPecking(true);
        let peckFrame = 0;
        const peckAnim = setInterval(() => {
          setPeckAngle(peckFrame < 5 ? peckFrame * 8 : (10 - peckFrame) * 8);
          peckFrame++;
          if(peckFrame >= 10) {
            clearInterval(peckAnim);
            peckRef.current = false;
            setPecking(false);
            setPeckAngle(0);
          }
        }, 100);
      }
    }, (4 + Math.random() * 6) * 1000);

    // Random jump to new Y position
    const jumpTimer = setInterval(() => {
      const newY = 10 + Math.random() * (window.innerHeight - 100);
      setY(newY);
    }, (10 + Math.random() * 15) * 1000);

    return () => { clearInterval(walk); clearInterval(peckTimer); clearInterval(jumpTimer); };
  }, [speed, size]);

  // Kaki animation — alternate lifting
  const legSwing = Math.sin(frame * Math.PI / 4) * 12;
  const bodyBob = Math.abs(Math.sin(frame * Math.PI / 4)) * 3;
  const headBob = pecking ? peckAngle : 0;

  return (
    <div style={{
      position:"fixed",
      left: x,
      top: y - bodyBob,
      zIndex: 998,
      transform: `scaleX(${dir === -1 ? -1 : 1})`,
      pointerEvents:"none",
      userSelect:"none",
      transition:"top 0.5s ease",
    }}>
      {/* Kepala + badan dengan bob */}
      <svg width={size} height={size} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
        {(() => {
          const c = {
            jantan:   { body:"#8B4513", head:"#CD853F", comb:"#DC143C", beak:"#DAA520", leg:"#DAA520", tail:"#4a2800" },
            betina:   { body:"#D2691E", head:"#DEB887", comb:"#FF6B6B", beak:"#DAA520", leg:"#DAA520", tail:"#8B4513" },
            pedaging: { body:"#F5F5DC", head:"#FFFACD", comb:"#FF4500", beak:"#FFD700", leg:"#FFA500", tail:"#DDD" },
            penelur:  { body:"#8B0000", head:"#A0522D", comb:"#FF0000", beak:"#FFD700", leg:"#DAA520", tail:"#600000" },
            puyuh:    { body:"#8B7355", head:"#A0896C", comb:"#8B4513", beak:"#DAA520", leg:"#DAA520", tail:"#6B5B3E" },
            anak:     { body:"#FFD700", head:"#FFE44D", comb:"#FFA500", beak:"#FFA500", leg:"#FFA500", tail:"#FFC000" },
          }[type] || { body:"#D2691E", head:"#DEB887", comb:"#FF6B6B", beak:"#DAA520", leg:"#DAA520", tail:"#8B4513" };

          return (
            <>
              {/* Ekor */}
              <ellipse cx="10" cy="28" rx="8" ry="5" fill={c.tail} transform="rotate(-30 10 28)"/>
              <ellipse cx="8" cy="24" rx="6" ry="3" fill={c.tail} transform="rotate(-50 8 24)"/>

              {/* Badan */}
              <ellipse cx="30" cy="32" rx="16" ry="12" fill={c.body}/>
              <ellipse cx="26" cy="34" rx="10" ry="6" fill={c.tail} opacity="0.6"/>

              {/* Leher + kepala dengan peck rotation */}
              <g transform={`rotate(${headBob} 44 26)`}>
                <ellipse cx="42" cy="26" rx="6" ry="8" fill={c.head}/>
                <circle cx="44" cy="18" r="8" fill={c.head}/>
                {type !== 'puyuh' && type !== 'anak' ? (
                  <>
                    <ellipse cx="42" cy="11" rx="3" ry="4" fill={c.comb}/>
                    <ellipse cx="46" cy="10" rx="2.5" ry="3.5" fill={c.comb}/>
                    <ellipse cx="44" cy="9" rx="2" ry="3" fill={c.comb}/>
                  </>
                ) : (
                  <ellipse cx="44" cy="11" rx="2" ry="5" fill={c.comb} transform="rotate(-20 44 11)"/>
                )}
                <polygon points="52,18 59,15 52,21" fill={c.beak}/>
                <circle cx="47" cy="17" r="2" fill="#111"/>
                <circle cx="48" cy="16" r="0.7" fill="white"/>
                {type !== 'anak' && <ellipse cx="52" cy="22" rx="2" ry="3" fill={c.comb} opacity="0.8"/>}
              </g>

              {/* Kaki kiri — swing */}
              <g transform={`rotate(${-legSwing} 26 43)`}>
                <line x1="26" y1="43" x2="22" y2="53" stroke={c.leg} strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="22" y1="53" x2="16" y2="55" stroke={c.leg} strokeWidth="2" strokeLinecap="round"/>
                <line x1="22" y1="53" x2="22" y2="58" stroke={c.leg} strokeWidth="2" strokeLinecap="round"/>
                <line x1="22" y1="53" x2="28" y2="57" stroke={c.leg} strokeWidth="2" strokeLinecap="round"/>
              </g>

              {/* Kaki kanan — swing opposite */}
              <g transform={`rotate(${legSwing} 34 43)`}>
                <line x1="34" y1="43" x2="38" y2="53" stroke={c.leg} strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="38" y1="53" x2="32" y2="55" stroke={c.leg} strokeWidth="2" strokeLinecap="round"/>
                <line x1="38" y1="53" x2="38" y2="58" stroke={c.leg} strokeWidth="2" strokeLinecap="round"/>
                <line x1="38" y1="53" x2="43" y2="57" stroke={c.leg} strokeWidth="2" strokeLinecap="round"/>
              </g>
            </>
          );
        })()}
      </svg>
    </div>
  );
}

function ChickenFarm() {
  const chickens = [
    { id:1,  type:"jantan",   size:58, speed:1.2, startX:100, startY:80  },
    { id:2,  type:"jantan",   size:52, speed:0.8, startX:500, startY:200 },
    { id:3,  type:"betina",   size:46, speed:1.0, startX:300, startY:150 },
    { id:4,  type:"betina",   size:44, speed:1.3, startX:700, startY:300 },
    { id:5,  type:"pedaging", size:62, speed:0.5, startX:200, startY:400 },
    { id:6,  type:"penelur",  size:42, speed:1.5, startX:600, startY:100 },
    { id:7,  type:"puyuh",    size:32, speed:2.2, startX:400, startY:250 },
    { id:8,  type:"puyuh",    size:30, speed:2.0, startX:800, startY:350 },
    { id:9,  type:"anak",     size:34, speed:1.8, startX:150, startY:320 },
    { id:10, type:"anak",     size:32, speed:1.9, startX:650, startY:180 },
  ];
  return (
    <>
      {chickens.map(c => <Chicken key={c.id} {...c} />)}
    </>
  );
}

export default function WaktuSolat() {
  const [zone, setZone] = useState("WLY01");
  const [now, setNow] = useState(new Date());
  const [alarmOn, setAlarmOn] = useState(true);
  const [audioReady, setAudioReady] = useState(false);
  const [showZones, setShowZones] = useState(false);
  const [hadithIdx, setHadithIdx] = useState(0);
  const [hadithFade, setHadithFade] = useState(true);
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

  const data = PRAYER_DB[zone];
  const prayerList = PRAYERS.map(p=>({ ...p, time:data[p.key]||null, sec:data[p.key]?toSec(data[p.key]):null }));
  const ns = nowSec();

  let currentIdx=-1;
  for(let i=prayerList.length-1;i>=0;i--){ if(prayerList[i].sec<=ns){currentIdx=i;break;} }
  const nextPrayer=prayerList.find(p=>p.sec>ns)||null;
  const nextDiff=nextPrayer?nextPrayer.sec-ns:null;
  const isWarning=nextDiff!==null&&nextDiff<=10&&nextDiff>0;
  const isAdhan=nextDiff!==null&&nextDiff<=3;

  // Auto dark mode — Maghrib hingga Subuh
  const maghribSec = data.maghrib ? toSec(data.maghrib) : 0;
  const fajrSec = data.fajr ? toSec(data.fajr) : 0;
  const isDark = ns >= maghribSec || ns < fajrSec;

  // Theme colors
  const T = {
    bg:       isDark ? "#0d1117" : "#f8f7f4",
    bgCard:   isDark ? "#161b22" : "#ffffff",
    bgHeader: isDark ? "#0d1117" : "#ffffff",
    border:   isDark ? "rgba(255,255,255,0.08)" : "#e8e5de",
    text:     isDark ? "#e6edf3" : "#1a1a1a",
    textMid:  isDark ? "#8b949e" : "#888888",
    textDim:  isDark ? "#6e7681" : "#aaaaaa",
    green:    isDark ? "#3fb950" : "#1a6b3c",
    greenBg:  isDark ? "rgba(63,185,80,0.15)" : "#f0f9f4",
    warn:     isDark ? "#d29922" : "#e8a020",
    warnBg:   isDark ? "rgba(210,153,34,0.15)" : "#fff8e6",
    danger:   isDark ? "#f85149" : "#e63946",
  };

  useEffect(()=>{
    if(!alarmOn) return;
    prayerList.forEach(p=>{
      if(!p.sec) return;
      const diff=p.sec-ns;
      if(diff>=1&&diff<=10){
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

  const G = T.green;

  return (
    <div onClick={initAudio} style={{ minHeight:"100vh", background:T.bg, fontFamily:"'Segoe UI',system-ui,sans-serif", color:T.text, transition:"background 1s ease, color 1s ease" }}>

      {/* ── HEADER ── */}
      <div style={{ background:T.bgHeader, borderBottom:`3px solid ${G}`, padding:"12px 24px", display:"flex", alignItems:"center", gap:16, transition:"background 1s ease" }}>
        <img src="/icon-512.png" alt="Logo" style={{ width:64, height:64, objectFit:"contain" }} />
        <div style={{ flex:1 }}>
          <div style={{ fontSize:11, letterSpacing:3, color:G, textTransform:"uppercase", fontWeight:700 }}>
            Jam Solat Surau · Institut Teknologi Unggas
          </div>
          <div style={{ fontSize:13, color:T.textMid, marginTop:3 }}>{dateStr}</div>
        </div>

        {/* Analog + Digital */}
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <AnalogClock now={now} />
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:44, fontWeight:300, fontFamily:"'Courier New',monospace", color:isAdhan?T.danger:isWarning?T.warn:T.text, lineHeight:1 }}>{timeStr}</div>
            {nextPrayer && (
              <div style={{ marginTop:6, padding:"6px 12px", borderRadius:8, background:isWarning?T.warnBg:isAdhan?"rgba(248,81,73,0.1)":T.greenBg, border:`1px solid ${isWarning?T.warn:isAdhan?T.danger:G}`, textAlign:"right" }}>
                <div style={{ fontSize:10, color:T.textMid, letterSpacing:1, textTransform:"uppercase" }}>Waktu Seterusnya</div>
                <div style={{ fontSize:16, fontWeight:700, color:isWarning?T.warn:isAdhan?T.danger:G }}>{nextPrayer.icon} {nextPrayer.label} · {nextPrayer.time}</div>
                <div style={{ fontSize:22, fontWeight:700, fontFamily:"'Courier New',monospace", color:isWarning?T.warn:isAdhan?T.danger:G }}>{fmt(nextDiff)}</div>
                {isAdhan && <div style={{ fontSize:11, fontWeight:700, color:T.danger }}>🕌 MASUK WAKTU SEKARANG!</div>}
              </div>
            )}
          </div>
        </div>

        {/* Zone picker */}
        <div style={{ position:"relative" }}>
          <button onClick={e=>{e.stopPropagation();setShowZones(v=>!v);}} style={{ padding:"8px 14px", background:T.greenBg, border:`1px solid ${G}`, borderRadius:8, color:G, fontSize:13, cursor:"pointer", fontWeight:600 }}>
            📍 {zone} {showZones?"▲":"▼"}
          </button>
          {showZones && (
            <div style={{ position:"absolute", right:0, top:"110%", zIndex:99, width:280, borderRadius:8, border:`1px solid ${G}`, background:T.bgCard, overflow:"hidden", maxHeight:300, overflowY:"auto", boxShadow:"0 4px 16px rgba(0,0,0,0.3)" }}>
              {Object.entries(PRAYER_DB).map(([code,d])=>(
                <button key={code} onClick={e=>{e.stopPropagation();setZone(code);setShowZones(false);firedRef.current={};}} style={{ width:"100%", padding:"9px 14px", textAlign:"left", background:code===zone?T.greenBg:T.bgCard, border:"none", borderBottom:`1px solid ${T.border}`, color:code===zone?G:T.text, cursor:"pointer", fontSize:12, display:"flex", justifyContent:"space-between" }}>
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
          const isNear=isNext&&nextDiff<=10;
          const diff=p.sec-ns;
          return (
            <div key={p.key} style={{ background:isCurrent?T.greenBg:isNear?T.warnBg:T.bgCard, borderRadius:14, border:isCurrent?`2.5px solid ${G}`:isNear?`2.5px solid ${T.warn}`:`1.5px solid ${T.border}`, padding:"20px 16px", textAlign:"center", opacity:isPast&&!isCurrent?0.4:1, transition:"all 0.5s ease" }}>
              <div style={{ fontSize:32, marginBottom:8 }}>{p.icon}</div>
              <div style={{ fontSize:24, fontWeight:700, color:isCurrent?G:isNear?T.warn:T.text }}>{p.label}</div>
              <div style={{ fontSize:13, color:T.textDim, marginTop:2 }}>{p.arabik}</div>
              <div style={{ fontSize:38, fontWeight:700, fontFamily:"'Courier New',monospace", color:isCurrent?G:isNear?T.warn:T.text, marginTop:8, lineHeight:1 }}>{p.time}</div>
              <div style={{ fontSize:13, marginTop:6, color:isCurrent?G:isNear?T.warn:T.textDim, fontWeight:isCurrent||isNear?600:400 }}>
                {isCurrent?"● WAKTU SEKARANG":isPast?"sudah lepas":fmt(diff)}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── HADITH ── */}
      <div style={{ padding:"0 24px 16px" }}>
        <div style={{ background:T.bgCard, borderRadius:14, border:`1.5px solid ${T.border}`, padding:"20px 24px", textAlign:"center", transition:"opacity 0.5s", opacity:hadithFade?1:0 }}>
          <div style={{ fontSize:10, letterSpacing:3, color:G, textTransform:"uppercase", fontWeight:700, marginBottom:10 }}>✦ Mutiara Hadith ✦</div>
          <div style={{ fontSize:22, color:G, fontFamily:"serif", direction:"rtl", lineHeight:1.8, marginBottom:10 }}>{hadith.arab}</div>
          <div style={{ fontSize:16, color:T.textMid, lineHeight:1.7, fontStyle:"italic", marginBottom:8 }}>"{hadith.ms}"</div>
          <div style={{ fontSize:12, color:T.textDim }}>— {hadith.ref}</div>
          <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:12 }}>
            {HADITH.map((_,i)=>(
              <div key={i} style={{ width:i===hadithIdx?20:6, height:6, borderRadius:3, background:i===hadithIdx?G:T.border, transition:"all 0.3s" }}/>
            ))}
          </div>
        </div>
      </div>

      {/* ── ALARM + FOOTER ── */}
      <div style={{ margin:"0 24px 24px", padding:"14px 18px", background:T.bgCard, borderRadius:14, border:`1.5px solid ${T.border}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:T.text }}>🔔 Alarm Peringatan</div>
            <div style={{ fontSize:12, color:T.textMid, marginTop:2 }}>Beep countdown 10 saat · Kriing masuk waktu</div>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button onClick={e=>{e.stopPropagation();initAudio();setTimeout(()=>beepTick(audioRef.current),50);}} style={{ padding:"7px 14px", borderRadius:8, border:`1px solid ${G}`, background:T.greenBg, color:G, fontSize:12, cursor:"pointer" }}>🔊 Test</button>
            <button onClick={e=>{e.stopPropagation();initAudio();setAlarmOn(v=>!v);}} style={{ padding:"7px 18px", borderRadius:20, border:"none", background:alarmOn?G:T.border, color:alarmOn?"#fff":T.textMid, fontWeight:700, fontSize:13, cursor:"pointer" }}>
              {alarmOn?"HIDUP":"MATI"}
            </button>
          </div>
        </div>
        {!audioReady && <div style={{ marginTop:8, fontSize:11, color:T.warn, background:T.warnBg, padding:"6px 10px", borderRadius:6, border:`1px solid ${T.warn}` }}>👆 Ketik skrin untuk aktifkan audio</div>}
      </div>

      {/* Footer */}
      <div style={{ borderTop:`1px solid ${T.border}`, background:T.bgCard, padding:"10px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", transition:"background 1s ease" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <img src="/icon-512.png" alt="" style={{ width:24, height:24, objectFit:"contain" }} />
          <span style={{ fontSize:11, color:T.textDim }}>Institut Teknologi Unggas · jamsolatitu.netlify.app</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:11, color:T.textDim }}>Data: api.waktusolat.app · JAKIM · {zone}</span>
          {isDark && <span style={{ fontSize:10, color:G, background:T.greenBg, padding:"2px 8px", borderRadius:10, border:`1px solid ${G}` }}>🌙 Mod Malam</span>}
          {!isDark && <span style={{ fontSize:10, color:"#e8a020", background:"#fff8e6", padding:"2px 8px", borderRadius:10, border:"1px solid #e8a020" }}>☀️ Mod Siang</span>}
        </div>
      </div>

      {/* ── AYAM-AYAM ITU ── */}
      <ChickenFarm />

    </div>
  );
}
