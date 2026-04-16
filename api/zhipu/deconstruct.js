// Vercel Serverless Function for Zhipu AI Deconstruction
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ZHIPU_API_KEY;
  if (!apiKey || apiKey === "PLACEHOLDER_API_KEY") {
    return res.status(500).json({ 
      error: "Server configuration error", 
      detail: "ZHIPU_API_KEY is missing in environment variables. Please add it in your Vercel Project Settings." 
    });
  }

  const { prompt, systemInstruction } = req.body || {};
  if (typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "prompt is required" });
  }
  if (typeof systemInstruction !== "string" || !systemInstruction.trim()) {
    return res.status(400).json({ error: "systemInstruction is required" });
  }

  // Safety length check
  if (prompt.length > 12000 || systemInstruction.length > 24000) {
    return res.status(400).json({ error: "Input text too long" });
  }

  const ZHIPU_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
  const ZHIPU_MODEL = process.env.ZHIPU_MODEL || "glm-4.7-flash";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout for Vercel Pro/Local dev

  try {
    const response = await fetch(ZHIPU_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: ZHIPU_MODEL,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "web_search",
            web_search: { enable: true },
          },
        ],
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(502).json({
        error: `Provider error (${response.status})`,
        detail: errorText.slice(0, 500),
      });
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || "{}";
    return res.status(200).json({ text });
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "Request timeout"
        : "Internal processing failed";
    return res.status(502).json({ error: message });
  } finally {
    clearTimeout(timeout);
  }
}
