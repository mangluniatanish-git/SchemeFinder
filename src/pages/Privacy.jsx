import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const sections = [
  {
    title: 'Information We Collect',
    content: [
      {
        sub: 'Profile Information (One-Time Mode)',
        text: 'When you use SchemeFinder without creating an account, your profile information is stored only in your browser\'s local storage. It is not sent to our servers. It includes: age, state, city, occupation, income range, education, social category, and interests you describe. This is deleted when you clear your browser data or use the "Clear Profile" option.'
      },
      {
        sub: 'Profile Information (Saved Mode)',
        text: 'If you choose to save your profile by creating an account, the same eligibility attributes are stored in our database. We store only what is needed for scheme matching — not your full CV, voice recordings, or document originals (unless you explicitly opt into document storage).'
      },
      {
        sub: 'Document Uploads',
        text: 'If you upload a CV or document, it is processed to extract eligibility information. The original file is not retained after processing unless you explicitly request it. Extracted information is shown to you for verification before being used.'
      },
      {
        sub: 'Usage Information',
        text: 'Standard web server logs including IP address, browser type, and pages visited may be retained for security and analytics purposes.'
      }
    ]
  },
  {
    title: 'How We Use Your Information',
    content: [
      { sub: 'Scheme Matching', text: 'Profile information is used to identify government schemes that may be relevant to you based on their published eligibility criteria.' },
      { sub: 'Profile Improvement', text: 'If you save your profile, it can be used to send you scheme alerts, deadline reminders, and eligibility change notifications if you enable them.' },
      { sub: 'No Sale of Data', text: 'We do not sell your personal information to any third party.' },
      { sub: 'AI Processing', text: 'If AI-assisted profile extraction is enabled, your text description may be sent to a third-party AI provider for processing. You will be clearly informed before this happens. The AI provider\'s privacy policy also applies. By default, AI processing uses only information you explicitly provide.' }
    ]
  },
  {
    title: 'External AI Services',
    content: [
      { sub: 'Configuration Required', text: 'SchemeFinder can optionally use AI services (such as Google Gemini, OpenAI, or Anthropic) for natural language profile extraction. These services are not active by default and require configuration by the platform operator.' },
      { sub: 'Consent', text: 'Before your text is processed by an external AI service, you will be clearly informed which provider is being used and asked for your consent.' },
      { sub: 'Data Retention by AI Providers', text: 'AI providers have their own privacy policies. SchemeFinder does not control how AI providers handle data sent to them. Review the relevant provider\'s privacy policy before using AI-assisted features.' }
    ]
  },
  {
    title: 'Data Security',
    content: [
      { sub: 'Local Storage', text: 'One-time profile data remains entirely in your browser and is not transmitted to SchemeFinder servers.' },
      { sub: 'Saved Profiles', text: 'Saved profiles are protected with standard security practices including encrypted transmission (HTTPS) and secure database storage.' },
      { sub: 'Passwords', text: 'Passwords are hashed using industry-standard bcrypt before storage. We never store plain-text passwords.' }
    ]
  },
  {
    title: 'Your Rights',
    content: [
      { sub: 'Access', text: 'You can view all information stored in your profile at any time.' },
      { sub: 'Correction', text: 'You can correct or update your profile information.' },
      { sub: 'Deletion', text: 'You can delete your profile and account at any time. This permanently removes all associated data.' },
      { sub: 'One-time mode', text: 'You can use SchemeFinder without creating an account. In this mode, nothing is stored on our servers.' }
    ]
  },
  {
    title: 'Official Government Data',
    content: [
      { sub: 'Source', text: 'Scheme information is sourced from official government portals. SchemeFinder is not affiliated with the Government of India.' },
      { sub: 'Accuracy', text: 'We strive to keep scheme information accurate and up to date. However, always verify eligibility requirements from the official government source before applying.' }
    ]
  },
  {
    title: 'Contact',
    content: [
      { sub: 'Questions', text: 'For privacy-related questions or to exercise your rights, use the Contact page.' }
    ]
  }
]

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#111814]">
      <div className="bg-white dark:bg-[#16201a] border-b border-[#CBCBCB] dark:border-[#2a382e] py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-extrabold text-[#1e2421] dark:text-[#f3f5f4] mb-1">Privacy Policy</h1>
          <p className="text-sm text-[#5c6861] dark:text-[#9eada5]">Last updated: September 2026</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        <div className="bg-[#174D38]/10 dark:bg-[#174D38]/20 border border-[#174D38]/30 rounded-xl p-4">
          <p className="text-sm text-[#174D38] dark:text-[#a7d7c5] leading-relaxed">
            <strong>Summary: </strong>
            In one-time mode, nothing you enter leaves your browser. If you save your profile, only eligibility attributes needed for scheme matching are stored — not your CV or voice recordings. You can delete everything at any time.
          </p>
        </div>
        {sections.map(sec => (
          <section key={sec.title} className="bg-white dark:bg-[#16201a] border border-[#CBCBCB] dark:border-[#2a382e] rounded-xl p-6 shadow-xs">
            <h2 className="font-bold text-[#1e2421] dark:text-[#f3f5f4] text-base mb-4 pb-2 border-b border-[#CBCBCB]/40 dark:border-[#2a382e]">{sec.title}</h2>
            <div className="space-y-4">
              {sec.content.map(item => (
                <div key={item.sub}>
                  <p className="font-semibold text-[#1e2421] dark:text-[#f3f5f4] text-sm mb-1">{item.sub}</p>
                  <p className="text-[#5c6861] dark:text-[#9eada5] text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
        <div className="pt-4 border-t border-[#CBCBCB]/40 dark:border-[#2a382e]">
          <Link to="/contact" className="text-sm text-[#174D38] dark:text-[#a7d7c5] hover:opacity-80 font-semibold flex items-center gap-1">
            Contact us with privacy questions <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
