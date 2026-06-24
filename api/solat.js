export default async function handler(req, res) {
  const { zon, month, year } = req.query;
  
  if (!zon) {
    return res.status(400).json({ error: "zon required" });
  }

  try {
    const url = `https://api.waktusolat.app/solat/${zon}?month=${month||new Date().getMonth()+1}&year=${year||new Date().getFullYear()}`;
    const response = await fetch(url);
    const data = await response.json();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=3600');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
