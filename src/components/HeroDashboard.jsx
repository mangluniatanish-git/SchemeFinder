import {
  BookOpen,
  IndianRupee,
  Briefcase,
  Heart,
  Home,
  Leaf,
  CheckCircle2,
  TrendingUp,
  Sparkles,
} from 'lucide-react'
import { useLang } from '../context/LanguageContext'

const schemeCards = [
  { icon: BookOpen, label: 'PM Vidyalaxmi Higher Ed', labelHi: 'पीएम विद्यालक्ष्मी शिक्षा', color: 'text-[#174D38] dark:text-emerald-300', bg: 'bg-[#174D38]/10 dark:bg-[#174D38]/20', match: 98, type: 'Central' },
  { icon: Leaf, label: 'PM-KISAN Samman Nidhi', labelHi: 'पीएम-किसान सम्मान निधि', color: 'text-[#174D38] dark:text-emerald-400', bg: 'bg-[#174D38]/10 dark:bg-[#174D38]/20', match: 95, type: 'Central' },
  { icon: Briefcase, label: 'PM Mudra Enterprise Loan', labelHi: 'पीएम मुद्रा उद्यम ऋण', color: 'text-[#4D1717] dark:text-[#f0a8a8]', bg: 'bg-[#4D1717]/10 dark:bg-[#4D1717]/20', match: 89, type: 'Central' },
  { icon: Home, label: 'PM Surya Ghar Muft Bijli', labelHi: 'पीएम सूर्य घर मुफ्त बिजली', color: 'text-[#174D38] dark:text-emerald-300', bg: 'bg-[#174D38]/10 dark:bg-[#174D38]/20', match: 84, type: 'Central' },
  { icon: Heart, label: 'Ayushman Bharat PM-JAY', labelHi: 'आयुष्मान भारत स्वास्थ्य', color: 'text-[#4D1717] dark:text-[#f0a8a8]', bg: 'bg-[#4D1717]/10 dark:bg-[#4D1717]/20', match: 81, type: 'Central' },
]

export default function HeroDashboard() {
  const { lang } = useLang()

  return (
    <div className="relative w-full max-w-md mx-auto select-none">
      {/* Dynamic ambient pulsing background glow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-[#174D38]/25 via-emerald-600/15 to-[#4D1717]/20 blur-2xl rounded-3xl -z-10 animate-pulse-glow" />

      {/* Floating Micro-Badge 1: Top Right */}
      <div className="absolute -top-4 -right-4 z-20 bg-[#174D38] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-emerald-400/40 animate-float flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
        <span>⚡ 98% {lang === 'hi' ? 'मिलान' : 'Match'}</span>
      </div>

      {/* Floating Micro-Badge 2: Bottom Left */}
      <div className="absolute -bottom-4 -left-4 z-20 bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] shadow-xl text-xs font-semibold text-[#1e2421] dark:text-slate-200 px-3.5 py-1.5 rounded-full animate-float-reverse flex items-center gap-1.5">
        <span>🇮🇳</span>
        <span>{lang === 'hi' ? '28 राज्य समर्थित' : '28 States Active'}</span>
      </div>

      {/* Main card */}
      <div className="bg-white dark:bg-[#1a231e] rounded-2xl border border-[#CBCBCB] dark:border-[#2a3830] shadow-2xl overflow-hidden shimmer-sweep">
        {/* Header gradient banner */}
        <div className="bg-gradient-to-r from-[#174D38] via-[#1f5f46] to-[#174D38] px-5 py-4 text-white relative overflow-hidden">
          {/* Subtle diagonal scanning beam */}
          <div className="absolute inset-0 bg-white/5 opacity-40 shimmer-badge pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                <span>{lang === 'hi' ? 'लाइव मिलान पूर्वावलोकन' : 'Live Match Preview'}</span>
              </div>
              <p className="text-white font-extrabold text-xl mt-0.5 tracking-tight">
                {lang === 'hi' ? '12 प्रासंगिक योजनाएं' : '12 Qualifying Schemes'}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-full font-bold">
                ✓ {lang === 'hi' ? 'सत्यापित' : 'Verified'}
              </span>
            </div>
          </div>

          {/* Match score bar with animated fill */}
          <div className="mt-3.5 relative z-10">
            <div className="flex items-center justify-between text-xs text-emerald-100 mb-1.5 font-medium">
              <span>{lang === 'hi' ? 'औसत पात्रता स्कोर' : 'Eligibility Match Rate'}</span>
              <span className="text-white font-bold text-sm">96%</span>
            </div>
            <div className="h-2 bg-black/20 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-300 to-white rounded-full animate-fill-meter"
                style={{ width: '96%' }}
              />
            </div>
          </div>
        </div>

        {/* Stats counter strip */}
        <div className="grid grid-cols-3 divide-x divide-[#CBCBCB]/40 dark:divide-[#2a3830] border-b border-[#CBCBCB]/60 dark:border-[#2a3830] bg-[#F2F2F2]/60 dark:bg-[#151e18]">
          {[
            { label: lang === 'hi' ? 'पात्र' : 'Eligible', value: '8', icon: CheckCircle2, color: 'text-[#174D38] dark:text-emerald-400' },
            { label: lang === 'hi' ? 'संभावित' : 'Potential', value: '4', icon: TrendingUp, color: 'text-[#4D1717] dark:text-[#f0a8a8]' },
            { label: lang === 'hi' ? 'सहायता' : 'Benefits', value: '₹65,000+', icon: IndianRupee, color: 'text-[#174D38] dark:text-emerald-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="px-3 py-2.5 text-center group hover:bg-white dark:hover:bg-[#1a231e] transition-colors">
              <Icon className={`w-3.5 h-3.5 ${color} mx-auto mb-0.5 group-hover:scale-120 transition-transform`} />
              <p className="text-[#1e2421] dark:text-slate-100 font-extrabold text-sm sm:text-base leading-tight">{value}</p>
              <p className="text-[#1e2421]/60 dark:text-slate-400 text-[11px] font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* Scheme mini-list with animated staggered hover */}
        <div className="p-3.5 space-y-2">
          {schemeCards.map(({ icon: Icon, label, labelHi, color, bg, match }, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F2F2F2] dark:hover:bg-[#232f29] transition-all duration-200 cursor-pointer group hover:-translate-x-0.5"
            >
              <div className={`w-7 h-7 ${bg} rounded-lg flex items-center justify-center shrink-0 group-hover:scale-115 transition-transform duration-200`}>
                <Icon className={`w-3.5 h-3.5 ${color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#1e2421] dark:text-slate-200 text-xs font-semibold truncate group-hover:text-[#174D38] dark:group-hover:text-emerald-400 transition-colors">
                  {lang === 'hi' ? labelHi : label}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-10 h-1.5 bg-[#CBCBCB]/40 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full animate-fill-meter"
                    style={{ width: `${match}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-[#174D38] dark:text-emerald-400">{match}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA preview */}
        <div className="px-3.5 pb-3.5">
          <div className="bg-[#F2F2F2] dark:bg-[#141d18] rounded-xl px-3 py-2 flex items-center justify-between border border-[#CBCBCB]/60 dark:border-[#2a3830] group hover:border-[#174D38] dark:hover:border-emerald-500 transition-colors">
            <span className="text-[#1e2421] dark:text-slate-300 text-xs font-semibold">
              {lang === 'hi' ? 'सभी 12 योजनाएं देखें' : 'Instant AI matching active'}
            </span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#174D38] text-white text-xs group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
