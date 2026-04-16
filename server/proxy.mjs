import express from "express";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const app = express();
const PORT = Number(process.env.PROXY_PORT || process.env.PORT || 8787);
const ZHIPU_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
const ZHIPU_MODEL = process.env.ZHIPU_MODEL || "glm-4.7-flash";

app.use(express.json({ limit: "128kb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/zhipu/deconstruct", async (req, res) => {
  const apiKey = process.env.ZHIPU_API_KEY;
  if (!apiKey || apiKey === "PLACEHOLDER_API_KEY") {
    return res.status(500).json({ error: "Server missing ZHIPU_API_KEY" });
  }

  const { prompt, systemInstruction } = req.body || {};
  if (typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "prompt is required" });
  }
  if (typeof systemInstruction !== "string" || !systemInstruction.trim()) {
    return res.status(400).json({ error: "systemInstruction is required" });
  }

  if (prompt.length > 12000 || systemInstruction.length > 24000) {
    return res.status(400).json({ error: "prompt or systemInstruction too long" });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

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
        error: `Zhipu provider error (${response.status})`,
        detail: errorText.slice(0, 500),
      });
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || "{}";
    return res.json({ text });
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "Zhipu request timeout"
        : "Proxy request failed";
    return res.status(502).json({ error: message });
  } finally {
    clearTimeout(timeout);
  }
});

app.listen(PORT, () => {
  console.log(`[proxy] Zhipu proxy listening on http://127.0.0.1:${PORT}`);
});
