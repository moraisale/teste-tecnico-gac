'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-hot-toast'
import { deposit } from '../actions/deposit'
import { useRouter } from 'next/navigation'
import { FiDollarSign } from 'react-icons/fi'

const depositSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Valor inválido' })
    .min(0.01, 'Valor mínimo: R$0.01')
    .max(10000, 'Valor máximo: R$10.000'),
})

type DepositFormData = z.infer<typeof depositSchema>

export const DepositForm = () => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DepositFormData>({
    resolver: zodResolver(depositSchema),
    defaultValues: { amount: undefined },
  })

  const onSubmit = async (values: DepositFormData) => {
    try {
      await deposit(values.amount)
      toast.success('Depósito realizado com sucesso!')
      reset()
      router.refresh()
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao realizar depósito')
    }
  }

  return (
    <div className="w-full max-w-full bg-white  rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-[#002948] mb-6">Depósito</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="relative">
          <FiDollarSign className="absolute left-3 top-3.5 text-[#002948]" size={20} />
          <input
            id="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0.01"
            {...register('amount', {
              setValueAs: (v) => parseFloat(v),
            })}
            value={watch('amount') || ''}
            placeholder="Valor (R$)"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 text-[#002948] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F2C363]"
          />
          {errors.amount && (
            <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-lg cursor-pointer text-white font-semibold bg-[#002948] hover:bg-[#001d35] transition-colors disabled:opacity-70"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Processando...
            </span>
          ) : (
            'Depositar'
          )}
        </button>
      </form>
    </div>
  )
}
