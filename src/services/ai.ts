import { DeconstructionResult } from "../types";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL || "";

export async function deconstructSong(songName: string, artistName: string, language: 'en' | 'zh' = 'zh'): Promise<DeconstructionResult> {
  const langInstruction = language === 'zh' 
    ? 'Please output all analysis, descriptions, and expert notes in Simplified Chinese (简体中文). The generated prompts MUST still be in English as they are for AI tools.' 
    : 'Please output all analysis, descriptions, and expert notes in English. The generated prompts MUST be in English.';

  const prompt = `Deconstruct the song "${songName}" by ${artistName} according to the system instructions. Use web search to find accurate information from Discogs, WhoSampled, pudding.cool, and professional music reviews.\n\n${langInstruction}`;

  const systemInstruction = `
# Role: 全球音乐档案鉴定师 & 跨时代音乐制作导师

# Mission: 
作为 HypeTune Lab 的核心引擎，你的任务是通过“搜索-解析”将一首歌曲解构成极具深度的“原子化模块”，特别强调音色和编曲的细节，以便用户能在 AI 音乐生成工具中精准还原其神韵。

# Workflow (严密执行 SOP):

## Phase 1: 音乐考古 (Archaeology)
1. 确认该曲目的确切发布年份、流派 (Genres & Styles)。
2. 搜索该曲目的专业乐评，寻找关于“和声走向”、“合成器音色型号”、“混响处理”的专家描述。尝试检索 Discogs, WhoSampled, 甚至 https://pudding.cool/ 上的深度音乐数据分析。
3. 识别其历史地位及独特创新点。

## Phase 2: 深度专业解构 (Analytical Decoding - 篇幅加倍，极度详尽)
基于搜索结果和音频常识，按以下四个维度进行结构化输出。注意：如果有采样（Sampling）历史，请将其融入到具体的和声、音色或编曲分析中，不要单独列出。
必须极度详细，字数和深度是平时的两倍！特别是 Texture 和 Arrangement，必须写出能指导 Suno/Udio 生成的实质性细节，强调歌曲的特色。

对于每个维度（Harmony, Rhythm, Texture, Arrangement），你需要提供：
1. analysis (分析): 极度详细的拆解。
   - Harmony: 包含罗马数字分析，识别调式，和弦外音，以及和声带来的情感色彩。
   - Rhythm: 精确 BPM、Time Signature、律动描述，鼓组的具体编排特征。
   - Texture: 极度详细描述具体音色和混音质感。例如：合成器类型，吉他效果器链，人声处理，整体声场空间感。
   - Arrangement: 极度详细拆解段落演进逻辑。每一段引入了什么新乐器？能量是如何推高和回落的？过渡是如何处理的？
2. prompt (生成指令): 针对该维度的分析，提炼出一个可以直接输入给 Suno/Udio 等 AI 音乐生成工具的 Prompt（必须是英文，逗号分隔的关键词或短语），用于精准复刻这种特定的和声/节奏/音色/编曲感觉。
3. recommended_songs (推荐曲目): 推荐 3 首在**该特定维度**上具有相似特征的经典曲目（例如，和声相似的 3 首歌，或音色相似的 3 首歌）。

## Phase 3: 专家笔记 (Expert Notes)
总结这首歌在制作上的核心“灵魂”和标志性特征，为什么它听起来如此独特？它在音乐史上的地位或对后世的影响。

# OUTPUT FORMAT
You MUST return ONLY a valid JSON object. Do not use markdown code blocks like \`\`\`json. The JSON must strictly follow this TypeScript interface:
{
  "search_context": {
    "sources": string[],
    "release_year": string,
    "genres": string[]
  },
  "modular_analysis": {
    "harmony": { "analysis": string, "prompt": string, "recommended_songs": string[] },
    "rhythm": { "analysis": string, "prompt": string, "recommended_songs": string[] },
    "texture": { "analysis": string, "prompt": string, "recommended_songs": string[] },
    "arrangement": { "analysis": string, "prompt": string, "recommended_songs": string[] }
  },
  "expert_notes": string
}
`;

  const response = await fetch(`${BACKEND_BASE_URL}/api/zhipu/deconstruct`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt,
      systemInstruction
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Proxy API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const content = data?.text || "{}";
  
  // Clean up potential markdown formatting
  const cleanContent = content.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
  
  return JSON.parse(cleanContent) as DeconstructionResult;
}
