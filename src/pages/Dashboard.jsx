import { Link } from 'react-router-dom'
import { User, Bookmark, Bell, Radar, ArrowRight, ChevronRight, Clock } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { useProfile } from '../context/ProfileContext'
import { matchSchemes } from '../utils/schemeMatcher'
import SchemeCard from '../components/SchemeCard'
import ProfileChips from '../components/ProfileChips'
import { useMemo } from 'react'

export default function Dashboard() {
  const { lang } = useLang()
  const { profile } = useProfile()

  const topMatches = useMemo(() => {
    if (!profile) return []
    return matchSchemes(profile, '', 'all', null).slice(0, 3)
  }, [profile])

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#111814] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-2xl p-8 shadow-sm">
          <div className="w-14 h-14 bg-[#F2F2F2] dark:bg-[#174D38]/20 border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl flex items-center justify-center mx-auto mb-4">
            <User className="w-7 h-7 text-[#174D38] dark:text-emerald-400" />
          </div>
          <h1 className="text-xl font-bold text-[#1e2421] dark:text-slate-100 mb-2">
            {lang === 'hi' ? 'अपना डैशबोर्ड देखें' : 'Create your profile to see your dashboard'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
            {lang === 'hi'
              ? 'अपनी प्रोफ़ाइल बनाएं और अपने लिए प्रासंगिक योजनाएं देखें।'
              : 'Once you describe your profile, your personalized dashboard will show matching schemes, deadlines, and scheme radar alerts.'
            }
          </p>
          <Link to="/find-schemes" className="btn-primary inline-flex mx-auto">
            {lang === 'hi' ? 'प्रोफ़ाइल बनाएं' : 'Create My Profile'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#111814]">
      <div className="bg-white dark:bg-[#1a231e] border-b border-[#CBCBCB] dark:border-[#2a3830] py-6 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-[#174D38] dark:text-emerald-400 uppercase tracking-wider font-semibold mb-1">
              {lang === 'hi' ? 'आपका डैशबोर्ड' : 'Your Dashboard'}
            </p>
            <h1 className="text-xl font-bold text-[#1e2421] dark:text-slate-100">
              {lang === 'hi' ? 'नमस्ते 👋' : 'Welcome back 👋'}
            </h1>
          </div>
          <Link to="/find-schemes" className="text-sm text-[#174D38] dark:text-emerald-400 hover:underline font-semibold">
            {lang === 'hi' ? 'प्रोफ़ाइल अपडेट करें' : 'Update Profile'} →
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Profile summary */}
        <section className="bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1e2421] dark:text-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-[#174D38]" />
              {lang === 'hi' ? 'आपकी प्रोफ़ाइल' : 'Your Profile'}
            </h2>
            <Link to="/profile" className="text-xs text-[#174D38] dark:text-emerald-400 hover:underline flex items-center gap-0.5 font-medium">
              {lang === 'hi' ? 'देखें' : 'View'} <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ProfileChips profile={profile} />
        </section>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: ArrowRight, label: lang === 'hi' ? 'मिलती योजनाएं' : 'Matching Schemes', value: matchSchemes(profile).filter(s => s.relevance !== 'neutral').length, color: 'text-[#174D38] dark:text-emerald-400', bg: 'bg-[#F2F2F2] dark:bg-[#1a231e]' },
            { icon: Bookmark, label: lang === 'hi' ? 'सहेजी गई' : 'Saved', value: 0, color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50/60 dark:bg-emerald-950/20' },
            { icon: Bell, label: lang === 'hi' ? 'अलर्ट' : 'Alerts', value: 0, color: 'text-[#4D1717] dark:text-amber-200', bg: 'bg-[#4D1717]/5 dark:bg-[#4D1717]/10' },
            { icon: Clock, label: lang === 'hi' ? 'डेडलाइन' : 'Deadlines', value: 0, color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-50/60 dark:bg-rose-950/20' },
          ].map(stat => {
            return (
              <div key={stat.label} className={`${stat.bg} border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-4 text-center shadow-sm`}>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{stat.label}</p>
              </div>
            )
          })}
        </div>

        {/* Top matches */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-[#1e2421] dark:text-slate-100">{lang === 'hi' ? 'शीर्ष मिलती योजनाएं' : 'Top Matching Schemes'}</h2>
            <Link to="/results" className="text-sm text-[#174D38] dark:text-emerald-400 hover:underline font-semibold">
              {lang === 'hi' ? 'सभी देखें' : 'View all'} →
            </Link>
          </div>
          {topMatches.length > 0 ? (
            <div className="space-y-3">
              {topMatches.map(s => <SchemeCard key={s.id} scheme={s} showRelevance />)}
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-8 text-center shadow-sm">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {lang === 'hi' ? 'अधिक जानकारी जोड़ें ताकि हम बेहतर मिलान कर सकें।' : 'Add more profile details for better matching.'}
              </p>
              <Link to="/find-schemes" className="text-sm text-[#174D38] dark:text-emerald-400 mt-2 inline-block font-semibold hover:underline">
                {lang === 'hi' ? 'प्रोफ़ाइल अपडेट करें' : 'Update profile'}
              </Link>
            </div>
          )}
        </section>

        {/* Scheme Radar placeholder */}
        <section className="bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Radar className="w-4 h-4 text-[#174D38]" />
            <h2 className="font-bold text-[#1e2421] dark:text-slate-100">Scheme Radar</h2>
            <span className="text-xs bg-[#F2F2F2] dark:bg-[#174D38]/20 text-[#174D38] dark:text-emerald-300 border border-[#CBCBCB] dark:border-[#2a3830] px-2.5 py-0.5 rounded-full font-medium ml-auto">
              Coming Soon
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            {lang === 'hi'
              ? 'Scheme Radar नई योजनाओं, खुलने वाले आवेदन, आसन्न समय-सीमाएं और पात्रता परिवर्तनों के बारे में आपको सूचित करेगा।'
              : 'Scheme Radar will notify you about new relevant schemes, application openings, approaching deadlines, and eligibility changes — automatically.'
            }
          </p>
          <div className="mt-3 grid sm:grid-cols-2 gap-2">
            {['New scheme for your profile', 'Application opening soon', 'Deadline approaching', 'Eligibility criteria changed'].map(item => (
              <div key={item} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-[#F2F2F2] dark:bg-[#111814] border border-[#CBCBCB]/60 dark:border-[#2a3830] rounded-lg px-3 py-2">
                <span className="w-1.5 h-1.5 bg-[#174D38] rounded-full" />
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
