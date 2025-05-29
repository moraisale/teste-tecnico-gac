'use client'

import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { FaSignOutAlt } from 'react-icons/fa'

export const MobileMenu = () => {
  const router = useRouter()
  const { data: session } = useSession()

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
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-r from-[#002948] to-[#003d6f] text-white px-4 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
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
    </header>
  )
}
