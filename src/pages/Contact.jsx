import { useState } from 'react'
import { Mail, MessageCircle, AlertCircle, CheckCircle2 } from 'lucide-react'

const topics = [
  'Question about a scheme',
  'Incorrect scheme information',
  'Profile / account issue',
  'Privacy / data deletion request',
  'Feedback or suggestion',
  'Partnership inquiry',
  'Other',
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError(null)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.topic || !form.message.trim()) {
      setError('Please fill in all required fields.')
      return
    }
    // MANUAL CONFIGURATION REQUIRED:
    // Connect this form to your backend POST /api/contact endpoint
    // or to an email service (e.g. Formspree, Resend, Nodemailer).
    // Currently shows a success state for UI demonstration.
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white border border-slate-200 rounded p-8">
          <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-4" />
          <h2 className="font-bold text-slate-900 text-lg mb-2">Message Received</h2>
          <p className="text-slate-600 text-sm">
            Thank you for reaching out. We'll respond as soon as possible.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#111814]">
      <div className="bg-white dark:bg-[#1a231e] border-b border-[#CBCBCB] dark:border-[#2a3830] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-[#1e2421] dark:text-white mb-1">Contact</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Questions, feedback, or data deletion requests — we're here to help.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-4 text-center shadow-xs">
            <Mail className="w-5 h-5 text-[#174D38] dark:text-emerald-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-[#1e2421] dark:text-slate-200">Email</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">contact@schemefinder.in</p>
          </div>
          <div className="bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-4 text-center shadow-xs">
            <MessageCircle className="w-5 h-5 text-[#174D38] dark:text-emerald-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-[#1e2421] dark:text-slate-200">Response Time</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">2–3 business days</p>
          </div>
          <div className="bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-xl p-4 text-center shadow-xs">
            <AlertCircle className="w-5 h-5 text-[#4D1717] dark:text-amber-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-[#1e2421] dark:text-slate-200">Scheme Issues</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Verify from official source</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] rounded-2xl p-6 shadow-xs">
          <h2 className="font-bold text-[#1e2421] dark:text-white mb-5">Send a Message</h2>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 text-sm text-red-700">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name <span className="text-red-500">*</span></label>
                <input name="name" value={form.name} onChange={handleChange} type="text" placeholder="Your name"
                  className="w-full bg-white dark:bg-[#141d18] border border-[#CBCBCB] dark:border-[#2a3830] text-[#1e2421] dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#174D38]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email <span className="text-red-500">*</span></label>
                <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="your@email.com"
                  className="w-full bg-white dark:bg-[#141d18] border border-[#CBCBCB] dark:border-[#2a3830] text-[#1e2421] dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#174D38]" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Topic <span className="text-red-500">*</span></label>
              <select name="topic" value={form.topic} onChange={handleChange}
                className="w-full bg-white dark:bg-[#141d18] border border-[#CBCBCB] dark:border-[#2a3830] text-[#1e2421] dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#174D38]">
                <option value="">Select topic</option>
                {topics.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message <span className="text-red-500">*</span></label>
              <textarea name="message" value={form.message} onChange={handleChange} rows={5}
                placeholder="Describe your question or issue..."
                className="w-full bg-white dark:bg-[#141d18] border border-[#CBCBCB] dark:border-[#2a3830] text-[#1e2421] dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#174D38] resize-none" />
            </div>
            <div className="bg-[#F2F2F2] dark:bg-[#141d18] border border-[#CBCBCB] dark:border-[#2a3830] rounded-lg p-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                For data deletion requests, please include your registered email address. We'll process deletion within 7 days.
              </p>
            </div>
            <button type="submit" className="btn-primary w-full justify-center">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
