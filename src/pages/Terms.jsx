const sections = [
  {
    title: '1. Acceptance of Terms',
    text: 'By using SchemeFinder, you agree to these Terms of Use. If you do not agree, please do not use the platform.'
  },
  {
    title: '2. Nature of Service',
    text: 'SchemeFinder is an independent information and discovery platform. It is not an official Government of India website, portal, or service. SchemeFinder is not affiliated with, endorsed by, or operated by any government ministry, department, or authority.'
  },
  {
    title: '3. Information Accuracy',
    text: 'SchemeFinder provides scheme information sourced from official government portals. While we strive for accuracy, scheme eligibility criteria, application processes, and deadlines change frequently. Always verify information from the official government source before making any decisions or applications. SchemeFinder does not guarantee the accuracy, completeness, or timeliness of scheme information.'
  },
  {
    title: '4. Eligibility Determination',
    text: 'SchemeFinder provides informational guidance and scheme discovery assistance only. A "match" or "possible match" displayed by SchemeFinder does not constitute a determination of eligibility for any government scheme. Final eligibility is determined solely by the respective government authority administering the scheme.'
  },
  {
    title: '5. No Application Processing',
    text: 'SchemeFinder does not accept, process, or submit applications for government schemes on your behalf. All applications must be submitted directly through the official government portal or application process.'
  },
  {
    title: '6. User Responsibilities',
    text: 'You are responsible for providing accurate information when creating your profile. You are responsible for verifying scheme details from official sources. You should not rely solely on SchemeFinder for eligibility decisions. Do not share sensitive financial account details, Aadhaar numbers, or passwords on SchemeFinder.'
  },
  {
    title: '7. Intellectual Property',
    text: 'SchemeFinder\'s platform design, code, branding, and proprietary content are protected. Scheme names and descriptions are sourced from public government sources. Do not reproduce or scrape SchemeFinder\'s platform without permission.'
  },
  {
    title: '8. Limitation of Liability',
    text: 'SchemeFinder is provided "as is" without warranties of any kind. SchemeFinder is not liable for any decisions made based on information provided by the platform, for errors in scheme information, for missed application deadlines, or for any consequences of scheme applications.'
  },
  {
    title: '9. Changes to Terms',
    text: 'These terms may be updated from time to time. Continued use of SchemeFinder after changes constitutes acceptance of the updated terms.'
  },
  {
    title: '10. Contact',
    text: 'For questions about these terms, use the Contact page.'
  }
]

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#111814]">
      <div className="bg-white dark:bg-[#16201a] border-b border-[#CBCBCB] dark:border-[#2a382e] py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-extrabold text-[#1e2421] dark:text-[#f3f5f4] mb-1">Terms of Use</h1>
          <p className="text-sm text-[#5c6861] dark:text-[#9eada5]">Last updated: September 2026</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <div className="bg-[#4D1717]/5 dark:bg-[#4D1717]/15 border border-[#4D1717]/30 rounded-xl p-4">
          <p className="text-sm text-[#4D1717] dark:text-[#f0a8a8] leading-relaxed">
            SchemeFinder is an independent platform. It is <strong>not</strong> an official Government of India website. Scheme information must be verified from official government sources before applying.
          </p>
        </div>
        {sections.map(sec => (
          <section key={sec.title} className="bg-white dark:bg-[#16201a] border border-[#CBCBCB] dark:border-[#2a382e] rounded-xl p-5 shadow-xs">
            <h2 className="font-bold text-[#1e2421] dark:text-[#f3f5f4] text-sm mb-2">{sec.title}</h2>
            <p className="text-[#5c6861] dark:text-[#9eada5] text-sm leading-relaxed">{sec.text}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
