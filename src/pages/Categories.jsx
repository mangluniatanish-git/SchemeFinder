import { Link } from 'react-router-dom'
import {
  BookOpen, Heart, Home, Leaf, IndianRupee, Briefcase,
  GraduationCap, Users, Baby, Wrench, Factory, Accessibility,
  ChevronRight,
} from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { CATEGORIES } from '../data/schemes'

const ICON_MAP = {
  BookOpen, Heart, Home, Leaf, IndianRupee, Briefcase,
  GraduationCap, Users, Baby, Wrench, Factory, Accessibility,
}

export default function Categories() {
  const { t, lang } = useLang()

  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#111814]">
      {/* Page header */}
      <div className="bg-white dark:bg-[#1a231e] border-b border-[#CBCBCB] dark:border-[#2a3830] py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-[#174D38] dark:text-emerald-400 uppercase tracking-wider font-semibold mb-1">
            {lang === 'hi' ? 'सभी श्रेणियाँ' : 'All Categories'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1e2421] dark:text-slate-100 mb-2">{t.categoriesTitle}</h1>
          <p className="text-slate-600 dark:text-slate-400 text-base">{t.categoriesSubtitle}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map(cat => {
            const Icon = ICON_MAP[cat.icon] || BookOpen
            return (
              <Link
                key={cat.id}
                to={`/schemes?category=${cat.id}`}
                className="group bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-5 hover:shadow-md hover:border-[#174D38] dark:hover:border-emerald-600 transition-all duration-150 flex items-center gap-4"
              >
                <div className={`w-12 h-12 ${cat.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${cat.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1e2421] dark:text-slate-200 text-sm group-hover:text-[#174D38] dark:group-hover:text-emerald-400 transition-colors">
                    {lang === 'hi' ? cat.labelHi : cat.label}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'hi' ? 'योजनाएं देखें' : 'View schemes'}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#CBCBCB] group-hover:text-[#174D38] flex-shrink-0 transition-colors" />
              </Link>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 bg-[#F2F2F2] dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <p className="font-semibold text-[#1e2421] dark:text-slate-100 mb-1">
              {lang === 'hi' ? 'नहीं पता कहाँ से शुरू करें?' : 'Not sure where to start?'}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {lang === 'hi'
                ? 'अपनी प्रोफ़ाइल बताएं और हम आपके लिए सही योजनाएं खोजेंगे।'
                : 'Tell us your profile and we\'ll find the right schemes for you.'
              }
            </p>
          </div>
          <Link to="/find-schemes" className="btn-primary text-sm flex-shrink-0">
            {t.findSchemesBtn}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
