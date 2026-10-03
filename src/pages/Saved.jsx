import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Trash2, ExternalLink, Search, ArrowRight } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { getSchemeById } from '../data/schemes'

const STORAGE_KEY = 'sf_saved_schemes'

export function getSavedSchemes() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch { return [] }
}

export function saveScheme(schemeId) {
  const current = getSavedSchemes()
  if (!current.includes(schemeId)) {
    const updated = [...current, schemeId]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }
}

export function unsaveScheme(schemeId) {
  const current = getSavedSchemes()
  const updated = current.filter(id => id !== schemeId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function isSchemesSaved(schemeId) {
  return getSavedSchemes().includes(schemeId)
}

export default function Saved() {
  const { lang, t } = useLang()
  const [savedIds, setSavedIds] = useState(getSavedSchemes())
  const [search, setSearch] = useState('')

  const savedSchemes = savedIds.map(id => getSchemeById(id)).filter(Boolean)
  const filtered = search.trim()
    ? savedSchemes.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.ministry.toLowerCase().includes(search.toLowerCase())
      )
    : savedSchemes

  function handleUnsave(id) {
    unsaveScheme(id)
    setSavedIds(getSavedSchemes())
  }

  if (savedSchemes.length === 0) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#111814] flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-14 h-14 bg-white dark:bg-[#16201a] border border-[#CBCBCB] dark:border-[#2a382e] rounded-xl flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-7 h-7 text-[#174D38] dark:text-[#a7d7c5]" />
          </div>
          <h1 className="text-xl font-bold text-[#1e2421] dark:text-[#f3f5f4] mb-2">
            {lang === 'hi' ? 'कोई सहेजी गई योजना नहीं' : 'No Saved Schemes'}
          </h1>
          <p className="text-[#5c6861] dark:text-[#9eada5] text-sm mb-6">
            {lang === 'hi'
              ? 'जब आप कोई योजना सहेजते हैं तो वह यहां दिखाई देगी।'
              : "You haven't saved any schemes yet. Browse schemes and click \"Save\" to add them here."
            }
          </p>
          <Link to="/schemes" className="btn-primary inline-flex mx-auto">
            {lang === 'hi' ? 'योजनाएं देखें' : 'Browse Schemes'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#111814]">
      <div className="bg-white dark:bg-[#16201a] border-b border-[#CBCBCB] dark:border-[#2a382e] py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-[#174D38] dark:text-[#a7d7c5] uppercase tracking-wider font-semibold mb-1">
            {lang === 'hi' ? 'सहेजी गई योजनाएं' : 'Saved Schemes'}
          </p>
          <h1 className="text-xl font-bold text-[#1e2421] dark:text-[#f3f5f4]">
            {savedSchemes.length} {lang === 'hi' ? 'सहेजी गई' : 'Saved'}
          </h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5c6861] dark:text-[#9eada5]" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder={lang === 'hi' ? 'सहेजी गई योजनाएं खोजें...' : 'Search saved schemes...'}
            className="w-full bg-white dark:bg-[#16201a] border border-[#CBCBCB] dark:border-[#2a382e] text-[#1e2421] dark:text-[#f3f5f4] rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#174D38]"
          />
        </div>
        <div className="space-y-3">
          {filtered.map(scheme => {
            const name = lang === 'hi' && scheme.nameHi ? scheme.nameHi : scheme.name
            const desc = lang === 'hi' && scheme.descriptionHi ? scheme.descriptionHi : scheme.description
            return (
              <div key={scheme.id} className="bg-white dark:bg-[#16201a] border border-[#CBCBCB] dark:border-[#2a382e] rounded-xl p-5 flex flex-col sm:flex-row gap-4 shadow-xs">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start gap-2 mb-1">
                    <h3 className="font-semibold text-[#1e2421] dark:text-[#f3f5f4] text-sm">{name}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${scheme.type === 'central' ? 'bg-[#174D38]/10 text-[#174D38] dark:bg-[#174D38]/30 dark:text-[#a7d7c5]' : 'bg-[#4D1717]/10 text-[#4D1717] dark:bg-[#4D1717]/30 dark:text-[#f0a8a8]'}`}>
                      {scheme.type === 'central' ? (lang === 'hi' ? 'केंद्र' : 'Central') : (lang === 'hi' ? 'राज्य' : 'State')}
                    </span>
                  </div>
                  <p className="text-xs text-[#5c6861] dark:text-[#9eada5] mb-2">{scheme.ministry}</p>
                  <p className="text-sm text-[#5c6861] dark:text-[#9eada5] line-clamp-2">{desc}</p>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
                  <Link to={`/schemes/${scheme.id}`} className="text-xs font-semibold text-[#174D38] dark:text-[#a7d7c5] bg-[#F2F2F2] dark:bg-[#111814] border border-[#CBCBCB] dark:border-[#2a382e] hover:border-[#174D38] px-3 py-1.5 rounded-lg transition-colors">
                    {lang === 'hi' ? 'विवरण' : 'View Details'}
                  </Link>
                  {scheme.officialUrl && (
                    <a href={scheme.officialUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-[#5c6861] dark:text-[#9eada5] hover:text-[#1e2421] dark:hover:text-white flex items-center gap-1 border border-[#CBCBCB] dark:border-[#2a382e] px-3 py-1.5 rounded-lg transition-colors">
                      <ExternalLink className="w-3 h-3" />
                      {lang === 'hi' ? 'आधिकारिक' : 'Official'}
                    </a>
                  )}
                  <button onClick={() => handleUnsave(scheme.id)}
                    className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 flex items-center gap-1 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                    {lang === 'hi' ? 'हटाएं' : 'Remove'}
                  </button>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <p className="text-center text-[#5c6861] dark:text-[#9eada5] py-8 text-sm">
              {lang === 'hi' ? 'कोई परिणाम नहीं मिला।' : 'No saved schemes match your search.'}
            </p>
          )}
        </div>
        <p className="text-xs text-[#5c6861] dark:text-[#9eada5] mt-6 text-center">
          {lang === 'hi'
            ? 'सहेजी गई योजनाएं इस डिवाइस पर संग्रहीत हैं। ब्राउज़र डेटा साफ़ करने पर हट जाएंगी।'
            : 'Saved schemes are stored locally on this device. They will be removed if you clear browser data.'
          }
        </p>
      </div>
    </div>
  )
}
