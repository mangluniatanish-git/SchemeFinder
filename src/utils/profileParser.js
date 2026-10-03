// profileParser.js
// Rule-based NLP parser for portfolio text (English + Hindi).
// Extracts structured attributes without AI. Designed to be replaced by LLM API later.

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
  'Andaman and Nicobar', 'Lakshadweep', 'Dadra and Nagar Haveli',
]

// Hindi state names mapped to English
const HINDI_STATE_MAP = {
  'महाराष्ट्र': 'Maharashtra', 'दिल्ली': 'Delhi', 'उत्तर प्रदेश': 'Uttar Pradesh',
  'राजस्थान': 'Rajasthan', 'बिहार': 'Bihar', 'गुजरात': 'Gujarat',
  'मध्य प्रदेश': 'Madhya Pradesh', 'कर्नाटक': 'Karnataka', 'तमिलनाडु': 'Tamil Nadu',
  'केरल': 'Kerala', 'पंजाब': 'Punjab', 'हरियाणा': 'Haryana',
  'पश्चिम बंगाल': 'West Bengal', 'आंध्र प्रदेश': 'Andhra Pradesh',
  'तेलंगाना': 'Telangana', 'ओडिशा': 'Odisha', 'असम': 'Assam',
  'छत्तीसगढ़': 'Chhattisgarh', 'झारखंड': 'Jharkhand', 'उत्तराखंड': 'Uttarakhand',
  'हिमाचल प्रदेश': 'Himachal Pradesh', 'गोवा': 'Goa',
}

const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune',
  'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore',
  'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Agra', 'Vadodara',
]

const OCCUPATION_KEYWORDS = {
  student: ['student', 'studying', 'study', 'college', 'school', 'university', 'b.tech', 'btech', 'bsc', 'ba', 'bcom', 'mba', 'mbbs', 'm.tech', 'mtech', 'engineering', 'medical', 'law', 'graduation', 'undergraduate', 'postgraduate', 'phd', 'छात्र', 'पढ़ाई', 'पढ़ रहा', 'पढ़ रही', 'कॉलेज', 'विश्वविद्यालय', 'इंजीनियरिंग'],
  farmer: ['farmer', 'farming', 'agriculture', 'cultivator', 'kisan', 'land', 'crop', 'किसान', 'खेती', 'कृषि', 'किसान हूं', 'खेत'],
  salaried: ['salaried', 'employed', 'job', 'service', 'government job', 'private job', 'office', 'salary', 'नौकरी', 'सरकारी नौकरी', 'प्राइवेट नौकरी', 'वेतनभोगी'],
  'self-employed': ['self-employed', 'self employed', 'business', 'entrepreneur', 'shop', 'trade', 'own business', 'startup', 'स्वरोजगार', 'व्यापार', 'दुकान', 'उद्यमी'],
  unemployed: ['unemployed', 'no job', 'looking for job', 'job seeker', 'बेरोजगार', 'नौकरी नहीं', 'काम नहीं'],
  homemaker: ['homemaker', 'housewife', 'househusband', 'home maker', 'गृहिणी', 'घरेलू'],
  worker: ['worker', 'labour', 'laborer', 'daily wage', 'migrant worker', 'construction', 'factory', 'मजदूर', 'श्रमिक', 'दिहाड़ी', 'प्रवासी मजदूर'],
}

const CATEGORY_KEYWORDS = {
  'SC': ['sc', 'scheduled caste', 'dalit', 'अनुसूचित जाति', 'एससी'],
  'ST': ['st', 'scheduled tribe', 'tribal', 'adivasi', 'अनुसूचित जनजाति', 'एसटी', 'आदिवासी'],
  'OBC': ['obc', 'other backward class', 'backward class', 'ओबीसी', 'अन्य पिछड़ा वर्ग', 'पिछड़ा वर्ग'],
  'EWS': ['ews', 'economically weaker section', 'आर्थिक रूप से कमजोर', 'ईडब्ल्यूएस'],
  'General': ['general', 'general category', 'open category', 'सामान्य', 'सामान्य वर्ग'],
  'minority': ['minority', 'muslim', 'christian', 'sikh', 'buddhist', 'jain', 'अल्पसंख्यक', 'मुस्लिम', 'सिख'],
}

const GENDER_KEYWORDS = {
  male: ['male', 'man', 'boy', 'he', 'his', 'पुरुष', 'लड़का', 'मैं पुरुष'],
  female: ['female', 'woman', 'girl', 'she', 'her', 'महिला', 'लड़की', 'मैं महिला'],
}

const EDUCATION_KEYWORDS = {
  '10th': ['10th', 'matriculation', 'matric', 'ssc', 'class 10', 'दसवीं', 'मैट्रिक'],
  '12th': ['12th', 'hsc', 'class 12', 'intermediate', 'बारहवीं', 'इंटरमीडिएट'],
  'graduation': ['graduation', 'graduate', 'ug', 'b.tech', 'btech', 'bsc', 'ba', 'bcom', 'bba', 'llb', 'mbbs', 'be', 'b.e', 'b.a', 'b.sc', 'b.com', 'स्नातक', 'ग्रेजुएशन'],
  'post-graduation': ['post graduation', 'postgraduate', 'pg', 'mba', 'm.tech', 'mtech', 'msc', 'ma', 'mcom', 'llm', 'ms', 'स्नातकोत्तर', 'पोस्ट ग्रेजुएशन'],
  'phd': ['phd', 'doctorate', 'doctoral', 'पीएचडी', 'डॉक्टरेट'],
  'diploma': ['diploma', 'polytechnic', 'डिप्लोमा', 'पॉलिटेक्निक'],
}

const INTEREST_KEYWORDS = {
  'Education': ['education', 'scholarship', 'study', 'school', 'college', 'शिक्षा', 'छात्रवृत्ति', 'पढ़ाई'],
  'Health': ['health', 'medical', 'hospital', 'insurance', 'स्वास्थ्य', 'चिकित्सा', 'अस्पताल'],
  'Housing': ['house', 'home', 'housing', 'shelter', 'आवास', 'घर', 'मकान'],
  'Employment': ['job', 'employment', 'work', 'career', 'नौकरी', 'रोजगार', 'काम'],
  'Agriculture': ['farming', 'agriculture', 'crop', 'खेती', 'कृषि'],
  'Skills': ['skill', 'training', 'course', 'certification', 'कौशल', 'प्रशिक्षण'],
  'Business': ['business', 'startup', 'entrepreneur', 'loan', 'व्यापार', 'व्यवसाय', 'ऋण'],
  'Financial Assistance': ['financial', 'money', 'assistance', 'support', 'वित्तीय', 'पैसा', 'सहायता'],
  'Women & Child': ['women', 'girl', 'daughter', 'child', 'महिला', 'बेटी', 'बच्चा'],
}

const DISABILITY_KEYWORDS = ['disabled', 'disability', 'differently abled', 'handicapped', 'wheelchair', 'blind', 'deaf', 'विकलांग', 'दिव्यांग', 'अपंग']

// Helper to safely match keywords with word boundaries for ASCII/Latin terms to avoid false positives
// (e.g. 'st' should not match 'studying' or 'rajasthan', 'he' should not match 'the' or 'where')
function matchesKeyword(text, keyword) {
  if (!text || !keyword) return false
  // For non-ASCII (Hindi / Devnagari), substring match is used
  if (/[^\x00-\x7F]/.test(keyword)) {
    return text.includes(keyword)
  }
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i')
  return regex.test(text)
}

// ─── Main Parser ────────────────────────────────────────────────────────────
export function parseProfile(text) {
  if (!text || text.trim().length < 10) return null

  const lower = text.toLowerCase()
  const result = {
    age: null,
    gender: null,
    state: null,
    city: null,
    income: null,
    occupation: null,
    education: null,
    category: null,
    disability: null,
    interests: [],
  }

  // ── Age ──────────────────────────────────────────────────────────────────
  const agePatterns = [
    /(\d{1,2})\s*[-–]?\s*(year|yr|years|वर्ष|साल)\s*(old)?/i,
    /aged?\s*(\d{1,2})/i,
    /age\s*[:\-]?\s*(\d{1,2})/i,
    /(\d{1,2})\s*(वर्षीय|साल का|साल की)/i,
    /मेरी उम्र\s*(\d{1,2})/i,
    /(\d{1,2})\s*year.old/i,
  ]
  for (const p of agePatterns) {
    const m = text.match(p)
    if (m) {
      const age = parseInt(m[1] || m[2])
      if (age >= 5 && age <= 100) { result.age = age; break }
    }
  }

  // ── State ─────────────────────────────────────────────────────────────────
  // Check Hindi state names first
  for (const [hiName, enName] of Object.entries(HINDI_STATE_MAP)) {
    if (text.includes(hiName)) { result.state = enName; break }
  }
  // Then English state names
  if (!result.state) {
    for (const state of INDIAN_STATES) {
      if (matchesKeyword(lower, state.toLowerCase())) { result.state = state; break }
    }
  }

  // ── City ──────────────────────────────────────────────────────────────────
  const cityList = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune',
    'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
    'Bhopal', 'Visakhapatnam', 'Patna', 'Agra', 'Vadodara', 'Nashik', 'Varanasi']
  for (const city of cityList) {
    if (matchesKeyword(lower, city.toLowerCase())) { result.city = city; break }
  }
  // Hindi city names
  const hindiCities = { 'मुंबई': 'Mumbai', 'पुणे': 'Pune', 'दिल्ली': 'Delhi', 'जयपुर': 'Jaipur', 'लखनऊ': 'Lucknow' }
  if (!result.city) {
    for (const [hi, en] of Object.entries(hindiCities)) {
      if (text.includes(hi)) { result.city = en; break }
    }
  }

  // ── Income ────────────────────────────────────────────────────────────────
  const incomePatterns = [
    /(?:income|earning|salary|आय|कमाई)[^₹\d]*[₹rs\.]*\s*(\d+(?:\.\d+)?)\s*(lakh|lac|लाख)/i,
    /[₹rs\.]*\s*(\d+(?:\.\d+)?)\s*(lakh|lac|लाख)[^a-z]*(per year|annually|annual|प्रति वर्ष|सालाना)?[^a-z]*(income|earning|आय)?/i,
    /(\d+(?:\.\d+)?)\s*(lakh|lac|लाख)\s*(rupee|रुपये|रुपया)?/i,
  ]
  for (const p of incomePatterns) {
    const m = lower.match(p)
    if (m) {
      const val = parseFloat(m[1])
      if (val > 0 && val < 100) {
        result.income = `₹${val} lakh/year`
        result.incomeValue = val
        break
      }
    }
  }
  // Also detect BPL/below poverty line
  if (!result.income && (matchesKeyword(lower, 'bpl') || lower.includes('below poverty') || lower.includes('गरीबी रेखा'))) {
    result.income = 'Below poverty line'
    result.incomeValue = 0.5
  }

  // ── Occupation ───────────────────────────────────────────────────────────
  for (const [occ, keywords] of Object.entries(OCCUPATION_KEYWORDS)) {
    if (keywords.some(k => matchesKeyword(lower, k))) {
      result.occupation = occ
      break
    }
  }

  // ── Education ─────────────────────────────────────────────────────────────
  for (const [level, keywords] of Object.entries(EDUCATION_KEYWORDS)) {
    if (keywords.some(k => matchesKeyword(lower, k))) {
      result.education = level
      // Don't break — take highest level found
      if (level === 'phd') break
    }
  }

  // ── Category ─────────────────────────────────────────────────────────────
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => matchesKeyword(lower, k))) {
      result.category = cat
      break
    }
  }

  // ── Gender ────────────────────────────────────────────────────────────────
  const maleScore = GENDER_KEYWORDS.male.filter(k => matchesKeyword(lower, k)).length
  const femaleScore = GENDER_KEYWORDS.female.filter(k => matchesKeyword(lower, k)).length
  if (femaleScore > maleScore) result.gender = 'Female'
  else if (maleScore > femaleScore) result.gender = 'Male'

  // ── Disability ────────────────────────────────────────────────────────────
  if (DISABILITY_KEYWORDS.some(k => matchesKeyword(lower, k))) {
    result.disability = 'Yes'
  }

  // ── Interests ─────────────────────────────────────────────────────────────
  const interests = []
  for (const [interest, keywords] of Object.entries(INTEREST_KEYWORDS)) {
    if (keywords.some(k => matchesKeyword(lower, k))) {
      interests.push(interest)
    }
  }
  result.interests = [...new Set(interests)]

  return result
}

// Format profile attribute for display
export function formatProfileValue(key, value) {
  if (!value || value === 'null') return null
  if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : null
  return String(value)
}

// Get display label for profile key
export function getProfileFieldLabel(key, t) {
  const map = {
    age: t.age, gender: t.gender, state: t.state, city: t.city,
    income: t.income, occupation: t.occupation, education: t.education,
    category: t.category, disability: t.disability, interests: t.interests,
  }
  return map[key] || key
}
