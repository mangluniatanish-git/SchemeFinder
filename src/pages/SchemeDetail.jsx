import { useParams, Link } from 'react-router-dom'
import { ExternalLink, ArrowLeft, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { useProfile } from '../context/ProfileContext'
import { getSchemeById } from '../data/schemes'

function ProfileMatchRow({ icon: Icon, matched, note }) {
  const color = matched === true 
    ? 'text-[#4A4A4A] dark:text-slate-200' 
    : matched === false 
      ? 'text-red-700 dark:text-red-400' 
      : 'text-[#6D8196] dark:text-[#9bb0c3]'
  const bg = matched === true 
    ? 'bg-[#FFFFE3] dark:bg-[#25282d] border border-[#CBCBCB] dark:border-slate-700' 
    : matched === false 
      ? 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800' 
      : 'bg-[#6D8196]/10 dark:bg-[#6D8196]/20 border border-[#6D8196]/30'
  const MatchIcon = matched === true ? CheckCircle2 : AlertCircle
  return (
    <div className={`flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg ${bg}`}>
      <MatchIcon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${matched === true ? 'text-[#6D8196]' : color}`} />
      <p className={`text-sm ${color}`}>{note}</p>
    </div>
  )
}

export default function SchemeDetail() {
  const { id } = useParams()
  const { t, lang } = useLang()
  const { profile } = useProfile()

  const scheme = getSchemeById(id)

  if (!scheme) {
    return (
      <div className="min-h-screen bg-[#FFFFE3]/50 dark:bg-[#1a1c1e] text-[#4A4A4A] dark:text-slate-100 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-[#4A4A4A]/70 dark:text-slate-400 mb-4">{lang === 'hi' ? 'योजना नहीं मिली।' : 'Scheme not found.'}</p>
          <Link to="/schemes" className="btn-primary inline-flex">
            {lang === 'hi' ? 'सभी योजनाएं देखें' : 'Browse All Schemes'}
          </Link>
        </div>
      </div>
    )
  }

  const name = lang === 'hi' && scheme.nameHi ? scheme.nameHi : scheme.name
  const description = lang === 'hi' && scheme.descriptionHi ? scheme.descriptionHi : scheme.description
  const benefits = lang === 'hi' && scheme.benefitsHi ? scheme.benefitsHi : scheme.benefits

  // Build profile match details for this scheme
  const profileMatchDetails = []
  if (profile && scheme.eligibility) {
    const el = scheme.eligibility
    if (profile.age && (el.minAge || el.maxAge)) {
      const inRange = (!el.minAge || profile.age >= el.minAge) && (!el.maxAge || profile.age <= el.maxAge)
      profileMatchDetails.push({
        matched: inRange,
        note: inRange
          ? `Age ${profile.age} qualifies (${el.minAge || 0}–${el.maxAge || 'no limit'} years)`
          : `Age ${profile.age} does not qualify (required: ${el.minAge || 0}–${el.maxAge || 'no limit'} years)`,
      })
    }
    if (profile.incomeValue && el.maxIncomeLakh) {
      const qualifies = profile.incomeValue <= el.maxIncomeLakh
      profileMatchDetails.push({
        matched: qualifies,
        note: qualifies
          ? `Family income is within ₹${el.maxIncomeLakh} lakh/year limit`
          : `Income exceeds scheme limit of ₹${el.maxIncomeLakh} lakh/year`,
      })
    }
    if (profile.category && el.category && el.category.length > 0) {
      const matchesCategory = el.category.includes(profile.category)
      profileMatchDetails.push({
        matched: matchesCategory,
        note: matchesCategory
          ? `Category ${profile.category.toUpperCase()} is eligible`
          : `Reserved for: ${el.category.map(c => c.toUpperCase()).join(', ')}`,
      })
    }
    if (profile.occupation && el.occupation && el.occupation.length > 0) {
      const matchesOcc = el.occupation.includes(profile.occupation)
      profileMatchDetails.push({
        matched: matchesOcc,
        note: matchesOcc
          ? `Occupation (${profile.occupation}) matches`
          : `Scheme targeted at: ${el.occupation.join(', ')}`,
      })
    }
    if (profile.gender && el.gender) {
      const matchesGender = el.gender === 'all' || profile.gender.toLowerCase() === el.gender.toLowerCase()
      profileMatchDetails.push({
        matched: matchesGender,
        note: matchesGender ? 'Gender eligibility matches' : `Scheme is for: ${el.gender}`,
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#111814] text-[#1e2421] dark:text-[#f3f5f4] transition-colors duration-200">
      {/* Top back bar */}
      <div className="bg-white dark:bg-[#1a231e] border-b border-[#CBCBCB] dark:border-[#2a3830] py-4 px-4 transition-colors duration-200">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/schemes" className="inline-flex items-center gap-1.5 text-sm text-[#1e2421] dark:text-slate-300 hover:text-[#174D38] dark:hover:text-emerald-400 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4 text-[#174D38] dark:text-emerald-400" />
            {lang === 'hi' ? 'सभी योजनाएं' : 'All Schemes'}
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">

            {/* Header card */}
            <div className="bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-6 shadow-xs">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${
                  scheme.type === 'central' 
                    ? 'bg-[#174D38]/10 text-[#174D38] dark:text-emerald-300 border border-[#174D38]/30' 
                    : 'bg-[#4D1717]/10 text-[#4D1717] dark:text-amber-200 border border-[#4D1717]/30'
                }`}>
                  {scheme.type === 'central' ? t.centralGovt : t.stateGovt}
                </span>
                {scheme.categories.slice(0, 2).map(cat => (
                  <span key={cat} className="text-xs font-medium px-2.5 py-1 rounded-md bg-[#F2F2F2] dark:bg-[#141d18] text-[#1e2421] dark:text-slate-300 border border-[#CBCBCB] dark:border-[#2a3830] capitalize">{cat.replace('-', ' ')}</span>
                ))}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1e2421] dark:text-white mb-2">{name}</h1>
              <p className="text-sm text-[#1e2421]/70 dark:text-slate-400 mb-4">{scheme.ministry}</p>
              <p className="text-[#1e2421]/80 dark:text-slate-300 leading-relaxed">{description}</p>
            </div>

            {/* Benefits */}
            <div className="bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-6 shadow-xs">
              <h2 className="font-bold text-[#1e2421] dark:text-white text-base mb-3">{t.benefits}</h2>
              <div className="flex items-start gap-2 bg-[#F2F2F2] dark:bg-[#141d18] border border-[#CBCBCB] dark:border-[#2a3830] rounded-lg p-3.5">
                <span className="text-[#174D38] dark:text-emerald-400 font-bold text-lg">₹</span>
                <p className="text-[#1e2421] dark:text-slate-200 font-medium">{benefits}</p>
              </div>
            </div>

            {/* Eligibility */}
            {scheme.eligibility && (
              <div className="bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-6 shadow-xs">
                <h2 className="font-bold text-[#1e2421] dark:text-white text-base mb-4">{t.eligibility}</h2>
                <div className="space-y-2.5 text-sm text-[#1e2421] dark:text-slate-300">
                  {scheme.eligibility.minAge && (
                    <div className="flex gap-2"><span className="text-[#1e2421]/60 dark:text-slate-400 w-32 flex-shrink-0">Min Age:</span><span>{scheme.eligibility.minAge} years</span></div>
                  )}
                  {scheme.eligibility.maxAge && (
                    <div className="flex gap-2"><span className="text-[#1e2421]/60 dark:text-slate-400 w-32 flex-shrink-0">Max Age:</span><span>{scheme.eligibility.maxAge} years</span></div>
                  )}
                  {scheme.eligibility.occupation && (
                    <div className="flex gap-2"><span className="text-[#1e2421]/60 dark:text-slate-400 w-32 flex-shrink-0">Occupation:</span><span className="capitalize">{scheme.eligibility.occupation.join(', ')}</span></div>
                  )}
                  {scheme.eligibility.maxIncomeLakh && (
                    <div className="flex gap-2"><span className="text-[#1e2421]/60 dark:text-slate-400 w-32 flex-shrink-0">Max Income:</span><span>₹{scheme.eligibility.maxIncomeLakh} lakh/year</span></div>
                  )}
                  {scheme.eligibility.category && (
                    <div className="flex gap-2"><span className="text-[#1e2421]/60 dark:text-slate-400 w-32 flex-shrink-0">Category:</span><span>{scheme.eligibility.category.join(', ')}</span></div>
                  )}
                  {scheme.eligibility.gender && (
                    <div className="flex gap-2"><span className="text-[#1e2421]/60 dark:text-slate-400 w-32 flex-shrink-0">Gender:</span><span className="capitalize">{scheme.eligibility.gender}</span></div>
                  )}
                  {scheme.eligibility.states && (
                    <div className="flex gap-2"><span className="text-[#1e2421]/60 dark:text-slate-400 w-32 flex-shrink-0">States:</span><span>{scheme.eligibility.states.join(', ')}</span></div>
                  )}
                  {scheme.eligibility.notes && (
                    <div className="mt-3 flex items-start gap-2 bg-[#F2F2F2] dark:bg-[#141d18] border border-[#CBCBCB] dark:border-[#2a3830] rounded-lg p-3">
                      <Info className="w-4 h-4 text-[#174D38] dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      <p className="text-[#1e2421]/80 dark:text-slate-300 text-xs">{scheme.eligibility.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile match */}
            {profile && profileMatchDetails.length > 0 && (
              <div className="bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-6 shadow-xs">
                <h2 className="font-bold text-[#1e2421] dark:text-white text-base mb-1">{t.yourProfileMatch}</h2>
                <p className="text-xs text-[#1e2421]/60 dark:text-slate-400 mb-4">{t.matchNote}</p>
                <div className="space-y-2">
                  {profileMatchDetails.map((d, i) => (
                    <ProfileMatchRow key={i} matched={d.matched} note={d.note} />
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-[#F2F2F2] dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-4 shadow-xs">
              <p className="text-xs text-[#1e2421]/80 dark:text-slate-400 leading-relaxed">{t.disclaimer}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Official source card */}
            <div className="bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-5 shadow-xs">
              <h3 className="font-semibold text-[#1e2421] dark:text-white text-sm mb-4">{t.officialSource}</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#1e2421]/60 dark:text-slate-400 mb-0.5">{lang === 'hi' ? 'मंत्रालय' : 'Ministry'}</p>
                  <p className="text-sm text-[#1e2421] dark:text-slate-200 font-medium">{scheme.ministry}</p>
                </div>
                {scheme.department && (
                  <div>
                    <p className="text-xs text-[#1e2421]/60 dark:text-slate-400 mb-0.5">{lang === 'hi' ? 'विभाग' : 'Department'}</p>
                    <p className="text-sm text-[#1e2421]/80 dark:text-slate-300">{scheme.department}</p>
                  </div>
                )}
                {scheme.lastUpdated && (
                  <div>
                    <p className="text-xs text-[#1e2421]/60 dark:text-slate-400 mb-0.5">{t.lastVerified}</p>
                    <p className="text-sm text-[#1e2421]/80 dark:text-slate-300">{scheme.lastUpdated}</p>
                  </div>
                )}
                {scheme.sourceVerified && (
                  <div className="flex items-center gap-1.5 text-[#174D38] dark:text-emerald-400 bg-[#174D38]/10 border border-[#174D38]/30 rounded-lg px-2.5 py-1.5 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {lang === 'hi' ? 'सत्यापित आधिकारिक स्रोत' : 'Verified official source'}
                  </div>
                )}
              </div>

              <div className="mt-5 space-y-2">
                {scheme.officialUrl && (
                  <a
                    href={scheme.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#1e2421] dark:text-slate-200 bg-[#F2F2F2] hover:bg-[#CBCBCB]/30 dark:bg-[#141d18] dark:hover:bg-[#1f2923] border border-[#CBCBCB] dark:border-[#2a3830] px-4 py-2.5 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-[#174D38] dark:text-emerald-400" />
                    {t.viewOfficialSource}
                  </a>
                )}
                {scheme.applyUrl && (
                  <a
                    href={scheme.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold text-white bg-[#174D38] hover:bg-[#113a2a] px-4 py-2.5 rounded-lg transition-colors shadow-xs"
                  >
                    {t.applyOnWebsite}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Tags */}
            {scheme.tags && scheme.tags.length > 0 && (
              <div className="bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-5 shadow-xs">
                <h3 className="font-semibold text-[#1e2421] dark:text-white text-sm mb-3">{lang === 'hi' ? 'टैग' : 'Tags'}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {scheme.tags.map(tag => (
                    <span key={tag} className="text-xs text-[#1e2421] dark:text-slate-300 bg-[#F2F2F2] dark:bg-[#141d18] border border-[#CBCBCB] dark:border-[#2a3830] px-2.5 py-1 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
