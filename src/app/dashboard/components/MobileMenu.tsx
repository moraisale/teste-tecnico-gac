'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { FaSignOutAlt, FaBars } from 'react-icons/fa'

export default function MobileMenu() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false, callbackUrl: '/login' })
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Erro ao sair:', error)
    }
  }

  return (
    <header className="md:hidden w-full bg-gradient-to-r from-[#002948] to-[#003d6f] text-white px-4 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-xl">
          <FaBars />
        </button>
        <span className="font-semibold text-lg truncate max-w-[150px]">
          {session?.user?.name || 'Minha Conta'}
        </span>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-[#F2C363] text-[#002948] px-3 py-2 rounded-md text-sm font-semibold hover:bg-yellow-400 transition"
      >
        <FaSignOutAlt />
        Sair
      </button>

      {isMenuOpen && (
        <div className="absolute top-14 left-0 w-full bg-white text-[#002948] z-50 shadow-md py-2">
          <ul className="flex flex-col text-sm font-medium">
            <li className="px-4 py-2 hover:bg-gray-100">Visão geral</li>
            <li className="px-4 py-2 hover:bg-gray-100">Opções</li>
            <li className="px-4 py-2 hover:bg-gray-100">Configurações</li>
          </ul>
        </div>
      )}
    </header>
  )
}
