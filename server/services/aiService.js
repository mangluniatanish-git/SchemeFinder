'use strict';

// ─── MANUAL CONFIGURATION REQUIRED ───────────────────────────────────────────
// Set the following in your .env file to enable AI-powered profile extraction:
//
//   AI_PROVIDER=gemini                    # or: openai | anthropic
//   AI_API_KEY=your_api_key_here          # DO NOT commit this value
//   AI_MODEL=gemini-1.5-flash            # or: gpt-4o-mini | claude-3-haiku-20240307
//   AI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
//                                         # OpenAI: https://api.openai.com/v1
//                                         # Anthropic: https://api.anthropic.com/v1
//
// Until configured, the service returns MOCK (rule-based) extractions with { mock: true }.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns true if AI is configured in environment variables.
 */
function isAIConfigured() {
  return !!(process.env.AI_API_KEY && process.env.AI_PROVIDER && process.env.AI_MODEL);
}

if (!isAIConfigured()) {
  console.info(
    '[AI] AI not configured — running in MOCK MODE. Set AI_API_KEY, AI_PROVIDER, AI_MODEL in .env to enable.'
  );
}

// ─── Prompt Templates ─────────────────────────────────────────────────────────

const TEXT_EXTRACTION_PROMPT = (text) => `
You are an expert at extracting demographic and socioeconomic profile information for Indian government scheme eligibility.

Extract the following fields from the user's text. Return ONLY valid JSON, no explanation.

Fields to extract:
- age (number or null)
- gender ("male" | "female" | "other" | null)
- state (full Indian state name or null)
- city (city name or null)
- income (human-readable string like "2 lakh" or null)
- incomeValue (numeric value in lakhs or null)
- occupation ("farmer" | "student" | "business" | "salaried" | "self-employed" | "unemployed" | "retired" | "homemaker" | null)
- education ("none" | "primary" | "secondary" | "higher-secondary" | "graduate" | "postgraduate" | null)
- category ("SC" | "ST" | "OBC" | "General" | "EWS" | null)
- disability ("yes" | "no" | null)
- interests (array of categories from: ["agriculture", "education", "health", "housing", "business", "scholarship", "women", "startup"])
- confidence (object with confidence 0-1 for each extracted field, e.g. {"age": 0.95, "gender": 0.8})

User text:
"""${text}"""

Return JSON only:
`;

const CV_EXTRACTION_PROMPT = (text) => `
You are an expert at reading Indian CVs/resumes to extract demographic and professional profile information for government scheme matching.

Extract profile fields from the CV text below. Be especially attentive to:
- Education qualifications and level
- Work experience and occupation type
- Address/location for state inference
- Any mentioned income or stipend
- Skills that hint at occupation

Return ONLY valid JSON with these fields:
- age (number or null — infer from birth year if present)
- gender ("male" | "female" | "other" | null)
- state (full Indian state name or null)
- city (city name or null)
- income (string or null)
- incomeValue (numeric in lakhs or null)
- occupation ("farmer" | "student" | "business" | "salaried" | "self-employed" | "unemployed" | "retired" | "homemaker" | null)
- education ("none" | "primary" | "secondary" | "higher-secondary" | "graduate" | "postgraduate" | null)
- category (null — CVs rarely mention caste)
- disability ("yes" | "no" | null)
- interests (inferred from education/work, array of: ["agriculture","education","health","housing","business","scholarship","women","startup"])
- confidence (object with 0-1 confidence per field)

CV Text:
"""${text}"""

Return JSON only:
`;

// ─── AI API Caller ────────────────────────────────────────────────────────────

/**
 * Calls the configured AI provider with the given prompt.
 * Supports: gemini, openai-compatible (openai, anthropic via openai-compat)
 * Returns: parsed JSON object from AI response.
 */
async function callAI(prompt) {
  const provider = process.env.AI_PROVIDER;
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;
  const baseUrl = process.env.AI_BASE_URL;

  if (provider === 'gemini') {
    // Google Gemini API
    const url = `${baseUrl}/models/${model}:generateContent?key=${apiKey}`;
    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 1024 },
    };
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${errText}`);
    }
    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return parseAIJSON(rawText);
  }

  // OpenAI-compatible (openai, openai-compat anthropic, etc.)
  const url = `${baseUrl}/chat/completions`;
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` };
  // Anthropic via openai-compat may need extra header
  if (provider === 'anthropic') {
    headers['anthropic-version'] = '2023-06-01';
  }
  const body = {
    model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
    max_tokens: 1024,
  };
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`AI API error ${res.status}: ${errText}`);
  }
  const data = await res.json();
  const rawText = data.choices?.[0]?.message?.content || '';
  return parseAIJSON(rawText);
}

/**
 * Strips markdown code fences and parses JSON from AI output.
 */
function parseAIJSON(rawText) {
  const cleaned = rawText
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();
  return JSON.parse(cleaned);
}

// ─── Rule-Based Mock Extraction ───────────────────────────────────────────────

/**
 * Simple rule-based profile extractor for MOCK MODE.
 * Parses text with regex patterns to extract basic fields.
 * Always sets mock: true in the result.
 */
function mockExtractProfile(text) {
  const lower = text.toLowerCase();
  const profile = { mock: true, confidence: {} };

  // Age
  const ageMatch = text.match(/\b(\d{1,2})\s*(?:years?\s*old|yr\.?\s*old|age)\b/i)
    || text.match(/\bage[:\s]+(\d{1,2})\b/i);
  if (ageMatch) {
    profile.age = parseInt(ageMatch[1], 10);
    profile.confidence.age = 0.8;
  }

  // Gender
  if (/\b(female|woman|girl|she\/her)\b/.test(lower)) {
    profile.gender = 'female';
    profile.confidence.gender = 0.9;
  } else if (/\b(male|man|boy|he\/him)\b/.test(lower)) {
    profile.gender = 'male';
    profile.confidence.gender = 0.9;
  }

  // Income
  const incomeMatch = text.match(/(?:income|salary|earn|earning)[:\s]+(?:rs\.?|₹)?\s*([\d,.]+)\s*(lakh|lakhs|l|thousand|k)?/i)
    || text.match(/(?:rs\.?|₹)\s*([\d,.]+)\s*(lakh|lakhs|l|thousand|k)/i);
  if (incomeMatch) {
    let val = parseFloat(incomeMatch[1].replace(/,/g, ''));
    const unit = (incomeMatch[2] || '').toLowerCase();
    if (unit.startsWith('thousand') || unit === 'k') val = val / 100; // convert to lakhs
    profile.incomeValue = val;
    profile.income = `${val} lakh`;
    profile.confidence.income = 0.7;
  }

  // Occupation
  const occupationMap = {
    farmer: ['farmer', 'agriculture', 'kisan', 'cultivator'],
    student: ['student', 'studying', 'college', 'school', 'university'],
    business: ['business', 'entrepreneur', 'owner', 'proprietor', 'shop'],
    salaried: ['salaried', 'employee', 'working', 'job', 'employed', 'office'],
    'self-employed': ['self-employed', 'freelance', 'consultant', 'contractor'],
    retired: ['retired', 'pension'],
    homemaker: ['homemaker', 'housewife', 'househusband'],
  };
  for (const [occ, keywords] of Object.entries(occupationMap)) {
    if (keywords.some((k) => lower.includes(k))) {
      profile.occupation = occ;
      profile.confidence.occupation = 0.75;
      break;
    }
  }

  // Education
  if (/\b(phd|doctorate|postgraduate|pg|m\.?tech|m\.?sc|m\.?b\.?a|masters?)\b/.test(lower)) {
    profile.education = 'postgraduate';
    profile.confidence.education = 0.85;
  } else if (/\b(graduate|b\.?tech|b\.?sc|b\.?a|degree|bachelor)\b/.test(lower)) {
    profile.education = 'graduate';
    profile.confidence.education = 0.85;
  } else if (/\b(12th|higher secondary|hsc|intermediate|senior secondary)\b/.test(lower)) {
    profile.education = 'higher-secondary';
    profile.confidence.education = 0.8;
  } else if (/\b(10th|secondary|ssc|matric|high school)\b/.test(lower)) {
    profile.education = 'secondary';
    profile.confidence.education = 0.8;
  }

  // Category
  if (/\b(sc|scheduled caste)\b/.test(lower)) {
    profile.category = 'SC';
    profile.confidence.category = 0.9;
  } else if (/\b(st|scheduled tribe)\b/.test(lower)) {
    profile.category = 'ST';
    profile.confidence.category = 0.9;
  } else if (/\b(obc|other backward)\b/.test(lower)) {
    profile.category = 'OBC';
    profile.confidence.category = 0.9;
  } else if (/\b(ews|economically weaker)\b/.test(lower)) {
    profile.category = 'EWS';
    profile.confidence.category = 0.9;
  } else if (/\b(general|unreserved)\b/.test(lower)) {
    profile.category = 'General';
    profile.confidence.category = 0.8;
  }

  // Disability
  if (/\b(disabled|disability|differently abled|divyangjan|pwd)\b/.test(lower)) {
    profile.disability = 'yes';
    profile.confidence.disability = 0.85;
  }

  // State — match common Indian state names
  const INDIAN_STATES = [
    'andhra pradesh', 'arunachal pradesh', 'assam', 'bihar', 'chhattisgarh', 'goa', 'gujarat',
    'haryana', 'himachal pradesh', 'jharkhand', 'karnataka', 'kerala', 'madhya pradesh',
    'maharashtra', 'manipur', 'meghalaya', 'mizoram', 'nagaland', 'odisha', 'punjab',
    'rajasthan', 'sikkim', 'tamil nadu', 'telangana', 'tripura', 'uttar pradesh',
    'uttarakhand', 'west bengal', 'delhi',
  ];
  for (const state of INDIAN_STATES) {
    if (lower.includes(state)) {
      profile.state = state
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      profile.confidence.state = 0.85;
      break;
    }
  }

  // Interests (infer from occupation/text)
  const interests = [];
  if (profile.occupation === 'farmer') interests.push('agriculture');
  if (profile.occupation === 'student') interests.push('education', 'scholarship');
  if (['business', 'entrepreneur', 'self-employed'].includes(profile.occupation)) {
    interests.push('business', 'startup');
  }
  if (/health|medical|hospital/.test(lower)) interests.push('health');
  if (/house|housing|home loan/.test(lower)) interests.push('housing');
  if (/women|mahila/.test(lower)) interests.push('women');
  profile.interests = [...new Set(interests)];

  return profile;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Extracts a user profile from free-form text input.
 * Uses AI if configured, otherwise falls back to rule-based mock extraction.
 *
 * @param {string} text - Free-form user input
 * @returns {Promise<Object>} profile object with optional mock: true flag
 */
async function extractProfileFromText(text) {
  if (!isAIConfigured()) {
    return mockExtractProfile(text);
  }
  try {
    const result = await callAI(TEXT_EXTRACTION_PROMPT(text));
    return { ...result, mock: false };
  } catch (err) {
    console.error('[AI] extractProfileFromText failed, falling back to mock:', err.message);
    return { ...mockExtractProfile(text), aiError: err.message };
  }
}

/**
 * Extracts a user profile from CV/resume text.
 * Uses a CV-optimized prompt if AI configured, else mock extraction.
 *
 * @param {string} text - CV text content
 * @returns {Promise<Object>} profile object with optional mock: true flag
 */
async function extractProfileFromCVText(text) {
  if (!isAIConfigured()) {
    return mockExtractProfile(text);
  }
  try {
    const result = await callAI(CV_EXTRACTION_PROMPT(text));
    return { ...result, mock: false };
  } catch (err) {
    console.error('[AI] extractProfileFromCVText failed, falling back to mock:', err.message);
    return { ...mockExtractProfile(text), aiError: err.message };
  }
}

module.exports = { extractProfileFromText, extractProfileFromCVText, isAIConfigured };
