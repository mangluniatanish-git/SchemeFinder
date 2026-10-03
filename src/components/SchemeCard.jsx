import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, BookOpen, Heart, Home, Leaf, IndianRupee, Briefcase, GraduationCap, Users, Baby, Wrench, Factory, Accessibility, Bookmark, BookmarkCheck } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { getRelevanceBadge } from '../utils/schemeMatcher'
import { saveScheme, unsaveScheme, isSchemesSaved } from '../pages/Saved'

const ICON_MAP = {
  BookOpen, Heart, Home, Leaf, IndianRupee, Briefcase,
  GraduationCap, Users, Baby, Wrench, Factory, Accessibility,
}

const CATEGORY_COLORS = {
  education: { icon: 'BookOpen', color: 'text-[#174D38] dark:text-emerald-300', bg: 'bg-[#174D38]/10 dark:bg-[#174D38]/20' },
  health: { icon: 'Heart', color: 'text-[#4D1717] dark:text-[#f0a8a8]', bg: 'bg-[#4D1717]/10 dark:bg-[#4D1717]/20' },
  housing: { icon: 'Home', color: 'text-[#174D38] dark:text-emerald-300', bg: 'bg-[#174D38]/10 dark:bg-[#174D38]/20' },
  employment: { icon: 'Briefcase', color: 'text-[#4D1717] dark:text-[#f0a8a8]', bg: 'bg-[#4D1717]/10 dark:bg-[#4D1717]/20' },
  agriculture: { icon: 'Leaf', color: 'text-[#174D38] dark:text-emerald-400', bg: 'bg-[#174D38]/10 dark:bg-[#174D38]/20' },
  financial: { icon: 'IndianRupee', color: 'text-[#174D38] dark:text-emerald-300', bg: 'bg-[#F2F2F2] border border-[#CBCBCB] dark:bg-[#1a231e]' },
  scholarships: { icon: 'GraduationCap', color: 'text-[#174D38] dark:text-emerald-300', bg: 'bg-[#174D38]/10 dark:bg-[#174D38]/20' },
  'women-child': { icon: 'Baby', color: 'text-[#4D1717] dark:text-[#f0a8a8]', bg: 'bg-[#4D1717]/10 dark:bg-[#4D1717]/20' },
  'social-welfare': { icon: 'Users', color: 'text-[#174D38] dark:text-emerald-300', bg: 'bg-[#174D38]/10 dark:bg-[#174D38]/20' },
  skills: { icon: 'Wrench', color: 'text-[#4D1717] dark:text-[#f0a8a8]', bg: 'bg-[#4D1717]/10 dark:bg-[#4D1717]/20' },
  business: { icon: 'Factory', color: 'text-[#4D1717] dark:text-[#f0a8a8]', bg: 'bg-[#4D1717]/10 dark:bg-[#4D1717]/20' },
  disability: { icon: 'Accessibility', color: 'text-[#174D38] dark:text-emerald-300', bg: 'bg-[#174D38]/10 dark:bg-[#174D38]/20' },
}

function getCategoryStyle(categories) {
  if (!categories || categories.length === 0) return { icon: 'BookOpen', color: 'text-[#174D38] dark:text-emerald-300', bg: 'bg-[#174D38]/10 dark:bg-[#174D38]/20' }
  return CATEGORY_COLORS[categories[0]] || { icon: 'BookOpen', color: 'text-[#174D38] dark:text-emerald-300', bg: 'bg-[#174D38]/10 dark:bg-[#174D38]/20' }
}

export default function SchemeCard({ scheme, showRelevance = false }) {
  const { t, lang } = useLang()
  const [saved, setSaved] = useState(() => isSchemesSaved(scheme.id))
  const style = getCategoryStyle(scheme.categories)
  const Icon = ICON_MAP[style.icon] || BookOpen

  const relevanceBadge = showRelevance && scheme.relevance && scheme.relevance !== 'neutral'
    ? getRelevanceBadge(scheme.relevance, t)
    : null

  const name = lang === 'hi' && scheme.nameHi ? scheme.nameHi : scheme.name
  const description = lang === 'hi' && scheme.descriptionHi ? scheme.descriptionHi : scheme.description
  const benefits = lang === 'hi' && scheme.benefitsHi ? scheme.benefitsHi : scheme.benefits

  function handleSaveToggle(e) {
    e.preventDefault()
    if (saved) {
      unsaveScheme(scheme.id)
      setSaved(false)
    } else {
      saveScheme(scheme.id)
      setSaved(true)
    }
  }

  // Show match details if available
  const matchDetails = scheme.matchDetails || []
  const positiveMatches = matchDetails.filter(d => d.match === true)
  const missingInfo = matchDetails.filter(d => d.match === 'missing')

  return (
    <div className="relative overflow-hidden bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl hover:shadow-xl hover:shadow-[#174D38]/10 hover:border-[#174D38] dark:hover:border-emerald-600/70 hover:-translate-y-1 transition-all duration-300 ease-out group shimmer-sweep">
      {/* Subtle top accent bar */}
      <div className={`h-1 w-full transition-opacity duration-300 ${
        scheme.type === 'central' ? 'bg-[#174D38] opacity-80 group-hover:opacity-100' : 'bg-[#4D1717] opacity-80 group-hover:opacity-100'
      }`} />

      <div className="p-5 sm:p-6">
        <div className="flex gap-4">
          {/* Icon with spin/scale on hover */}
          <div className={`w-11 h-11 ${style.bg} rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-115 group-hover:rotate-6 transition-all duration-300 shadow-2xs`}>
            <Icon className={`w-5 h-5 ${style.color}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
              <h3 className="font-bold text-[#1e2421] dark:text-white group-hover:text-[#174D38] dark:group-hover:text-emerald-400 transition-colors text-sm sm:text-base leading-snug">
                {name}
              </h3>
              {relevanceBadge && (
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${relevanceBadge.color} flex-shrink-0 animate-scale-in shadow-2xs flex items-center gap-1`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  {relevanceBadge.label}
                </span>
              )}
            </div>

            {/* Match score meter if score available */}
            {showRelevance && scheme.score && (
              <div className="mb-2.5 max-w-xs">
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#174D38] dark:text-emerald-400 mb-1">
                  <span>{lang === 'hi' ? 'मिलान प्रासंगिकता' : 'Match Relevance'}</span>
                  <span>{Math.round(scheme.score)}%</span>
                </div>
                <div className="h-1.5 bg-[#CBCBCB]/40 dark:bg-[#2a3830] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#174D38] to-emerald-500 rounded-full animate-fill-meter"
                    style={{ width: `${Math.min(Math.round(scheme.score), 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Ministry + type badges */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs text-[#1e2421]/70 dark:text-slate-400 font-medium">{scheme.ministry}</span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md transition-transform duration-200 group-hover:scale-105 ${
                scheme.type === 'central' 
                  ? 'bg-[#174D38]/10 text-[#174D38] dark:text-emerald-300 border border-[#174D38]/30' 
                  : 'bg-[#4D1717]/10 text-[#4D1717] dark:text-[#f0a8a8] border border-[#4D1717]/30'
              }`}>
                {scheme.type === 'central'
                  ? (lang === 'hi' ? '🏛️ केंद्र सरकार' : '🏛️ Central Govt')
                  : (lang === 'hi' ? '📍 राज्य सरकार' : '📍 State Govt')
                }
              </span>
              {scheme.status && scheme.status !== 'open' && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                  scheme.status === 'closing_soon' ? 'bg-[#4D1717]/10 text-[#4D1717] dark:bg-red-950/60 dark:text-red-300 border border-[#4D1717]/30 animate-pulse' :
                  scheme.status === 'closed' ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' :
                  'bg-[#F2F2F2] text-[#1e2421] border border-[#CBCBCB]'
                }`}>
                  {scheme.status === 'closing_soon' ? (lang === 'hi' ? '⏳ जल्द बंद' : '⏳ Closing Soon') :
                   scheme.status === 'closed' ? (lang === 'hi' ? 'बंद' : 'Closed') :
                   scheme.status}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-[#1e2421]/80 dark:text-slate-300 text-sm leading-relaxed mb-3 line-clamp-2">{description}</p>

            {/* Benefits */}
            {benefits && (
              <div className="flex items-start gap-1.5 mb-3 bg-[#F2F2F2] dark:bg-[#141d18] px-3 py-1.5 rounded-lg border border-[#CBCBCB] dark:border-[#2a3830] w-fit transition-transform duration-200 group-hover:translate-x-1">
                <IndianRupee className="w-3.5 h-3.5 text-[#174D38] dark:text-emerald-400 flex-shrink-0 mt-0.5 animate-bounceSubtle" />
                <span className="text-sm font-semibold text-[#174D38] dark:text-emerald-300">{benefits}</span>
              </div>
            )}

            {/* Why this scheme (match details) */}
            {showRelevance && positiveMatches.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {positiveMatches.slice(0, 3).map((d, i) => (
                  <span key={i} className="text-xs text-[#174D38] dark:text-emerald-300 bg-[#174D38]/10 dark:bg-[#174D38]/20 border border-[#174D38]/30 px-2 py-0.5 rounded-md animate-scale-in" style={{ animationDelay: `${i * 80}ms` }}>
                    ✓ {d.reason}
                  </span>
                ))}
                {missingInfo.length > 0 && (
                  <span className="text-xs text-[#4D1717] dark:text-[#f0a8a8] bg-[#4D1717]/10 dark:bg-[#4D1717]/20 border border-[#4D1717]/30 px-2 py-0.5 rounded-md">
                    ⚠ {lang === 'hi' ? 'कुछ जानकारी नहीं दी' : 'Some info missing'}
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-[#CBCBCB]/60 dark:border-[#2a3830]">
              <Link to={`/schemes/${scheme.id}`}
                className="text-xs font-semibold text-[#174D38] dark:text-emerald-300 hover:text-white hover:bg-[#174D38] bg-[#174D38]/10 dark:bg-[#174D38]/20 border border-[#174D38]/30 px-3.5 py-1.5 rounded-lg transition-all duration-200 active:scale-95 shadow-2xs hover:shadow-xs group-hover:border-[#174D38]">
                {t.viewDetails} →
              </Link>
              {scheme.officialUrl && (
                <a href={scheme.officialUrl} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-medium text-[#1e2421] dark:text-slate-300 hover:text-[#174D38] dark:hover:text-white bg-[#F2F2F2] hover:bg-[#CBCBCB]/30 dark:bg-[#141d18] dark:hover:bg-[#1f2923] border border-[#CBCBCB] dark:border-[#2a3830] px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-95 flex items-center gap-1 shadow-2xs">
                  <ExternalLink className="w-3 h-3 text-[#174D38] dark:text-emerald-400" />
                  {t.officialWebsite}
                </a>
              )}
              <button onClick={handleSaveToggle}
                className={`ml-auto text-xs font-semibold px-3.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all duration-200 active:scale-90 cursor-pointer shadow-2xs hover:scale-105 ${
                  saved
                    ? 'bg-[#174D38] text-white border-[#174D38] hover:bg-[#113a2a] shadow-md shadow-[#174D38]/20'
                    : 'bg-white dark:bg-[#1a231e] text-[#1e2421] dark:text-slate-300 border-[#CBCBCB] dark:border-[#2a3830] hover:text-[#174D38] hover:bg-[#F2F2F2] dark:hover:bg-[#232f29]'
                }`}>
                {saved
                  ? <><BookmarkCheck className="w-3.5 h-3.5 text-emerald-300 animate-scale-in" /> {lang === 'hi' ? 'सहेजा गया' : 'Saved'}</>
                  : <><Bookmark className="w-3.5 h-3.5 text-[#174D38] dark:text-emerald-400 group-hover:scale-110 transition-transform" /> {lang === 'hi' ? 'सहेजें' : 'Save'}</>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
