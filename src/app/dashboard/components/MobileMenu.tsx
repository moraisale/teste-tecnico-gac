'use client'

import { useState } from 'react'
import { FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

export default function MobileMenu() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    router.push('/login')
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        className="text-[#002948] p-2 rounded-md hover:bg-[#F2C363]/20 transition"
      >
        <FaBars size={24} />
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
          />

          <nav className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl p-6 z-50 flex flex-col">
            <button
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
              className="self-end mb-8 text-[#002948] hover:text-[#F2C363] transition"
            >
              <FaTimes size={28} />
            </button>


            <button
              onClick={handleLogout}
              className="mt-auto flex items-center gap-3 px-4 py-3 bg-[#002948] text-white rounded-md hover:bg-[#F2C363] transition font-semibold"
              aria-label="Sair"
              type="button"
            >
              <FaSignOutAlt size={20} />
              Sair
            </button>
          </nav>
        </>
      )}
    </>
  )
}
