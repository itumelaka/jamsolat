import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATABASE DAERAH ─────────────────────────────────────────────────────────
const DAERAH_DB = {
  "Wilayah Persekutuan": [
    { daerah:"Kuala Lumpur",  zon:"WLY01", lat:3.1390,  lng:101.6869 },
    { daerah:"Putrajaya",     zon:"WLY01", lat:2.9264,  lng:101.6964 },
    { daerah:"Labuan",        zon:"WLY02", lat:5.2831,  lng:115.2308 },
  ],
  "Selangor": [
    { daerah:"Gombak",              zon:"SGR01", lat:3.2674,  lng:101.7014 },
    { daerah:"Petaling Jaya",       zon:"SGR01", lat:3.1073,  lng:101.6067 },
    { daerah:"Shah Alam",           zon:"SGR01", lat:3.0733,  lng:101.5185 },
    { daerah:"Subang Jaya",         zon:"SGR01", lat:3.0506,  lng:101.5812 },
    { daerah:"Hulu Langat",         zon:"SGR01", lat:3.0021,  lng:101.8356 },
    { daerah:"Hulu Selangor",       zon:"SGR01", lat:3.5693,  lng:101.6490 },
    { daerah:"Sepang",              zon:"SGR01", lat:2.7400,  lng:101.7070 },
    { daerah:"Ampang",              zon:"SGR01", lat:3.1488,  lng:101.7621 },
    { daerah:"Kajang",              zon:"SGR01", lat:2.9930,  lng:101.7877 },
    { daerah:"Kuala Selangor",      zon:"SGR02", lat:3.3404,  lng:101.2565 },
    { daerah:"Sabak Bernam",        zon:"SGR02", lat:3.7743,  lng:100.9753 },
    { daerah:"Tanjong Karang",      zon:"SGR02", lat:3.4213,  lng:101.1843 },
    { daerah:"Klang",               zon:"SGR03", lat:3.0449,  lng:101.4455 },
    { daerah:"Kuala Langat",        zon:"SGR03", lat:2.8089,  lng:101.4993 },
    { daerah:"Banting",             zon:"SGR03", lat:2.8157,  lng:101.5021 },
  ],
  "Melaka": [
    { daerah:"Melaka Tengah",       zon:"MLK01", lat:2.1896,  lng:102.2501 },
    { daerah:"Alor Gajah",          zon:"MLK01", lat:2.3822,  lng:102.2084 },
    { daerah:"Masjid Tanah",        zon:"MLK01", lat:2.5163,  lng:102.0762 },
    { daerah:"Merlimau",            zon:"MLK01", lat:2.2003,  lng:102.4356 },
    { daerah:"Jasin",               zon:"MLK01", lat:2.3082,  lng:102.4330 },
    { daerah:"Ayer Keroh",          zon:"MLK01", lat:2.2636,  lng:102.2774 },
    { daerah:"Batu Berendam",       zon:"MLK01", lat:2.2458,  lng:102.2528 },
    { daerah:"Tanjung Kling",       zon:"MLK01", lat:2.2697,  lng:102.1464 },
    { daerah:"Bemban",              zon:"MLK01", lat:2.3641,  lng:102.3821 },
    { daerah:"Rembia",              zon:"MLK01", lat:2.4276,  lng:102.1853 },
  ],
  "Johor": [
    { daerah:"Johor Bahru",         zon:"JHR02", lat:1.4927,  lng:103.7414 },
    { daerah:"Kota Tinggi",         zon:"JHR02", lat:1.7374,  lng:103.9021 },
    { daerah:"Mersing",             zon:"JHR02", lat:2.4405,  lng:103.8397 },
    { daerah:"Kulai",               zon:"JHR02", lat:1.6597,  lng:103.5968 },
    { daerah:"Pasir Gudang",        zon:"JHR02", lat:1.4694,  lng:103.8980 },
    { daerah:"Skudai",              zon:"JHR02", lat:1.5327,  lng:103.6777 },
    { daerah:"Iskandar Puteri",     zon:"JHR02", lat:1.4234,  lng:103.6344 },
    { daerah:"Kluang",              zon:"JHR03", lat:2.0263,  lng:103.3191 },
    { daerah:"Pontian",             zon:"JHR03", lat:1.4891,  lng:103.3893 },
    { daerah:"Batu Pahat",          zon:"JHR04", lat:1.8535,  lng:102.9329 },
    { daerah:"Muar",                zon:"JHR04", lat:2.0442,  lng:102.5689 },
    { daerah:"Segamat",             zon:"JHR04", lat:2.5145,  lng:102.8143 },
    { daerah:"Tangkak",             zon:"JHR04", lat:2.2667,  lng:102.5500 },
    { daerah:"Gemas",               zon:"JHR04", lat:2.5855,  lng:102.5983 },
  ],
  "Negeri Sembilan": [
    { daerah:"Tampin",              zon:"NGS01", lat:2.4732,  lng:102.2264 },
    { daerah:"Jempol",              zon:"NGS01", lat:3.0677,  lng:102.5779 },
    { daerah:"Bahau",               zon:"NGS01", lat:2.8015,  lng:102.3979 },
    { daerah:"Jelebu",              zon:"NGS02", lat:3.0326,  lng:102.0810 },
    { daerah:"Kuala Pilah",         zon:"NGS02", lat:2.7385,  lng:102.2478 },
    { daerah:"Rembau",              zon:"NGS02", lat:2.5936,  lng:102.0895 },
    { daerah:"Port Dickson",        zon:"NGS03", lat:2.5228,  lng:101.7958 },
    { daerah:"Seremban",            zon:"NGS03", lat:2.7297,  lng:101.9381 },
    { daerah:"Nilai",               zon:"NGS03", lat:2.8124,  lng:101.7979 },
  ],
  "Pahang": [
    { daerah:"Kuantan",             zon:"PHG02", lat:3.8077,  lng:103.3260 },
    { daerah:"Pekan",               zon:"PHG02", lat:3.4875,  lng:103.3826 },
    { daerah:"Muadzam Shah",        zon:"PHG02", lat:3.0580,  lng:103.0842 },
    { daerah:"Jerantut",            zon:"PHG03", lat:3.9343,  lng:102.3579 },
    { daerah:"Temerloh",            zon:"PHG03", lat:3.4520,  lng:102.4183 },
    { daerah:"Maran",               zon:"PHG03", lat:3.5934,  lng:102.7558 },
    { daerah:"Bera",                zon:"PHG03", lat:3.3691,  lng:102.5706 },
    { daerah:"Bentong",             zon:"PHG04", lat:3.5191,  lng:101.9077 },
    { daerah:"Lipis",               zon:"PHG04", lat:4.1775,  lng:102.0503 },
    { daerah:"Raub",                zon:"PHG04", lat:3.7893,  lng:101.8582 },
    { daerah:"Cameron Highlands",   zon:"PHG06", lat:4.4682,  lng:101.3796 },
    { daerah:"Fraser's Hill",       zon:"PHG06", lat:3.7167,  lng:101.7333 },
    { daerah:"Rompin",              zon:"PHG07", lat:2.7918,  lng:103.4877 },
  ],
  "Perak": [
    { daerah:"Ipoh",                zon:"PRK02", lat:4.5975,  lng:101.0901 },
    { daerah:"Kuala Kangsar",       zon:"PRK02", lat:4.7726,  lng:100.9357 },
    { daerah:"Sg. Siput",           zon:"PRK02", lat:4.8407,  lng:101.0618 },
    { daerah:"Batu Gajah",          zon:"PRK02", lat:4.4724,  lng:101.0290 },
    { daerah:"Kampar",              zon:"PRK02", lat:4.3074,  lng:101.1508 },
    { daerah:"Tapah",               zon:"PRK01", lat:4.1973,  lng:101.2664 },
    { daerah:"Tanjung Malim",       zon:"PRK01", lat:3.6850,  lng:101.5163 },
    { daerah:"Slim River",          zon:"PRK01", lat:3.8143,  lng:101.4000 },
    { daerah:"Grik",                zon:"PRK03", lat:5.4292,  lng:101.1258 },
    { daerah:"Lenggong",            zon:"PRK03", lat:5.0986,  lng:100.9644 },
    { daerah:"Teluk Intan",         zon:"PRK05", lat:4.0239,  lng:101.0228 },
    { daerah:"Sitiawan",            zon:"PRK05", lat:4.2193,  lng:100.6992 },
    { daerah:"Lumut",               zon:"PRK05", lat:4.2342,  lng:100.6291 },
    { daerah:"Pulau Pangkor",       zon:"PRK05", lat:4.2189,  lng:100.5619 },
    { daerah:"Taiping",             zon:"PRK06", lat:4.8489,  lng:100.7359 },
    { daerah:"Bagan Serai",         zon:"PRK06", lat:5.0086,  lng:100.5280 },
    { daerah:"Parit Buntar",        zon:"PRK06", lat:5.1255,  lng:100.4977 },
  ],
  "Kedah": [
    { daerah:"Alor Setar",          zon:"KDH01", lat:6.1184,  lng:100.3685 },
    { daerah:"Kubang Pasu",         zon:"KDH01", lat:6.3539,  lng:100.4245 },
    { daerah:"Sungai Petani",       zon:"KDH02", lat:5.6479,  lng:100.4873 },
    { daerah:"Kuala Muda",          zon:"KDH02", lat:5.7024,  lng:100.4079 },
    { daerah:"Pendang",             zon:"KDH02", lat:5.9982,  lng:100.4808 },
    { daerah:"Yan",                 zon:"KDH02", lat:5.7851,  lng:100.3797 },
    { daerah:"Sik",                 zon:"KDH03", lat:5.9482,  lng:100.7397 },
    { daerah:"Padang Terap",        zon:"KDH03", lat:6.2500,  lng:100.7333 },
    { daerah:"Baling",              zon:"KDH04", lat:5.6745,  lng:100.9217 },
    { daerah:"Kulim",               zon:"KDH05", lat:5.3648,  lng:100.5611 },
    { daerah:"Bandar Baharu",       zon:"KDH05", lat:5.2390,  lng:100.5619 },
    { daerah:"Langkawi",            zon:"KDH06", lat:6.3500,  lng:99.8000  },
  ],
  "Perlis": [
    { daerah:"Kangar",              zon:"PLS01", lat:6.4449,  lng:100.1986 },
    { daerah:"Arau",                zon:"PLS01", lat:6.4248,  lng:100.2707 },
    { daerah:"Padang Besar",        zon:"PLS01", lat:6.6478,  lng:100.3243 },
    { daerah:"Wang Kelian",         zon:"PLS01", lat:6.3794,  lng:100.0911 },
  ],
  "Pulau Pinang": [
    { daerah:"George Town",         zon:"PNG01", lat:5.4141,  lng:100.3288 },
    { daerah:"Bayan Lepas",         zon:"PNG01", lat:5.2966,  lng:100.2726 },
    { daerah:"Butterworth",         zon:"PNG01", lat:5.3989,  lng:100.3638 },
    { daerah:"Bukit Mertajam",      zon:"PNG01", lat:5.3637,  lng:100.4618 },
    { daerah:"Kepala Batas",        zon:"PNG01", lat:5.5218,  lng:100.4241 },
    { daerah:"Nibong Tebal",        zon:"PNG01", lat:5.1610,  lng:100.4704 },
    { daerah:"Balik Pulau",         zon:"PNG01", lat:5.3508,  lng:100.2340 },
  ],
  "Kelantan": [
    { daerah:"Kota Bharu",          zon:"KTN01", lat:6.1254,  lng:102.2381 },
    { daerah:"Bachok",              zon:"KTN01", lat:6.0663,  lng:102.3968 },
    { daerah:"Machang",             zon:"KTN01", lat:5.7699,  lng:102.2135 },
    { daerah:"Pasir Mas",           zon:"KTN01", lat:6.0449,  lng:102.1403 },
    { daerah:"Pasir Puteh",         zon:"KTN01", lat:5.8316,  lng:102.4007 },
    { daerah:"Tanah Merah",         zon:"KTN01", lat:5.8071,  lng:102.1503 },
    { daerah:"Tumpat",              zon:"KTN01", lat:6.1978,  lng:102.1710 },
    { daerah:"Kuala Krai",          zon:"KTN01", lat:5.5327,  lng:102.1974 },
    { daerah:"Gua Musang",          zon:"KTN02", lat:4.8826,  lng:101.9614 },
    { daerah:"Jeli",                zon:"KTN02", lat:5.6946,  lng:101.8430 },
  ],
  "Terengganu": [
    { daerah:"Kuala Terengganu",    zon:"TRG01", lat:5.3296,  lng:103.1370 },
    { daerah:"Marang",              zon:"TRG01", lat:5.2024,  lng:103.2131 },
    { daerah:"Kuala Nerus",         zon:"TRG01", lat:5.4266,  lng:103.1201 },
    { daerah:"Besut",               zon:"TRG02", lat:5.7125,  lng:102.5658 },
    { daerah:"Setiu",               zon:"TRG02", lat:5.5488,  lng:102.8997 },
    { daerah:"Hulu Terengganu",     zon:"TRG03", lat:4.9456,  lng:102.7807 },
    { daerah:"Dungun",              zon:"TRG04", lat:4.7577,  lng:103.4217 },
    { daerah:"Kemaman",             zon:"TRG04", lat:4.2274,  lng:103.4174 },
    { daerah:"Chukai",              zon:"TRG04", lat:4.2442,  lng:103.4248 },
  ],
  "Sabah": [
    { daerah:"Kota Kinabalu",       zon:"SBH07", lat:5.9804,  lng:116.0735 },
    { daerah:"Penampang",           zon:"SBH07", lat:5.9005,  lng:116.0988 },
    { daerah:"Papar",               zon:"SBH07", lat:5.7367,  lng:115.9344 },
    { daerah:"Tuaran",              zon:"SBH07", lat:6.1776,  lng:116.2340 },
    { daerah:"Ranau",               zon:"SBH07", lat:5.9594,  lng:116.6694 },
    { daerah:"Kota Belud",          zon:"SBH07", lat:6.3480,  lng:116.4302 },
    { daerah:"Sandakan",            zon:"SBH01", lat:5.8402,  lng:118.1179 },
    { daerah:"Lahad Datu",          zon:"SBH03", lat:5.0272,  lng:118.3305 },
    { daerah:"Semporna",            zon:"SBH03", lat:4.4782,  lng:118.6140 },
    { daerah:"Tawau",               zon:"SBH04", lat:4.2449,  lng:117.8912 },
    { daerah:"Kudat",               zon:"SBH05", lat:6.8871,  lng:116.8484 },
    { daerah:"Keningau",            zon:"SBH08", lat:5.3376,  lng:116.1621 },
    { daerah:"Beaufort",            zon:"SBH09", lat:5.3456,  lng:115.7479 },
    { daerah:"Tenom",               zon:"SBH09", lat:5.1229,  lng:115.9509 },
  ],
  "Sarawak": [
    { daerah:"Kuching",             zon:"SWK08", lat:1.5533,  lng:110.3592 },
    { daerah:"Bau",                 zon:"SWK08", lat:1.4160,  lng:110.1549 },
    { daerah:"Lundu",               zon:"SWK08", lat:1.6707,  lng:109.8483 },
    { daerah:"Samarahan",           zon:"SWK07", lat:1.4541,  lng:110.4602 },
    { daerah:"Serian",              zon:"SWK07", lat:1.1634,  lng:110.5745 },
    { daerah:"Sri Aman",            zon:"SWK06", lat:1.2378,  lng:111.4617 },
    { daerah:"Betong",              zon:"SWK06", lat:1.3961,  lng:111.5189 },
    { daerah:"Sarikei",             zon:"SWK05", lat:2.1269,  lng:111.5226 },
    { daerah:"Sibu",                zon:"SWK04", lat:2.2878,  lng:111.8272 },
    { daerah:"Mukah",               zon:"SWK04", lat:2.8960,  lng:112.0833 },
    { daerah:"Bintulu",             zon:"SWK03", lat:3.1716,  lng:113.0467 },
    { daerah:"Miri",                zon:"SWK02", lat:4.3995,  lng:113.9914 },
    { daerah:"Limbang",             zon:"SWK01", lat:4.7557,  lng:115.0102 },
    { daerah:"Lawas",               zon:"SWK01", lat:4.8516,  lng:115.4067 },
  ],
};

// Waktu solat ikut zon JAKIM
const PRAYER_DB = {
  WLY01: { fajr:"06:02", syuruk:"07:10", dhuhr:"13:20", asr:"16:33", maghrib:"19:25", isha:"20:36" },
  WLY02: { fajr:"05:38", syuruk:"06:48", dhuhr:"12:56", asr:"16:09", maghrib:"19:00", isha:"20:11" },
  SGR01: { fajr:"06:01", syuruk:"07:09", dhuhr:"13:19", asr:"16:32", maghrib:"19:24", isha:"20:35" },
  SGR02: { fajr:"06:03", syuruk:"07:11", dhuhr:"13:21", asr:"16:34", maghrib:"19:26", isha:"20:37" },
  SGR03: { fajr:"06:00", syuruk:"07:08", dhuhr:"13:18", asr:"16:31", maghrib:"19:23", isha:"20:34" },
  JHR01: { fajr:"05:58", syuruk:"07:07", dhuhr:"13:12", asr:"16:28", maghrib:"19:19", isha:"20:30" },
  JHR02: { fajr:"05:59", syuruk:"07:08", dhuhr:"13:14", asr:"16:30", maghrib:"19:21", isha:"20:32" },
  JHR03: { fajr:"05:58", syuruk:"07:07", dhuhr:"13:13", asr:"16:29", maghrib:"19:20", isha:"20:31" },
  JHR04: { fajr:"06:00", syuruk:"07:09", dhuhr:"13:15", asr:"16:31", maghrib:"19:22", isha:"20:33" },
  MLK01: { fajr:"06:00", syuruk:"07:09", dhuhr:"13:16", asr:"16:31", maghrib:"19:22", isha:"20:33" },
  NGS01: { fajr:"06:01", syuruk:"07:10", dhuhr:"13:16", asr:"16:31", maghrib:"19:22", isha:"20:33" },
  NGS02: { fajr:"06:01", syuruk:"07:10", dhuhr:"13:17", asr:"16:32", maghrib:"19:23", isha:"20:34" },
  NGS03: { fajr:"06:01", syuruk:"07:10", dhuhr:"13:17", asr:"16:32", maghrib:"19:23", isha:"20:34" },
  PHG01: { fajr:"06:01", syuruk:"07:11", dhuhr:"13:17", asr:"16:33", maghrib:"19:23", isha:"20:35" },
  PHG02: { fajr:"06:02", syuruk:"07:12", dhuhr:"13:20", asr:"16:34", maghrib:"19:26", isha:"20:37" },
  PHG03: { fajr:"06:02", syuruk:"07:11", dhuhr:"13:19", asr:"16:34", maghrib:"19:25", isha:"20:36" },
  PHG04: { fajr:"06:02", syuruk:"07:11", dhuhr:"13:19", asr:"16:33", maghrib:"19:25", isha:"20:36" },
  PHG05: { fajr:"06:02", syuruk:"07:11", dhuhr:"13:19", asr:"16:33", maghrib:"19:25", isha:"20:36" },
  PHG06: { fajr:"06:03", syuruk:"07:12", dhuhr:"13:20", asr:"16:34", maghrib:"19:26", isha:"20:37" },
  PHG07: { fajr:"06:01", syuruk:"07:11", dhuhr:"13:18", asr:"16:33", maghrib:"19:24", isha:"20:35" },
  PRK01: { fajr:"06:03", syuruk:"07:12", dhuhr:"13:21", asr:"16:35", maghrib:"19:27", isha:"20:38" },
  PRK02: { fajr:"06:04", syuruk:"07:13", dhuhr:"13:22", asr:"16:36", maghrib:"19:28", isha:"20:39" },
  PRK03: { fajr:"06:05", syuruk:"07:14", dhuhr:"13:23", asr:"16:37", maghrib:"19:29", isha:"20:40" },
  PRK04: { fajr:"06:06", syuruk:"07:15", dhuhr:"13:24", asr:"16:38", maghrib:"19:30", isha:"20:41" },
  PRK05: { fajr:"06:04", syuruk:"07:13", dhuhr:"13:22", asr:"16:36", maghrib:"19:28", isha:"20:39" },
  PRK06: { fajr:"06:05", syuruk:"07:14", dhuhr:"13:23", asr:"16:37", maghrib:"19:29", isha:"20:40" },
  PRK07: { fajr:"06:05", syuruk:"07:14", dhuhr:"13:23", asr:"16:37", maghrib:"19:29", isha:"20:40" },
  KDH01: { fajr:"06:07", syuruk:"07:16", dhuhr:"13:25", asr:"16:39", maghrib:"19:31", isha:"20:42" },
  KDH02: { fajr:"06:06", syuruk:"07:15", dhuhr:"13:24", asr:"16:38", maghrib:"19:30", isha:"20:41" },
  KDH03: { fajr:"06:07", syuruk:"07:16", dhuhr:"13:25", asr:"16:39", maghrib:"19:31", isha:"20:42" },
  KDH04: { fajr:"06:06", syuruk:"07:15", dhuhr:"13:24", asr:"16:38", maghrib:"19:30", isha:"20:41" },
  KDH05: { fajr:"06:06", syuruk:"07:15", dhuhr:"13:24", asr:"16:38", maghrib:"19:30", isha:"20:41" },
  KDH06: { fajr:"06:08", syuruk:"07:17", dhuhr:"13:26", asr:"16:40", maghrib:"19:32", isha:"20:43" },
  KDH07: { fajr:"06:07", syuruk:"07:16", dhuhr:"13:25", asr:"16:39", maghrib:"19:31", isha:"20:42" },
  PLS01: { fajr:"06:09", syuruk:"07:18", dhuhr:"13:27", asr:"16:41", maghrib:"19:33", isha:"20:44" },
  PNG01: { fajr:"06:06", syuruk:"07:15", dhuhr:"13:24", asr:"16:38", maghrib:"19:30", isha:"20:41" },
  KTN01: { fajr:"06:04", syuruk:"07:14", dhuhr:"13:22", asr:"16:37", maghrib:"19:28", isha:"20:39" },
  KTN02: { fajr:"06:03", syuruk:"07:12", dhuhr:"13:21", asr:"16:35", maghrib:"19:27", isha:"20:38" },
  TRG01: { fajr:"06:03", syuruk:"07:13", dhuhr:"13:21", asr:"16:36", maghrib:"19:27", isha:"20:38" },
  TRG02: { fajr:"06:03", syuruk:"07:13", dhuhr:"13:21", asr:"16:36", maghrib:"19:27", isha:"20:38" },
  TRG03: { fajr:"06:03", syuruk:"07:12", dhuhr:"13:21", asr:"16:35", maghrib:"19:27", isha:"20:38" },
  TRG04: { fajr:"06:03", syuruk:"07:12", dhuhr:"13:21", asr:"16:35", maghrib:"19:27", isha:"20:38" },
  SBH01: { fajr:"05:40", syuruk:"06:50", dhuhr:"12:58", asr:"16:11", maghrib:"19:02", isha:"20:13" },
  SBH02: { fajr:"05:39", syuruk:"06:49", dhuhr:"12:57", asr:"16:10", maghrib:"19:01", isha:"20:12" },
  SBH03: { fajr:"05:38", syuruk:"06:48", dhuhr:"12:56", asr:"16:09", maghrib:"19:00", isha:"20:11" },
  SBH04: { fajr:"05:37", syuruk:"06:47", dhuhr:"12:55", asr:"16:08", maghrib:"18:59", isha:"20:10" },
  SBH05: { fajr:"05:41", syuruk:"06:51", dhuhr:"12:59", asr:"16:12", maghrib:"19:03", isha:"20:14" },
  SBH07: { fajr:"05:38", syuruk:"06:48", dhuhr:"12:56", asr:"16:09", maghrib:"19:00", isha:"20:11" },
  SBH08: { fajr:"05:37", syuruk:"06:47", dhuhr:"12:55", asr:"16:08", maghrib:"18:59", isha:"20:10" },
  SBH09: { fajr:"05:37", syuruk:"06:47", dhuhr:"12:55", asr:"16:08", maghrib:"18:59", isha:"20:10" },
  SWK01: { fajr:"05:47", syuruk:"06:57", dhuhr:"13:05", asr:"16:18", maghrib:"19:08", isha:"20:19" },
  SWK02: { fajr:"05:45", syuruk:"06:55", dhuhr:"13:03", asr:"16:16", maghrib:"19:06", isha:"20:17" },
  SWK03: { fajr:"05:44", syuruk:"06:54", dhuhr:"13:02", asr:"16:15", maghrib:"19:05", isha:"20:16" },
  SWK04: { fajr:"05:43", syuruk:"06:53", dhuhr:"13:01", asr:"16:14", maghrib:"19:04", isha:"20:15" },
  SWK05: { fajr:"05:43", syuruk:"06:53", dhuhr:"13:01", asr:"16:14", maghrib:"19:04", isha:"20:15" },
  SWK06: { fajr:"05:43", syuruk:"06:53", dhuhr:"13:00", asr:"16:13", maghrib:"19:03", isha:"20:14" },
  SWK07: { fajr:"05:42", syuruk:"06:52", dhuhr:"12:59", asr:"16:13", maghrib:"19:03", isha:"20:14" },
  SWK08: { fajr:"05:42", syuruk:"06:52", dhuhr:"12:59", asr:"16:13", maghrib:"19:03", isha:"20:14" },
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
  const [negeri, setNegeri] = useState("Melaka");
  const [daerah, setDaerah] = useState("Masjid Tanah");
  const [showPicker, setShowPicker] = useState(false);
  const [now, setNow] = useState(new Date());
  const [alarmOn, setAlarmOn] = useState(true);
  const [audioReady, setAudioReady] = useState(false);
  const [hadithIdx, setHadithIdx] = useState(0);
  const [hadithFade, setHadithFade] = useState(true);
  const [liveData, setLiveData] = useState(null);
  const [apiStatus, setApiStatus] = useState("loading"); // loading | ok | error
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

  // ── FETCH LIVE DATA dari API ──────────────────────────────────────────────
  const fetchPrayerData = useCallback(async (zonCode) => {
    setApiStatus("loading");
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    try {
      // Guna Vercel API route sendiri sebagai proxy
      const res = await fetch(`/api/solat?zon=${zonCode}&month=${month}&year=${year}`);
      if (!res.ok) throw new Error("API error");
      const json = await res.json();

      if (json.prayerTime && Array.isArray(json.prayerTime)) {
        const today = new Date();
        const day = String(today.getDate()).padStart(2,"0");
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const mon = months[today.getMonth()];
        const yr = today.getFullYear();
        const todayStr = `${day}-${mon}-${yr}`;

        const todayData = json.prayerTime.find(p => p.date === todayStr);
        if (todayData) {
          setLiveData({
            fajr:    todayData.fajr?.slice(0,5),
            syuruk:  todayData.syuruk?.slice(0,5),
            dhuhr:   todayData.dhuhr?.slice(0,5),
            asr:     todayData.asr?.slice(0,5),
            maghrib: todayData.maghrib?.slice(0,5),
            isha:    todayData.isha?.slice(0,5),
          });
          setApiStatus("ok");
          return;
        }
      }
      throw new Error("Data tidak dijumpai");
    } catch(e) {
      setApiStatus("error");
      setLiveData(null);
    }
  }, []);

  // Fetch bila daerah bertukar
  useEffect(() => {
    const daerahList = DAERAH_DB[negeri] || [];
    const daerahData = daerahList.find(d => d.daerah === daerah) || daerahList[0];
    if (daerahData) {
      fetchPrayerData(daerahData.zon);
      firedRef.current = {};
    }
  }, [negeri, daerah, fetchPrayerData]);
  const initAudio = useCallback(() => {
    if(!audioRef.current) {
      audioRef.current = new (window.AudioContext||window.webkitAudioContext)();
      setAudioReady(true);
    } else if(audioRef.current.state==="suspended") {
      audioRef.current.resume().then(()=>setAudioReady(true));
    }
  }, []);

  const daerahList = DAERAH_DB[negeri] || [];
  const daerahData = daerahList.find(d => d.daerah === daerah) || daerahList[0] || { zon:"WLY01", lat:3.139, lng:101.687 };
  const zon = daerahData.zon;

  // Guna live data kalau ada, fallback ke hardcode
  const hardcodeData = PRAYER_DB[zon] || PRAYER_DB["WLY01"];
  const data = liveData || hardcodeData;

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
  const fajrSec = data.fajr ? toSec(data.fajr) : 0;  const isDark = ns >= maghribSec || ns < fajrSec;

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
        const k=`${zon}_${p.key}_beep_${diff}_${now.toDateString()}`;
        if(!firedRef.current[k]){ firedRef.current[k]=true; beepTick(audioRef.current); }
      }
      const ka=`${zon}_${p.key}_adhan_${now.toDateString()}`;
      if(diff>=-3&&diff<=3&&!firedRef.current[ka]){ firedRef.current[ka]=true; beepAdhan(audioRef.current); }
    });
  }, [ns, alarmOn, zon]);

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
          <div style={{ fontSize:10, marginTop:2 }}>
            {apiStatus==="loading" && <span style={{ color:T.warn }}>⏳ Memuatkan waktu solat...</span>}
            {apiStatus==="ok"      && <span style={{ color:G }}>✅ Data live JAKIM</span>}
            {apiStatus==="error"   && <span style={{ color:"#e63946" }}>⚠️ Guna data anggaran</span>}
          </div>
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

        {/* Negeri + Daerah picker */}
        <div style={{ position:"relative" }}>
          <button onClick={e=>{e.stopPropagation();setShowPicker(v=>!v);}} style={{ padding:"8px 14px", background:T.greenBg, border:`1px solid ${G}`, borderRadius:8, color:G, fontSize:13, cursor:"pointer", fontWeight:600, textAlign:"left" }}>
            <div style={{ fontSize:10, color:T.textMid }}>📍 {negeri}</div>
            <div style={{ fontSize:14, fontWeight:700 }}>{daerah} {showPicker?"▲":"▼"}</div>
            <div style={{ fontSize:10, color:T.textDim }}>Zon: {zon}</div>
          </button>
          {showPicker && (
            <div style={{ position:"absolute", right:0, top:"110%", zIndex:99, width:320, borderRadius:10, border:`1px solid ${G}`, background:T.bgCard, boxShadow:"0 8px 24px rgba(0,0,0,0.2)", overflow:"hidden" }}>
              {/* Negeri tabs */}
              <div style={{ display:"flex", flexWrap:"wrap", gap:4, padding:8, borderBottom:`1px solid ${T.border}`, maxHeight:120, overflowY:"auto" }}>
                {Object.keys(DAERAH_DB).map(n=>(
                  <button key={n} onClick={e=>{e.stopPropagation();setNegeri(n);setDaerah(DAERAH_DB[n][0].daerah);firedRef.current={};}} style={{ padding:"4px 10px", borderRadius:16, border:`1px solid ${n===negeri?G:T.border}`, background:n===negeri?G:T.bgCard, color:n===negeri?"#fff":T.text, fontSize:11, cursor:"pointer", fontWeight:n===negeri?700:400 }}>
                    {n}
                  </button>
                ))}
              </div>
              {/* Daerah list */}
              <div style={{ maxHeight:240, overflowY:"auto" }}>
                {(DAERAH_DB[negeri]||[]).map(d=>(
                  <button key={d.daerah} onClick={e=>{e.stopPropagation();setDaerah(d.daerah);setShowPicker(false);firedRef.current={};}} style={{ width:"100%", padding:"10px 14px", textAlign:"left", background:d.daerah===daerah?T.greenBg:T.bgCard, border:"none", borderBottom:`1px solid ${T.border}`, color:d.daerah===daerah?G:T.text, cursor:"pointer", fontSize:13, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span>{d.daerah}</span>
                    <span style={{ fontSize:10, color:T.textDim }}>{d.zon}</span>
                  </button>
                ))}
              </div>
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
          <span style={{ fontSize:11, color:T.textDim }}>Data: api.waktusolat.app · JAKIM · {daerah}, {negeri} ({zon})</span>
          {isDark && <span style={{ fontSize:10, color:G, background:T.greenBg, padding:"2px 8px", borderRadius:10, border:`1px solid ${G}` }}>🌙 Mod Malam</span>}
          {!isDark && <span style={{ fontSize:10, color:"#e8a020", background:"#fff8e6", padding:"2px 8px", borderRadius:10, border:"1px solid #e8a020" }}>☀️ Mod Siang</span>}
        </div>
      </div>

      {/* ── AYAM-AYAM ITU ── */}
      <ChickenFarm />

    </div>
  );
}
