'use client'

import { useRouter } from 'next/navigation'
import { FaSignOutAlt, FaChartPie, FaSlidersH, FaFileAlt, FaCog, FaHome } from 'react-icons/fa'
import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'

export default function Sidebar() {
  const router = useRouter()
  const { data: session } = useSession()
  const [activeIndex, setActiveIndex] = useState(0)

  const handleLogout = async () => {
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: '/login'
      })
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const navItems = [
    { label: 'Visão geral', icon: <FaHome /> },
    { label: 'Opções', icon: <FaSlidersH /> },
    { label: 'Configurações', icon: <FaCog /> },
  ]

  return (
    <aside className="hidden md:flex flex-col fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-[#002948] to-[#003d6f] text-white shadow-lg font-inter">
      <div className="flex items-center justify-center h-20 border-b border-[#F2C363]/30 font-extrabold text-2xl tracking-wide select-none">
        {session?.user.name}
      </div>

      <nav className="flex-1 px-6 py-8 space-y-3">
        {navItems.map(({ label, icon }, i) => (
          <button
            key={label}
            onClick={() => setActiveIndex(i)}
            className={`flex items-center gap-4 w-full text-left text-lg font-semibold rounded-lg px-4 py-3 transition-colors
              ${
                activeIndex === i
                  ? 'bg-[#F2C363] text-[#002948] shadow-md shadow-yellow-400/30'
                  : 'hover:bg-[#F2C363]/20 hover:text-[#F2C363]'
              }`}
            aria-current={activeIndex === i ? 'page' : undefined}
          >
            <span className="text-xl">{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-[#F2C363]/30">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 bg-[#F2C363] text-[#002948] py-3 rounded-xl font-semibold tracking-wide shadow-lg hover:bg-yellow-400 transition cursor-pointer"
          aria-label="Sair"
          type="button"
        >
          <FaSignOutAlt className="text-lg" />
          Sair
        </button>
      </div>
    </aside>
  )
}
