import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Trash2, Edit3, Shield, Bell, Eye, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { useProfile } from '../context/ProfileContext'
import ProfileChips from '../components/ProfileChips'

const FIELD_LABELS = {
  age: 'Age', gender: 'Gender', state: 'State', city: 'City / District',
  income: 'Family Income', occupation: 'Occupation', education: 'Education',
  category: 'Category', disability: 'Disability', interests: 'Interests',
}

export default function Profile() {
  const { lang } = useLang()
  const { profile, setProfile, clearProfile } = useProfile()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleted, setDeleted] = useState(false)

  function handleDelete() {
    clearProfile()
    setDeleted(true)
  }

  function handleRemoveChip(key) {
    if (!profile) return
    const updated = { ...profile }
    if (Array.isArray(updated[key])) updated[key] = []
    else updated[key] = null
    if (key === 'income') updated.incomeValue = null
    setProfile(updated)
  }

  if (deleted) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#111814] flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center bg-white dark:bg-[#16201a] border border-[#CBCBCB] dark:border-[#2a382e] rounded-xl p-8 shadow-xs">
          <CheckCircle2 className="w-10 h-10 text-[#174D38] dark:text-[#a7d7c5] mx-auto mb-4" />
          <h2 className="font-bold text-[#1e2421] dark:text-[#f3f5f4] text-lg mb-2">Profile Deleted</h2>
          <p className="text-[#5c6861] dark:text-[#9eada5] text-sm mb-6">Your profile and all associated data has been removed from this device.</p>
          <Link to="/" className="btn-primary inline-flex mx-auto">Go Home</Link>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#111814] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-14 h-14 bg-white dark:bg-[#16201a] border border-[#CBCBCB] dark:border-[#2a382e] rounded-xl flex items-center justify-center mx-auto mb-4">
            <User className="w-7 h-7 text-[#174D38] dark:text-[#a7d7c5]" />
          </div>
          <h1 className="text-xl font-bold text-[#1e2421] dark:text-[#f3f5f4] mb-2">No Profile Yet</h1>
          <p className="text-[#5c6861] dark:text-[#9eada5] text-sm mb-6">Create your profile to see personalized scheme matches.</p>
          <Link to="/find-schemes" className="btn-primary inline-flex mx-auto">
            Create My Profile <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#111814]">
      <div className="bg-white dark:bg-[#16201a] border-b border-[#CBCBCB] dark:border-[#2a382e] py-6 px-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-[#174D38] dark:text-[#a7d7c5] uppercase tracking-wider font-semibold mb-1">
              {lang === 'hi' ? 'आपकी प्रोफ़ाइल' : 'Your Profile'}
            </p>
            <h1 className="text-xl font-bold text-[#1e2421] dark:text-[#f3f5f4]">
              {lang === 'hi' ? 'पात्रता प्रोफ़ाइल' : 'Eligibility Profile'}
            </h1>
          </div>
          <Link to="/find-schemes" className="flex items-center gap-1.5 text-sm text-[#174D38] dark:text-[#a7d7c5] hover:opacity-80 font-medium">
            <Edit3 className="w-4 h-4" />
            {lang === 'hi' ? 'संपादित करें' : 'Edit Profile'}
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Profile data */}
        <section className="bg-white dark:bg-[#16201a] border border-[#CBCBCB] dark:border-[#2a382e] rounded-xl p-6 shadow-xs">
          <h2 className="font-bold text-[#1e2421] dark:text-[#f3f5f4] mb-4">
            {lang === 'hi' ? 'वर्तमान प्रोफ़ाइल' : 'Current Profile'}
          </h2>
          <ProfileChips profile={profile} onRemove={handleRemoveChip} />
          <div className="mt-5 border-t border-[#CBCBCB]/40 dark:border-[#2a382e] pt-5">
            <p className="text-xs text-[#5c6861] dark:text-[#9eada5] font-semibold mb-3 uppercase tracking-wider">All Fields</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {Object.entries(FIELD_LABELS).map(([key, label]) => {
                const value = profile[key]
                const display = Array.isArray(value) ? value.join(', ') : value
                return (
                  <div key={key} className="flex items-start gap-2">
                    <span className="text-xs text-[#5c6861] dark:text-[#9eada5] w-28 flex-shrink-0 pt-0.5">{label}</span>
                    <span className={`text-sm font-medium ${display ? 'text-[#1e2421] dark:text-[#f3f5f4]' : 'text-[#8e9c94] dark:text-[#5c6861] italic'}`}>
                      {display || 'Not provided'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Privacy mode */}
        <section className="bg-white dark:bg-[#16201a] border border-[#CBCBCB] dark:border-[#2a382e] rounded-xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4 text-[#174D38] dark:text-[#a7d7c5]" />
            <h2 className="font-bold text-[#1e2421] dark:text-[#f3f5f4]">{lang === 'hi' ? 'गोपनीयता मोड' : 'Privacy Mode'}</h2>
          </div>
          <div className="flex items-start gap-3 bg-[#174D38]/10 dark:bg-[#174D38]/20 border border-[#174D38]/30 rounded-xl p-4">
            <CheckCircle2 className="w-4 h-4 text-[#174D38] dark:text-[#a7d7c5] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#174D38] dark:text-[#a7d7c5] text-sm">
                {lang === 'hi' ? 'वन-टाइम मोड (वर्तमान)' : 'One-Time Mode (Current)'}
              </p>
              <p className="text-[#174D38]/90 dark:text-[#a7d7c5]/90 text-xs mt-1">
                {lang === 'hi'
                  ? 'आपकी प्रोफ़ाइल केवल इस डिवाइस पर सहेजी गई है। कोई भी जानकारी हमारे सर्वर पर नहीं भेजी गई।'
                  : 'Your profile is saved only in this browser. No information has been sent to SchemeFinder servers. Clearing your browser data will remove it.'
                }
              </p>
            </div>
          </div>
        </section>

        {/* Notification preferences */}
        <section className="bg-white dark:bg-[#16201a] border border-[#CBCBCB] dark:border-[#2a382e] rounded-xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-[#174D38] dark:text-[#a7d7c5]" />
            <h2 className="font-bold text-[#1e2421] dark:text-[#f3f5f4]">{lang === 'hi' ? 'सूचना प्राथमिकताएं' : 'Notification Preferences'}</h2>
            <span className="ml-auto text-xs text-[#5c6861] dark:text-[#9eada5] bg-[#F2F2F2] dark:bg-[#111814] border border-[#CBCBCB]/60 dark:border-[#2a382e] px-2 py-0.5 rounded-full font-medium">Coming Soon</span>
          </div>
          <p className="text-sm text-[#5c6861] dark:text-[#9eada5]">
            {lang === 'hi'
              ? 'Scheme Radar चालू होने पर आप ईमेल या WhatsApp अलर्ट चुन सकेंगे।'
              : 'Once Scheme Radar is active, you\'ll be able to opt into email or WhatsApp alerts for new schemes, deadlines, and eligibility changes.'
            }
          </p>
        </section>

        {/* Privacy info */}
        <section className="bg-white dark:bg-[#16201a] border border-[#CBCBCB] dark:border-[#2a382e] rounded-xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-[#174D38] dark:text-[#a7d7c5]" />
            <h2 className="font-bold text-[#1e2421] dark:text-[#f3f5f4]">
              {lang === 'hi' ? 'गोपनीयता जानकारी' : 'Privacy Information'}
            </h2>
          </div>
          <div className="space-y-2 text-sm text-[#5c6861] dark:text-[#9eada5]">
            <p>✓ Your profile is stored locally in this browser only</p>
            <p>✓ No profile data is sent to SchemeFinder servers in one-time mode</p>
            <p>✓ Used only to match you with relevant schemes</p>
            <p>✓ You can remove any attribute or delete the entire profile at any time</p>
          </div>
          <Link to="/privacy" className="text-xs text-[#174D38] dark:text-[#a7d7c5] hover:underline mt-3 inline-block font-semibold">
            Read full Privacy Policy →
          </Link>
        </section>

        {/* Delete profile */}
        <section className="bg-white dark:bg-[#16201a] border border-red-200 dark:border-red-900/40 rounded-xl p-6 shadow-xs">
          <h2 className="font-bold text-red-600 dark:text-red-400 mb-2">{lang === 'hi' ? 'प्रोफ़ाइल हटाएं' : 'Delete Profile'}</h2>
          <p className="text-sm text-[#5c6861] dark:text-[#9eada5] mb-4">
            {lang === 'hi'
              ? 'यह आपकी सभी प्रोफ़ाइल जानकारी इस डिवाइस से हटा देगा।'
              : 'This will permanently remove all your profile information from this device. This action cannot be undone.'
            }
          </p>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-700 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-4 py-2 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {lang === 'hi' ? 'प्रोफ़ाइल हटाएं' : 'Delete My Profile'}
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button onClick={handleDelete} className="text-sm font-semibold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors">
                {lang === 'hi' ? 'हां, हटाएं' : 'Yes, Delete'}
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="text-sm text-[#5c6861] dark:text-[#9eada5] hover:text-[#1e2421] dark:hover:text-white">
                {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
