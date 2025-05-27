'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { revertTransaction } from '../actions/revert'
import { useRouter } from 'next/navigation'

export function RevertButton({ 
  transactionId,
  disabled
}: {
  transactionId: string
  disabled?: boolean
}) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
  
    const handleRevert = async () => {
      setIsLoading(true)
      try {
        await revertTransaction(transactionId)
        
        toast.success('Transação estornada com sucesso!')
        router.refresh()
      } catch (error: any) {
        toast.error(error.message || 'Erro ao estornar transação')
      } finally {
        setIsLoading(false)
        setIsOpen(false)
      }
    }
  

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={disabled || isLoading}
        className="text-red-600 hover:bg-red-50 px-3 py-1 rounded-md text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Estornar
      </button>

      {/* Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => !isLoading && setIsOpen(false)}
        >
          <div 
            className="bg-white rounded-xl max-w-sm w-full p-6 relative"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-red-700 text-lg font-semibold mb-2">
              Confirmar estorno?
            </h3>
            <p className="text-gray-600 mb-6">
              Esta ação reverterá os valores da transação. Tem certeza que deseja continuar?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                onClick={handleRevert}
                disabled={isLoading}
                className="px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
