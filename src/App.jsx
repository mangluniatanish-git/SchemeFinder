import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { ProfileProvider } from './context/ProfileContext'
import { ThemeProvider } from './context/ThemeContext'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import FindSchemes from './pages/FindSchemes'
import Results from './pages/Results'
import Categories from './pages/Categories'
import AllSchemes from './pages/AllSchemes'
import SchemeDetail from './pages/SchemeDetail'
import Assistant from './pages/Assistant'
import About from './pages/About'
import FAQ from './pages/FAQ'
import HowItWorks from './pages/HowItWorks'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Disclaimer from './pages/Disclaimer'
import Contact from './pages/Contact'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Saved from './pages/Saved'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ProfileProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<MainLayout />}>
                {/* Core */}
                <Route path="/" element={<Home />} />
                <Route path="/find-schemes" element={<FindSchemes />} />
                <Route path="/results" element={<Results />} />

                {/* Scheme browsing */}
                <Route path="/categories" element={<Categories />} />
                <Route path="/schemes" element={<AllSchemes />} />
                <Route path="/schemes/:id" element={<SchemeDetail />} />

                {/* Profile & user */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/saved" element={<Saved />} />

                {/* Info */}
                <Route path="/assistant" element={<Assistant />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<FAQ />} />

                {/* Legal */}
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/disclaimer" element={<Disclaimer />} />
                <Route path="/contact" element={<Contact />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ProfileProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
