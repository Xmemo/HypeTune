import React, { useState } from 'react';
import { Search, Loader2, Disc3, Activity, Layers, Music, Terminal, Clipboard, Globe, Copy, CheckCircle2, Sparkles, AudioLines } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { deconstructSong } from './services/ai';
import { DeconstructionResult, ModuleAnalysis } from './types';

const translations = {
  en: {
    subtitle: "Decode the Magic. Mix the Future.",
    oneLiner: "Enter any song and artist. HypeTune Lab breaks it into harmony, rhythm, texture, and arrangement, then outputs ready-to-use prompts for AI music tools.",
    value1: "4D song deconstruction",
    value2: "Production-grade prompt output",
    value3: "Style replication with your own twist",
    targetTrack: "Target Track",
    artist: "Artist / Producer",
    initiate: "INITIATE",
    deconstructing: "DECONSTRUCTING...",
    pasteClipboard: "Paste from Clipboard",
    archaeology: "Archaeology Context",
    releaseYear: "RELEASE YEAR",
    genres: "GENRES & STYLES",
    harmony: "HARMONY",
    rhythm: "RHYTHM",
    texture: "TEXTURE",
    arrangement: "ARRANGEMENT",
    expertNotes: "Expert Legacy Notes",
    error: "Error",
    placeholderSong: "e.g. Get Lucky",
    placeholderArtist: "e.g. Daft Punk",
    prompt: "PROMPT",
    copyPrompt: "Copy Prompt",
    copied: "Copied!",
    recommendedFor: "RECOMMENDED FOR"
  },
  zh: {
    subtitle: "解构经典，复刻未来。",
    oneLiner: "输入任意歌曲和歌手，HypeTune Lab 会把这首歌拆解成「和声、节奏、音色、编曲」四个关键模块，并自动生成可直接用于 AI 音乐工具的创作 Prompt，让你快速复刻风格并做出自己的版本。",
    value1: "四维音乐解构",
    value2: "可直接使用的创作指令",
    value3: "复刻风格并做出自己的版本",
    targetTrack: "目标曲目",
    artist: "艺术家 / 制作人",
    initiate: "开始解构",
    deconstructing: "解构中...",
    pasteClipboard: "从剪贴板读取",
    archaeology: "音乐考古上下文",
    releaseYear: "发行年份",
    genres: "流派与风格",
    harmony: "和声",
    rhythm: "节奏",
    texture: "音色",
    arrangement: "编曲",
    expertNotes: "专家历史笔记",
    error: "错误",
    placeholderSong: "例如：夜曲",
    placeholderArtist: "例如：周杰伦",
    prompt: "生成指令",
    copyPrompt: "复制指令",
    copied: "已复制！",
    recommendedFor: "相似推荐"
  }
};

export default function App() {
  const [song, setSong] = useState('');
  const [artist, setArtist] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DeconstructionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<'en' | 'zh'>('zh');

  const t = translations[lang];

  const handleDeconstruct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!song || !artist) return;

    setLoading(true);
    setError(null);
    try {
      const data = await deconstructSong(song, artist, lang);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to deconstruct song.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return;
      
      // Netease format: 分享[Artist]的单曲《[Song]》
      const neteaseRegex = /分享(.+?)的单曲《(.+?)》/;
      const match = text.match(neteaseRegex);
      if (match) {
        setArtist(match[1].trim());
        setSong(match[2].trim());
        return;
      }
      
      // Generic format: Artist - Song
      if (text.includes(' - ')) {
        const parts = text.split(' - ');
        setArtist(parts[0].trim());
        setSong(parts[1].trim());
        return;
      }

      // Fallback
      setSong(text.trim());
    } catch (err) {
      console.error("Failed to read clipboard", err);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-lab-bg text-lab-text font-sans p-4 md:p-8">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute -top-32 left-[-8%] h-96 w-96 rounded-full bg-lab-accent/12 blur-3xl" />
        <div className="absolute top-28 right-[-6%] h-[30rem] w-[30rem] rounded-full bg-lab-accent-2/12 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="rounded-2xl border border-lab-border/70 bg-lab-card/70 backdrop-blur-xl p-5 md:p-7 shadow-[0_20px_70px_-40px_rgba(58,230,176,0.5)]">
          <div className="flex flex-col gap-5 md:gap-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-lab-bg border border-lab-border/80 flex items-center justify-center shadow-inner">
                  <Disc3 className="text-lab-accent w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-display">
                    HypeTune Lab
                    <span className="text-lab-muted font-mono text-xs ml-2 align-middle">v2.0</span>
                  </h1>
                  <p className="text-[11px] text-lab-muted font-mono uppercase tracking-[0.24em] mt-1">{t.subtitle}</p>
                </div>
              </div>

              <button
                onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-lab-border bg-lab-bg/70 hover:border-lab-accent transition-colors text-sm font-mono"
              >
                <Globe className="w-4 h-4" />
                {lang === 'en' ? 'EN' : '中文'}
              </button>
            </div>

            <p className="text-sm md:text-base leading-relaxed text-lab-text/95 max-w-4xl">
              {t.oneLiner}
            </p>

            <div className="flex flex-wrap gap-2">
              {[t.value1, t.value2, t.value3].map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full border border-lab-border bg-lab-bg/70 px-3 py-1.5 text-xs md:text-sm text-lab-muted"
                >
                  <Sparkles className="w-3.5 h-3.5 text-lab-accent" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Search Panel */}
        <section className="bg-lab-card/90 border border-lab-border rounded-2xl p-5 md:p-6 shadow-[0_24px_90px_-52px_rgba(16,185,129,0.85)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-lab-muted font-mono">Input Studio</p>
              <h2 className="text-lg md:text-xl font-semibold mt-1 flex items-center gap-2 font-display">
                <AudioLines className="w-5 h-5 text-lab-accent" />
                {lang === 'zh' ? '输入曲目并开始解析' : 'Feed a Track and Start Parsing'}
              </h2>
            </div>
            <button 
              type="button"
              onClick={handlePaste}
              className="w-full md:w-auto flex items-center justify-center gap-2 text-xs font-mono text-lab-accent hover:text-white transition-colors bg-lab-accent/10 px-3 py-2 rounded-lg border border-lab-accent/30"
            >
              <Clipboard className="w-3.5 h-3.5" />
              {t.pasteClipboard}
            </button>
          </div>
          <form onSubmit={handleDeconstruct} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-2">
              <label className="text-xs font-mono text-lab-muted uppercase tracking-wider">{t.targetTrack}</label>
              <input 
                type="text" 
                value={song}
                onChange={(e) => setSong(e.target.value)}
                placeholder={t.placeholderSong}
                className="w-full bg-lab-bg border border-lab-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-lab-accent focus:ring-2 focus:ring-lab-accent/30 transition-all"
                required
              />
            </div>
            <div className="flex-1 w-full space-y-2">
              <label className="text-xs font-mono text-lab-muted uppercase tracking-wider">{t.artist}</label>
              <input 
                type="text" 
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder={t.placeholderArtist}
                className="w-full bg-lab-bg border border-lab-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-lab-accent focus:ring-2 focus:ring-lab-accent/30 transition-all"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading || !song || !artist}
              className="w-full md:w-auto bg-lab-accent text-black font-semibold px-8 py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_10px_24px_-10px_rgba(58,230,176,0.8)]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Terminal className="w-5 h-5" />}
              <span>{loading ? t.deconstructing : t.initiate}</span>
            </button>
          </form>
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-mono">
              {t.error}: {error}
            </div>
          )}
        </section>

        {/* Dashboard */}
        <AnimatePresence mode="wait">
          {result && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Top Row: Context & Expert Notes */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Context Widget */}
                <div className="bg-lab-card border border-lab-border rounded-2xl p-5 space-y-4 lg:col-span-1">
                  <h3 className="text-xs font-mono text-lab-muted uppercase tracking-wider flex items-center gap-2">
                    <Search className="w-4 h-4" /> {t.archaeology}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-lab-muted font-mono">{t.releaseYear}</span>
                      <p className="font-mono text-sm">{result.search_context.release_year}</p>
                    </div>
                    <div>
                      <span className="text-xs text-lab-muted font-mono">{t.genres}</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {result.search_context.genres.map((g, i) => (
                          <span key={i} className="px-2 py-1 bg-lab-bg border border-lab-border rounded text-xs font-mono text-lab-accent">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expert Notes */}
                <div className="bg-lab-card border border-lab-border rounded-2xl p-6 relative overflow-hidden lg:col-span-2">
                  <div className="absolute top-0 left-0 w-1 h-full bg-lab-accent"></div>
                  <h3 className="text-xs font-mono text-lab-muted uppercase tracking-wider mb-3">{t.expertNotes}</h3>
                  <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">{result.expert_notes}</p>
                </div>
              </div>

              {/* Bottom Row: Modular Analysis Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ModuleCard title={t.harmony} icon={<Music className="w-4 h-4" />} data={result.modular_analysis.harmony} t={t} />
                <ModuleCard title={t.rhythm} icon={<Activity className="w-4 h-4" />} data={result.modular_analysis.rhythm} t={t} />
                <ModuleCard title={t.texture} icon={<Layers className="w-4 h-4" />} data={result.modular_analysis.texture} t={t} />
                <ModuleCard title={t.arrangement} icon={<Disc3 className="w-4 h-4" />} data={result.modular_analysis.arrangement} t={t} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ModuleCard({ title, icon, data, t }: { title: string, icon: React.ReactNode, data: ModuleAnalysis, t: any }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-lab-card/95 border border-lab-border rounded-2xl p-6 hover:border-lab-accent/50 transition-colors group flex flex-col h-full shadow-[0_15px_45px_-28px_rgba(58,230,176,0.35)]">
      <div className="flex items-center gap-2 mb-4 text-lab-accent opacity-80 group-hover:opacity-100 transition-opacity">
        {icon}
        <h4 className="text-sm font-mono uppercase tracking-wider font-semibold">{title}</h4>
      </div>
      
      <div className="flex-grow space-y-4">
        <p className="text-sm text-lab-text/85 leading-relaxed whitespace-pre-wrap">{data.analysis}</p>
        
        {/* Prompt Section */}
        <div className="space-y-2 pt-4 border-t border-lab-border/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-lab-muted uppercase">{t.prompt}</span>
            <button 
              onClick={handleCopy} 
              className="text-lab-muted hover:text-lab-accent transition-colors flex items-center gap-1 text-xs font-mono"
            >
              {copied ? (
                <><CheckCircle2 className="w-3 h-3 text-green-400" /> {t.copied}</>
              ) : (
                <><Copy className="w-3 h-3" /> {t.copyPrompt}</>
              )}
            </button>
          </div>
          <div className="bg-lab-bg border border-lab-border rounded-lg p-3 text-xs font-mono text-gray-300 break-words">
            {data.prompt}
          </div>
        </div>

        {/* Recommended Songs Section */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-mono text-lab-muted uppercase">{t.recommendedFor} {title}</span>
          <ul className="list-disc list-inside text-xs text-gray-400 space-y-1 font-mono">
            {data.recommended_songs.map((song, i) => (
              <li key={i}>{song}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
