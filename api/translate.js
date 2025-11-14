// api/translate.js - Vercel Serverless Function
// Deploy this repo to Vercel, set env var LLM_API_KEY, optional LLM_MODEL.
// It accepts POST {text} and returns {zh}. CORS enabled for browsers.

export default async function handler(req, res) {
  // --- CORS ---
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { text } = req.body || {};
    if (!text || typeof text !== 'string') return res.status(400).json({ error: 'no text' });

    const system = '你是一個專業技術翻譯器。請將輸入完整翻譯成繁體中文，所有英文字都必須翻譯成中文，包括告警名稱、錯誤訊息、技術詞與動作詞（例如：RESET NOTIFICATION、download failed、unit reset、software download、authentication failed 等）。除特定專有名詞（RF、GPS、VSWR、PLL、FPGA、BTS 等）外，所有英文字詞不得保留英文，必須譯為中文。不要省略、不要新增內容，不要保留英文字。只做直譯，不加註解、不加前後綴。只輸出翻譯結果。';

    const apiKey = process.env.LLM_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'missing LLM_API_KEY' });

    const model = process.env.LLM_MODEL || 'gpt-4o-mini';
    const endpoint = process.env.LLM_ENDPOINT || 'https://api.openai.com/v1/chat/completions';

    const r = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: text }
        ]
      })
    });

    if (!r.ok) {
      const detail = await r.text();
      return res.status(500).json({ error: 'llm call failed', detail: detail.slice(0, 500) });
    }

    const data = await r.json();
    const zh = (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content || '').trim();
    return res.status(200).json({ zh });
  } catch (e) {
    return res.status(500).json({ error: 'server error', detail: e.message });
  }
}
