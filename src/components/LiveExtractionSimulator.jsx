import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Play, RotateCcw, Sparkles, CheckCircle2, ArrowRight, Bot, User, Brain, Shield } from 'lucide-react'
import { useLang } from '../context/LanguageContext'

const SIMULATION_SCENARIOS = [
  {
    id: 'farmer',
    icon: '🌾',
    name: 'Ramesh Kumar',
    nameHi: 'रमेश कुमार',
    role: 'Farmer (2.5 Acres)',
    roleHi: 'किसान (2.5 एकड़ भूमि)',
    location: 'Alwar, Rajasthan',
    locationHi: 'अलवर, राजस्थान',
    textEn: "I am a 42-year-old farmer living in Alwar, Rajasthan with 2.5 acres of agricultural land. My annual family income is ₹1.4 lakh. Belong to OBC category. Looking for fertilizer subsidies, crop insurance, and solar water pumps.",
    textHi: "मैं राजस्थान के अलवर का 42 वर्षीय किसान हूं और मेरे पास 2.5 एकड़ कृषि भूमि है। मेरे परिवार की वार्षिक आय ₹1.4 लाख है। मैं OBC वर्ग से हूं। मुझे खाद सब्सिडी, फसल बीमा और सोलर वाटर पंप योजनाएं चाहिए।",
    highlights: [
      { text: '42-year-old', textHi: '42 वर्षीय', key: 'Age', val: '42 years', color: 'bg-emerald-500/20 text-[#174D38] dark:text-emerald-300' },
      { text: 'Alwar, Rajasthan', textHi: 'अलवर, राजस्थान', key: 'State', val: 'Rajasthan', color: 'bg-[#4D1717]/20 text-[#4D1717] dark:text-[#f0a8a8]' },
      { text: 'farmer', textHi: 'किसान', key: 'Occupation', val: 'Farmer', color: 'bg-emerald-500/20 text-[#174D38] dark:text-emerald-300' },
      { text: '₹1.4 lakh', textHi: '₹1.4 लाख', key: 'Income', val: '₹1.4 Lakh/yr', color: 'bg-emerald-500/20 text-[#174D38] dark:text-emerald-300' },
      { text: 'OBC category', textHi: 'OBC वर्ग', key: 'Category', val: 'OBC', color: 'bg-[#4D1717]/20 text-[#4D1717] dark:text-[#f0a8a8]' },
    ],
    matchedSchemes: [
      { name: 'PM-KISAN Samman Nidhi', nameHi: 'पीएम-किसान सम्मान निधि', benefit: '₹6,000 / year', tag: 'Central' },
      { name: 'PM Fasal Bima Yojana', nameHi: 'पीएम फसल बीमा योजना', benefit: 'Full crop loss protection', tag: 'Central' },
      { name: 'PM-KUSUM Solar Pump', nameHi: 'पीएम-कुसुम सोलर पंप', benefit: 'Up to 60% solar subsidy', tag: 'Central' },
    ]
  },
  {
    id: 'student',
    icon: '🎓',
    name: 'Pooja Sharma',
    nameHi: 'पूजा शर्मा',
    role: 'College Student (B.Sc)',
    roleHi: 'कॉलेज छात्रा (बी.एससी)',
    location: 'Lucknow, Uttar Pradesh',
    locationHi: 'लखनऊ, उत्तर प्रदेश',
    textEn: "I am a 20-year-old female undergraduate college student in Lucknow, Uttar Pradesh. Family income is ₹1.2 lakh per year from daily wage labour. Belong to OBC category. Seeking post-matric education scholarship and hostel allowance.",
    textHi: "मैं लखनऊ, उत्तर प्रदेश की 20 वर्षीय महिला कॉलेज छात्रा हूं। परिवार की वार्षिक आय ₹1.2 लाख है। मैं OBC वर्ग से हूं। मुझे उच्च शिक्षा छात्रवृत्ति और छात्रावास सहायता चाहिए।",
    highlights: [
      { text: '20-year-old', textHi: '20 वर्षीय', key: 'Age', val: '20 years', color: 'bg-emerald-500/20 text-[#174D38] dark:text-emerald-300' },
      { text: 'female', textHi: 'महिला', key: 'Gender', val: 'Female', color: 'bg-[#4D1717]/20 text-[#4D1717] dark:text-[#f0a8a8]' },
      { text: 'Lucknow, Uttar Pradesh', textHi: 'लखनऊ, उत्तर प्रदेश', key: 'State', val: 'Uttar Pradesh', color: 'bg-[#4D1717]/20 text-[#4D1717] dark:text-[#f0a8a8]' },
      { text: 'college student', textHi: 'कॉलेज छात्रा', key: 'Occupation', val: 'Student', color: 'bg-emerald-500/20 text-[#174D38] dark:text-emerald-300' },
      { text: '₹1.2 lakh', textHi: '₹1.2 लाख', key: 'Income', val: '₹1.2 Lakh/yr', color: 'bg-emerald-500/20 text-[#174D38] dark:text-emerald-300' },
    ],
    matchedSchemes: [
      { name: 'National Scholarship Scheme', nameHi: 'राष्ट्रीय छात्रवृत्ति योजना', benefit: '₹12,000 / year + tuition', tag: 'Central' },
      { name: 'UP Post-Matric Scholarship', nameHi: 'यूपी पोस्ट-मैट्रिक छात्रवृत्ति', benefit: '100% Fee reimbursement', tag: 'State' },
      { name: 'Pragati Scholarship for Girls', nameHi: 'प्रगति छात्रवृत्ति योजना', benefit: '₹50,000 / year', tag: 'Central' },
    ]
  },
  {
    id: 'entrepreneur',
    icon: '💼',
    name: 'Sunita Patil',
    nameHi: 'सुनीता पाटिल',
    role: 'Woman Entrepreneur',
    roleHi: 'महिला उद्यमी',
    location: 'Pune, Maharashtra',
    locationHi: 'पुणे, महाराष्ट्र',
    textEn: "I am a 32-year-old woman in Pune, Maharashtra wanting to start a small millet food processing enterprise. Looking for zero-collateral loan under Mudra or Stand-Up India, capital subsidy, and skill training.",
    textHi: "मैं पुणे, महाराष्ट्र की 32 वर्षीय महिला हूं और एक छोटा खाद्य प्रसंस्करण उद्यम शुरू करना चाहती हूं। मुझे बिना गारंटी का ऋण, पूंजीगत सब्सिडी और कौशल प्रशिक्षण सहायता चाहिए।",
    highlights: [
      { text: '32-year-old', textHi: '32 वर्षीय', key: 'Age', val: '32 years', color: 'bg-emerald-500/20 text-[#174D38] dark:text-emerald-300' },
      { text: 'woman', textHi: 'महिला', key: 'Gender', val: 'Female', color: 'bg-[#4D1717]/20 text-[#4D1717] dark:text-[#f0a8a8]' },
      { text: 'Pune, Maharashtra', textHi: 'पुणे, महाराष्ट्र', key: 'State', val: 'Maharashtra', color: 'bg-[#4D1717]/20 text-[#4D1717] dark:text-[#f0a8a8]' },
      { text: 'food processing enterprise', textHi: 'खाद्य प्रसंस्करण उद्यम', key: 'Goal', val: 'Micro Business', color: 'bg-emerald-500/20 text-[#174D38] dark:text-emerald-300' },
    ],
    matchedSchemes: [
      { name: 'Pradhan Mantri MUDRA Yojana', nameHi: 'प्रधानमंत्री मुद्रा योजना', benefit: 'Up to ₹10 Lakh collateral-free', tag: 'Central' },
      { name: 'Stand-Up India Scheme', nameHi: 'स्टैंड-अप इंडिया योजना', benefit: '₹10L to ₹1 Crore for women', tag: 'Central' },
      { name: 'PM Formalisation of Micro Food', nameHi: 'पीएम सूक्ष्म खाद्य उद्यम योजना', benefit: '35% capital subsidy', tag: 'Central' },
    ]
  }
]

export default function LiveExtractionSimulator() {
  const { lang } = useLang()
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [displayedLength, setDisplayedLength] = useState(0)
  const [activeChipCount, setActiveChipCount] = useState(0)
  const [showMatches, setShowMatches] = useState(false)
  const timerRef = useRef(null)

  const scenario = SIMULATION_SCENARIOS[scenarioIndex]
  const fullText = lang === 'hi' ? scenario.textHi : scenario.textEn

  function resetSimulation() {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsPlaying(false)
    setDisplayedLength(0)
    setActiveChipCount(0)
    setShowMatches(false)
  }

  function startSimulation() {
    resetSimulation()
    setIsPlaying(true)

    let currentLength = 0
    const totalLength = fullText.length
    const textSpeed = 22 // ms per char

    timerRef.current = setInterval(() => {
      currentLength += 2
      if (currentLength >= totalLength) {
        currentLength = totalLength
        clearInterval(timerRef.current)
        setDisplayedLength(totalLength)

        // Stagger chips appearance
        let chipsRevealed = 0
        const chipInterval = setInterval(() => {
          chipsRevealed++
          setActiveChipCount(chipsRevealed)
          if (chipsRevealed >= scenario.highlights.length) {
            clearInterval(chipInterval)
            setTimeout(() => {
              setShowMatches(true)
              setIsPlaying(false)
            }, 300)
          }
        }, 220)
      } else {
        setDisplayedLength(currentLength)
        // Progressively reveal chips based on text percent
        const progress = currentLength / totalLength
        const targetChips = Math.floor(progress * scenario.highlights.length)
        setActiveChipCount(targetChips)
      }
    }, textSpeed)
  }

  // Cleanup on unmount or scenario switch
  useEffect(() => {
    resetSimulation()
    // Auto-display finished state initially so it's not blank
    setDisplayedLength(fullText.length)
    setActiveChipCount(scenario.highlights.length)
    setShowMatches(true)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [scenarioIndex, lang])

  return (
    <section className="py-16 bg-white dark:bg-[#151d18] border-b border-[#CBCBCB] dark:border-[#232f28] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-[#174D38]/10 dark:bg-[#174D38]/20 border border-[#174D38]/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#174D38] dark:text-[#a7d7c5] uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'लाइव सिमुलेशन' : 'Interactive Simulation'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1e2421] dark:text-white tracking-tight leading-tight mb-3">
            {lang === 'hi' ? 'देखें SchemeFinder आपकी प्रोफ़ाइल कैसे समझता है' : 'Watch How SchemeFinder Understands Any Profile'}
          </h2>
          <p className="text-sm sm:text-base text-[#5c6861] dark:text-[#9eada5] leading-relaxed">
            {lang === 'hi'
              ? 'एक नागरिक अपनी भाषा में लिखता है — सिस्टम तुरंत आवश्यक पात्रता विवरण निकालता है और योजनाएं ढूंढता है।'
              : 'A citizen describes their situation in plain natural language — SchemeFinder instantly extracts key eligibility attributes and matches official schemes.'
            }
          </p>
        </div>

        {/* Simulator Container */}
        <div className="bg-[#F2F2F2] dark:bg-[#111814] border border-[#CBCBCB] dark:border-[#2a382e] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-md">
          
          {/* Scenario Selector & Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#CBCBCB]/60 dark:border-[#2a382e]">
            {/* Personas */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#5c6861] dark:text-[#9eada5] uppercase tracking-wider mr-1">
                {lang === 'hi' ? 'नागरिक चुनें:' : 'Select Citizen:'}
              </span>
              {SIMULATION_SCENARIOS.map((sc, i) => (
                <button
                  key={sc.id}
                  onClick={() => { setScenarioIndex(i) }}
                  className={`inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                    scenarioIndex === i
                      ? 'bg-[#174D38] text-white border-[#174D38] shadow-xs scale-102'
                      : 'bg-white dark:bg-[#1a231e] text-[#1e2421] dark:text-slate-300 border-[#CBCBCB] dark:border-[#2a3830] hover:border-[#174D38]'
                  }`}
                >
                  <span>{sc.icon}</span>
                  <span>{lang === 'hi' ? sc.roleHi : sc.role}</span>
                </button>
              ))}
            </div>

            {/* Play / Reset Action Buttons */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={startSimulation}
                disabled={isPlaying}
                className="inline-flex items-center gap-1.5 bg-[#174D38] hover:bg-[#113a2a] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 shadow-xs hover:shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{lang === 'hi' ? 'सिमुलेशन चलाएं' : '▶ Play Simulation'}</span>
              </button>
              <button
                onClick={resetSimulation}
                className="p-2 text-[#5c6861] dark:text-[#9eada5] hover:text-[#174D38] dark:hover:text-white bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                title="Reset simulation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Simulation Display Grid */}
          <div className="grid lg:grid-cols-12 gap-6 mt-6">
            
            {/* LEFT (7 cols): Simulated Input Box */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#174D38] dark:text-[#a7d7c5]" />
                  <span className="text-xs font-bold text-[#1e2421] dark:text-white">
                    {lang === 'hi' ? scenario.nameHi : scenario.name} ({lang === 'hi' ? scenario.locationHi : scenario.location})
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[#174D38] dark:text-[#a7d7c5] bg-[#174D38]/10 dark:bg-[#174D38]/20 px-2 py-0.5 rounded-md">
                  {lang === 'hi' ? 'प्राकृतिक भाषा विवरण' : 'Natural Language Input'}
                </span>
              </div>

              {/* Text Canvas */}
              <div className="flex-1 bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between min-h-[170px]">
                <p className="text-[#1e2421] dark:text-slate-100 text-sm sm:text-base leading-relaxed font-normal">
                  {fullText.slice(0, displayedLength)}
                  {isPlaying && displayedLength < fullText.length && (
                    <span className="inline-block w-2 h-4 bg-[#174D38] dark:bg-emerald-400 ml-1 animate-pulse" />
                  )}
                </p>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#CBCBCB]/40 dark:border-[#2a3830] text-xs text-[#5c6861] dark:text-[#9eada5]">
                  <span className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full bg-emerald-500 inline-block ${isPlaying ? 'animate-pulse' : ''}`} />
                    <span>{isPlaying ? (lang === 'hi' ? 'AI विश्लेषक पढ़ रहा है...' : 'AI Parser Analyzing...') : (lang === 'hi' ? 'विश्लेषण संपन्न' : 'Analysis Ready')}</span>
                  </span>
                  <span>{displayedLength} / {fullText.length} {lang === 'hi' ? 'अक्षर' : 'chars'}</span>
                </div>
              </div>
            </div>

            {/* RIGHT (5 cols): Real-Time Extracted Profile & Schemes */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Extracted Chips Card */}
              <div className="bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-4 sm:p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#174D38] dark:text-[#a7d7c5] uppercase tracking-wider">
                    <Brain className="w-4 h-4" />
                    <span>{lang === 'hi' ? 'पहचाने गए पात्रता विवरण' : 'Extracted Attributes'}</span>
                  </div>
                  <span className="text-xs font-bold text-[#174D38] dark:text-[#a7d7c5] bg-[#174D38]/10 dark:bg-[#174D38]/20 px-2 py-0.5 rounded-full">
                    {activeChipCount} / {scenario.highlights.length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[48px]">
                  {scenario.highlights.slice(0, activeChipCount).map((h, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 bg-[#F2F2F2] dark:bg-[#111814] border border-[#CBCBCB] dark:border-[#2a382e] text-[#1e2421] dark:text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-lg animate-scale-in"
                    >
                      <span className="text-[#174D38] dark:text-[#a7d7c5]">{h.key}:</span>
                      <span>{h.val}</span>
                    </span>
                  ))}
                  {activeChipCount === 0 && (
                    <p className="text-xs text-[#5c6861] dark:text-[#9eada5] italic py-2">
                      {lang === 'hi' ? 'सिमुलेशन चलाने पर विवरण यहां दिखाई देंगे...' : 'Attributes will pop in here as AI parses the text...'}
                    </p>
                  )}
                </div>
              </div>

              {/* Instant Scheme Matches Preview */}
              <div className="bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-4 sm:p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#4D1717] dark:text-[#f0a8a8] uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{lang === 'hi' ? 'सटीक योजनाएं मिलीं' : 'Matched Schemes'}</span>
                  </div>
                  {showMatches && (
                    <span className="text-xs font-bold text-white bg-[#174D38] px-2 py-0.5 rounded-full animate-fade-in">
                      {scenario.matchedSchemes.length} {lang === 'hi' ? 'योजनाएं' : 'Found'}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {showMatches ? (
                    scenario.matchedSchemes.map((sch, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#F2F2F2] dark:bg-[#111814] border border-[#CBCBCB]/60 dark:border-[#2a382e] animate-fade-in text-xs"
                        style={{ animationDelay: `${i * 120}ms` }}
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-[#1e2421] dark:text-white truncate">
                            {lang === 'hi' ? sch.nameHi : sch.name}
                          </p>
                          <p className="text-[11px] text-[#174D38] dark:text-[#a7d7c5] font-semibold mt-0.5">
                            {sch.benefit}
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          sch.tag === 'Central' ? 'bg-[#174D38]/10 text-[#174D38] dark:text-[#a7d7c5]' : 'bg-[#4D1717]/10 text-[#4D1717] dark:text-[#f0a8a8]'
                        }`}>
                          {sch.tag}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#5c6861] dark:text-[#9eada5] italic py-2">
                      {lang === 'hi' ? 'योजना मिलान परिणाम यहां दिखाई देंगे...' : 'Matching government schemes will appear here...'}
                    </p>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Live Action Callout */}
          <div className="mt-6 pt-5 border-t border-[#CBCBCB]/60 dark:border-[#2a382e] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-[#5c6861] dark:text-[#9eada5]">
              <Shield className="w-4 h-4 text-[#174D38] dark:text-[#a7d7c5] shrink-0" />
              <span>
                {lang === 'hi'
                  ? 'SchemeFinder केवल आपके द्वारा दी गई जानकारी का उपयोग करता है। कोई गलत अनुमान नहीं लगाया जाता।'
                  : 'Transparent rule matching: only criteria you explicitly provide are evaluated against official government rules.'
                }
              </span>
            </div>
            <Link
              to="/find-schemes"
              className="btn-primary text-xs sm:text-sm px-5 py-2.5 shrink-0"
            >
              <span>{lang === 'hi' ? 'अपनी प्रोफ़ाइल के लिए आज़माएं' : 'Try With Your Own Profile'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  )
}
