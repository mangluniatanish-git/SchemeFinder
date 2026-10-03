import { useLang } from '../context/LanguageContext'

export default function FilterBar({ activeType, onTypeChange, activeCategory, onCategoryChange, categories = [] }) {
  const { t, lang } = useLang()

  const typeFilters = [
    { id: 'all', label: t.all },
    { id: 'central', label: t.centralGovt },
    { id: 'state', label: t.stateGovt },
  ]

  return (
    <div className="space-y-3">
      {/* Type filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {typeFilters.map(f => (
          <button
            key={f.id}
            onClick={() => onTypeChange(f.id)}
            className={`text-sm font-medium px-4 py-2 rounded-xl border transition-all duration-200 active:scale-95 cursor-pointer ${
              activeType === f.id
                ? 'bg-[#174D38] text-white border-[#174D38] shadow-xs hover:bg-[#113a2a]'
                : 'bg-white dark:bg-[#1a231e] text-[#1e2421] dark:text-slate-300 border-[#CBCBCB] dark:border-[#2a3830] hover:border-[#174D38] hover:text-[#174D38] dark:hover:text-white hover:bg-[#F2F2F2] dark:hover:bg-[#232f29]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Category filter pills */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onCategoryChange(null)}
            className={`text-xs font-medium px-3.5 py-1.5 rounded-lg border transition-all duration-200 active:scale-95 cursor-pointer ${
              !activeCategory
                ? 'bg-[#4D1717] text-[#F2F2F2] border-[#4D1717] shadow-xs'
                : 'bg-white dark:bg-[#1a231e] text-[#1e2421] dark:text-slate-300 border-[#CBCBCB] dark:border-[#2a3830] hover:border-[#4D1717] hover:bg-[#F2F2F2] dark:hover:bg-[#232f29]'
            }`}
          >
            {t.all}
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id === activeCategory ? null : cat.id)}
              className={`text-xs font-medium px-3.5 py-1.5 rounded-lg border transition-all duration-200 active:scale-95 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#4D1717] text-[#F2F2F2] border-[#4D1717] shadow-xs'
                  : 'bg-white dark:bg-[#1a231e] text-[#1e2421] dark:text-slate-300 border-[#CBCBCB] dark:border-[#2a3830] hover:border-[#4D1717] hover:bg-[#F2F2F2] dark:hover:bg-[#232f29]'
              }`}
            >
              {lang === 'hi' ? cat.labelHi : cat.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
