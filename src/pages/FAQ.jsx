import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useLang } from '../context/LanguageContext'

const FAQ_DATA = [
  {
    q: 'What is SchemeFinder?',
    qHi: 'SchemeFinder क्या है?',
    a: 'SchemeFinder is a free government scheme discovery platform. It helps Indian citizens find government schemes, benefits, and financial assistance they may be eligible for — by simply describing their profile in plain language.',
    aHi: 'SchemeFinder एक निःशुल्क सरकारी योजना खोज प्लेटफ़ॉर्म है। यह भारतीय नागरिकों को सरल भाषा में अपनी प्रोफ़ाइल बताकर उन सरकारी योजनाओं, लाभों और वित्तीय सहायता को खोजने में मदद करता है जिनके वे पात्र हो सकते हैं।',
  },
  {
    q: 'Is SchemeFinder free to use?',
    qHi: 'क्या SchemeFinder निःशुल्क है?',
    a: 'Yes. SchemeFinder is completely free to use and requires no account or registration.',
    aHi: 'हां। SchemeFinder पूरी तरह से निःशुल्क है और इसके लिए किसी खाते या पंजीकरण की आवश्यकता नहीं है।',
  },
  {
    q: 'How does the profile-based discovery work?',
    qHi: 'प्रोफ़ाइल-आधारित खोज कैसे काम करती है?',
    a: 'You describe yourself in plain English or Hindi — your age, location, income, occupation, education, social category, and what you are looking for. SchemeFinder reads your description, extracts key attributes, and matches them against the eligibility criteria of government schemes to find the most relevant ones for you.',
    aHi: 'आप हिंदी या अंग्रेजी में अपने बारे में बताते हैं — आपकी आयु, स्थान, आय, व्यवसाय, शिक्षा, सामाजिक श्रेणी और आप क्या ढूंढ रहे हैं। SchemeFinder आपके विवरण को पढ़ता है, मुख्य विशेषताएं निकालता है, और आपके लिए सबसे प्रासंगिक योजनाएं खोजने के लिए उन्हें सरकारी योजनाओं की पात्रता मानदंडों से मिलाता है।',
  },
  {
    q: 'Does SchemeFinder determine my eligibility?',
    qHi: 'क्या SchemeFinder मेरी पात्रता निर्धारित करता है?',
    a: 'No. SchemeFinder is a discovery and informational tool. It identifies schemes that appear relevant based on the information you provide. Final eligibility for any government scheme is determined solely by the respective government authority. Always verify from the official government source before applying.',
    aHi: 'नहीं। SchemeFinder एक खोज और सूचनात्मक उपकरण है। यह आपकी प्रदान की गई जानकारी के आधार पर प्रासंगिक लगने वाली योजनाओं की पहचान करता है। किसी भी सरकारी योजना के लिए अंतिम पात्रता संबंधित सरकारी प्राधिकरण द्वारा निर्धारित की जाती है। आवेदन से पहले आधिकारिक स्रोत से सत्यापित करें।',
  },
  {
    q: 'Is my personal information stored?',
    qHi: 'क्या मेरी व्यक्तिगत जानकारी संग्रहीत की जाती है?',
    a: 'The profile you create is stored locally in your browser (localStorage) only — it is not sent to any server or third party. You can clear your profile at any time from the results page.',
    aHi: 'आपके द्वारा बनाई गई प्रोफ़ाइल केवल आपके ब्राउज़र (localStorage) में स्थानीय रूप से संग्रहीत होती है — इसे किसी सर्वर या तृतीय पक्ष को नहीं भेजा जाता। आप परिणाम पृष्ठ से किसी भी समय अपनी प्रोफ़ाइल साफ़ कर सकते हैं।',
  },
  {
    q: 'What languages are supported?',
    qHi: 'कौन सी भाषाएं समर्थित हैं?',
    a: 'You can write your profile in both English and Hindi. The interface can be switched between English and Hindi using the language toggle in the navigation bar.',
    aHi: 'आप अपनी प्रोफ़ाइल हिंदी और अंग्रेजी दोनों में लिख सकते हैं। नेवबार में भाषा टॉगल का उपयोग करके इंटरफ़ेस को अंग्रेजी और हिंदी के बीच स्विच किया जा सकता है।',
  },
  {
    q: 'Where does the scheme information come from?',
    qHi: 'योजना की जानकारी कहाँ से आती है?',
    a: 'All scheme information is sourced from official government portals including MyScheme.gov.in, India.gov.in, ministry websites, and state government portals. Each scheme includes a link to its official source.',
    aHi: 'सभी योजना जानकारी आधिकारिक सरकारी पोर्टलों से ली गई है, जिसमें MyScheme.gov.in, India.gov.in, मंत्रालय वेबसाइटें और राज्य सरकार पोर्टल शामिल हैं। प्रत्येक योजना में उसके आधिकारिक स्रोत का लिंक है।',
  },
  {
    q: 'How do I apply for a scheme?',
    qHi: 'मैं किसी योजना के लिए कैसे आवेदन करूं?',
    a: 'Each scheme detail page includes an "Apply on Official Website" button that takes you directly to the official government application portal. SchemeFinder does not process applications — you apply directly on the official government website.',
    aHi: 'प्रत्येक योजना विवरण पृष्ठ में एक "आधिकारिक वेबसाइट पर आवेदन करें" बटन है जो आपको सीधे आधिकारिक सरकारी आवेदन पोर्टल पर ले जाता है। SchemeFinder आवेदनों को संसाधित नहीं करता — आप आधिकारिक सरकारी वेबसाइट पर सीधे आवेदन करते हैं।',
  },
]

function FAQItem({ item, lang }) {
  const [open, setOpen] = useState(false)
  const question = lang === 'hi' ? item.qHi : item.q
  const answer = lang === 'hi' ? item.aHi : item.a

  return (
    <div className="bg-white dark:bg-[#16201a] border border-[#CBCBCB] dark:border-[#2a382e] rounded-xl overflow-hidden shadow-2xs hover:border-[#174D38]/50 dark:hover:border-emerald-600/50 transition-all duration-200">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-[#F2F2F2]/50 dark:hover:bg-[#1f2b23]/50 cursor-pointer"
      >
        <span className="font-semibold text-[#1e2421] dark:text-[#f3f5f4] text-sm">{question}</span>
        <ChevronDown className={`w-4 h-4 text-[#174D38] dark:text-[#a7d7c5] flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : 'rotate-0'}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-[#CBCBCB]/40 dark:border-[#2a382e] pt-4 animate-fade-in">
          <p className="text-[#5c6861] dark:text-[#9eada5] text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  const { t, lang } = useLang()

  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#111814]">
      <div className="bg-white dark:bg-[#16201a] border-b border-[#CBCBCB] dark:border-[#2a382e] py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e2421] dark:text-[#f3f5f4] mb-2">{t.faqTitle}</h1>
          <p className="text-[#5c6861] dark:text-[#9eada5]">{t.faqSubtitle}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="space-y-3">
          {FAQ_DATA.map((item, i) => (
            <FAQItem key={i} item={item} lang={lang} />
          ))}
        </div>

        <div className="mt-10 bg-white dark:bg-[#16201a] border border-[#CBCBCB] dark:border-[#2a382e] rounded-xl p-6 text-center shadow-xs">
          <p className="font-bold text-[#1e2421] dark:text-[#f3f5f4] mb-2">
            {lang === 'hi' ? 'अभी भी कोई सवाल है?' : 'Still have questions?'}
          </p>
          <p className="text-sm text-[#5c6861] dark:text-[#9eada5] mb-4">
            {lang === 'hi'
              ? 'Find Schemes पेज पर जाएं और अपना प्रोफ़ाइल बनाएं।'
              : 'Head to Find Schemes and describe your profile to get instant matches.'
            }
          </p>
          <Link to="/find-schemes" className="btn-primary inline-flex mx-auto">
            {t.findSchemesBtn}
          </Link>
        </div>
      </div>
    </div>
  )
}
