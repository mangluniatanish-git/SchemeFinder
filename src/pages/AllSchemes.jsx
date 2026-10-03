import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { schemes, CATEGORIES } from '../data/schemes'
import SchemeCard from '../components/SchemeCard'
import FilterBar from '../components/FilterBar'

const INDIAN_STATES = [
  'All States', 'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
]

export default function AllSchemes() {
  const { t, lang } = useLang()
  const [searchParams] = useSearchParams()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeType, setActiveType] = useState('all')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || null)
  const [selectedState, setSelectedState] = useState('All States')
  const [visibleCount, setVisibleCount] = useState(10)

  // Sync category from URL param
  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setActiveCategory(cat)
  }, [searchParams])

  const filtered = useMemo(() => {
    let result = [...schemes]

    if (activeType === 'central') result = result.filter(s => s.type === 'central')
    if (activeType === 'state') result = result.filter(s => s.type === 'state')

    if (activeCategory) result = result.filter(s => s.categories.includes(activeCategory))

    if (activeType === 'state' && selectedState !== 'All States') {
      result = result.filter(s => s.state === selectedState)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.ministry.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q)) ||
        s.keywords.some(k => k.toLowerCase().includes(q))
      )
    }

    return result
  }, [activeType, activeCategory, selectedState, searchQuery])

  const visible = filtered.slice(0, visibleCount)

  const activeCategoryLabel = activeCategory
    ? (CATEGORIES.find(c => c.id === activeCategory)?.[lang === 'hi' ? 'labelHi' : 'label'] || activeCategory)
    : null

  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#111814]">
      {/* Page header */}
      <div className="bg-white dark:bg-[#1a231e] border-b border-[#CBCBCB] dark:border-[#2a3830] py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-[#174D38] dark:text-emerald-400 uppercase tracking-wider font-semibold mb-1">
            {lang === 'hi' ? 'सभी योजनाएं' : 'All Schemes'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1e2421] dark:text-slate-100 mb-1">
            {activeCategoryLabel
              ? (lang === 'hi' ? `${activeCategoryLabel} योजनाएं` : `${activeCategoryLabel} Schemes`)
              : (lang === 'hi' ? 'सभी सरकारी योजनाएं' : 'All Government Schemes')
            }
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {filtered.length} {lang === 'hi' ? 'योजनाएं उपलब्ध' : 'schemes available'}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar filters */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-4 space-y-5 sticky top-20 shadow-sm">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  {lang === 'hi' ? 'प्रकार' : 'Type'}
                </p>
                <div className="space-y-1">
                  {[
                    { id: 'all', label: t.all },
                    { id: 'central', label: t.centralGovt },
                    { id: 'state', label: t.stateGovt },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setActiveType(f.id)}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                        activeType === f.id
                          ? 'bg-[#174D38] text-white font-semibold'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-[#F2F2F2] dark:hover:bg-[#232f29]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeType === 'state' && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    {lang === 'hi' ? 'राज्य' : 'State'}
                  </p>
                  <select
                    value={selectedState}
                    onChange={e => setSelectedState(e.target.value)}
                    className="w-full text-sm bg-white dark:bg-[#141d18] text-[#1e2421] dark:text-slate-100 border border-[#CBCBCB] dark:border-[#2a3830] rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#174D38]"
                  >
                    {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  {lang === 'hi' ? 'श्रेणी' : 'Category'}
                </p>
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveCategory(null)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                      !activeCategory ? 'bg-[#4D1717] text-[#F2F2F2] font-semibold' : 'text-slate-600 dark:text-slate-300 hover:bg-[#F2F2F2] dark:hover:bg-[#232f29]'
                    }`}
                  >
                    {t.all}
                  </button>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                        activeCategory === cat.id ? 'bg-[#4D1717] text-[#F2F2F2] font-semibold' : 'text-slate-600 dark:text-slate-300 hover:bg-[#F2F2F2] dark:hover:bg-[#232f29]'
                      }`}
                    >
                      {lang === 'hi' ? cat.labelHi : cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Search */}
            <div className="relative mb-5">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#174D38] dark:text-emerald-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] text-[#1e2421] dark:text-slate-100 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#174D38] shadow-sm"
              />
            </div>

            {/* Results */}
            {visible.length === 0 ? (
              <div className="bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-10 text-center shadow-sm">
                <p className="text-slate-500 dark:text-slate-400">{t.noResults}</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveType('all'); setActiveCategory(null) }}
                  className="mt-3 text-sm text-[#174D38] dark:text-emerald-400 font-semibold hover:underline"
                >
                  {lang === 'hi' ? 'फ़िल्टर साफ करें' : 'Clear filters'}
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {visible.map(scheme => (
                    <SchemeCard key={scheme.id} scheme={scheme} showRelevance={false} />
                  ))}
                </div>
                {visibleCount < filtered.length && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setVisibleCount(c => c + 10)}
                      className="btn-secondary text-sm px-8"
                    >
                      {t.loadMore}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
