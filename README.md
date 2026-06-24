# 🕌 Jam Waktu Solat Institut Teknologi Unggas — React App

Aplikasi Jam Waktu Solat Institut Teknologi Unggas dengan alarm peringatan 2 minit sebelum masuk waktu. Data dari [api.waktusolat.app](https://api.waktusolat.app) (sumber rasmi JAKIM).

---

## ✨ Ciri-ciri

| Ciri | Status |
|------|--------|
| Papar 6 waktu solat (Subuh, Syuruk, Zohor, Asar, Maghrib, Isyak) | ✅ |
| Countdown masa real-time setiap saat | ✅ |
| Alarm bunyi 2 minit sebelum masuk waktu | ✅ |
| Alarm bunyi tepat masuk waktu | ✅ |
| Sokongan 17 zon JAKIM seluruh Malaysia | ✅ |
| Dark mode UI (tema keemasan) | ✅ |
| Log rekod alarm berbunyi | ✅ |
| Live API fetch dari waktusolat.app | 🔜 (pending CORS proxy) |
| PWA — boleh install kat phone | 🔜 |
| Push notification (alarm walau browser tutup) | 🔜 |

---

## 📱 Cara Guna

1. Buka app
2. **Ketik skrin sekali** untuk aktifkan audio (wajib — browser requirement)
3. Pilih zon kawasan kau
4. Countdown dan alarm akan jalan automatik
5. Tekan **"Test 2-min"** atau **"Test Waktu"** untuk uji bunyi alarm

---

## 🗂️ Struktur Projek

```
waktu-solat/
├── src/
│   └── WaktuSolat.jsx      # Komponen utama
├── public/
│   └── index.html
├── README.md
└── package.json
```

---

## 🚀 Setup & Run

### Prasyarat
- Node.js v18+
- npm atau yarn

### Install

```bash
git clone https://github.com/<username>/waktu-solat.git
cd waktu-solat
npm install
```

### Run development

```bash
npm run dev
# atau
npm start
```

Buka `http://localhost:3000` dalam browser.

### Build untuk production

```bash
npm run build
```

---

## 🌐 Data & API

Data waktu solat diambil dari **[api.waktusolat.app](https://api.waktusolat.app)** — API tidak rasmi yang mengumpul data dari portal JAKIM e-Solat.

### Endpoint yang digunakan

```
GET https://api.waktusolat.app/solat/{zone}?month={month}&year={year}
```

**Contoh:**
```
GET https://api.waktusolat.app/solat/WLY01?month=6&year=2026
```

### Senarai Zon (JAKIM Code)

| Kod | Kawasan |
|-----|---------|
| `WLY01` | Kuala Lumpur / Putrajaya |
| `SGR01` | Selangor — Petaling, Gombak, Shah Alam |
| `SGR02` | Selangor — Kuala Selangor, Sabak Bernam |
| `SGR03` | Selangor — Klang, Kuala Langat |
| `JHR02` | Johor Bahru |
| `MLK01` | Melaka |
| `PNG01` | Pulau Pinang |
| `PRK02` | Perak — Ipoh |
| `KTN01` | Kelantan — Kota Bharu |
| `TRG01` | Terengganu — Kuala Terengganu |
| `PHG02` | Pahang — Kuantan |
| `SBH07` | Sabah — Kota Kinabalu |
| `SWK08` | Sarawak — Kuching |
| `PLS01` | Perlis |

> Senarai lengkap semua zon: `GET https://api.waktusolat.app/zones`

### ⚠️ Nota CORS

API ini tidak support CORS secara terus dari browser. Untuk production, kena setup salah satu cara ni:

**Cara 1 — CORS Proxy (paling mudah):**
```js
const API = "https://corsproxy.io/?https://api.waktusolat.app";
fetch(`${API}/solat/${zone}`);
```

**Cara 2 — Backend sendiri (paling selamat):**
```
Browser → Your Server (Node/PHP) → api.waktusolat.app
```

**Cara 3 — Deploy Vercel/Netlify dengan API route:**
```js
// /api/solat.js (Vercel serverless function)
export default async function handler(req, res) {
  const { zone } = req.query;
  const data = await fetch(`https://api.waktusolat.app/solat/${zone}`);
  res.json(await data.json());
}
```

---

## 🔔 Cara Kerja Alarm

Alarm menggunakan **Web Audio API** — tiada library luaran diperlukan, bunyi dijana terus dalam browser.

```
2 minit sebelum waktu  →  3 beep pendek (880Hz)
Tepat masuk waktu      →  5 tone melodik (A4→C5→D5→C5→A4)
```

**Penting:** Browser memerlukan interaksi pengguna (click/tap) sebelum boleh mainkan audio. Sebab tu ada step "ketik skrin" masa pertama buka.

---

## 🛣️ Roadmap / TO DO

- [ ] **PWA support** — `manifest.json` + service worker supaya boleh install kat phone
- [ ] **Push notification** — alarm waktu solat walau browser/app tertutup
- [ ] **Live API** — sambung terus ke api.waktusolat.app (perlu CORS proxy atau backend)
- [ ] **Auto-detect zon** — guna GPS coordinates (`/v2/solat/gps/{lat}/{long}`)
- [ ] **Imsak** — tambah waktu imsak untuk bulan Ramadan
- [ ] **Widget** — widget kecil untuk homescreen Android
- [ ] **Update data bulanan** — auto-update data bila masuk bulan baru

---

## 🛠️ Tech Stack

- **React** — UI framework
- **Web Audio API** — bunyi alarm (zero dependency)
- **api.waktusolat.app** — sumber data waktu solat (JAKIM)

---

## 📄 Lesen

MIT License — bebas guna, ubah suai, dan kongsikan.

---

## 🙏 Credit

- Data waktu solat: [api.waktusolat.app](https://api.waktusolat.app) oleh [@mptwaktusolat](https://github.com/mptwaktusolat)
- Sumber asal data: [JAKIM e-Solat](https://www.e-solat.gov.my/)

---

> *"Dan dirikanlah sembahyang, kerana sesungguhnya sembahyang itu adalah satu kewajipan yang telah ditentukan waktunya ke atas orang-orang yang beriman."*
> — Al-Quran, An-Nisa' 4:103
