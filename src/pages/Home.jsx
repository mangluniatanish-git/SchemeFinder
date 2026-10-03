import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronRight, Sparkles, ShieldCheck, Award, Zap, Users2 } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { CATEGORIES } from '../data/schemes'
import { SAMPLE_PROFILES } from '../data/sampleProfiles'
import LiveExtractionSimulator from '../components/LiveExtractionSimulator'
import EligibilitySimulator from '../components/EligibilitySimulator'
import HeroDashboard from '../components/HeroDashboard'
import AnimatedCounter from '../components/AnimatedCounter'

export default function Home() {
  const { t, lang } = useLang()
  const navigate = useNavigate()

  // Top 8 categories for home strip
  const featuredCategories = CATEGORIES.slice(0, 8)

  function handleSelectSample(sample) {
    const sampleText = lang === 'hi' ? sample.textHi : sample.text
    navigate('/find-schemes', { state: { sampleText, autoAnalyze: true } })
  }

  return (
    <>
      {/* ── HERO ── */}
      <section className="bg-[#F2F2F2] dark:bg-[#111814] border-b border-[#CBCBCB] dark:border-[#232f28] relative overflow-hidden transition-colors duration-200">
        {/* Ambient floating orbs for depth */}
        <div className="absolute top-12 left-1/4 w-80 h-80 bg-[#174D38]/10 dark:bg-[#174D38]/20 rounded-full blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#4D1717]/10 dark:bg-[#4D1717]/15 rounded-full blur-3xl pointer-events-none animate-float-reverse" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-18 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Column: Hero Text & Actions (Col 7) */}
            <div className="lg:col-span-7">
              {/* Official Gov badge with radar beacon */}
              <div className="inline-flex items-center gap-2 border border-[#CBCBCB] dark:border-[#2a3830] bg-white dark:bg-[#1a231e] text-[#1e2421] dark:text-slate-300 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 shadow-xs animate-fade-in-down">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#174D38] dark:bg-emerald-400" />
                </span>
                <span className="text-sm">🇮🇳</span>
                {lang === 'hi' ? 'आधिकारिक सरकारी स्रोतों से जानकारी' : 'Information from official government sources'}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1e2421] dark:text-white leading-[1.15] tracking-tight mb-5 animate-fade-in-up">
                {t.heroTitle}
              </h1>

              <p className="text-[#1e2421]/80 dark:text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl font-normal animate-fade-in-up stagger-1">
                {t.heroSubtitle}
              </p>

              <div className="flex flex-wrap gap-3.5 animate-fade-in-up stagger-2">
                <Link to="/find-schemes" className="btn-primary text-base px-7 py-3.5 shimmer-sweep shadow-lg shadow-[#174D38]/20 group">
                  <span>{t.heroPrimary}</span>
                  <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/schemes" className="btn-secondary text-base px-6 py-3.5">
                  {t.heroSecondary}
                </Link>
              </div>

              {/* 1-Click Sample Citizen Profiles */}
              <div className="mt-8 pt-6 border-t border-[#CBCBCB]/60 dark:border-[#2a3830] animate-fade-in-up stagger-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#174D38] dark:text-[#a7d7c5] uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5 animate-sparkle" />
                  <span>{lang === 'hi' ? 'एक क्लिक में आज़माएं — नमूना नागरिक प्रोफ़ाइल:' : 'Try in 1-Click with a Sample Citizen Profile:'}</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {SAMPLE_PROFILES.map((sample, idx) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectSample(sample)}
                      className="inline-flex items-center gap-2 bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a382e] hover:border-[#174D38] dark:hover:border-emerald-500 text-[#1e2421] dark:text-[#f3f5f4] text-xs font-medium px-3.5 py-2 rounded-xl transition-all shadow-2xs hover:shadow-md hover:-translate-y-0.5 group cursor-pointer"
                    >
                      <span className="group-hover:scale-120 transition-transform">{sample.icon}</span>
                      <span className="font-bold text-[#174D38] dark:text-[#a7d7c5]">{lang === 'hi' ? sample.roleHi : sample.role}:</span>
                      <span>{lang === 'hi' ? sample.titleHi : sample.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#174D38] dark:text-[#a7d7c5] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Simple trust row */}
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm text-[#1e2421]/70 dark:text-slate-400">
                <span className="flex items-center gap-1.5"><span className="text-[#174D38] dark:text-emerald-400 font-bold">✓</span> {lang === 'hi' ? 'निःशुल्क — कोई खाता नहीं चाहिए' : 'Free — no account needed'}</span>
                <span className="flex items-center gap-1.5"><span className="text-[#174D38] dark:text-emerald-400 font-bold">✓</span> {lang === 'hi' ? 'सभी 28 राज्यों की योजनाएं' : 'Schemes from all 28 states'}</span>
                <span className="flex items-center gap-1.5"><span className="text-[#174D38] dark:text-emerald-400 font-bold">✓</span> {lang === 'hi' ? 'हिंदी और अंग्रेजी में' : 'Available in Hindi & English'}</span>
              </div>
            </div>

            {/* Right Column: Animated Live Preview Dashboard (Col 5) */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0 animate-scale-in">
              <HeroDashboard />
            </div>

          </div>
        </div>
      </section>

      {/* ── STATS COUNTER STRIP ── */}
      <section className="bg-white dark:bg-[#151d18] border-b border-[#CBCBCB] dark:border-[#232f28] py-6 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y md:divide-y-0 md:divide-x divide-[#CBCBCB]/50 dark:divide-[#2a3830]">
            <div className="text-center pt-2 md:pt-0 group cursor-default">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Award className="w-5 h-5 text-[#174D38] dark:text-emerald-400 group-hover:scale-120 group-hover:rotate-12 transition-transform" />
                <span className="text-2xl sm:text-3xl font-extrabold text-[#174D38] dark:text-emerald-400">
                  <AnimatedCounter value={500} suffix="+" />
                </span>
              </div>
              <p className="text-xs font-semibold text-[#1e2421]/70 dark:text-slate-300 uppercase tracking-wider">
                {lang === 'hi' ? 'सत्यापित योजनाएं' : 'Verified Schemes'}
              </p>
            </div>

            <div className="text-center pt-2 md:pt-0 md:pl-6 group cursor-default">
              <div className="flex items-center justify-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-[#4D1717] dark:text-[#f0a8a8] group-hover:scale-120 group-hover:rotate-12 transition-transform" />
                <span className="text-2xl sm:text-3xl font-extrabold text-[#4D1717] dark:text-[#f0a8a8]">
                  <AnimatedCounter value={28} suffix=" States" />
                </span>
              </div>
              <p className="text-xs font-semibold text-[#1e2421]/70 dark:text-slate-300 uppercase tracking-wider">
                {lang === 'hi' ? '28 राज्य व 8 केंद्र शासित' : 'All States & UTs'}
              </p>
            </div>

            <div className="text-center pt-2 md:pt-0 md:pl-6 group cursor-default">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap className="w-5 h-5 text-[#174D38] dark:text-emerald-400 group-hover:scale-120 group-hover:rotate-12 transition-transform" />
                <span className="text-2xl sm:text-3xl font-extrabold text-[#174D38] dark:text-emerald-400">
                  <AnimatedCounter value={100} suffix="%" />
                </span>
              </div>
              <p className="text-xs font-semibold text-[#1e2421]/70 dark:text-slate-300 uppercase tracking-wider">
                {lang === 'hi' ? 'निःशुल्क और पारदर्शी' : 'Free & Transparent'}
              </p>
            </div>

            <div className="text-center pt-2 md:pt-0 md:pl-6 group cursor-default">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users2 className="w-5 h-5 text-[#4D1717] dark:text-[#f0a8a8] group-hover:scale-120 group-hover:rotate-12 transition-transform" />
                <span className="text-2xl sm:text-3xl font-extrabold text-[#4D1717] dark:text-[#f0a8a8]">
                  <AnimatedCounter value={1200} prefix="₹" suffix=" Cr+" />
                </span>
              </div>
              <p className="text-xs font-semibold text-[#1e2421]/70 dark:text-slate-300 uppercase tracking-wider">
                {lang === 'hi' ? 'वार्षिक सहायता निधि' : 'Aid Unlocked'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORY STRIP ── */}
      <section className="bg-[#F2F2F2]/60 dark:bg-[#121914] border-b border-[#CBCBCB] dark:border-[#232f28] py-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#174D38] dark:bg-emerald-400" />
              <span className="text-xs font-bold text-[#174D38] dark:text-emerald-400 uppercase tracking-wider">
                {lang === 'hi' ? 'श्रेणी के अनुसार योजनाएं देखें' : 'Browse schemes by category'}
              </span>
            </div>
            <Link to="/categories" className="text-xs font-bold text-[#174D38] dark:text-emerald-400 hover:underline flex items-center gap-1">
              <span>{lang === 'hi' ? 'सभी 12 श्रेणियां' : 'All 12 categories'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {featuredCategories.map((cat, idx) => (
              <Link
                key={cat.id}
                to={`/schemes?category=${cat.id}`}
                className="flex flex-col items-center gap-2 p-3.5 bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl hover:border-[#174D38] dark:hover:border-emerald-500 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-[#174D38]/10 transition-all duration-300 text-center group shadow-2xs cursor-pointer"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div className={`w-9 h-9 ${cat.bg} rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-120 group-hover:rotate-6 shadow-2xs`}>
                  <span className={`text-xs font-extrabold ${cat.color}`}>{cat.label.slice(0, 2)}</span>
                </div>
                <span className="text-xs font-bold text-[#1e2421] dark:text-slate-200 group-hover:text-[#174D38] dark:group-hover:text-emerald-400 leading-tight transition-colors">
                  {lang === 'hi' ? cat.labelHi : cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SIMULATION 1: LIVE AI PROFILE UNDERSTANDING ── */}
      <LiveExtractionSimulator />

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-[#F2F2F2]/60 dark:bg-[#111814] relative overflow-hidden transition-colors duration-200">
        {/* Left Dot Matrix Pattern */}
        <div className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 hidden md:block opacity-40 pointer-events-none" aria-hidden="true">
          <div className="grid grid-cols-4 gap-3">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#174D38]" />
            ))}
          </div>
        </div>

        {/* Bottom Right Soft Blur */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-[#174D38]/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" aria-hidden="true" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-14 sm:mb-16">
            <span className="section-tag mb-3">
              {lang === 'hi' ? 'यह कैसे काम करता है' : 'How it works'}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-[#1e2421] dark:text-white tracking-tight leading-tight mt-2">
              {lang === 'hi' ? (
                <>
                  आपके लिए प्रासंगिक सरकारी योजनाएं खोजने के <br className="hidden sm:inline" />तीन सरल चरण
                </>
              ) : (
                <>
                  Three simple steps to discover <br className="hidden sm:inline" />government schemes relevant to you
                </>
              )}
            </h2>
          </div>

          {/* 3 Step Cards with Double Chevron Connectors */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-8">
            {/* ── CARD 1: Describe Your Profile ── */}
            <div className="bg-white dark:bg-[#1a231e] rounded-2xl p-7 sm:py-9 sm:px-8 shadow-md shadow-[#174D38]/5 dark:shadow-none border border-[#CBCBCB] dark:border-[#2a3830] flex flex-col items-center text-center w-full max-w-[290px] sm:max-w-[320px] transition-all duration-300 hover:-translate-y-2.5 hover:shadow-2xl hover:shadow-[#174D38]/15 hover:border-[#174D38] dark:hover:border-emerald-600 group cursor-default">
              {/* Step indicator tag placed cleanly inside */}
              <span className="inline-flex items-center gap-1 bg-[#174D38]/10 dark:bg-[#174D38]/25 text-[#174D38] dark:text-emerald-300 text-xs font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full mb-5 border border-[#174D38]/20 group-hover:scale-105 transition-transform">
                {lang === 'hi' ? 'चरण 01' : 'Step 01'}
              </span>

              <div className="mb-5 h-20 flex items-center justify-center">
                <svg className="w-20 h-20 transition-transform duration-300 group-hover:scale-115 group-hover:rotate-2" viewBox="0 0 72 72" fill="none">
                  {/* Chat / Profile card bubble */}
                  <path d="M16 15h40a4 4 0 0 1 4 4v23a4 4 0 0 1-4 4H32l-9 7v-7h-7a4 4 0 0 1-4-4V19a4 4 0 0 1 4-4z" fill="#F2F2F2" stroke="#174D38" strokeWidth="2.5" strokeLinejoin="round" />
                  {/* User profile avatar */}
                  <circle cx="28" cy="27" r="5" stroke="#4D1717" strokeWidth="2.5" fill="#F2F2F2" />
                  <path d="M21 39c0-3.5 3.5-5.5 7-5.5s7 2 7 5.5" stroke="#4D1717" strokeWidth="2.2" strokeLinecap="round" />
                  {/* Description text lines */}
                  <line x1="40" y1="25" x2="50" y2="25" stroke="#174D38" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="40" y1="31" x2="48" y2="31" stroke="#174D38" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="40" y1="37" x2="46" y2="37" stroke="#4D1717" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              <h3 className="text-[#174D38] dark:text-emerald-400 font-bold text-lg sm:text-xl mb-3">
                {lang === 'hi' ? 'अपनी प्रोफ़ाइल बताएं' : 'Describe Your Profile'}
              </h3>

              {lang === 'hi' ? (
                <p className="text-[#1e2421]/80 dark:text-slate-300 text-sm leading-relaxed">
                  हिंदी या अंग्रेजी में अपने बारे में बताएं — आपकी <span className="font-bold text-[#1e2421] dark:text-white">आयु, स्थान, व्यवसाय, आय</span> और ज़रूरतें।
                </p>
              ) : (
                <p className="text-[#1e2421]/80 dark:text-slate-300 text-sm leading-relaxed">
                  Write about yourself in plain <span className="font-bold text-[#1e2421] dark:text-white">English or Hindi</span> — your age, location, occupation, income, and what you are looking for.
                </p>
              )}
            </div>

            {/* ── CONNECTOR ARROW 1 ── */}
            <div className="hidden md:flex items-center justify-center text-[#174D38] dark:text-emerald-500/80 shrink-0 select-none animate-drift-right" aria-hidden="true">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <svg className="w-10 h-10 -ml-6 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* ── CARD 2: We Understand You ── */}
            <div className="bg-white dark:bg-[#1a231e] rounded-2xl p-7 sm:py-9 sm:px-8 shadow-md shadow-[#174D38]/5 dark:shadow-none border border-[#CBCBCB] dark:border-[#2a3830] flex flex-col items-center text-center w-full max-w-[290px] sm:max-w-[320px] transition-all duration-300 hover:-translate-y-2.5 hover:shadow-2xl hover:shadow-[#174D38]/15 hover:border-[#174D38] dark:hover:border-emerald-600 group cursor-default">
              {/* Step indicator tag placed cleanly inside */}
              <span className="inline-flex items-center gap-1 bg-[#4D1717]/10 dark:bg-[#4D1717]/25 text-[#4D1717] dark:text-[#f0a8a8] text-xs font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full mb-5 border border-[#4D1717]/20 group-hover:scale-105 transition-transform">
                {lang === 'hi' ? 'चरण 02' : 'Step 02'}
              </span>

              <div className="mb-5 h-20 flex items-center justify-center">
                <svg className="w-20 h-20 transition-transform duration-300 group-hover:scale-115" viewBox="0 0 72 72" fill="none">
                  {/* Intelligent Brain / Cognition outline */}
                  <path
                    d="M36 12c-4 0-7.5 2-9 5a10 10 0 0 0-9 10c0 3 1.5 6 4 8a11 11 0 0 0 0 9c0 5 4 9 9 9h4V12zm0 0c4 0 7.5 2 9 5a10 10 0 0 1 9 10c0 3-1.5 6-4 8a11 11 0 0 1 0 9c0 5-4 9-9 9h-4V12z"
                    fill="#F2F2F2"
                    stroke="#174D38"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  <line x1="36" y1="14" x2="36" y2="51" stroke="#174D38" strokeWidth="2" strokeLinecap="round" />
                  {/* Neural understanding nodes */}
                  <circle cx="28" cy="27" r="3.5" fill="#4D1717" className="animate-pulse" />
                  <circle cx="44" cy="27" r="3.5" fill="#4D1717" className="animate-pulse" />
                  <circle cx="28" cy="41" r="3" fill="#174D38" />
                  <circle cx="44" cy="41" r="3" fill="#174D38" />
                  <path d="M28 27l8 7-8 7" stroke="#174D38" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M44 27l-8 7 8 7" stroke="#174D38" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>

              <h3 className="text-[#174D38] dark:text-emerald-400 font-bold text-lg sm:text-xl mb-3">
                {lang === 'hi' ? 'हम आपको समझते हैं' : 'We Understand You'}
              </h3>

              {lang === 'hi' ? (
                <p className="text-[#1e2421]/80 dark:text-slate-300 text-sm leading-relaxed">
                  SchemeFinder आपकी प्रोफ़ाइल पढ़कर <span className="font-bold text-[#1e2421] dark:text-white">मुख्य विवरण</span> जैसे राज्य, श्रेणी, आय और रुचियां निकालता है।
                </p>
              ) : (
                <p className="text-[#1e2421]/80 dark:text-slate-300 text-sm leading-relaxed">
                  SchemeFinder reads your profile and <span className="font-bold text-[#1e2421] dark:text-white">extracts key details</span> like state, category, income, and interests.
                </p>
              )}
            </div>

            {/* ── CONNECTOR ARROW 2 ── */}
            <div className="hidden md:flex items-center justify-center text-[#174D38] dark:text-emerald-500/80 shrink-0 select-none animate-drift-right" aria-hidden="true">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <svg className="w-10 h-10 -ml-6 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* ── CARD 3: Find Matching Schemes ── */}
            <div className="bg-white dark:bg-[#1a231e] rounded-2xl p-7 sm:py-9 sm:px-8 shadow-md shadow-[#174D38]/5 dark:shadow-none border border-[#CBCBCB] dark:border-[#2a3830] flex flex-col items-center text-center w-full max-w-[290px] sm:max-w-[320px] transition-all duration-300 hover:-translate-y-2.5 hover:shadow-2xl hover:shadow-[#174D38]/15 hover:border-[#174D38] dark:hover:border-emerald-600 group cursor-default">
              {/* Step indicator tag placed cleanly inside */}
              <span className="inline-flex items-center gap-1 bg-[#174D38]/10 dark:bg-[#174D38]/25 text-[#174D38] dark:text-emerald-300 text-xs font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full mb-5 border border-[#174D38]/20 group-hover:scale-105 transition-transform">
                {lang === 'hi' ? 'चरण 03' : 'Step 03'}
              </span>

              <div className="mb-5 h-20 flex items-center justify-center">
                <svg className="w-20 h-20 transition-transform duration-300 group-hover:scale-115 group-hover:-rotate-2" viewBox="0 0 72 72" fill="none">
                  {/* Back document */}
                  <rect x="25" y="10" width="28" height="44" rx="3" fill="#F2F2F2" stroke="#174D38" strokeWidth="2.5" />
                  {/* Front scheme sheet with folded corner */}
                  <path d="M16 16h24l10 10v26a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3V19a3 3 0 0 1 3-3z" fill="white" stroke="#174D38" strokeWidth="2.5" strokeLinejoin="round" />
                  <path d="M40 16v10h10" fill="#CBCBCB" stroke="#174D38" strokeWidth="2.5" strokeLinejoin="round" />
                  {/* Verified check badge in forest green */}
                  <circle cx="31" cy="38" r="9" fill="#F2F2F2" stroke="#174D38" strokeWidth="2.5" />
                  <path d="M27 38l3 3 5-5" stroke="#174D38" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="22" y1="24" x2="34" y2="24" stroke="#CBCBCB" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              <h3 className="text-[#174D38] dark:text-emerald-400 font-bold text-lg sm:text-xl mb-3">
                {lang === 'hi' ? 'मिलती-जुलती योजनाएं खोजें' : 'Find Matching Schemes'}
              </h3>

              {lang === 'hi' ? (
                <p className="text-[#1e2421]/80 dark:text-slate-300 text-sm leading-relaxed">
                  <span className="font-bold text-[#1e2421] dark:text-white">सरकारी स्रोतों</span> से ऐसी योजनाएं देखें जो आपकी प्रोफ़ाइल और ज़रूरतों के लिए प्रासंगिक हों।
                </p>
              ) : (
                <p className="text-[#1e2421]/80 dark:text-slate-300 text-sm leading-relaxed">
                  View government schemes from <span className="font-bold text-[#1e2421] dark:text-white">official sources</span> that are relevant to your profile and needs.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── SIMULATION 2: INTERACTIVE ELIGIBILITY & BENEFITS SIMULATOR ── */}
      <EligibilitySimulator />

      {/* ── DISCLAIMER ── */}
      <section className="bg-white dark:bg-[#111814] border-t border-[#CBCBCB] dark:border-[#232f28] py-6 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-[#1e2421]/70 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {t.disclaimer}
          </p>
        </div>
      </section>
    </>
  )
}

