import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, Compass, ChevronRight, ChevronDown, Bookmark, User, LayoutDashboard, Sun, Moon } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { useProfile } from '../context/ProfileContext'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const { lang, setLang, t } = useLang()
  const { profile } = useProfile()
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const primaryLinks = [
    { to: '/', label: t.home },
    { to: '/find-schemes', label: t.findSchemes },
    { to: '/schemes', label: t.allSchemes },
  ]

  const moreLinks = [
    { to: '/categories', label: t.categories },
    { to: '/how-it-works', label: lang === 'hi' ? 'यह कैसे काम करता है' : 'How It Works' },
    { to: '/faq', label: t.faq },
    { to: '/about', label: t.about },
  ]

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 bg-white/95 dark:bg-[#111814]/95 backdrop-blur-sm border-b border-[#CBCBCB] dark:border-[#232f28] ${scrolled ? 'shadow-sm shadow-[#174D38]/5 dark:shadow-black/20' : ''}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 bg-[#174D38] rounded-lg flex items-center justify-center group-hover:bg-[#4D1717] group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-sm">
              <Compass className="w-4.5 h-4.5 text-[#F2F2F2] transition-transform duration-300 group-hover:rotate-45" strokeWidth={2.5} />
            </div>
            <span className="text-[#174D38] dark:text-white font-bold text-base tracking-tight transition-colors">
              Scheme<span className="text-[#4D1717] dark:text-emerald-400">Finder</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {primaryLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} end={to === '/'}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'text-[#174D38] dark:text-emerald-400 bg-[#174D38]/10 dark:bg-[#174D38]/20 font-semibold' 
                        : 'text-[#1e2421] dark:text-slate-300 hover:text-[#174D38] dark:hover:text-emerald-300 hover:bg-[#F2F2F2] dark:hover:bg-[#1c2621] hover:scale-[1.02]'
                    }`
                  }
                >{label}</NavLink>
              </li>
            ))}
            {/* More dropdown */}
            <li className="relative group">
              <button className="px-3 py-2 rounded-lg text-sm font-medium text-[#1e2421] dark:text-slate-300 hover:text-[#174D38] dark:hover:text-emerald-300 hover:bg-[#F2F2F2] dark:hover:bg-[#1c2621] flex items-center gap-1 transition-all">
                {lang === 'hi' ? 'अधिक' : 'More'}
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 top-full mt-1 bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl shadow-lg min-w-48 py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-1.5 transition-all duration-200 z-50">
                {moreLinks.map(({ to, label }) => (
                  <NavLink key={to} to={to}
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm transition-colors ${
                        isActive 
                          ? 'text-[#174D38] dark:text-emerald-400 bg-[#174D38]/10 dark:bg-[#174D38]/20 font-semibold' 
                          : 'text-[#1e2421] dark:text-slate-300 hover:text-[#174D38] dark:hover:text-emerald-300 hover:bg-[#F2F2F2] dark:hover:bg-[#232f29]'
                      }`
                    }
                  >{label}</NavLink>
                ))}
              </div>
            </li>
          </ul>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-[#1e2421] dark:text-slate-300 hover:text-[#174D38] dark:hover:text-emerald-300 hover:bg-[#F2F2F2] dark:hover:bg-[#1c2621] rounded-lg transition-all duration-300 border border-transparent hover:border-[#CBCBCB] hover:scale-105 active:scale-90 hover:rotate-12 cursor-pointer"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle dark/light mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4.5 h-4.5 text-amber-300 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-[#174D38] transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>

            {/* Language Toggle */}
            <div className="flex items-center border border-[#CBCBCB] dark:border-[#2a3830] rounded-lg overflow-hidden text-xs font-semibold">
              <button onClick={() => setLang('en')}
                className={`px-3 py-1.5 transition-colors ${lang === 'en' ? 'bg-[#174D38] text-white' : 'text-[#1e2421] dark:text-slate-300 hover:bg-[#F2F2F2] dark:hover:bg-[#1c2621]'}`}>
                English
              </button>
              <button onClick={() => setLang('hi')}
                className={`px-3 py-1.5 transition-colors ${lang === 'hi' ? 'bg-[#174D38] text-white' : 'text-[#1e2421] dark:text-slate-300 hover:bg-[#F2F2F2] dark:hover:bg-[#1c2621]'}`}>
                हिंदी
              </button>
            </div>

            {/* Saved */}
            <Link to="/saved" className="p-2 text-[#1e2421] dark:text-slate-300 hover:text-[#174D38] dark:hover:text-emerald-300 hover:bg-[#F2F2F2] dark:hover:bg-[#1c2621] rounded-lg transition-colors" title="Saved Schemes">
              <Bookmark className="w-4.5 h-4.5" />
            </Link>

            {/* Profile icon if has profile */}
            {profile && (
              <Link to="/dashboard" className="p-2 text-[#1e2421] dark:text-slate-300 hover:text-[#174D38] dark:hover:text-emerald-300 hover:bg-[#F2F2F2] dark:hover:bg-[#1c2621] rounded-lg transition-colors" title="Dashboard">
                <LayoutDashboard className="w-4.5 h-4.5" />
              </Link>
            )}

            <Link to="/find-schemes" className="btn-primary text-sm py-2 px-4">
              {t.findSchemesBtn}
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile right */}
          <div className="lg:hidden flex items-center gap-1.5">
            {/* Mobile Dark/Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 text-[#1e2421] dark:text-slate-300 hover:text-[#174D38] dark:hover:text-emerald-300 hover:bg-[#F2F2F2] dark:hover:bg-[#1c2621] rounded-md transition-colors"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle dark/light mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-[#174D38]" />
              )}
            </button>

            {/* Mobile Language */}
            <div className="flex items-center border border-[#CBCBCB] dark:border-[#2a3830] rounded overflow-hidden text-xs font-semibold">
              <button onClick={() => setLang('en')}
                className={`px-2 py-1 transition-colors ${lang === 'en' ? 'bg-[#174D38] text-white' : 'text-[#1e2421] dark:text-slate-300'}`}>EN</button>
              <button onClick={() => setLang('hi')}
                className={`px-2 py-1 transition-colors ${lang === 'hi' ? 'bg-[#174D38] text-white' : 'text-[#1e2421] dark:text-slate-300'}`}>हि</button>
            </div>

            <button className="p-2 rounded text-[#1e2421] dark:text-slate-300 hover:text-[#174D38] dark:hover:text-white hover:bg-[#F2F2F2] dark:hover:bg-[#1c2621] transition-colors"
              onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#151d18] border-t border-[#CBCBCB] dark:border-[#232f28]">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {[...primaryLinks, ...moreLinks].map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'} onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'text-[#174D38] dark:text-emerald-400 bg-[#174D38]/10 dark:bg-[#174D38]/20 font-semibold' 
                      : 'text-[#1e2421] dark:text-slate-300 hover:text-[#174D38] dark:hover:text-white hover:bg-[#F2F2F2] dark:hover:bg-[#1c2621]'
                  }`
                }
              >{label}</NavLink>
            ))}
            <NavLink to="/saved" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#1e2421] dark:text-slate-300 hover:bg-[#F2F2F2] dark:hover:bg-[#1c2621] flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#174D38] dark:text-emerald-400" /> {lang === 'hi' ? 'सहेजी गई योजनाएं' : 'Saved Schemes'}
            </NavLink>
            {profile && (
              <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#1e2421] dark:text-slate-300 hover:bg-[#F2F2F2] dark:hover:bg-[#1c2621] flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-[#174D38] dark:text-emerald-400" /> {lang === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
              </NavLink>
            )}
            <div className="pt-2 pb-1 border-t border-[#CBCBCB] dark:border-[#232f28] mt-1">
              <Link to="/find-schemes" onClick={() => setMenuOpen(false)} className="btn-primary w-full justify-center text-sm">
                {t.findSchemesBtn} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
