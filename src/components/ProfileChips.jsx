import { X } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { getProfileFieldLabel, formatProfileValue } from '../utils/profileParser'

const FIELD_ORDER = ['age', 'gender', 'state', 'city', 'income', 'occupation', 'education', 'category', 'disability', 'interests']

export default function ProfileChips({ profile, onRemove, onEdit }) {
  const { t } = useLang()

  if (!profile) return null

  const chips = FIELD_ORDER
    .map(key => {
      const value = formatProfileValue(key, profile[key])
      return { key, label: getProfileFieldLabel(key, t), value }
    })
    .filter(c => c.value)

  const missing = FIELD_ORDER
    .filter(key => {
      const v = profile[key]
      return !v || (Array.isArray(v) && v.length === 0)
    })
    .map(key => ({ key, label: getProfileFieldLabel(key, t) }))
    .slice(0, 3) // Show max 3 missing fields

  return (
    <div className="space-y-4">
      {/* Extracted chips */}
      <div className="flex flex-wrap gap-2">
        {chips.map(({ key, label, value }) => (
          <div
            key={key}
            className="inline-flex items-center gap-1.5 bg-[#F2F2F2] dark:bg-[#1a231e] border border-[#CBCBCB] dark:border-[#2a3830] text-[#1e2421] dark:text-slate-200 text-sm font-medium px-3.5 py-1.5 rounded-lg shadow-xs hover:border-[#174D38] dark:hover:border-emerald-500/70 transition-all duration-200 animate-scale-in"
          >
            <span className="text-xs text-[#174D38] dark:text-emerald-400 font-semibold">{label}:</span>
            <span>{value}</span>
            {onRemove && (
              <button
                onClick={() => onRemove(key)}
                className="ml-1 text-[#1e2421]/60 dark:text-slate-400 hover:text-[#4D1717] dark:hover:text-red-400 hover:scale-125 active:scale-90 transition-transform duration-150 cursor-pointer p-0.5"
                aria-label={`Remove ${label}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Missing fields (show as grayed out) */}
      {missing.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-[#1e2421]/60 dark:text-slate-500 font-medium">{t.notProvided}:</span>
          {missing.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onEdit && onEdit(key)}
              className="inline-flex items-center gap-1 border border-dashed border-[#CBCBCB] dark:border-[#2a3830] text-[#1e2421]/70 dark:text-slate-400 hover:text-[#174D38] dark:hover:text-emerald-300 hover:border-[#174D38] text-xs px-2.5 py-1 rounded-md transition-colors bg-white/60 dark:bg-transparent"
            >
              + {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
