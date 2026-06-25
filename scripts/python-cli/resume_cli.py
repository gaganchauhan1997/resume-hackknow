#!/usr/bin/env python3
"""
Resume Hackknow CLI
Local-first resume optimization tool using BYOK (Bring Your Own Key).
Minimizes server usage and tokens by running core tools locally.

Usage:
    python resume_cli.py resume-fixer --resume resume.txt --key YOUR_GROQ_KEY
    python resume_cli.py jd-matcher --resume resume.txt --jd job.txt --key YOUR_KEY
    python resume_cli.py company-tailor --resume resume.txt --jd jd.txt --company "Stripe" --title "Senior Frontend" --key YOUR_KEY
    python resume_cli.py ats-checker --resume resume.txt --jd job.txt --key YOUR_KEY
"""

import argparse
import json
import sys
import re
from pathlib import Path

import urllib.request
import urllib.error


PROVIDERS = {
    "groq": {
        "url": "https://api.groq.com/openai/v1/chat/completions",
        "model": "llama-3.3-70b-versatile",
        "type": "openai",
    },
    "gemini": {
        "url": "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        "type": "gemini",
    },
    "openrouter": {
        "url": "https://openrouter.ai/api/v1/chat/completions",
        "model": "meta-llama/llama-3.3-70b-instruct:free",
        "type": "openai",
    },
    "together": {
        "url": "https://api.together.xyz/v1/chat/completions",
        "model": "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
        "type": "openai",
    },
    "mistral": {
        "url": "https://api.mistral.ai/v1/chat/completions",
        "model": "mistral-small-latest",
        "type": "openai",
    },
    "cohere": {
        "url": "https://api.cohere.com/v2/chat",
        "model": "command-r-08-2024",
        "type": "cohere",
    },
}

# --- ATS scoring (ported from Yahavi Forge report.js) ---
STOP_WORDS = {
    'the','a','an','and','or','but','of','in','on','at','to','for','from','with','by','as','is','was','are','were',
    'be','been','being','have','has','had','do','does','did','will','would','shall','should','can','could','may',
    'might','must','this','that','these','those','it','its','i','you','he','she','we','they','them','their','our',
    'your','his','her','my','me','us','him','about','into','through','during','before','after','above','below','up',
    'down','out','off','over','under','again','further','then','once','here','there','when','where','why','how',
    'all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so',
    'than','too','very','company','role','responsible','work','team','using','used','use','working'
}


def tokenize(text):
    lower = text.lower()
    matches = re.findall(r'[a-z][a-z0-9+\#\.\-]{2,}', lower)
    return [t for t in matches if t not in STOP_WORDS and len(t) >= 3]


def ngrams(tokens, n):
    return [' '.join(tokens[i:i+n]) for i in range(len(tokens) - n + 1)]


def extract_keywords(text, top_k=40):
    tokens = tokenize(text)
    freq = {}
    for t in tokens:
        freq[t] = freq.get(t, 0) + 1
    for bg in ngrams(tokens, 2):
        parts = bg.split(' ')
        if all(len(p) >= 4 for p in parts):
            freq[bg] = freq.get(bg, 0) + 1.5
    return sorted(freq.items(), key=lambda x: -x[1])[:top_k]


def compute_local_ats_score(resume_text, jd_text):
    resume_lower = resume_text.lower()
    jd_keywords = extract_keywords(jd_text, 40)
    matched = [k for k, _ in jd_keywords if k in resume_lower]
    missing = [k for k, _ in jd_keywords if k not in resume_lower]
    kw_score = min(50, round(50 * len(matched) / max(1, len(jd_keywords))))

    word_count = len(resume_text.split())
    length_score = 10 if 350 <= word_count <= 900 else 7 if 250 <= word_count < 350 or 900 < word_count <= 1100 else 5 if word_count >= 250 else 3

    sections = {
        'experience': ['experience', 'work history', 'employment', 'professional'],
        'education': ['education', 'academic', 'university', 'college', 'degree'],
        'skills': ['skills', 'technologies', 'competencies', 'expertise', 'tech stack'],
        'summary': ['summary', 'about', 'profile', 'objective']
    }
    sections_found = sum(1 for kws in sections.values() if any(k in resume_lower for k in kws))
    section_score = round(15 * sections_found / 4)

    action_verbs = ['architected','built','shipped','engineered','designed','led','managed','drove','reduced',
        'increased','accelerated','automated','optimized','scaled','launched','delivered','created','developed',
        'implemented','integrated','migrated','owned','spearheaded','transformed','negotiated','mentored','achieved',
        'improved','boosted','streamlined','orchestrated','executed']
    verb_hits = sum(1 for v in action_verbs if re.search(r'\b' + v + r'\b', resume_lower))
    verb_score = min(10, verb_hits)

    quant_matches = len(re.findall(r'\b\d+[%xKkMmBb]?\b', resume_text))
    quant_score = min(15, quant_matches)

    total = kw_score + length_score + section_score + verb_score + quant_score
    return {
        'score': total,
        'word_count': word_count,
        'matched_keywords': matched[:20],
        'missing_keywords': missing[:25],
        'verb_hits': verb_hits,
        'quant_hits': quant_matches,
        'breakdown': {
            'keyword_overlap': {'score': kw_score, 'max': 50},
            'length_density': {'score': length_score, 'max': 10},
            'section_completeness': {'score': section_score, 'max': 15},
            'action_verbs': {'score': verb_score, 'max': 10},
            'quantified_impact': {'score': quant_score, 'max': 15}
        }
    }


def call_provider(provider_id, api_key, messages, temperature=0.7, max_tokens=2048):
    p = PROVIDERS[provider_id]

    if p["type"] == "openai":
        body = {
            "model": p["model"],
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        req = urllib.request.Request(
            p["url"],
            data=json.dumps(body).encode(),
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read())
            return data["choices"][0]["message"]["content"]

    elif p["type"] == "gemini":
        user_turns = [m for m in messages if m["role"] != "system"]
        sys_msg = next((m for m in messages if m["role"] == "system"), None)
        body = {
            "contents": [{"role": "user" if m["role"] != "assistant" else "model", "parts": [{"text": m["content"]}]} for m in user_turns],
            "generationConfig": {"temperature": temperature, "maxOutputTokens": max_tokens}
        }
        if sys_msg:
            body["systemInstruction"] = {"parts": [{"text": sys_msg["content"]}]}
        url = f"{p['url']}?key={api_key}"
        req = urllib.request.Request(url, data=json.dumps(body).encode(), headers={"Content-Type": "application/json"}, method="POST")
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read())
            return data["candidates"][0]["content"]["parts"][0]["text"]

    elif p["type"] == "cohere":
        body = {
            "model": p["model"],
            "messages": [{"role": m["role"] if m["role"] != "user" and m["role"] != "assistant" else m["role"], "content": m["content"]} for m in messages],
            "temperature": temperature
        }
        req = urllib.request.Request(
            p["url"],
            data=json.dumps(body).encode(),
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read())
            return data["message"]["content"][0]["text"]

    raise ValueError(f"Unknown provider type: {p['type']}")


PROMPTS = {
    "resume-fixer": {
        "system": "You are an elite resume engineer. Rewrite the resume to maximize interview callbacks. Use strong action verbs, quantify results, ATS-friendly formatting. NEVER fabricate. Bold key metrics.",
        "template": "TARGET ROLE: {role}\n\nRESUME:\n{resume}\n\nRewrite this resume now.",
        "temp": 0.7,
        "tokens": 2500
    },
    "jd-matcher": {
        "system": "Compare the resume against the JD. Output: keyword gaps + rewritten resume sections + estimated match score before/after.",
        "template": "RESUME:\n{resume}\n\n---\n\nJOB DESCRIPTION:\n{jd}\n\nAnalyze and rewrite.",
        "temp": 0.5,
        "tokens": 2500
    },
    "company-tailor": {
        "system": "Generate a complete application package: tailored resume, cover letter, recruiter message, and prep checklist. Use company name and JD language explicitly. No fabrication.",
        "template": "Job title: {title}\nCompany: {company}\nSource: {source}\n\nJOB DESCRIPTION:\n{jd}\n\nRESUME:\n{resume}\n\nGenerate the full pack.",
        "temp": 0.6,
        "tokens": 3500
    },
    "ats-checker": {
        "system": "Analyze resume vs JD. Output: ATS score /100, keyword gaps, section analysis, top 3 fixes, 6-second recruiter read.",
        "template": "RESUME:\n{resume}\n\n---\n\nJOB DESCRIPTION:\n{jd}\n\nScore and analyze.",
        "temp": 0.3,
        "tokens": 2000
    },
}


def main():
    parser = argparse.ArgumentParser(description="Resume Hackknow CLI - BYOK Resume Optimization")
    parser.add_argument("tool", choices=["resume-fixer", "jd-matcher", "company-tailor", "ats-checker"])
    parser.add_argument("--resume", required=True, help="Path to resume text file")
    parser.add_argument("--jd", help="Path to job description text file")
    parser.add_argument("--company", help="Company name (for company-tailor)")
    parser.add_argument("--title", help="Job title (for company-tailor)")
    parser.add_argument("--source", default="", help="Source URL (for company-tailor)")
    parser.add_argument("--key", required=True, help="API key")
    parser.add_argument("--provider", default="groq", choices=list(PROVIDERS.keys()))
    parser.add_argument("--role", default="", help="Target role (for resume-fixer)")
    parser.add_argument("--output", "-o", help="Output file path")
    parser.add_argument("--local-ats-only", action="store_true", help="Only run local ATS scoring (no AI)")

    args = parser.parse_args()

    resume_text = Path(args.resume).read_text(encoding="utf-8")
    jd_text = Path(args.jd).read_text(encoding="utf-8") if args.jd else ""

    # Local ATS score
    if jd_text:
        print("=" * 50)
        print("LOCAL ATS SCORE")
        print("=" * 50)
        score = compute_local_ats_score(resume_text, jd_text)
        print(f"Score: {score['score']}/100")
        print(f"Word count: {score['word_count']}")
        print(f"Matched keywords: {len(score['matched_keywords'])}")
        print(f"Missing keywords: {len(score['missing_keywords'])}")
        print(f"Action verb hits: {score['verb_hits']}")
        print(f"Quantification hits: {score['quant_hits']}")
        print("\nBreakdown:")
        for k, v in score['breakdown'].items():
            print(f"  {k}: {v['score']}/{v['max']}")
        print("=" * 50)

    if args.local_ats_only:
        return

    cfg = PROMPTS[args.tool]
    user_msg = cfg["template"].format(
        resume=resume_text,
        jd=jd_text,
        role=args.role,
        company=args.company or "",
        title=args.title or "",
        source=args.source
    )

    print(f"\nCalling {args.provider}...")
    try:
        result = call_provider(
            args.provider,
            args.key,
            [{"role": "system", "content": cfg["system"]}, {"role": "user", "content": user_msg}],
            temperature=cfg["temp"],
            max_tokens=cfg["tokens"]
        )
    except urllib.error.HTTPError as e:
        print(f"Error: HTTP {e.code} - {e.read().decode()[:500]}", file=sys.stderr)
        sys.exit(1)

    print("\n" + "=" * 50)
    print("RESULT")
    print("=" * 50)
    print(result)

    if args.output:
        Path(args.output).write_text(result, encoding="utf-8")
        print(f"\nSaved to {args.output}")


if __name__ == "__main__":
    main()
