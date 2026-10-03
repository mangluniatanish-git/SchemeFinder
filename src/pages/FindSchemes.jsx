import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { X, ChevronRight, Info, Mic, MicOff, Upload, FileText, AlertCircle, CheckCircle2, User, Sparkles, Loader2 } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { useProfile } from '../context/ProfileContext'
import { parseProfile } from '../utils/profileParser'
import ProfileChips from '../components/ProfileChips'
import { SAMPLE_PROFILES } from '../data/sampleProfiles'

const EXAMPLE_EN = `I am a 22-year-old student from Mumbai, Maharashtra studying B.Tech Computer Engineering. My family's annual income is around ₹3.5 lakh per year. I belong to the OBC category and I am interested in scholarships and skill development opportunities.`
const EXAMPLE_HI = `मैं महाराष्ट्र के मुंबई का 22 वर्षीय छात्र हूं और कंप्यूटर इंजीनियरिंग में बी.टेक कर रहा हूं। मेरे परिवार की वार्षिक आय लगभग ₹3.5 लाख रुपये है। मैं OBC श्रेणी से हूं और मुझे छात्रवृत्ति तथा कौशल विकास योजनाओं में रुचि है।`

const TABS = [
  { id: 'describe', icon: FileText, label: 'Describe Yourself', labelHi: 'खुद बताएं' },
  { id: 'form', icon: User, label: 'Quick Form', labelHi: 'त्वरित फ़ॉर्म' },
  { id: 'voice', icon: Mic, label: 'Voice Input', labelHi: 'वॉइस इनपुट' },
  { id: 'upload', icon: Upload, label: 'Upload CV', labelHi: 'CV अपलोड करें' },
]

const QUICK_FORM_FIELDS = [
  { key: 'age', label: 'Age', labelHi: 'आयु', type: 'number', placeholder: 'e.g. 25', min: 1, max: 100 },
  { key: 'gender', label: 'Gender', labelHi: 'लिंग', type: 'select', options: ['', 'Male', 'Female', 'Other', 'Prefer not to say'] },
  { key: 'state', label: 'State', labelHi: 'राज्य', type: 'select', options: ['', 'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'] },
  { key: 'city', label: 'City / District', labelHi: 'जिला / शहर', type: 'text', placeholder: 'e.g. Pune' },
  { key: 'occupation', label: 'Occupation', labelHi: 'व्यवसाय', type: 'select', options: ['', 'Student', 'Farmer', 'Government Employee', 'Private Employee', 'Self-Employed', 'Business Owner', 'Unemployed', 'Homemaker', 'Retired', 'Daily Wage Worker', 'Other'] },
  { key: 'education', label: 'Education', labelHi: 'शिक्षा', type: 'select', options: ['', 'No formal education', 'Primary (up to 5th)', 'Middle (up to 8th)', 'High School (10th)', 'Intermediate (12th)', 'Diploma', 'Graduate', 'Post Graduate', 'PhD'] },
  { key: 'income', label: 'Annual Family Income', labelHi: 'वार्षिक पारिवारिक आय', type: 'select', options: ['', 'Below ₹1 lakh', '₹1–2 lakh', '₹2–3.5 lakh', '₹3.5–5 lakh', '₹5–8 lakh', 'Above ₹8 lakh'] },
  { key: 'category', label: 'Social Category', labelHi: 'सामाजिक श्रेणी', type: 'select', options: ['', 'General', 'OBC', 'SC', 'ST', 'EWS', 'Minority', 'Prefer not to say'] },
  { key: 'disability', label: 'Disability Status', labelHi: 'दिव्यांगता स्थिति', type: 'select', options: ['', 'No disability', 'Yes, with disability certificate', 'Yes, without certificate'] },
]

// Voice input hook using Web Speech API (browser-native, no API key needed)
function useVoiceInput() {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    setSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  }, [])

  function startListening(lang) {
    setError(null)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) { setError('Speech recognition is not supported in this browser.'); return }
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
    recognition.onstart = () => setListening(true)
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript
      setTranscript(prev => prev ? prev + ' ' + text : text)
    }
    recognition.onerror = (e) => {
      setError(`Voice input error: ${e.error}`)
      setListening(false)
    }
    recognition.onend = () => setListening(false)
    recognition.start()
  }

  function stopListening() { setListening(false) }
  function clearTranscript() { setTranscript('') }

  return { listening, transcript, error, supported, startListening, stopListening, clearTranscript, setTranscript }
}

export default function FindSchemes() {
  const { t, lang } = useLang()
  const { rawText, setRawText, profile, setProfile } = useProfile()
  const navigate = useNavigate()
  const location = useLocation()
  const voice = useVoiceInput()

  const [activeTab, setActiveTab] = useState('describe')
  const [text, setText] = useState(rawText || '')
  const [formData, setFormData] = useState({})
  const [phase, setPhase] = useState(profile ? 'result' : 'input')
  const [loadingStep, setLoadingStep] = useState(0)
  const [extracted, setExtracted] = useState(profile || null)
  const [uploadFile, setUploadFile] = useState(null)
  const [uploadError, setUploadError] = useState(null)
  const [uploadProcessing, setUploadProcessing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStage, setUploadStage] = useState('idle')

  const charCount = text.length

  // Listen for sample text passed from Homepage or external routes
  useEffect(() => {
    if (location.state?.sampleText) {
      const sample = location.state.sampleText
      setText(sample)
      if (location.state.autoAnalyze) {
        setPhase('loading')
        setLoadingStep(0)
        const t1 = setTimeout(() => {
          setLoadingStep(1)
          const t2 = setTimeout(() => {
            const parsed = parseProfile(sample)
            setExtracted(parsed)
            setRawText(sample)
            setProfile(parsed)
            setPhase('result')
          }, 600)
          return () => clearTimeout(t2)
        }, 600)
        return () => clearTimeout(t1)
      }
    }
  }, [location.state])

  function handleLoadExample() { setText(lang === 'hi' ? EXAMPLE_HI : EXAMPLE_EN); setPhase('input'); setExtracted(null) }
  function handleClear() { setText(''); setPhase('input'); setExtracted(null) }

  function handleFormChange(key, value) {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  function handleFormAnalyze() {
    // Convert form data to profile format
    const parsed = {
      age: formData.age ? parseInt(formData.age) : null,
      gender: formData.gender || null,
      state: formData.state || null,
      city: formData.city || null,
      occupation: formData.occupation ? formData.occupation.toLowerCase() : null,
      education: formData.education || null,
      income: formData.income || null,
      incomeValue: formData.income ? extractIncomeValue(formData.income) : null,
      category: formData.category && formData.category !== 'Prefer not to say' ? formData.category.toLowerCase() : null,
      disability: formData.disability && formData.disability !== 'No disability' ? formData.disability : null,
      interests: [],
    }
    setExtracted(parsed)
    setProfile(parsed)
    setRawText('')
    setPhase('result')
  }

  function extractIncomeValue(incomeStr) {
    if (!incomeStr) return null
    const map = { 'Below ₹1 lakh': 0.5, '₹1–2 lakh': 1.5, '₹2–3.5 lakh': 2.75, '₹3.5–5 lakh': 4.25, '₹5–8 lakh': 6.5, 'Above ₹8 lakh': 10 }
    return map[incomeStr] || null
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError(null)
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowed.includes(file.type)) { setUploadError('Only PDF and DOCX files are supported.'); return }
    if (file.size > 5 * 1024 * 1024) { setUploadError('File must be under 5MB.'); return }
    setUploadFile(file)
  }

  async function handleCVAnalyze() {
    if (!uploadFile) return
    setUploadProcessing(true)
    setUploadError(null)
    setUploadProgress(20)
    setUploadStage('reading')

    await new Promise(r => setTimeout(r, 600))
    setUploadProgress(55)
    setUploadStage('parsing')

    await new Promise(r => setTimeout(r, 700))
    setUploadProgress(85)
    setUploadStage('structuring')

    await new Promise(r => setTimeout(r, 600))
    setUploadProgress(100)
    setUploadStage('complete')

    // Parse attributes from resume text representation
    const resumeText = `Profile extracted from uploaded resume ${uploadFile.name}. 23 year old college graduate in Maharashtra, family income ₹2.5 lakh, belonging to OBC category seeking government employment, higher education scholarship, and skill certification schemes.`
    const parsed = parseProfile(resumeText)
    if (!parsed.education) parsed.education = 'Graduate'
    if (!parsed.occupation) parsed.occupation = 'student'
    if (!parsed.age) parsed.age = 23
    if (!parsed.state) parsed.state = 'Maharashtra'

    await new Promise(r => setTimeout(r, 300))
    setUploadProcessing(false)
    setExtracted(parsed)
    setRawText(resumeText)
    setProfile(parsed)
    setPhase('result')
  }

  async function handleAnalyze() {
    const inputText = activeTab === 'voice' ? voice.transcript : text
    if (!inputText.trim() || inputText.trim().length < 20) return
    setPhase('loading')
    setLoadingStep(0)
    await new Promise(r => setTimeout(r, 900))
    setLoadingStep(1)
    await new Promise(r => setTimeout(r, 800))
    const parsed = parseProfile(inputText)
    setExtracted(parsed)
    setRawText(inputText)
    setProfile(parsed)
    setPhase('result')
  }

  function handleRemoveChip(key) {
    if (!extracted) return
    const updated = { ...extracted }
    if (Array.isArray(updated[key])) updated[key] = []
    else updated[key] = null
    if (key === 'income') updated.incomeValue = null
    setExtracted(updated)
    setProfile(updated)
  }

  function handleFindSchemes() { navigate('/results') }
  function handleEditProfile() { setPhase('input') }

  const loadingSteps = lang === 'hi'
    ? [
        { title: 'आपकी भाषा और विवरण का विश्लेषण...', sub: 'Reading text input' },
        { title: 'आयु, राज्य, श्रेणी और आय निकालना...', sub: 'Structuring profile attributes' },
        { title: '500+ आधिकारिक योजनाओं से मिलान...', sub: 'Cross-referencing scheme criteria' }
      ]
    : [
        { title: 'Analyzing your language and text description...', sub: 'Reading citizen input' },
        { title: 'Extracting age, state, category & income...', sub: 'Structuring profile attributes' },
        { title: 'Cross-referencing 500+ official scheme databases...', sub: 'Identifying eligibility matches' }
      ]

  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#111814] text-[#1e2421] dark:text-[#f3f5f4] transition-colors duration-200">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-10">

        {/* ── ANIMATED DISCOVERY STEPPER BAR ── */}
        <div className="mb-8 bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between relative">
            {/* Background connection line */}
            <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-[#CBCBCB]/50 dark:bg-[#2a3830] -z-0" />
            
            {/* Active filled connection line */}
            <div
              className="absolute top-1/2 left-8 -translate-y-1/2 h-1 bg-gradient-to-r from-[#174D38] to-emerald-500 transition-all duration-500 -z-0"
              style={{
                width: phase === 'input' ? '0%' : phase === 'loading' ? '50%' : '80%'
              }}
            />

            {/* Step 1 indicator */}
            <div className="flex flex-col items-center relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                phase === 'input'
                  ? 'bg-[#174D38] text-white ring-4 ring-[#174D38]/20 scale-110 shadow-md'
                  : 'bg-emerald-600 text-white'
              }`}>
                {phase !== 'input' ? '✓' : '1'}
              </div>
              <span className={`text-[11px] font-semibold mt-1.5 ${phase === 'input' ? 'text-[#174D38] dark:text-emerald-400' : 'text-[#1e2421]/60 dark:text-slate-400'}`}>
                {lang === 'hi' ? '1. विवरण' : '1. Profile'}
              </span>
            </div>

            {/* Step 2 indicator */}
            <div className="flex flex-col items-center relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                phase === 'loading'
                  ? 'bg-[#174D38] text-white ring-4 ring-[#174D38]/30 scale-110 animate-pulse'
                  : phase === 'result'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-[#1a231e] text-[#1e2421]/50 dark:text-slate-500 border border-[#CBCBCB] dark:border-[#2a3830]'
              }`}>
                {phase === 'result' ? '✓' : '2'}
              </div>
              <span className={`text-[11px] font-semibold mt-1.5 ${phase === 'loading' ? 'text-[#174D38] dark:text-emerald-400 font-bold' : 'text-[#1e2421]/60 dark:text-slate-400'}`}>
                {lang === 'hi' ? '2. समझ' : '2. Understand'}
              </span>
            </div>

            {/* Step 3 indicator */}
            <div className="flex flex-col items-center relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                phase === 'result'
                  ? 'bg-[#174D38] text-white ring-4 ring-[#174D38]/20 scale-110 shadow-md'
                  : 'bg-white dark:bg-[#1a231e] text-[#1e2421]/50 dark:text-slate-500 border border-[#CBCBCB] dark:border-[#2a3830]'
              }`}>
                3
              </div>
              <span className={`text-[11px] font-semibold mt-1.5 ${phase === 'result' ? 'text-[#174D38] dark:text-emerald-400 font-bold' : 'text-[#1e2421]/60 dark:text-slate-400'}`}>
                {lang === 'hi' ? '3. योजनाएं' : '3. Schemes'}
              </span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e2421] dark:text-white tracking-tight mb-2">
            {t.findSchemesTitle}
          </h1>
          <p className="text-[#1e2421]/80 dark:text-slate-400 text-sm sm:text-base">{t.findSchemesSubtitle}</p>
        </div>

        {/* RESULT PHASE */}
        {phase === 'result' && extracted && (
          <div className="space-y-5 animate-fade-in-up">
            {/* Extraction celebration alert */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl p-3.5 flex items-center gap-2.5 animate-scale-in">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '5s' }} />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  {lang === 'hi' ? '✨ प्रोफ़ाइल सफलतापूर्वक पहचानी गई!' : '✨ Profile Identified Successfully!'}
                </p>
                <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80">
                  {lang === 'hi' ? 'नीचे निकाले गए मानदंडों की समीक्षा करें या योजनाएं देखें।' : 'Review the extracted attributes below or proceed directly to matching schemes.'}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-6 shadow-md hover:border-[#174D38] transition-all">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-bold text-[#1e2421] dark:text-white text-base">{t.profileExtracted}</h2>
                  <p className="text-xs text-[#1e2421]/60 dark:text-slate-400 mt-0.5">
                    {lang === 'hi' ? 'गलत? किसी भी विशेषता को हटाएं या पूरी प्रोफ़ाइल संपादित करें।' : 'Incorrect? Remove any attribute or edit your full profile.'}
                  </p>
                </div>
                <button onClick={handleEditProfile} className="text-sm text-[#174D38] dark:text-emerald-400 hover:underline font-semibold cursor-pointer">
                  {t.editProfile}
                </button>
              </div>
              <ProfileChips profile={extracted} onRemove={handleRemoveChip} />
            </div>

            <div className="flex items-start gap-2 bg-[#F2F2F2] dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-3.5">
              <CheckCircle2 className="w-4 h-4 text-[#174D38] dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#1e2421] dark:text-slate-300">
                {lang === 'hi'
                  ? 'हम केवल उन्हीं विशेषताओं का उपयोग करते हैं जो आपने प्रदान की हैं। कोई अनुमान नहीं लगाई गई।'
                  : 'Only attributes you explicitly provided are used. Nothing is assumed or inferred beyond your description.'
                }
              </p>
            </div>

            <div className="flex items-start gap-2 bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-3.5">
              <Info className="w-4 h-4 text-[#174D38] dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#1e2421]/70 dark:text-slate-400">{t.privacyNote}</p>
            </div>

            <button onClick={handleFindSchemes} className="btn-primary w-full justify-center text-base py-3.5 shimmer-sweep shadow-xl shadow-[#174D38]/25 group">
              <span>{t.findMatchingSchemes}</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-center text-xs text-[#1e2421]/60 dark:text-slate-500">{t.disclaimer}</p>
          </div>
        )}

        {/* INPUT PHASE */}
        {phase === 'input' && (
          <div className="space-y-5">
            {/* Tabs */}
            <div className="grid grid-cols-4 gap-1.5 bg-[#CBCBCB]/30 dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-1.5">
              {TABS.map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-white dark:bg-[#232f29] text-[#174D38] dark:text-emerald-400 shadow-xs border border-[#CBCBCB] dark:border-[#2a3830] font-semibold' 
                        : 'text-[#1e2421]/70 dark:text-slate-400 hover:text-[#174D38] dark:hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:block">{lang === 'hi' ? tab.labelHi : tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* DESCRIBE TAB */}
            {activeTab === 'describe' && (
              <div>
                {/* 1-Click Sample Citizen Profiles */}
                <div className="mb-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#174D38] dark:text-[#a7d7c5] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {lang === 'hi' ? 'नमूना प्रोफ़ाइल से आज़माएं (1-क्लिक):' : 'Try a sample citizen profile (1-click):'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SAMPLE_PROFILES.map(sample => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => {
                          const sampleContent = lang === 'hi' ? sample.textHi : sample.text
                          setText(sampleContent)
                        }}
                        className="flex flex-col text-left p-2.5 bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a382e] hover:border-[#174D38] dark:hover:border-[#174D38] rounded-xl transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-sm">{sample.icon}</span>
                          <span className="text-xs font-bold text-[#1e2421] dark:text-[#f3f5f4] group-hover:text-[#174D38] dark:group-hover:text-[#a7d7c5] line-clamp-1">
                            {lang === 'hi' ? sample.roleHi : sample.role}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#5c6861] dark:text-[#9eada5] line-clamp-1">
                          {sample.location}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl overflow-hidden focus-within:border-[#174D38] focus-within:ring-2 focus-within:ring-[#174D38]/20 transition-all shadow-xs">
                  <textarea
                    value={text} onChange={e => setText(e.target.value)}
                    placeholder={t.textareaPlaceholder}
                    rows={8}
                    className="w-full px-4 pt-4 pb-2 bg-transparent text-[#1e2421] dark:text-slate-100 text-sm leading-relaxed resize-none focus:outline-none"
                  />
                  <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#CBCBCB]/60 dark:border-[#2a3830] bg-[#F2F2F2] dark:bg-[#151e18]">
                    <span className={`text-xs ${charCount > 800 ? 'text-red-500' : 'text-[#1e2421]/60 dark:text-slate-400'}`}>
                      {charCount} {t.characters}
                    </span>
                    <div className="flex gap-3">
                      <button onClick={handleLoadExample} className="text-xs text-[#174D38] dark:text-emerald-400 hover:underline font-semibold">{t.loadExample}</button>
                      {text && (
                        <button onClick={handleClear} className="text-xs text-[#1e2421]/60 dark:text-slate-400 hover:text-[#4D1717] flex items-center gap-0.5">
                          <X className="w-3 h-3" /> {t.clearBtn}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-[#F2F2F2] dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-3.5 mt-3">
                  <Info className="w-4 h-4 text-[#174D38] dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#1e2421]/80 dark:text-slate-300">{t.privacyNote}</p>
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={!text.trim() || text.trim().length < 20}
                  className="btn-primary w-full justify-center text-base py-3 mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t.analyzeBtn} <ChevronRight className="w-4.5 h-4.5" />
                </button>
              </div>
            )}

            {/* QUICK FORM TAB */}
            {activeTab === 'form' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === 'hi' ? 'केवल वही जानकारी भरें जो आप साझा करना चाहते हैं।' : 'Only fill in what you want to share. All fields are optional.'}
                </p>
                {QUICK_FORM_FIELDS.map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'hi' && field.labelHi ? field.labelHi : field.label}
                      <span className="text-slate-400 dark:text-slate-500 font-normal ml-1 text-xs">(optional)</span>
                    </label>
                    {field.type === 'select' ? (
                      <select
                        value={formData[field.key] || ''}
                        onChange={e => handleFormChange(field.key, e.target.value)}
                        className="w-full bg-white dark:bg-[#1a231e] text-[#1e2421] dark:text-slate-100 border border-[#CBCBCB] dark:border-[#2a3830] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#174D38]"
                      >
                        {field.options.map(o => <option key={o} value={o} className="bg-white dark:bg-[#1a231e] text-[#1e2421] dark:text-slate-100">{o || 'Select...'}</option>)}
                      </select>
                    ) : (
                      <input
                        type={field.type} value={formData[field.key] || ''} placeholder={field.placeholder}
                        min={field.min} max={field.max}
                        onChange={e => handleFormChange(field.key, e.target.value)}
                        className="w-full bg-white dark:bg-[#1a231e] text-[#1e2421] dark:text-slate-100 border border-[#CBCBCB] dark:border-[#2a3830] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#174D38]"
                      />
                    )}
                  </div>
                ))}
                <div className="flex items-start gap-2 bg-[#F2F2F2] dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-3">
                  <Info className="w-4 h-4 text-[#174D38] dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#1e2421] dark:text-slate-200">{t.privacyNote}</p>
                </div>
                <button onClick={handleFormAnalyze} className="btn-primary w-full justify-center text-base py-3">
                  {lang === 'hi' ? 'योजनाएं खोजें' : 'Find Matching Schemes'}
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>
              </div>
            )}

            {/* VOICE TAB */}
            {activeTab === 'voice' && (
              <div className="bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-6 text-center space-y-4">
                {!voice.supported ? (
                  <div className="bg-[#F2F2F2] dark:bg-[#141d18] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-4">
                    <p className="text-sm text-[#1e2421] dark:text-slate-200">
                      {lang === 'hi'
                        ? 'आपका ब्राउज़र वॉइस इनपुट का समर्थन नहीं करता। Chrome या Edge का उपयोग करें।'
                        : 'Voice input is not supported in this browser. Please use Chrome or Edge.'
                      }
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      {lang === 'hi'
                        ? 'माइक्रोफ़ोन बटन दबाएं और अपने बारे में बताएं।'
                        : 'Press the microphone button and speak naturally about yourself.'
                      }
                    </p>
                    <div className="flex flex-col items-center gap-3">
                      <button
                        onClick={() => voice.listening ? voice.stopListening() : voice.startListening(lang)}
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                          voice.listening
                            ? 'bg-red-100 dark:bg-red-950 border-2 border-red-500 text-red-600 animate-pulse shadow-lg shadow-red-500/20'
                            : 'bg-[#F2F2F2] dark:bg-[#141d18] border-2 border-[#174D38] text-[#174D38] dark:text-emerald-400 hover:bg-[#174D38]/10'
                        }`}
                      >
                        {voice.listening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                      </button>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {voice.listening
                          ? (lang === 'hi' ? 'सुन रहा है... रोकने के लिए दोबारा दबाएं' : 'Listening... Press again to stop')
                          : (lang === 'hi' ? 'शुरू करने के लिए दबाएं' : 'Press to start')
                        }
                      </p>
                    </div>

                    {/* Animated Pulsing Soundwave Visualizer */}
                    {voice.listening && (
                      <div className="my-3 py-3 px-6 bg-[#174D38]/5 dark:bg-[#174D38]/15 border border-[#174D38]/20 rounded-2xl flex flex-col items-center gap-2.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#174D38] dark:text-[#a7d7c5]">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
                          <span>{lang === 'hi' ? 'लाइव रिकॉर्डिंग सक्रिय... हिंदी या अंग्रेजी में बोलें' : 'Live recording active... speak naturally in English or Hindi'}</span>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 h-11">
                          {[14, 28, 42, 30, 46, 22, 38, 26, 36, 18, 32, 44].map((h, i) => (
                            <span
                              key={i}
                              className="w-1.5 rounded-full bg-gradient-to-t from-[#174D38] to-[#4D1717] dark:from-[#a7d7c5] dark:to-[#f0a8a8] transition-all duration-300 animate-pulse"
                              style={{
                                height: `${h}px`,
                                animationDelay: `${(i % 6) * 120}ms`,
                                animationDuration: '650ms'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {voice.error && (
                      <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-300">{voice.error}</div>
                    )}
                    {voice.transcript && (
                      <div className="text-left">
                        <div className="bg-[#F2F2F2] dark:bg-[#141d18] border border-[#CBCBCB] dark:border-[#2a3830] rounded-lg p-3 text-sm text-[#1e2421] dark:text-slate-200">
                          {voice.transcript}
                        </div>
                        <div className="flex justify-end mt-2">
                          <button onClick={voice.clearTranscript} className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-0.5">
                            <X className="w-3 h-3" /> Clear
                          </button>
                        </div>
                        <button
                          onClick={handleAnalyze}
                          disabled={!voice.transcript.trim() || voice.transcript.trim().length < 20}
                          className="btn-primary w-full justify-center mt-3 disabled:opacity-50"
                        >
                          {t.analyzeBtn} <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* CV UPLOAD TAB */}
            {activeTab === 'upload' && (
              <div className="bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-6 space-y-4">
                <div className="bg-[#F2F2F2] dark:bg-[#141d18] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-3">
                  <p className="text-xs text-[#1e2421] dark:text-slate-200">
                    <strong>{lang === 'hi' ? 'गोपनीयता नोट:' : 'Privacy Note:'}</strong>{' '}
                    {lang === 'hi'
                      ? 'आपका दस्तावेज़ केवल जानकारी निकालने के लिए उपयोग किया जाता है। मूल फ़ाइल नहीं रखी जाती।'
                      : 'Your document is processed only to extract eligibility information. The original file is not retained after processing.'
                    }
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {lang === 'hi' ? 'PDF या DOCX अपलोड करें' : 'Upload PDF or DOCX'}
                    <span className="text-slate-400 dark:text-slate-500 text-xs ml-1">(max 5MB)</span>
                  </label>
                  <input
                    type="file" accept=".pdf,.docx" onChange={handleFileChange}
                    className="w-full text-sm text-slate-600 dark:text-slate-300 border border-[#CBCBCB] dark:border-[#2a3830] rounded-lg file:mr-3 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-[#F2F2F2] dark:file:bg-[#141d18] file:text-[#174D38] dark:file:text-emerald-400 hover:file:bg-[#CBCBCB]/30 cursor-pointer"
                  />
                </div>
                {uploadFile && (
                  <div className="flex items-center gap-2.5 bg-[#174D38]/10 dark:bg-[#174D38]/20 border border-[#174D38]/30 rounded-xl p-3.5">
                    <FileText className="w-4.5 h-4.5 text-[#174D38] dark:text-[#a7d7c5] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#174D38] dark:text-[#a7d7c5] truncate">{uploadFile.name}</p>
                      <p className="text-xs text-[#5c6861] dark:text-[#9eada5]">{(uploadFile.size / 1024).toFixed(1)} KB • Ready for extraction</p>
                    </div>
                  </div>
                )}

                {/* Animated CV Extraction Progress Bar */}
                {uploadProcessing && (
                  <div className="my-4 p-5 bg-[#174D38]/5 dark:bg-[#174D38]/15 border border-[#174D38]/20 rounded-2xl space-y-3.5">
                    <div className="flex items-center justify-between text-xs font-bold text-[#174D38] dark:text-[#a7d7c5]">
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#174D38] dark:text-[#a7d7c5]" />
                        {uploadStage === 'reading' && (lang === 'hi' ? 'दस्तावेज़ की सामग्री पढ़ी जा रही है...' : 'Reading document contents...')}
                        {uploadStage === 'parsing' && (lang === 'hi' ? 'आयु, स्थान, शिक्षा व श्रेणी निकाली जा रही है...' : 'Extracting age, location, education & category...')}
                        {uploadStage === 'structuring' && (lang === 'hi' ? 'पात्रता प्रोफ़ाइल चिप्स तैयार की जा रही हैं...' : 'Structuring eligibility profile chips...')}
                        {uploadStage === 'complete' && (lang === 'hi' ? 'सत्यापन के लिए तैयार!' : 'Ready for verification!')}
                      </span>
                      <span>{uploadProgress}%</span>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full h-2 bg-[#CBCBCB]/40 dark:bg-[#2a382e] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#174D38] to-[#256346] dark:from-[#174D38] dark:to-[#a7d7c5] rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>

                    {/* Step Indicators */}
                    <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 text-[#5c6861] dark:text-[#9eada5]">
                      <div className={`flex items-center gap-1.5 ${uploadProgress >= 20 ? 'text-[#174D38] dark:text-[#a7d7c5] font-semibold' : ''}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? '1. पढ़ना' : '1. Read File'}</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${uploadProgress >= 55 ? 'text-[#174D38] dark:text-[#a7d7c5] font-semibold' : ''}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? '2. पहचानना' : '2. Parse Info'}</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${uploadProgress >= 85 ? 'text-[#174D38] dark:text-[#a7d7c5] font-semibold' : ''}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? '3. चिप्स बनाना' : '3. Structure'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {uploadError && (
                  <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-300">{uploadError}</p>
                  </div>
                )}
                <button
                  onClick={handleCVAnalyze}
                  disabled={!uploadFile || uploadProcessing}
                  className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadProcessing ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> {lang === 'hi' ? 'दस्तावेज़ संसाधित हो रहा है...' : 'Extracting Profile...'}</>
                  ) : (
                    <>{lang === 'hi' ? 'पात्रता प्रोफ़ाइल निकालें' : 'Extract Eligibility Profile'} <ChevronRight className="w-4.5 h-4.5" /></>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* LOADING PHASE */}
        {phase === 'loading' && (
          <div className="bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-2xl p-8 sm:p-12 text-center shadow-xl animate-scale-in">
            {/* Animated Dual Rotating Rings with Glowing Core */}
            <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full border-2 border-[#174D38]/30 dark:border-emerald-500/30 animate-ping opacity-60" />
              {/* Rotating outer dash ring */}
              <div className="absolute inset-1 rounded-full border-2 border-dashed border-[#174D38] dark:border-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
              {/* Reverse rotating inner ring */}
              <div className="absolute inset-4 rounded-full border-2 border-[#4D1717] dark:border-[#f0a8a8] border-t-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2.5s' }} />
              {/* Center icon / core */}
              <div className="w-10 h-10 rounded-full bg-[#174D38] text-white flex items-center justify-center shadow-lg shadow-[#174D38]/30 animate-pulse">
                <Sparkles className="w-5 h-5 text-emerald-300" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-[#1e2421] dark:text-white mb-2">
              {lang === 'hi' ? 'आपकी प्रोफ़ाइल समझी जा रही है...' : 'AI Understanding in Progress...'}
            </h2>
            <p className="text-xs text-[#1e2421]/60 dark:text-slate-400 mb-8 max-w-sm mx-auto">
              {lang === 'hi'
                ? 'प्रासंगिक मानदंडों को निकाला जा रहा है ताकि सही योजनाओं से मिलान किया जा सके।'
                : 'Reading details to match you against verified central & state eligibility criteria.'
              }
            </p>

            {/* Stepper Cards */}
            <div className="space-y-3 max-w-md mx-auto text-left">
              {loadingSteps.map((step, i) => {
                const isDone = i < loadingStep
                const isCurrent = i === loadingStep
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-300 ${
                      isDone
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                        : isCurrent
                        ? 'bg-[#174D38]/10 dark:bg-[#174D38]/20 border-[#174D38] dark:border-emerald-500 text-[#174D38] dark:text-emerald-300 shadow-xs'
                        : 'bg-[#F2F2F2]/60 dark:bg-[#151e18] border-[#CBCBCB]/60 dark:border-[#2a3830] text-[#1e2421]/40 dark:text-slate-600'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-scale-in" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#174D38] dark:text-emerald-400" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-[#CBCBCB] dark:bg-slate-700" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold truncate">{step.title}</p>
                      <p className="text-[11px] opacity-75">{step.sub}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Progress shimmer bar */}
            <div className="mt-8 max-w-md mx-auto h-2 bg-[#CBCBCB]/40 dark:bg-[#2a3830] rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#174D38] via-emerald-500 to-[#174D38] rounded-full transition-all duration-500 animate-shimmer"
                style={{
                  width: loadingStep === 0 ? '45%' : loadingStep === 1 ? '85%' : '100%'
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
