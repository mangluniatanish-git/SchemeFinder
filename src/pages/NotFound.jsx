import { Link } from 'react-router-dom'
import { Compass, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Compass className="w-8 h-8 text-slate-400" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
        <p className="text-lg font-semibold text-slate-700 mb-2">Page not found</p>
        <p className="text-slate-500 text-sm mb-8">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </Link>
          <Link to="/schemes" className="btn-secondary">
            <Search className="w-4 h-4" />
            Browse Schemes
          </Link>
        </div>
        <p className="text-xs text-slate-400 mt-8">
          Looking for scheme information? Verify from the official government source.
        </p>
      </div>
    </div>
  )
}
