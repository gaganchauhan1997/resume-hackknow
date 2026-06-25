import type { ProviderConfig, ToolResult } from '@/types';

export const PROVIDERS: Record<string, ProviderConfig> = {
  groq: {
    id: 'groq',
    name: 'Groq',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.3-70b-versatile',
    fallbackModel: 'llama-3.1-8b-instant',
    type: 'openai',
    keyHint: 'gsk_...',
    keyUrl: 'https://console.groq.com/keys',
    note: 'Fastest free tier · 14,400 req/day'
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    model: 'gemini-2.0-flash',
    fallbackUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    type: 'gemini',
    keyHint: 'AIza...',
    keyUrl: 'https://aistudio.google.com/apikey',
    note: 'Free · 1,500 req/day · 1M context'
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'meta-llama/llama-3.3-70b-instruct:free',
    fallbackModel: 'google/gemini-2.0-flash-exp:free',
    type: 'openai',
    keyHint: 'sk-or-...',
    keyUrl: 'https://openrouter.ai/keys',
    note: 'Free tier across 100+ models'
  },
  together: {
    id: 'together',
    name: 'Together AI',
    url: 'https://api.together.xyz/v1/chat/completions',
    model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
    type: 'openai',
    keyHint: 'API key',
    keyUrl: 'https://api.together.xyz/settings/api-keys',
    note: 'Free tier with $5 credit on signup'
  },
  mistral: {
    id: 'mistral',
    name: 'Mistral',
    url: 'https://api.mistral.ai/v1/chat/completions',
    model: 'mistral-small-latest',
    type: 'openai',
    keyHint: 'API key',
    keyUrl: 'https://console.mistral.ai/api-keys',
    note: 'Free tier · La Plateforme'
  },
  cohere: {
    id: 'cohere',
    name: 'Cohere',
    url: 'https://api.cohere.com/v2/chat',
    model: 'command-r-08-2024',
    type: 'cohere',
    keyHint: 'API key',
    keyUrl: 'https://dashboard.cohere.com/api-keys',
    note: 'Free trial keys · 1,000 req/month'
  }
};

const STORAGE_KEY = 'resume-hackknow-keys';
const PREFS_KEY = 'resume-hackknow-prefs';

export function loadKeys(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveKeys(keys: Record<string, string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

export function loadPrefs(): { preferredProvider: string } {
  try {
    return { preferredProvider: 'auto', ...JSON.parse(localStorage.getItem(PREFS_KEY) || '{}') };
  } catch {
    return { preferredProvider: 'auto' };
  }
}

export function savePrefs(prefs: { preferredProvider: string }) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export function maskKey(key: string): string {
  if (key.length <= 8) return '••••••••';
  return key.slice(0, 4) + '••••' + key.slice(-4);
}

async function callProvider(
  id: string,
  key: string,
  messages: { role: string; content: string }[],
  options: { temperature?: number; max_tokens?: number; json_mode?: boolean; model?: string } = {}
): Promise<string> {
  const p = PROVIDERS[id];
  const temperature = options.temperature ?? 0.7;
  const maxTokens = options.max_tokens ?? 2048;

  if (p.type === 'openai') {
    const body: Record<string, unknown> = {
      model: options.model || p.model,
      messages,
      temperature,
      max_tokens: maxTokens
    };
    if (options.json_mode) {
      body.response_format = { type: 'json_object' };
    }
    const res = await fetch(p.url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const text = await res.text();
      const err = new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
      (err as Error & { status?: number }).status = res.status;
      throw err;
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }

  if (p.type === 'gemini') {
    const sys = messages.find(m => m.role === 'system');
    const userTurns = messages.filter(m => m.role !== 'system');
    const body: Record<string, unknown> = {
      contents: userTurns.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })),
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens
      }
    };
    if (options.json_mode) {
      body.generationConfig = { ...(body.generationConfig as object), responseMimeType: 'application/json' };
    }
    if (sys) {
      body.systemInstruction = { parts: [{ text: sys.content }] };
    }

    const url = `${p.url}?key=${encodeURIComponent(key)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const text = await res.text();
      if (p.fallbackUrl) {
        const res2 = await fetch(`${p.fallbackUrl}?key=${encodeURIComponent(key)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (res2.ok) {
          const data2 = await res2.json();
          return data2.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
      }
      const err = new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
      (err as Error & { status?: number }).status = res.status;
      throw err;
    }
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  if (p.type === 'cohere') {
    const body = {
      model: options.model || p.model,
      messages: messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : (m.role === 'system' ? 'system' : 'user'),
        content: m.content
      })),
      temperature
    };
    const res = await fetch(p.url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const text = await res.text();
      const err = new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
      (err as Error & { status?: number }).status = res.status;
      throw err;
    }
    const data = await res.json();
    return data.message?.content?.[0]?.text || '';
  }

  throw new Error(`Unknown provider type: ${p.type}`);
}

export async function aiCall(
  keys: Record<string, string>,
  prefs: { preferredProvider: string },
  messages: { role: string; content: string }[],
  options: { temperature?: number; max_tokens?: number; json_mode?: boolean; model?: string } = {}
): Promise<ToolResult> {
  const order = ['groq', 'gemini', 'openrouter', 'together', 'mistral', 'cohere'];
  const preferred = prefs.preferredProvider;
  const tryOrder = preferred && preferred !== 'auto' && keys[preferred]
    ? [preferred, ...order.filter(p => p !== preferred)]
    : order;

  const errors: { id: string; msg: string; status?: number }[] = [];

  for (const id of tryOrder) {
    if (!keys[id]) continue;
    try {
      const result = await callProvider(id, keys[id], messages, options);
      return { result, provider: id };
    } catch (e) {
      const err = e as Error & { status?: number };
      errors.push({ id, msg: err.message, status: err.status };
      continue;
    }
  }

  if (errors.length === 0) {
    throw new Error('NO API KEYS CONFIGURED\n\nOpen the KEYS panel and paste at least one free API key.\n\nFastest path: Get a Groq key (60 sec) at console.groq.com/keys');
  }

  const summary = errors.map(e => {
    const p = PROVIDERS[e.id]?.name || e.id;
    if (e.status === 401 || /401|invalid|unauthorized/i.test(e.msg)) {
      return `${p}: API KEY INVALID — re-generate at ${PROVIDERS[e.id]?.keyUrl}`;
    }
    if (e.status === 429 || /429|rate|quota/i.test(e.msg)) {
      return `${p}: RATE LIMITED — wait a minute, or add another provider as backup`;
    }
    if (e.status === 403 || /403|forbidden/i.test(e.msg)) {
      return `${p}: ACCESS DENIED — key may need billing/verification`;
    }
    return `${p}: ${e.msg.slice(0, 160)}`;
  }).join('\n');

  throw new Error(summary + '\n\nFix the issue above OR add another provider as fallback in KEYS.');
}

export function computeLocalAtsScore(resumeText: string, jdText: string) {
  const STOP_WORDS = new Set([
    'the','a','an','and','or','but','of','in','on','at','to','for','from','with','by','as','is','was','are','were',
    'be','been','being','have','has','had','do','does','did','will','would','shall','should','can','could','may',
    'might','must','this','that','these','those','it','its','i','you','he','she','we','they','them','their','our',
    'your','his','her','my','me','us','him','about','into','through','during','before','after','above','below','up',
    'down','out','off','over','under','again','further','then','once','here','there','when','where','why','how',
    'all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so',
    'than','too','very','company','role','responsible','work','team','using','used','use','working'
  ]);

  function tokenize(text: string) {
    if (!text) return [];
    const lower = text.toLowerCase();
    const matches = lower.match(/[a-z][a-z0-9+\#\.\-]{2,}/g) || [];
    return matches.filter(t => !STOP_WORDS.has(t) && t.length >= 3);
  }

  function ngrams(tokens: string[], n: number) {
    const out: string[] = [];
    for (let i = 0; i <= tokens.length - n; i++) out.push(tokens.slice(i, i + n).join(' '));
    return out;
  }

  function extractKeywords(text: string, topK = 40) {
    const tokens = tokenize(text);
    const freq: Record<string, number> = {};
    for (const t of tokens) freq[t] = (freq[t] || 0) + 1;
    for (const bg of ngrams(tokens, 2)) {
      const parts = bg.split(' ');
      if (parts.every(p => p.length >= 4)) freq[bg] = (freq[bg] || 0) + 1.5;
    }
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, topK);
  }

  const resumeLower = resumeText.toLowerCase();
  const jdKeywords = extractKeywords(jdText, 40);
  const matched = jdKeywords.filter(([kw]) => resumeLower.includes(kw)).map(([k]) => k);
  const missing = jdKeywords.filter(([kw]) => !resumeLower.includes(kw)).map(([k]) => k);
  const kwScore = Math.min(50, Math.round(50 * matched.length / Math.max(1, jdKeywords.length)));

  const wordCount = resumeText.split(/\s+/).filter(Boolean).length;
  let lengthScore = 5;
  if (wordCount >= 350 && wordCount <= 900) lengthScore = 10;
  else if ((wordCount >= 250 && wordCount < 350) || (wordCount > 900 && wordCount <= 1100)) lengthScore = 7;
  else if (wordCount < 250) lengthScore = 3;

  const sections: Record<string, string[]> = {
    experience: ['experience', 'work history', 'employment', 'professional'],
    education: ['education', 'academic', 'university', 'college', 'degree'],
    skills: ['skills', 'technologies', 'competencies', 'expertise', 'tech stack'],
    summary: ['summary', 'about', 'profile', 'objective']
  };
  let sectionsFound = 0;
  for (const kws of Object.values(sections)) {
    if (kws.some(k => resumeLower.includes(k))) sectionsFound++;
  }
  const sectionScore = Math.round(15 * sectionsFound / 4);

  const actionVerbs = ['architected','built','shipped','engineered','designed','led','managed','drove','reduced',
    'increased','accelerated','automated','optimized','scaled','launched','delivered','created','developed',
    'implemented','integrated','migrated','owned','spearheaded','transformed','negotiated','mentored','achieved',
    'improved','boosted','streamlined','orchestrated','executed'];
  const verbHits = actionVerbs.filter(v => new RegExp('\\b' + v + '\\b').test(resumeLower)).length;
  const verbScore = Math.min(10, verbHits);

  const quantMatches = (resumeText.match(/\b\d+[%xKkMmBb]?\b/g) || []).length;
  const quantScore = Math.min(15, quantMatches);

  const total = kwScore + lengthScore + sectionScore + verbScore + quantScore;

  return {
    score: total,
    word_count: wordCount,
    matched_keywords: matched.slice(0, 20),
    missing_keywords: missing.slice(0, 25),
    verb_hits: verbHits,
    quant_hits: quantMatches,
    breakdown: {
      keyword_overlap: { score: kwScore, max: 50 },
      length_density: { score: lengthScore, max: 10 },
      section_completeness: { score: sectionScore, max: 15 },
      action_verbs: { score: verbScore, max: 10 },
      quantified_impact: { score: quantScore, max: 15 }
    }
  };
}

export function mdToHtml(text: string): string {
  if (!text) return '';
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');
  html = html.replace(/\*\*([^\*\n]+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_\n]+?)__/g, '<strong>$1</strong>');

  try {
    html = html.replace(/(?<!\w)\*([^\*\n]+?)\*(?!\w)/g, '<em>$1</em>');
  } catch {
    html = html.replace(/\*([^\*\n]+?)\*/g, '<em>$1</em>');
  }

  html = html.replace(/^### +(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## +(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# +(.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/^[\-\*_]{3,}\s*$/gm, '<hr>');
  html = html.replace(/^> +(.+)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/^[ \t]*[\-\*\+•] +(.+)$/gm, '<li data-bullet="u">$1</li>');
  html = html.replace(/^[ \t]*\d+\. +(.+)$/gm, '<li data-bullet="o">$1</li>');

  html = html.replace(/(<li data-bullet="u">[\s\S]*?<\/li>)(?:\n*(<li data-bullet="u">[\s\S]*?<\/li>))+/g,
    (m) => '<ul>' + m.replace(/ data-bullet="u"/g, '') + '</ul>');
  html = html.replace(/(<li data-bullet="o">[\s\S]*?<\/li>)(?:\n*(<li data-bullet="o">[\s\S]*?<\/li>))+/g,
    (m) => '<ol>' + m.replace(/ data-bullet="o"/g, '') + '</ol>');
  html = html.replace(/<li data-bullet="u">([\s\S]*?)<\/li>/g, '<ul><li>$1</li></ul>');
  html = html.replace(/<li data-bullet="o">([\s\S]*?)<\/li>/g, '<ol><li>$1</li></ol>');

  html = html.split(/\n\n+/).map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    if (/^<(h\d|ul|ol|li|hr|p|pre|blockquote|div)/.test(trimmed)) return block;
    return '<p>' + block.replace(/\n/g, '<br>') + '</p>';
  }).join('\n');

  return html;
}
