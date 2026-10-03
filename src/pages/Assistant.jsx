import { Link } from 'react-router-dom'
import { Bot, Sparkles, MessageCircle, ArrowRight } from 'lucide-react'

export default function Assistant() {
  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#111814] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-[#174D38] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#174D38]/25">
          <Bot className="w-10 h-10 text-[#F2F2F2]" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-[#F2F2F2] dark:bg-[#16201a] border border-[#CBCBCB] dark:border-[#2a382e] text-[#174D38] dark:text-[#a7d7c5] text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
          <Sparkles className="w-3.5 h-3.5" />
          Coming Soon
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1e2421] dark:text-[#f3f5f4] tracking-tight mb-4">
          AI Scheme Assistant
        </h1>
        <p className="text-[#5c6861] dark:text-[#9eada5] text-base leading-relaxed mb-8">
          Ask anything about government schemes in plain language. 
          Get instant, accurate answers with step-by-step guidance on how to apply.
        </p>

        {/* Feature preview */}
        <div className="bg-white dark:bg-[#16201a] rounded-2xl border border-[#CBCBCB] dark:border-[#2a382e] shadow-sm p-6 mb-8 text-left space-y-3">
          {[
            'What schemes am I eligible for as a farmer in Rajasthan?',
            'How do I apply for Ayushman Bharat?',
            'What documents are needed for PM Awas Yojana?',
          ].map((q, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-[#F2F2F2] dark:bg-[#111814] rounded-xl border border-[#CBCBCB]/40 dark:border-[#2a382e]">
              <MessageCircle className="w-4 h-4 text-[#174D38] dark:text-[#a7d7c5] shrink-0" />
              <p className="text-[#1e2421] dark:text-[#f3f5f4] text-sm">{q}</p>
            </div>
          ))}
        </div>

        <Link to="/find-schemes" className="btn-primary inline-flex mx-auto text-base px-8">
          Use Scheme Finder Instead
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
