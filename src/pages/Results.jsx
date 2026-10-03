import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { useProfile } from '../context/ProfileContext'
import { matchSchemes } from '../utils/schemeMatcher'
import { CATEGORIES } from '../data/schemes'
import SchemeCard from '../components/SchemeCard'
import FilterBar from '../components/FilterBar'
import AnimatedCounter from '../components/AnimatedCounter'
import DiscoveryStepper from '../components/DiscoveryStepper'

function buildProfileSummary(profile) {
  if (!profile) return null
  const parts = []
  if (profile.age) parts.push(`Age ${profile.age}`)
  if (profile.occupation) parts.push(profile.occupation.charAt(0).toUpperCase() + profile.occupation.slice(1))
  if (profile.state) parts.push(profile.state)
  if (profile.category) parts.push(profile.category)
  if (profile.income) parts.push(profile.income)
  return parts.join(' · ')
}

export default function Results() {
  const { t, lang } = useLang()
  const { profile, clearProfile } = useProfile()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeType, setActiveType] = useState('all')
  const [activeCategory, setActiveCategory] = useState(null)
  const [visibleCount, setVisibleCount] = useState(8)

  const allMatched = useMemo(() =>
    matchSchemes(profile, searchQuery, activeType, activeCategory),
    [profile, searchQuery, activeType, activeCategory]
  )

  const visibleSchemes = allMatched.slice(0, visibleCount)
  const profileSummary = buildProfileSummary(profile)

  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#111814] text-[#1e2421] dark:text-[#f3f5f4] transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ── DISCOVERY STEPPER BAR (STEP 3 COMPLETED) ── */}
        <div className="mb-8">
          <DiscoveryStepper
            currentStep={3}
            isStep1Done={true}
            isStep2Done={!!profile}
            isStep3Done={true}
          />
        </div>

        {/* Header */}
        <div className="mb-6">
          <p className="text-xs text-[#174D38] dark:text-emerald-400 uppercase tracking-wider font-semibold mb-1">
            {lang === 'hi' ? 'आपके परिणाम' : 'Your Results'}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1e2421] dark:text-white flex items-center gap-2">
                <span className="text-[#174D38] dark:text-emerald-400">
                  <AnimatedCounter value={allMatched.length} />
                </span>
                <span>{t.schemesFound}</span>
              </h1>
              {profileSummary && (
                <p className="text-sm text-[#1e2421]/70 dark:text-slate-400 mt-0.5">{t.basedOnProfile}</p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link to="/find-schemes" className="text-sm text-[#174D38] dark:text-emerald-400 hover:underline font-semibold">
                {t.editProfileLink} →
              </Link>
              {profile && (
                <button
                  onClick={clearProfile}
                  className="text-xs text-[#1e2421]/70 dark:text-slate-400 hover:text-[#4D1717] dark:hover:text-white border border-[#CBCBCB] dark:border-[#2a3830] px-2.5 py-1.5 rounded-lg transition-colors bg-white/70 dark:bg-transparent"
                >
                  Clear profile
                </button>
              )}
            </div>
          </div>

          {/* Profile summary bar */}
          {profileSummary && (
            <div className="mt-3 bg-[#F2F2F2] dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 shadow-xs">
              <p className="text-sm text-[#1e2421] dark:text-slate-200 font-medium truncate">{profileSummary}</p>
              <Link to="/find-schemes" className="text-xs text-[#174D38] dark:text-emerald-400 hover:underline flex-shrink-0 font-semibold">
                {t.editProfileLink}
              </Link>
            </div>
          )}

          {!profile && (
            <div className="mt-3 bg-[#F2F2F2] dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl px-4 py-3 shadow-xs">
              <p className="text-sm text-[#1e2421] dark:text-slate-300">
                {t.basedOnProfile}{' '}
                <Link to="/find-schemes" className="font-semibold text-[#174D38] dark:text-emerald-400 underline">
                  {t.findSchemes}
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Search + Filters */}
        <div className="bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-4.5 mb-5 space-y-4 shadow-xs">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#174D38] dark:text-emerald-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-[#F2F2F2] dark:bg-[#141d18] border border-[#CBCBCB] dark:border-[#2a3830] text-[#1e2421] dark:text-slate-100 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#174D38] focus:border-transparent transition-colors"
            />
          </div>

          {/* Filters */}
          <FilterBar
            activeType={activeType}
            onTypeChange={setActiveType}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            categories={CATEGORIES}
          />
        </div>

        {/* Results */}
        {visibleSchemes.length === 0 ? (
          <div className="bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-12 text-center shadow-xs">
            <p className="text-[#1e2421]/70 dark:text-slate-400">{t.noResults}</p>
            <button onClick={() => { setSearchQuery(''); setActiveType('all'); setActiveCategory(null) }} className="mt-3 text-sm text-[#174D38] dark:text-emerald-400 hover:underline font-semibold">
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {visibleSchemes.map((scheme, idx) => (
                <div
                  key={scheme.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${Math.min(idx, 7) * 70}ms` }}
                >
                  <SchemeCard
                    scheme={scheme}
                    showRelevance={!!profile}
                  />
                </div>
              ))}
            </div>

            {visibleCount < allMatched.length && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setVisibleCount(c => c + 8)}
                  className="btn-secondary text-sm px-8"
                >
                  {t.loadMore}
                </button>
              </div>
            )}
          </>
        )}

        {/* Disclaimer */}
        <div className="mt-8 bg-white dark:bg-[#202226] border border-[#CBCBCB] dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-[#4A4A4A]/70 dark:text-slate-400 leading-relaxed">{t.disclaimer}</p>
        </div>
      </div>
    </div>
  )
}
