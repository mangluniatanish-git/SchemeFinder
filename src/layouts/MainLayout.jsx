import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BackToTop from '../components/BackToTop'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F2F2F2] dark:bg-[#111814] text-[#1e2421] dark:text-[#f3f5f4] transition-colors duration-200">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
