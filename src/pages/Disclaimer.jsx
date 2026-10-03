import { AlertTriangle } from 'lucide-react'

const disclaimers = [
  {
    title: 'Not an Official Government Website',
    text: 'SchemeFinder is an independent, privately operated platform. It is not affiliated with, operated by, or endorsed by the Government of India, any state government, any central or state ministry, or any government department or authority.'
  },
  {
    title: 'Informational Purpose Only',
    text: 'All content on SchemeFinder is provided for informational and discovery purposes only. SchemeFinder does not provide legal, financial, or official government advice.'
  },
  {
    title: 'Eligibility Disclaimer',
    text: 'A scheme appearing in your results does not mean you are eligible for it. SchemeFinder identifies schemes that may be relevant based on your profile. Final eligibility for any government scheme is determined solely by the government authority responsible for administering that scheme, based on their official criteria and verification processes.'
  },
  {
    title: 'Accuracy of Information',
    text: 'SchemeFinder sources scheme information from official government portals and makes reasonable efforts to keep information accurate and current. However, scheme eligibility, benefits, deadlines, and status change frequently. We cannot guarantee that all information is complete, accurate, or up to date at the time you access it.'
  },
  {
    title: 'Always Verify from Official Sources',
    text: 'Before submitting any application for a government scheme, verify the latest eligibility criteria, required documents, application process, and deadlines directly from the official government website or application portal linked on each scheme\'s detail page.'
  },
  {
    title: 'No Application Processing',
    text: 'SchemeFinder does not submit, process, or facilitate government scheme applications. All applications must be submitted directly through official government channels.'
  },
  {
    title: 'No Guarantee of Benefit',
    text: 'SchemeFinder does not guarantee that any user will receive any government benefit, subsidy, or assistance. Scheme availability depends on government policy, budget allocations, and individual eligibility as determined by the government.'
  },
  {
    title: 'External Links',
    text: 'SchemeFinder links to official government websites. We are not responsible for the content, availability, or accuracy of external websites.'
  }
]

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#111814]">
      <div className="bg-white dark:bg-[#16201a] border-b border-[#CBCBCB] dark:border-[#2a382e] py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-[#4D1717] dark:text-[#f0a8a8]" />
            <h1 className="text-2xl font-extrabold text-[#1e2421] dark:text-[#f3f5f4]">Disclaimer</h1>
          </div>
          <p className="text-sm text-[#5c6861] dark:text-[#9eada5]">Please read carefully before using SchemeFinder.</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <div className="bg-[#4D1717]/5 dark:bg-[#4D1717]/15 border border-[#4D1717]/30 rounded-xl p-5">
          <p className="text-sm font-bold text-[#4D1717] dark:text-[#f0a8a8] mb-2">Important Notice</p>
          <p className="text-sm text-[#4D1717] dark:text-[#f0a8a8] leading-relaxed">
            SchemeFinder is an independent information platform — not an official government portal. The information provided is for discovery and guidance only. Always verify with the official government source.
          </p>
        </div>
        {disclaimers.map(d => (
          <section key={d.title} className="bg-white dark:bg-[#16201a] border border-[#CBCBCB] dark:border-[#2a382e] rounded-xl p-5 shadow-xs">
            <h2 className="font-semibold text-[#1e2421] dark:text-[#f3f5f4] text-sm mb-2">{d.title}</h2>
            <p className="text-[#5c6861] dark:text-[#9eada5] text-sm leading-relaxed">{d.text}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
