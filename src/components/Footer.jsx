import { Link } from 'react-router-dom'
import { Compass, ExternalLink } from 'lucide-react'
import { useLang } from '../context/LanguageContext'

export default function Footer() {
  const { lang } = useLang()

  const cols = [
    {
      heading: lang === 'hi' ? 'मुख्य' : 'Platform',
      links: [
        { to: '/', label: lang === 'hi' ? 'होम' : 'Home' },
        { to: '/find-schemes', label: lang === 'hi' ? 'योजनाएं खोजें' : 'Find Schemes' },
        { to: '/schemes', label: lang === 'hi' ? 'सभी योजनाएं' : 'All Schemes' },
        { to: '/categories', label: lang === 'hi' ? 'श्रेणियाँ' : 'Categories' },
        { to: '/saved', label: lang === 'hi' ? 'सहेजी गई' : 'Saved Schemes' },
        { to: '/dashboard', label: lang === 'hi' ? 'डैशबोर्ड' : 'Dashboard' },
      ]
    },
    {
      heading: lang === 'hi' ? 'जानकारी' : 'Learn',
      links: [
        { to: '/how-it-works', label: lang === 'hi' ? 'यह कैसे काम करता है' : 'How It Works' },
        { to: '/faq', label: lang === 'hi' ? 'FAQ' : 'FAQ' },
        { to: '/about', label: lang === 'hi' ? 'हमारे बारे में' : 'About' },
        { to: '/contact', label: lang === 'hi' ? 'संपर्क करें' : 'Contact' },
      ]
    },
    {
      heading: lang === 'hi' ? 'कानूनी' : 'Legal',
      links: [
        { to: '/privacy', label: lang === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy' },
        { to: '/terms', label: lang === 'hi' ? 'उपयोग की शर्तें' : 'Terms of Use' },
        { to: '/disclaimer', label: lang === 'hi' ? 'अस्वीकरण' : 'Disclaimer' },
      ]
    },
  ]

  return (
    <footer className="bg-[#0e1612] text-slate-300 border-t border-[#CBCBCB]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2 group mb-4">
              <div className="w-8 h-8 bg-[#174D38] rounded-lg flex items-center justify-center border border-[#CBCBCB]/30 shadow-xs">
                <Compass className="w-4.5 h-4.5 text-[#F2F2F2]" strokeWidth={2.5} />
              </div>
              <span className="text-white font-bold text-base tracking-tight">
                Scheme<span className="text-emerald-400">Finder</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mt-3 max-w-xs">
              {lang === 'hi'
                ? 'भारतीय नागरिकों को सरकारी योजनाओं की खोज में सहायता करने वाला स्वतंत्र मंच।'
                : 'An independent platform helping Indian citizens discover government schemes they may be eligible for.'
              }
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 bg-[#17231c] text-slate-300 border border-[#2a3830] text-xs px-3 py-1.5 rounded-lg">
              <ExternalLink className="w-3 h-3 text-emerald-400" />
              {lang === 'hi' ? 'आधिकारिक सरकारी स्रोत' : 'Official government sources'}
            </div>
            <p className="text-xs text-slate-500 mt-3 leading-relaxed max-w-xs">
              {lang === 'hi'
                ? 'SchemeFinder भारत सरकार की आधिकारिक वेबसाइट नहीं है।'
                : 'SchemeFinder is not an official Government of India website.'
              }
            </p>
          </div>

          {/* Link columns */}
          {cols.map(col => (
            <div key={col.heading}>
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">{col.heading}</h4>
              <ul className="space-y-2.5">
                {col.links.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="text-slate-400 hover:text-[#F2F2F2] text-sm transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#1d2b23] py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} SchemeFinder. {lang === 'hi' ? 'केवल सूचनात्मक उद्देश्यों के लिए।' : 'For informational purposes only.'}
          </p>
          <p className="text-xs text-slate-500 max-w-sm text-left sm:text-right leading-relaxed">
            {lang === 'hi'
              ? 'किसी भी योजना के लिए आवेदन करने से पहले आधिकारिक सरकारी स्रोत से सत्यापित करें।'
              : 'Always verify scheme information from the official government source before applying.'
            }
          </p>
        </div>
      </div>
    </footer>
  )
}
