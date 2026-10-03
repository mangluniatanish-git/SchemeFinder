import { Link } from 'react-router-dom'
import { MessageSquare, Brain, FileText, Mic, CheckCircle2, ArrowRight, Users, Shield, Zap } from 'lucide-react'
import { useLang } from '../context/LanguageContext'

const steps = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Describe Your Profile',
    titleHi: 'अपनी प्रोफ़ाइल बताएं',
    desc: 'Describe yourself in natural language — English or Hindi. You can also fill a quick form, upload your CV, or use voice input. You control what to share.',
    descHi: 'हिंदी या अंग्रेजी में अपनी प्रोफ़ाइल बताएं। आप एक त्वरित फ़ॉर्म भर सकते हैं, अपना CV अपलोड कर सकते हैं, या वॉइस इनपुट का उपयोग कर सकते हैं।',
    color: 'text-[#174D38] dark:text-[#a7d7c5]', bg: 'bg-[#174D38]/10 dark:bg-[#174D38]/20', border: 'border-[#174D38]/30',
    sub: ['Natural Language Input', 'Quick Form Option', 'CV & Voice Support', 'Bilingual (EN/HI)']
  },
  {
    number: '02',
    icon: Brain,
    title: 'We Understand You',
    titleHi: 'हम आपकी ज़रूरत समझते हैं',
    desc: 'SchemeFinder extracts key attributes — age, state, income, occupation, education, social category — and presents them in clean chips for your instant verification.',
    descHi: 'SchemeFinder आपके विवरण से प्रमुख पात्रता विशेषताएं निकालता है और सत्यापन के लिए आपको दिखाता है।',
    color: 'text-[#4D1717] dark:text-[#f0a8a8]', bg: 'bg-[#4D1717]/10 dark:bg-[#4D1717]/20', border: 'border-[#4D1717]/30',
    sub: ['Instant Extraction', 'Transparent Chips', 'User Editable', 'No Hallucinations']
  },
  {
    number: '03',
    icon: CheckCircle2,
    title: 'Find Matching Schemes',
    titleHi: 'सटीक योजनाएं खोजें',
    desc: 'Deterministic eligibility rules evaluate your profile against 130+ schemes with precise "Why this scheme?" match criteria and transparent checklists.',
    descHi: 'संरचित पात्रता नियमों की आपकी प्रोफ़ाइल से तुलना की जाती है। प्रत्येक परिणाम बताता है कि यह क्यों मिला।',
    color: 'text-[#174D38] dark:text-[#a7d7c5]', bg: 'bg-[#174D38]/10 dark:bg-[#174D38]/20', border: 'border-[#174D38]/30',
    sub: ['Rule-Based Matching', 'Why This Scheme?', 'Strong / Possible Fits', 'Official Sources Only']
  },
  {
    number: '04',
    icon: FileText,
    title: 'Apply on Official Portals',
    titleHi: 'आधिकारिक स्रोतों से आवेदन करें',
    desc: 'Each scheme links directly to the verified official government portal (.gov.in). SchemeFinder never collects fees or handles applications.',
    descHi: 'प्रत्येक योजना सीधे आधिकारिक सरकारी पोर्टल से लिंक है। SchemeFinder आवेदन नहीं संभालता। आप सीधे सरकारी वेबसाइट से आवेदन करते हैं।',
    color: 'text-[#4D1717] dark:text-[#f0a8a8]', bg: 'bg-[#4D1717]/10 dark:bg-[#4D1717]/20', border: 'border-[#4D1717]/30',
    sub: ['Official .gov.in Links', 'Direct Portal Redirection', 'Document Checklist', 'Free & Unbiased']
  },
]

const inputMethods = [
  { icon: MessageSquare, title: 'Describe Yourself', titleHi: 'खुद बताएं', desc: 'Write a few sentences about yourself in English or Hindi.' },
  { icon: FileText, title: 'Quick Form', titleHi: 'त्वरित फ़ॉर्म', desc: 'Answer simple structured questions.' },
  { icon: Mic, title: 'Voice Input', titleHi: 'वॉइस इनपुट', desc: 'Speak naturally — no typing needed.' },
  { icon: Users, title: 'Upload CV/Document', titleHi: 'CV अपलोड करें', desc: 'Upload a PDF or DOCX. Info extracted automatically.' },
]

const principles = [
  { icon: Shield, title: 'You control your data', desc: 'Profile is used only for scheme matching. One-time mode never saves anything to external servers.' },
  { icon: Zap, title: 'Transparent matching', desc: 'Every result explains why it appeared. No black-box scores or opaque rankings.' },
  { icon: CheckCircle2, title: 'Official sources only', desc: 'All scheme info is sourced from verified official government portals.' },
]

export default function HowItWorks() {
  const { lang } = useLang()

  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#111814]">
      {/* Header */}
      <div className="bg-white dark:bg-[#16201a] border-b border-[#CBCBCB] dark:border-[#2a382e] py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-[#174D38] dark:text-[#a7d7c5] uppercase tracking-wider font-semibold mb-2">How It Works</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e2421] dark:text-[#f3f5f4] mb-3">
            {lang === 'hi' ? 'SchemeFinder कैसे काम करता है' : 'How SchemeFinder Works'}
          </h1>
          <p className="text-[#5c6861] dark:text-[#9eada5] max-w-2xl mx-auto">
            {lang === 'hi'
              ? 'एक बार अपनी प्रोफ़ाइल बताएं। SchemeFinder आपके लिए प्रासंगिक सरकारी योजनाएं खोजता है।'
              : 'Tell SchemeFinder about yourself once in plain English or Hindi. We match you with official welfare schemes and guide you to application portals.'
            }
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">

        {/* 4 Steps */}
        <section>
          <div className="space-y-4">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="bg-white dark:bg-[#16201a] border border-[#CBCBCB] dark:border-[#2a382e] rounded-xl p-6 flex flex-col sm:flex-row gap-5 shadow-xs transition-colors">
                  <div className={`w-12 h-12 ${step.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${step.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-bold ${step.color}`}>{step.number}</span>
                      <h3 className="font-bold text-[#1e2421] dark:text-[#f3f5f4] text-base">
                        {lang === 'hi' ? step.titleHi : step.title}
                      </h3>
                    </div>
                    <p className="text-[#5c6861] dark:text-[#9eada5] text-sm leading-relaxed mb-3">
                      {lang === 'hi' ? step.descHi : step.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {step.sub.map(s => (
                        <span key={s} className="text-xs bg-[#F2F2F2] dark:bg-[#111814] text-[#1e2421] dark:text-[#f3f5f4] border border-[#CBCBCB]/60 dark:border-[#2a382e] px-2.5 py-1 rounded-md font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Input Methods */}
        <section>
          <h2 className="text-lg font-bold text-[#1e2421] dark:text-[#f3f5f4] mb-4">
            {lang === 'hi' ? 'आप कैसे बता सकते हैं' : 'Ways to describe your profile'}
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {inputMethods.map(m => {
              const Icon = m.icon
              return (
                <div key={m.title} className="bg-white dark:bg-[#16201a] border border-[#CBCBCB] dark:border-[#2a382e] rounded-xl p-4 flex items-start gap-3 shadow-xs">
                  <div className="w-9 h-9 bg-[#174D38]/10 dark:bg-[#174D38]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#174D38] dark:text-[#a7d7c5]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1e2421] dark:text-[#f3f5f4] text-sm">
                      {lang === 'hi' ? m.titleHi : m.title}
                    </p>
                    <p className="text-[#5c6861] dark:text-[#9eada5] text-xs mt-0.5">{m.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Principles */}
        <section className="bg-white dark:bg-[#16201a] border border-[#CBCBCB] dark:border-[#2a382e] rounded-xl p-6 shadow-xs">
          <h2 className="font-bold text-[#1e2421] dark:text-[#f3f5f4] mb-4">
            {lang === 'hi' ? 'हमारे मूल सिद्धांत' : 'Our core principles'}
          </h2>
          <div className="space-y-3">
            {principles.map(p => {
              const Icon = p.icon
              return (
                <div key={p.title} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-[#174D38] dark:text-[#a7d7c5] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#1e2421] dark:text-[#f3f5f4] text-sm">{p.title}</p>
                    <p className="text-[#5c6861] dark:text-[#9eada5] text-xs mt-0.5">{p.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-[#4D1717]/5 dark:bg-[#4D1717]/15 border border-[#4D1717]/30 rounded-xl p-5">
          <p className="text-sm text-[#4D1717] dark:text-[#f0a8a8] leading-relaxed">
            <strong>Important: </strong>
            SchemeFinder is an independent information platform. It is not an official Government of India website. Scheme information should always be verified on the official government source before applying. Final eligibility and approval is determined solely by the respective government authority.
          </p>
        </section>

        {/* CTA */}
        <div className="text-center pt-2">
          <Link to="/find-schemes" className="btn-primary inline-flex mx-auto text-base px-8 shadow-sm">
            {lang === 'hi' ? 'मेरे लिए योजनाएं खोजें' : 'Find My Schemes'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
