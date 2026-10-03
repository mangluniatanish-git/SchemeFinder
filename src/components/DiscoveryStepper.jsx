import { Check } from 'lucide-react'
import { useLang } from '../context/LanguageContext'

/**
 * Reusable Discovery Stepper component matching Image 1 UI.
 * currentStep:
 *  1 = Input Profile
 *  2 = Verification / Extracted Details
 *  3 = Matching Schemes
 */
export default function DiscoveryStepper({ currentStep = 1, isStep1Done = false, isStep2Done = false, isStep3Done = false }) {
  const { lang } = useLang()

  return (
    <div className="border-b border-[#CBCBCB]/60 dark:border-[#2a3830] pb-5">
      <div className="flex items-center justify-between gap-2 sm:gap-4 overflow-x-auto no-scrollbar py-1">
        
        {/* Step 1: Input Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {isStep1Done ? (
            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm shadow-xs">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
          ) : (
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-xs ${
              currentStep === 1
                ? 'bg-[#111827] dark:bg-emerald-500 text-white'
                : 'border border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500'
            }`}>
              1
            </div>
          )}
          <div className="flex flex-col text-left">
            <span className={`text-[10px] sm:text-[11px] font-bold tracking-wider uppercase ${
              currentStep === 1 || isStep1Done ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
            }`}>
              {lang === 'hi' ? 'चरण 1' : 'STEP 1'}
            </span>
            <span className={`text-xs sm:text-sm font-semibold ${
              currentStep === 1 ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-600 dark:text-slate-300'
            }`}>
              {lang === 'hi' ? 'प्रोफ़ाइल दर्ज करें' : 'Input Profile'}
            </span>
          </div>
        </div>

        {/* Step 2: Verification / Extracted Details */}
        <div className="flex items-center gap-3 shrink-0">
          {isStep2Done ? (
            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm shadow-xs">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
          ) : (
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-xs ${
              currentStep === 2
                ? 'bg-[#111827] dark:bg-emerald-500 text-white ring-4 ring-emerald-500/20'
                : 'border border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500'
            }`}>
              2
            </div>
          )}
          <div className="flex flex-col text-left">
            <span className={`text-[10px] sm:text-[11px] font-bold tracking-wider uppercase ${
              currentStep === 2 || isStep2Done
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-slate-400 dark:text-slate-500'
            }`}>
              {lang === 'hi' ? 'सत्यापन' : 'VERIFICATION'}
            </span>
            <span className={`text-xs sm:text-sm font-semibold ${
              currentStep === 2
                ? 'text-slate-900 dark:text-white font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}>
              {lang === 'hi' ? 'निकाले गए विवरण' : 'Extracted Details'}
            </span>
          </div>
        </div>

        {/* Step 3: Matching Schemes */}
        <div className="flex items-center gap-3 shrink-0">
          {isStep3Done ? (
            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm shadow-xs">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
          ) : (
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-xs ${
              currentStep === 3
                ? 'bg-[#111827] dark:bg-emerald-500 text-white ring-4 ring-emerald-500/20'
                : 'border border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500'
            }`}>
              3
            </div>
          )}
          <div className="flex flex-col text-left">
            <span className={`text-[10px] sm:text-[11px] font-bold tracking-wider uppercase ${
              currentStep === 3 || isStep3Done ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
            }`}>
              {lang === 'hi' ? 'चरण 3' : 'STEP 3'}
            </span>
            <span className={`text-xs sm:text-sm font-semibold ${
              currentStep === 3
                ? 'text-slate-900 dark:text-white font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}>
              {lang === 'hi' ? 'योजनाओं का मिलान' : 'Matching Schemes'}
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}
