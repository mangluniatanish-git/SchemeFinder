import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Calculator, CheckCircle2, IndianRupee, ArrowRight, Sparkles, Filter, ExternalLink, ShieldCheck } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import AnimatedCounter from './AnimatedCounter'

const ROLES = [
  { id: 'farmer', icon: '🌾', label: 'Farmer', labelHi: 'किसान' },
  { id: 'student', icon: '🎓', label: 'Student', labelHi: 'विद्यार्थी' },
  { id: 'entrepreneur', icon: '💼', label: 'Woman Entrepreneur', labelHi: 'महिला उद्यमी' },
  { id: 'senior', icon: '🏥', label: 'Senior Citizen', labelHi: 'वरिष्ठ नागरिक' },
]

const INCOMES = [
  { id: 'low', label: '< ₹1.5 Lakh', labelHi: '< ₹1.5 लाख', maxLakh: 1.5 },
  { id: 'mid-low', label: '₹1.5L – ₹3 Lakh', labelHi: '₹1.5L – ₹3 लाख', maxLakh: 3.0 },
  { id: 'mid', label: '₹3L – ₹6 Lakh', labelHi: '₹3L – ₹6 लाख', maxLakh: 6.0 },
  { id: 'high', label: '> ₹6 Lakh', labelHi: '> ₹6 लाख', maxLakh: 99.0 },
]

const CATEGORIES = [
  { id: 'obc', label: 'OBC', labelHi: 'ओबीसी' },
  { id: 'sc_st', label: 'SC / ST', labelHi: 'एससी / एसटी' },
  { id: 'ews', label: 'EWS / Minority', labelHi: 'ईडब्ल्यूएस / अल्पसंख्यक' },
  { id: 'general', label: 'General', labelHi: 'सामान्य' },
]

const STATES = [
  { id: 'all', label: 'All India / Central', labelHi: 'अखिल भारतीय / केंद्र' },
  { id: 'Rajasthan', label: 'Rajasthan', labelHi: 'राजस्थान' },
  { id: 'Maharashtra', label: 'Maharashtra', labelHi: 'महाराष्ट्र' },
  { id: 'Uttar Pradesh', label: 'Uttar Pradesh', labelHi: 'उत्तर प्रदेश' },
  { id: 'Madhya Pradesh', label: 'Madhya Pradesh', labelHi: 'मध्य प्रदेश' },
]

export default function EligibilitySimulator() {
  const { lang } = useLang()
  const [selectedRole, setSelectedRole] = useState('farmer')
  const [selectedIncome, setSelectedIncome] = useState('low')
  const [selectedCategory, setSelectedCategory] = useState('obc')
  const [selectedState, setSelectedState] = useState('all')

  // Live dynamic calculation based on chosen parameters
  const simulationResults = useMemo(() => {
    let count = 0
    let potentialValue = ''
    let potentialValueHi = ''
    let topSchemes = []

    if (selectedRole === 'farmer') {
      count = selectedIncome === 'high' ? 4 : 8
      potentialValue = '₹6,000 / yr Direct Transfer + 60% Solar Subsidy'
      potentialValueHi = '₹6,000 / वर्ष प्रत्यक्ष बैंक अंतरण + 60% सोलर सब्सिडी'
      topSchemes = [
        { name: 'PM-KISAN Samman Nidhi', nameHi: 'पीएम-किसान सम्मान निधि', benefit: '₹6,000/yr direct to bank account', type: 'Central' },
        { name: 'PM Fasal Bima Yojana', nameHi: 'पीएम फसल बीमा योजना', benefit: 'Comprehensive crop insurance coverage', type: 'Central' },
        { name: 'PM-KUSUM Solar Water Pump', nameHi: 'पीएम-कुसुम सोलर पंप योजना', benefit: 'Up to 60% capital assistance', type: 'Central' },
      ]
    } else if (selectedRole === 'student') {
      count = selectedIncome === 'high' ? 3 : 9
      potentialValue = 'Up to ₹50,000 / yr Scholarship + Tuition Support'
      potentialValueHi = '₹50,000 / वर्ष तक छात्रवृत्ति + पूर्ण शुल्क प्रतिपूर्ति'
      topSchemes = [
        { name: 'National Scholarship Portal Post-Matric', nameHi: 'राष्ट्रीय पोस्ट-मैट्रिक छात्रवृत्ति', benefit: 'Full tuition + maintenance allowance', type: 'Central' },
        { name: 'Pragati Scholarship Scheme', nameHi: 'प्रगति छात्रवृत्ति योजना', benefit: '₹50,000 per year for technical degree', type: 'Central' },
        { name: 'PM YASASVI Scholarship', nameHi: 'पीएम यशस्वी छात्रवृत्ति योजना', benefit: '₹75,000 to ₹1,25,000 / year', type: 'Central' },
      ]
    } else if (selectedRole === 'entrepreneur') {
      count = 7
      potentialValue = 'Up to ₹10 Lakh Zero-Collateral Loan + 35% Capital Grant'
      potentialValueHi = '₹10 लाख तक बिना गारंटी का ऋण + 35% अनुदान'
      topSchemes = [
        { name: 'Pradhan Mantri MUDRA Yojana (Shishu/Kishore)', nameHi: 'प्रधानमंत्री मुद्रा योजना', benefit: 'Collateral-free micro enterprise loan', type: 'Central' },
        { name: 'Stand-Up India for Women Entrepreneurs', nameHi: 'स्टैंड-अप इंडिया योजना', benefit: '₹10 Lakh to ₹1 Crore bank loan', type: 'Central' },
        { name: 'PM Formalisation of Micro Food Enterprises', nameHi: 'पीएम सूक्ष्म खाद्य उद्यम औपचारिकीकरण', benefit: '35% capital subsidy (up to ₹10L)', type: 'Central' },
      ]
    } else {
      // senior citizen
      count = selectedIncome === 'high' ? 3 : 6
      potentialValue = '₹5,00,000 / yr Free Healthcare + Monthly Pension'
      potentialValueHi = '₹5,00,000 / वर्ष मुफ्त स्वास्थ्य सुरक्षा + मासिक पेंशन'
      topSchemes = [
        { name: 'Ayushman Bharat PM-JAY', nameHi: 'आयुष्मान भारत (पीएम-जय)', benefit: '₹5 Lakh free cashless family treatment', type: 'Central' },
        { name: 'Indira Gandhi National Old Age Pension', nameHi: 'इंदिरा गांधी राष्ट्रीय वृद्धावस्था पेंशन', benefit: 'Monthly direct financial support', type: 'Central' },
        { name: 'Rashtriya Vayoshri Yojana', nameHi: 'राष्ट्रीय वयोश्री योजना', benefit: 'Free assistive living devices & aids', type: 'Central' },
      ]
    }

    if (selectedState !== 'all') {
      count += 3
      topSchemes.push({
        name: `${selectedState} State Citizen Welfare Grant`,
        nameHi: `${selectedState} राज्य नागरिक कल्याण अनुदान`,
        benefit: 'State-specific supplementary assistance',
        type: 'State'
      })
    }

    return { count, potentialValue, potentialValueHi, topSchemes }
  }, [selectedRole, selectedIncome, selectedCategory, selectedState])

  return (
    <section className="py-16 bg-[#F2F2F2] dark:bg-[#111814] border-b border-[#CBCBCB] dark:border-[#232f28] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-[#4D1717]/10 dark:bg-[#4D1717]/25 border border-[#4D1717]/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#4D1717] dark:text-[#f0a8a8] uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'इंटरएक्टिव सिमुलेटर' : 'Live Benefits Simulator'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1e2421] dark:text-white tracking-tight leading-tight mb-3">
            {lang === 'hi' ? 'देखें आप किन योजनाओं व लाभों के हकदार हो सकते हैं' : 'Simulate Your Eligibility & Government Assistance'}
          </h2>
          <p className="text-sm sm:text-base text-[#5c6861] dark:text-[#9eada5] leading-relaxed">
            {lang === 'hi'
              ? 'नीचे दिए गए विकल्पों पर क्लिक करके देखें कि आपकी श्रेणी और आय के आधार पर कौन सी योजनाएं मिलती हैं।'
              : 'Toggle your profile attributes below to see instant matching welfare schemes and potential financial benefits.'
            }
          </p>
        </div>

        {/* Simulator Sandbox Card */}
        <div className="bg-white dark:bg-[#16201a] border border-[#CBCBCB] dark:border-[#2a382e] rounded-2xl p-5 sm:p-7 lg:p-9 shadow-md">
          
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT (7 cols): Interactive Controls Form */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Control 1: Role */}
              <div>
                <label className="block text-xs font-bold text-[#1e2421] dark:text-white uppercase tracking-wider mb-2.5">
                  1. {lang === 'hi' ? 'आपकी वर्तमान स्थिति / पेशा:' : 'I Am A:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ROLES.map(r => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRole(r.id)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        selectedRole === r.id
                          ? 'bg-[#174D38] text-white border-[#174D38] shadow-sm scale-102'
                          : 'bg-[#F2F2F2] dark:bg-[#111814] text-[#1e2421] dark:text-slate-200 border-[#CBCBCB] dark:border-[#2a382e] hover:border-[#174D38]'
                      }`}
                    >
                      <span className="text-lg">{r.icon}</span>
                      <span className="text-center">{lang === 'hi' ? r.labelHi : r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Control 2: Annual Income */}
              <div>
                <label className="block text-xs font-bold text-[#1e2421] dark:text-white uppercase tracking-wider mb-2.5">
                  2. {lang === 'hi' ? 'वार्षिक पारिवारिक आय:' : 'Annual Family Income:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {INCOMES.map(inc => (
                    <button
                      key={inc.id}
                      onClick={() => setSelectedIncome(inc.id)}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-semibold text-center transition-all duration-200 cursor-pointer ${
                        selectedIncome === inc.id
                          ? 'bg-[#4D1717] text-[#F2F2F2] border-[#4D1717] shadow-sm scale-102'
                          : 'bg-[#F2F2F2] dark:bg-[#111814] text-[#1e2421] dark:text-slate-200 border-[#CBCBCB] dark:border-[#2a382e] hover:border-[#4D1717]'
                      }`}
                    >
                      {lang === 'hi' ? inc.labelHi : inc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Control 3: Social Category */}
              <div>
                <label className="block text-xs font-bold text-[#1e2421] dark:text-white uppercase tracking-wider mb-2.5">
                  3. {lang === 'hi' ? 'सामाजिक श्रेणी:' : 'Social Category:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-semibold text-center transition-all duration-200 cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-[#174D38] text-white border-[#174D38] shadow-sm scale-102'
                          : 'bg-[#F2F2F2] dark:bg-[#111814] text-[#1e2421] dark:text-slate-200 border-[#CBCBCB] dark:border-[#2a382e] hover:border-[#174D38]'
                      }`}
                    >
                      {lang === 'hi' ? cat.labelHi : cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Control 4: State */}
              <div>
                <label className="block text-xs font-bold text-[#1e2421] dark:text-white uppercase tracking-wider mb-2.5">
                  4. {lang === 'hi' ? 'राज्य / स्थान:' : 'State / Region:'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {STATES.map(st => (
                    <button
                      key={st.id}
                      onClick={() => setSelectedState(st.id)}
                      className={`py-1.5 px-3 rounded-lg border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        selectedState === st.id
                          ? 'bg-[#174D38] text-white border-[#174D38]'
                          : 'bg-[#F2F2F2] dark:bg-[#111814] text-[#1e2421] dark:text-slate-200 border-[#CBCBCB] dark:border-[#2a382e] hover:border-[#174D38]'
                      }`}
                    >
                      {lang === 'hi' ? st.labelHi : st.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT (5 cols): Real-Time Results & Estimated Value */}
            <div className="lg:col-span-5 bg-[#F2F2F2] dark:bg-[#111814] border border-[#CBCBCB] dark:border-[#2a382e] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
              
              {/* Live Count Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-[#CBCBCB]/60 dark:border-[#2a382e]">
                <div>
                  <span className="text-[11px] font-bold text-[#174D38] dark:text-[#a7d7c5] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                    <span>{lang === 'hi' ? 'सिमुलेशन परिणाम' : 'Instant Match'}</span>
                  </span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#1e2421] dark:text-white mt-0.5 animate-scale-in flex items-center gap-1.5">
                    <span className="text-[#174D38] dark:text-emerald-400">
                      <AnimatedCounter value={simulationResults.count} />
                    </span>
                    <span>{lang === 'hi' ? 'सरकारी योजनाएं' : 'Schemes Found'}</span>
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#174D38] flex items-center justify-center text-white shadow-md shadow-[#174D38]/20 animate-bounceSubtle">
                  <CheckCircle2 className="w-6 h-6 text-emerald-300" />
                </div>
              </div>

              {/* Estimated Potential Benefits Box */}
              <div className="bg-white dark:bg-[#16201a] border border-[#CBCBCB] dark:border-[#2a382e] rounded-xl p-4 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#4D1717] dark:text-[#f0a8a8] uppercase tracking-wider mb-1.5">
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'संभावित वार्षिक सहायता' : 'Estimated Potential Value'}</span>
                </div>
                <p className="text-xs sm:text-sm font-extrabold text-[#174D38] dark:text-[#a7d7c5] leading-snug">
                  {lang === 'hi' ? simulationResults.potentialValueHi : simulationResults.potentialValue}
                </p>
              </div>

              {/* Preview Cards */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-[#5c6861] dark:text-[#9eada5] uppercase tracking-wider">
                  {lang === 'hi' ? 'शीर्ष मिलान की गई योजनाएं:' : 'Top Matched Schemes:'}
                </p>
                {simulationResults.topSchemes.slice(0, 3).map((sch, i) => (
                  <div
                    key={i}
                    className="p-3 bg-white dark:bg-[#16201a] border border-[#CBCBCB]/80 dark:border-[#2a382e] rounded-xl text-xs hover:border-[#174D38] transition-all shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-bold text-[#1e2421] dark:text-white">
                        {lang === 'hi' ? sch.nameHi : sch.name}
                      </p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                        sch.type === 'Central'
                          ? 'bg-[#174D38]/10 text-[#174D38] dark:text-[#a7d7c5]'
                          : 'bg-[#4D1717]/10 text-[#4D1717] dark:text-[#f0a8a8]'
                      }`}>
                        {sch.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5c6861] dark:text-[#9eada5]">
                      {sch.benefit}
                    </p>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <Link
                to={`/schemes?category=${selectedRole === 'farmer' ? 'agriculture' : selectedRole === 'student' ? 'education' : selectedRole === 'entrepreneur' ? 'business' : 'health'}`}
                className="btn-primary w-full justify-center text-xs sm:text-sm py-3"
              >
                <span>{lang === 'hi' ? 'इन योजनाओं का पूरा विवरण देखें' : 'View Full Details & Official Links'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
